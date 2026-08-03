<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Enums\OrderStatus;
use App\Exceptions\OrderException;
use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Food;
use App\Models\Order;
use App\Models\Store;
use App\Notifications\OrderStatusUpdated;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    use ApiResponse;
    /**
     * Place a new order for the authenticated client.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'store_id'          => 'required|exists:stores,id',
            'items'             => 'required|array|min:1',
            'items.*.food_id'   => 'required|exists:foods,id',
            'items.*.quantity'  => 'required|integer|min:1',
            'delivery_type'     => 'nullable|string|in:delivery,pickup',
            'pickup_time'       => 'nullable|string',
            'address'           => 'required_if:delivery_type,delivery|string|max:500',
            'phone'             => 'required|string|max:20',
            'notes'             => 'nullable|string|max:1000',
            'promo_code'        => 'nullable|string|max:50',
        ]);

        $store = Store::findOrFail($request->store_id);

        if (!$store->is_approved) {
            throw OrderException::storeNotApproved();
        }

        if (!$store->ordering_enabled) {
            return $this->error('Ce restaurant ne prend pas de commandes pour le moment.', 400);
        }

        $deliveryType = $request->input('delivery_type', 'delivery');
        $subtotal     = 0;
        $itemsData    = [];

        $foodIds = array_column($request->items, 'food_id');
        $foods = Food::whereIn('id', $foodIds)->get()->keyBy('id');

        foreach ($request->items as $item) {
            $food = $foods[$item['food_id']] ?? null;
            if (!$food) {
                throw OrderException::foodWrongStore("Food #{$item['food_id']} not found");
            }

            if ($food->store_id !== $store->id) {
                throw OrderException::foodWrongStore($food->name);
            }
            if (!$food->is_available) {
                throw OrderException::foodUnavailable($food->name);
            }

            $price     = (float) ($food->new_price ?? $food->price);
            $subtotal += $price * $item['quantity'];

            $itemsData[] = [
                'food_id'  => $food->id,
                'quantity' => $item['quantity'],
                'price'    => $price,
            ];
        }

        $deliveryFee   = $deliveryType === 'delivery'
            ? config('business.delivery_fee', 200)
            : 0;
        $commission    = config('business.commission_percentage', 0.10);
        $totalAmount   = $subtotal + $deliveryFee;
        $commissionAmt = $subtotal * $commission;
        $addressVal    = $deliveryType === 'delivery'
            ? $request->address
            : 'Retrait en magasin / Store Pickup';

        $order = DB::transaction(function () use (
            $request, $store, $deliveryType, $totalAmount,
            $commissionAmt, $deliveryFee, $addressVal, $itemsData
        ) {
            $order = Order::create([
                'client_id'         => auth()->id(),
                'store_id'          => $store->id,
                'status'            => OrderStatus::Pending->value,
                'delivery_type'     => $deliveryType,
                'pickup_time'       => $request->pickup_time,
                'total_amount'      => $totalAmount,
                'commission_amount' => $commissionAmt,
                'delivery_fee'      => $deliveryFee,
                'address'           => $addressVal,
                'phone'             => $request->phone,
                'notes'             => $request->notes,
            ]);

            foreach ($itemsData as $data) {
                $order->items()->create($data);
            }

            Log::info('API Order created', [
                'order_id'  => $order->id,
                'client_id' => auth()->id(),
                'store_id'  => $store->id,
                'total'     => $totalAmount,
                'ip'        => request()->ip(),
            ]);

            return $order;
        });

        return $this->success(
            OrderResource::make($order->load('items.food', 'store')),
            201
        );
    }

    /**
     * Show order details (role-scoped authorization).
     */
    public function show(int $id): JsonResponse
    {
        $order = Order::with(['items.food', 'store', 'client', 'deliveryGuy.deliveryProfile', 'promoCode'])
            ->findOrFail($id);

        $user = auth()->user();

        if ($user->isAdmin()) {
            // Admin sees all
        } elseif ($user->isOwner()) {
            if ($order->store->owner_id !== $user->id
                && !$user->hasStorePermission($order->store_id, 'manage_orders')) {
                throw OrderException::unauthorized();
            }
        } elseif ($user->isDelivery()) {
            if ($order->delivery_id !== $user->id && $order->status->value !== OrderStatus::Ready->value) {
                throw OrderException::unauthorized();
            }
        } else {
            // Client
            if ($order->client_id !== $user->id) {
                throw OrderException::unauthorized();
            }
        }

        return $this->success(OrderResource::make($order));
    }

    /**
     * Update order status.
     */
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:' . implode(',', OrderStatus::values()),
        ]);

        $order  = Order::with('items.food', 'client')->findOrFail($id);
        $user   = auth()->user();
        $newStatus = OrderStatus::from($request->status);

        if (!$user->isAdmin()) {
            if ($user->isOwner()) {
                if ($order->store->owner_id !== $user->id
                    && !$user->hasStorePermission($order->store_id, 'manage_orders')) {
                    throw OrderException::unauthorized();
                }
            } else {
                throw OrderException::unauthorized();
            }
        }

        $oldStatus = $order->status;

        if (!$oldStatus->canTransitionTo($newStatus)) {
            return $this->error("Cannot transition from {$oldStatus->value} to {$newStatus->value}.", 422);
        }

        $order->status = $newStatus->value;
        $order->save();

        // Increment bought_count when order is confirmed
        if ($newStatus === OrderStatus::Confirmed && $oldStatus !== OrderStatus::Confirmed) {
            foreach ($order->items as $item) {
                // items already eager-loaded
                $item->food()->increment('bought_count', $item->quantity);
            }
        }

        if ($oldStatus !== $newStatus) {
            try {
                $order->client->notify(new OrderStatusUpdated($order));
            } catch (\Exception $e) {
                Log::warning('Order notification failed', ['order_id' => $order->id, 'error' => $e->getMessage()]);
            }
        }

        return $this->success([
            'message' => 'Statut de la commande mis à jour avec succès.',
            'order'   => OrderResource::make($order),
        ]);
    }

    /**
     * Return paginated orders for POS sync (store owner / staff).
     */
    public function posOrders(Request $request): JsonResponse
    {
        $user  = auth()->user();
        $store = \App\Models\Store::where('owner_id', $user->id)->first();

        if (!$store) {
            $staff = \App\Models\StoreStaff::where('user_id', $user->id)->first();
            if ($staff) {
                $store = \App\Models\Store::find($staff->store_id);
            }
        }

        if (!$store) {
            return $this->error('Aucun restaurant associé à ce compte.', 404);
        }

        $perPage = config('business.pagination.pos', 50);
        $orders  = Order::forStore($store->id)
            ->with(['items.food', 'client'])
            ->orderByDesc('created_at')
            ->paginate($perPage);

        return $this->success([
            'store'  => ['id' => $store->id, 'name' => $store->name],
            'orders' => OrderResource::collection($orders),
            'meta'   => [
                'current_page' => $orders->currentPage(),
                'last_page'    => $orders->lastPage(),
                'per_page'     => $orders->perPage(),
                'total'        => $orders->total(),
            ],
        ]);
    }
}
