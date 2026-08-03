<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Store;
use App\Models\StoreStaff;
use App\Services\WebSocketBroadcastService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class KdsOrderController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected WebSocketBroadcastService $broadcastService
    ) {}

    private function getStore(): ?Store
    {
        $user = Auth::user();

        if ($user->isOwner() || $user->isAdmin()) {
            return $user->store;
        }

        $staff = StoreStaff::where('user_id', $user->id)
            ->whereIn('store_role', ['kds', 'cook', 'chef'])
            ->with('store')
            ->first();

        return $staff?->store;
    }

    public function orders(): JsonResponse
    {
        $store = $this->getStore();
        if (!$store) {
            return $this->forbidden('No KDS access. You must be assigned as kitchen staff to a store.');
        }

        $orders = Order::with([
            'items.food:id,name,cooking_time,price',
            'client:id,name',
            'store:id,order_prefix,order_suffix,order_padding',
        ])
            ->where('store_id', $store->id)
            ->whereIn('status', [OrderStatus::Confirmed, OrderStatus::Preparing])
            ->orderByRaw("CASE WHEN status = 'confirmed' THEN 0 WHEN status = 'preparing' THEN 1 ELSE 2 END")
            ->orderBy('created_at')
            ->get()
            ->map(function ($order) {
                $totalCookingTime = $order->items->sum(fn($item) => $item->food?->cooking_time ?? 0);

                return [
                    'id' => $order->id,
                    'store_id' => $order->store_id,
                    'status' => $order->status->value,
                    'status_label' => $order->status->label(),
                    'client_name' => $order->client?->name,
                    'phone' => $order->phone,
                    'notes' => $order->notes,
                    'delivery_type' => $order->delivery_type,
                    'estimated_delivery_minutes' => $order->estimated_delivery_minutes,
                    'total_cooking_time' => $totalCookingTime,
                    'created_at' => $order->created_at,
                    'items' => $order->items->map(fn($item) => [
                        'id' => $item->id,
                        'name' => $item->food?->name ?? 'Deleted item',
                        'quantity' => $item->quantity,
                        'cooking_time' => $item->food?->cooking_time ?? 0,
                        'notes' => null,
                    ]),
                ];
            });

        return $this->success($orders);
    }

    public function start(int $id): JsonResponse
    {
        $store = $this->getStore();
        if (!$store) {
            return $this->forbidden('No KDS access.');
        }

        $order = Order::where('id', $id)
            ->where('store_id', $store->id)
            ->firstOrFail();

        if (!$order->status->canTransitionTo(OrderStatus::Preparing)) {
            return $this->error('Order cannot be started. Current status: ' . $order->status->value, 422);
        }

        $order->update([
            'status' => OrderStatus::Preparing,
            'assigned_chef_id' => Auth::id(),
        ]);

        return $this->success(
            $order->fresh()->load('items.food:id,name'),
            200,
            'Order is now being prepared.'
        );
    }

    public function complete(int $id): JsonResponse
    {
        $store = $this->getStore();
        if (!$store) {
            return $this->forbidden('No KDS access.');
        }

        $order = Order::where('id', $id)
            ->where('store_id', $store->id)
            ->firstOrFail();

        if (!$order->status->canTransitionTo(OrderStatus::Ready)) {
            return $this->error('Order cannot be completed. Current status: ' . $order->status->value, 422);
        }

        $order->update([
            'status' => OrderStatus::Ready,
        ]);

        return $this->success(
            $order->fresh()->load('items.food:id,name'),
            200,
            'Order is ready.'
        );
    }
}
