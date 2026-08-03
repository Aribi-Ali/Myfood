<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\CartItemRequest;
use App\Http\Requests\Api\PlaceOrderRequest;
use App\Models\Food;
use App\Models\Order;
use App\Models\PromoCode;
use App\Models\Store;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class ClientOrderController extends Controller
{
    use ApiResponse;

    private function cartKey(): string
    {
        return 'cart:user_' . Auth::id();
    }

    private function loadCart(): array
    {
        return Cache::get($this->cartKey(), []);
    }

    private function saveCart(array $cart): void
    {
        Cache::put($this->cartKey(), $cart, now()->addDays(7));
    }

    public function addToCart(CartItemRequest $request): JsonResponse
    {
        $data = $request->validated();

        $food = Food::findOrFail($data['food_id']);

        if ($food->store_id !== (int) $data['store_id']) {
            return $this->error('Ce produit n\'appartient pas à ce restaurant.', 400);
        }

        $store = Store::find($food->store_id);
        if ($store && !$store->ordering_enabled) {
            return $this->error('Ce restaurant ne prend pas de commandes pour le moment.', 400);
        }

        $cart = $this->loadCart();

        if (!empty($cart)) {
            $firstItem = reset($cart);
            if ($firstItem['store_id'] !== (int) $data['store_id']) {
                return $this->error('Votre panier contient déjà des articles d\'un autre restaurant. Veuillez d\'abord vider le panier.', 400);
            }
        }

        $price = (float) ($food->new_price ?? $food->price);
        $foodId = (int) $data['food_id'];

        if (isset($cart[$foodId])) {
            $cart[$foodId]['quantity'] += (int) $data['quantity'];
        } else {
            $cart[$foodId] = [
                'id'       => $food->id,
                'name'     => $food->name,
                'price'    => $price,
                'quantity' => (int) $data['quantity'],
                'store_id' => (int) $data['store_id'],
                'image'    => $food->image ? asset('storage/' . $food->image) : null,
            ];
        }

        $this->saveCart($cart);

        return $this->success([
            'cart'     => array_values($cart),
            'subtotal' => $this->calculateSubtotal($cart),
            'count'    => array_sum(array_column($cart, 'quantity')),
        ], 200, 'Article ajouté au panier.');
    }

    public function updateQuantity(Request $request): JsonResponse
    {
        $data = $request->validate([
            'food_id'  => 'required|exists:foods,id',
            'quantity' => 'required|integer|min:0',
        ]);

        $cart = $this->loadCart();
        $foodId = (int) $data['food_id'];

        if (!isset($cart[$foodId])) {
            return $this->notFound('Article introuvable dans le panier.');
        }

        if ((int) $data['quantity'] <= 0) {
            unset($cart[$foodId]);
        } else {
            $cart[$foodId]['quantity'] = (int) $data['quantity'];
        }

        $this->saveCart($cart);

        return $this->success([
            'cart'     => array_values($cart),
            'subtotal' => $this->calculateSubtotal($cart),
            'count'    => array_sum(array_column($cart, 'quantity')),
        ], 200, 'Quantité mise à jour.');
    }

    public function removeFromCart(Request $request): JsonResponse
    {
        $data = $request->validate([
            'food_id' => 'required|exists:foods,id',
        ]);

        $cart = $this->loadCart();
        $foodId = (int) $data['food_id'];

        if (!isset($cart[$foodId])) {
            return $this->notFound('Article introuvable dans le panier.');
        }

        unset($cart[$foodId]);
        $this->saveCart($cart);

        return $this->success([
            'cart'     => array_values($cart),
            'subtotal' => $this->calculateSubtotal($cart),
            'count'    => array_sum(array_column($cart, 'quantity')),
        ], 200, 'Article retiré du panier.');
    }

    public function clearCart(): JsonResponse
    {
        Cache::forget($this->cartKey());

        return $this->success([
            'cart'     => [],
            'subtotal' => 0,
            'count'    => 0,
        ], 200, 'Panier vidé.');
    }

    public function getCart(): JsonResponse
    {
        $cart = $this->loadCart();

        return $this->success([
            'cart'     => array_values($cart),
            'subtotal' => $this->calculateSubtotal($cart),
            'count'    => array_sum(array_column($cart, 'quantity')),
        ]);
    }

    public function placeOrder(PlaceOrderRequest $request): JsonResponse
    {
        $data = $request->validated();

        $cart = $this->loadCart();

        if (empty($cart)) {
            return $this->error('Votre panier est vide.', 400);
        }

            $firstItem = reset($cart);
            $store = Store::findOrFail($firstItem['store_id']);

            if (!$store->is_approved) {
                return $this->error('Ce restaurant n\'est pas encore approuvé.', 403);
            }

            if (!$store->ordering_enabled) {
                return $this->error('Ce restaurant ne prend pas de commandes pour le moment.', 400);
            }

            // Check if client is banned from this store
            $banned = \App\Models\ClientBan::where('store_id', $store->id)
                ->where('client_id', Auth::id())
                ->exists();
            if ($banned) {
                return $this->error('Vous avez été banni de ce restaurant et ne pouvez pas passer de commande.', 403);
            }

            // Check if store is paused
            if ($store->isPaused()) {
                $note = $store->pause_note ?? 'Ce restaurant ne peut pas prendre de commandes pour le moment.';
                return $this->error($note, 403);
            }

            // Validate pre-order
            $scheduledAt = $data['scheduled_at'] ?? null;
            if ($scheduledAt && !$store->allows_pre_orders) {
                return $this->error('Ce restaurant n\'accepte pas les pré-commandes.', 400);
            }
            if ($scheduledAt) {
                $scheduledAtCarbon = Carbon::parse($scheduledAt);
                $leadTime = $store->pre_order_lead_time_hours ?? 1;
                $earliest = now()->addHours($leadTime);
                if ($scheduledAtCarbon->lessThan($earliest)) {
                    return $this->error('La date de pré-commande doit être au moins ' . $leadTime . ' heure(s) à l\'avance.', 400);
                }
            }

            $deliveryType = $data['delivery_type'] ?? 'delivery';
            $deliveryFee = $deliveryType === 'delivery'
                ? config('business.delivery_fee', 200)
                : 0;
            $commission = config('business.commission_percentage', 0.10);

            $addressVal = $deliveryType === 'delivery'
                ? $data['address']
                : 'Retrait en magasin / Store Pickup';

            try {
                $order = DB::transaction(function () use (
                    $cart, $store, $deliveryType, $data, $deliveryFee,
                    $commission, $addressVal, $scheduledAt
                ) {
                // Re-fetch foods from DB so prices/availability can't go stale
                // between the cart snapshot and order placement.
                $foods = Food::whereIn('id', array_keys($cart))
                    ->where('is_available', true)
                    ->get()
                    ->keyBy('id');

                $orderItems = [];
                $subtotal = 0.0;
                foreach ($cart as $item) {
                    $food = $foods->get($item['id']);
                    if (!$food || $food->store_id !== $store->id) {
                        throw new \RuntimeException('Un des articles de votre panier n\'est plus disponible.');
                    }
                    $price = (float) ($food->new_price ?? $food->price);
                    $orderItems[] = [
                        'food_id'  => $food->id,
                        'quantity' => $item['quantity'],
                        'price'    => $price,
                    ];
                    $subtotal += $price * $item['quantity'];
                }

                $discountAmount = 0.00;
                $promoCodeId = null;

                if (!empty($data['promo_code'])) {
                    $promo = PromoCode::where('code', strtoupper(trim($data['promo_code'])))->first();

                    if (!$promo || !$promo->isValidForStore($store->id)) {
                        throw new \RuntimeException('Code promo invalide ou expiré.');
                    }

                    $discountAmount = $promo->calculateDiscount($subtotal);
                    $promoCodeId = $promo->id;
                }

                $taxableAmount = max(0.0, $subtotal - $discountAmount);
                $totalAmount = $taxableAmount + $deliveryFee;
                $commissionAmt = $taxableAmount * $commission;

                $order = Order::create([
                    'client_id'         => Auth::id(),
                    'store_id'          => $store->id,
                    'status'            => OrderStatus::Pending->value,
                    'delivery_type'     => $deliveryType,
                    'scheduled_at'      => $scheduledAt,
                    'pickup_time'       => $data['pickup_time'] ?? null,
                    'total_amount'      => $totalAmount,
                    'commission_amount' => $commissionAmt,
                    'delivery_fee'      => $deliveryFee,
                    'address'           => $addressVal,
                    'phone'             => $data['phone'],
                    'notes'             => $data['notes'] ?? null,
                    'promo_code_id'     => $promoCodeId,
                    'discount_amount'   => $discountAmount,
                ]);

                foreach ($orderItems as $orderItem) {
                    $order->items()->create($orderItem);
                }

                return $order;
                });
            } catch (\RuntimeException $e) {
                return $this->error($e->getMessage(), 400);
            }

            Cache::forget($this->cartKey());

        return $this->success(
            $order->load(['items.food', 'store']),
            201,
            'Commande créée avec succès.'
        );
    }

    public function listOrders(Request $request): JsonResponse
    {
        $perPage = config('business.pagination.orders', 15);

        $query = Order::forClient()
            ->with(['items.food', 'store', 'deliveryGuy.deliveryProfile'])
            ->orderByDesc('created_at');

        // Status filter
        if ($request->filled('status')) {
            $query->withStatus($request->status);
        }

        // Cursor-based pagination when ?cursor= is provided
        if ($request->filled('cursor')) {
            $orders = $query->cursorPaginate($perPage, ['*'], 'cursor', $request->cursor);
            return response()->json([
                'data' => $orders->items(),
                'next_cursor' => $orders->nextCursor()?->encoded,
                'prev_cursor' => $orders->previousCursor()?->encoded,
                'has_more' => $orders->hasMore(),
                'per_page' => $orders->perPage(),
            ]);
        }

        // Legacy page-based fallback
        $orders = $query->paginate($perPage);
        return $this->success($orders);
    }

    public function showOrder(int $id): JsonResponse
    {
        $order = Order::with([
            'items.food',
            'store',
            'deliveryGuy.deliveryProfile',
            'promoCode',
        ])->forClient()->findOrFail($id);

        return $this->success($order);
    }

    public function reorder(int $id): JsonResponse
    {
        $order = Order::forClient()->with('items.food')->findOrFail($id);

        $store = $order->store;
        if (!$store->is_active || !$store->ordering_enabled) {
            return $this->error('Ce restaurant ne prend pas de commandes pour le moment.', 400);
        }

        $cart = [];

        foreach ($order->items as $item) {
            if (!$item->food || !$item->food->is_available) continue;

            $food = $item->food;
            $price = $food->new_price ?? $food->price;

            $foodId = (string) $food->id;
            if (isset($cart[$foodId])) {
                $cart[$foodId]['quantity'] += $item->quantity;
            } else {
                $cart[$foodId] = [
                    'id'       => $food->id,
                    'name'     => $food->name,
                    'price'    => (float) $price,
                    'quantity' => $item->quantity,
                    'store_id' => (int) $store->id,
                    'image'    => $food->image ? asset('storage/' . $food->image) : null,
                ];
            }
        }

        if (empty($cart)) {
            return $this->error('Aucun article de cette commande n\'est plus disponible.', 400);
        }

        // Merge with existing cart (replace same store, add items)
        $existingCart = $this->loadCart();
        $existingStoreId = !empty($existingCart) ? reset($existingCart)['store_id'] : null;

        if ($existingStoreId && $existingStoreId !== $store->id) {
            return $this->error('Vider votre panier actuel avant de ré-commander depuis un autre restaurant.', 400);
        }

        $merged = $cart;
        foreach ($existingCart as $foodId => $existingItem) {
            if (!isset($merged[$foodId]) && $existingItem['store_id'] === $store->id) {
                $merged[$foodId] = $existingItem;
            }
        }

        $this->saveCart($merged);

        return $this->success([
            'cart' => $merged,
            'store_id' => $store->id,
            'store_alias' => $store->alias,
        ], 200, 'Articles ajoutés à votre panier.');
    }

    public function submitComplaint(Request $request, int $id): JsonResponse
    {
        $order = Order::forClient()->findOrFail($id);

        $data = $request->validate([
            'subject'     => 'required|string|max:255',
            'description' => 'required|string',
            'food_id'     => 'nullable|exists:foods,id',
        ]);

        $complaint = \App\Models\Complaint::create([
            'client_id'   => Auth::id(),
            'store_id'    => $order->store_id,
            'order_id'    => $order->id,
            'food_id'     => $data['food_id'] ?? null,
            'subject'     => $data['subject'],
            'description' => $data['description'],
            'status'      => 'pending',
        ]);

        return $this->success($complaint, 201, 'Votre réclamation a été soumise avec succès.');
    }

    private function calculateSubtotal(array $cart): float
    {
        return (float) array_sum(
            array_map(fn ($item) => $item['price'] * $item['quantity'], $cart)
        );
    }
}
