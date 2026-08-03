<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Enums\OrderStatus;
use App\Models\DeliveryProfileArea;
use App\Models\Order;
use App\Services\WebSocketBroadcastService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DeliveryController extends Controller
{
    use ApiResponse;
    public function __construct(
        protected WebSocketBroadcastService $broadcastService
    ) {}

    /**
     * Return pending orders ready for delivery.
     */
    public function pendingOrders()
    {
        $orders = Order::where('status', OrderStatus::Ready->value)
            ->whereNull('delivery_id')
            ->with(['store', 'items.food', 'client'])
            ->orderByDesc('created_at')
            ->paginate(50);

        return $this->success($orders->items());
    }

    /**
     * Accept a delivery order.
     */
    public function acceptOrder($id)
    {
        $order = Order::findOrFail($id);

        if ($order->status !== OrderStatus::Ready) {
            return $this->error('Cette commande n\'est pas prête pour livraison.', 400);
        }

        if ($order->delivery_id !== null && $order->delivery_id !== auth()->id()) {
            return $this->error('Cette commande a déjà été acceptée par un autre livreur.', 400);
        }

        $order->delivery_id = auth()->id();
        $order->status = OrderStatus::Delivering;
        $order->save();

        $this->broadcastService->deliveryAssigned($order->fresh());

        return $this->success([
            'message' => 'Commande acceptée pour livraison.',
            'order' => $order->load(['store', 'items.food', 'client'])
        ]);
    }

    /**
     * Complete a delivery order.
     */
    public function completeOrder($id)
    {
        $order = Order::findOrFail($id);

        if ($order->delivery_id !== auth()->id()) {
            return $this->error('Non autorisé.', 403);
        }

        if ($order->status !== OrderStatus::Delivering) {
            return $this->error('Le statut de la commande n\'est pas en cours de livraison.', 400);
        }

        $order->status = OrderStatus::Delivered;
        $order->save();

        $this->broadcastService->deliveryCompleted($order->fresh());

        return $this->success([
            'message' => 'Livraison complétée avec succès.',
            'order' => $order->load(['store', 'items.food', 'client'])
        ]);
    }

    /**
     * Return active deliveries for the authenticated delivery person.
     */
    public function activeOrders()
    {
        $orders = Order::where('delivery_id', auth()->id())
            ->where('status', OrderStatus::Delivering->value)
            ->with(['store', 'items.food', 'client'])
            ->orderByDesc('created_at')
            ->paginate(50);

        return $this->success([
            'data' => $orders->items(),
            'pagination' => [
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
                'total' => $orders->total(),
                'per_page' => $orders->perPage(),
            ],
        ]);
    }

    /**
     * Toggle working status.
     */
    public function toggleStatus()
    {
        $profile = auth()->user()->deliveryProfile;
        if (!$profile) {
            $profile = auth()->user()->deliveryProfile()->create([
                'phone' => auth()->user()->phone ?? '',
                'transporter_type' => 'bike',
                'is_working' => false
            ]);
        }

        $profile->is_working = !$profile->is_working;
        $profile->save();

        return $this->success([
            'message' => 'Statut de disponibilité mis à jour.',
            'is_working' => $profile->is_working
        ]);
    }

    /**
     * GET /delivery/stats — Dashboard stats for delivery person.
     */
    public function stats()
    {
        $userId = auth()->id();

        $pending = Order::where('status', OrderStatus::Ready->value)
            ->whereNull('delivery_id')
            ->count();

        $completed = Order::where('delivery_id', $userId)
            ->where('status', OrderStatus::Delivered->value)
            ->count();

        $earnings = (float) Order::where('delivery_id', $userId)
            ->where('status', OrderStatus::Delivered->value)
            ->sum('delivery_fee');

        return $this->success([
            'pending'   => $pending,
            'completed' => $completed,
            'earnings'  => $earnings,
        ]);
    }

    /**
     * GET /delivery/areas — Get my delivery areas with pricing.
     */
    public function getAreas()
    {
        $profile = auth()->user()->deliveryProfile;
        if (!$profile) {
            return $this->success([]);
        }

        $areas = $profile->deliveryAreas()->with(['wilaya', 'daira', 'commune'])->get();

        return $this->success($areas);
    }

    /**
     * POST /delivery/areas — Save delivery areas (replaces all existing).
     */
    public function saveAreas(Request $request)
    {
        $request->validate([
            'areas' => 'required|array',
            'areas.*.wilaya_id' => 'required|exists:wilayas,id',
            'areas.*.daira_id' => 'nullable|exists:dairas,id',
            'areas.*.commune_id' => 'nullable|exists:communes,id',
            'areas.*.day_price' => 'required|numeric|min:0',
            'areas.*.night_price' => 'required|numeric|min:0',
        ]);

        $profile = auth()->user()->deliveryProfile;
        if (!$profile) {
            $profile = auth()->user()->deliveryProfile()->create([
                'phone' => auth()->user()->phone ?? '',
                'transporter_type' => 'bike',
                'is_working' => false,
            ]);
        }

        DB::transaction(function () use ($profile, $request) {
            $profile->deliveryAreas()->delete();
            foreach ($request->areas as $area) {
                $profile->deliveryAreas()->create([
                    'wilaya_id' => $area['wilaya_id'],
                    'daira_id' => $area['daira_id'] ?? null,
                    'commune_id' => $area['commune_id'] ?? null,
                    'day_price' => $area['day_price'],
                    'night_price' => $area['night_price'],
                ]);
            }
        });

        return $this->success([
            'message' => 'Zones de livraison enregistrées.',
            'data' => $profile->fresh()->deliveryAreas->load(['wilaya', 'daira', 'commune']),
        ]);
    }

    /**
     * POST /delivery/pricing — Update flat day/night pricing for the profile.
     */
    public function updatePricing(Request $request)
    {
        $validated = $request->validate([
            'day_price' => 'required|numeric|min:0',
            'night_price' => 'required|numeric|min:0',
        ]);

        $profile = auth()->user()->deliveryProfile;
        if (!$profile) {
            return $this->error('Delivery profile not found.', 404);
        }

        $profile->update($validated);

        return $this->success([
            'message' => 'Tarifs mis à jour.',
            'day_price' => $profile->day_price,
            'night_price' => $profile->night_price,
        ]);
    }

    /**
     * POST /delivery/location — Update rider location and broadcast to client.
     */
    public function updateLocation(Request $request)
    {
        $request->validate([
            'order_id' => 'required|integer|exists:orders,id',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
        ]);

        $order = Order::where('id', $request->order_id)
            ->where('delivery_id', auth()->id())
            ->firstOrFail();

        $this->broadcastService->riderLocationUpdated(
            $order,
            (float) $request->latitude,
            (float) $request->longitude
        );

        return $this->success(null, 200, 'Position mise à jour.');
    }
}
