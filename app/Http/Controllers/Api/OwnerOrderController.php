<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use App\Services\WebSocketBroadcastService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OwnerOrderController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected WebSocketBroadcastService $broadcastService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $store = Auth::user()->store;

        if (!$store) {
            return $this->forbidden('No store found for this account.');
        }

        $query = Order::forStore($store->id)
            ->with(['items.food', 'client', 'deliveryGuy.deliveryProfile', 'store'])
            ->orderByDesc('created_at');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = '%' . $request->search . '%';
            $query->where(function ($q) use ($search) {
                $q->where('id', 'like', $search)
                    ->orWhere('phone', 'like', $search)
                    ->orWhereHas('client', function ($cq) use ($search) {
                        $cq->where('name', 'like', $search);
                    });
            });
        }

        $orders = $query->paginate(min((int)$request->input('per_page', 15), 100));

        return $this->success($orders);
    }

    public function show(int $id): JsonResponse
    {
        $store = Auth::user()->store;

        if (!$store) {
            return $this->forbidden('No store found for this account.');
        }

        $order = Order::where('id', $id)
            ->where('store_id', $store->id)
            ->with(['items.food', 'client', 'deliveryGuy.deliveryProfile', 'store'])
            ->first();

        if (!$order) {
            return $this->notFound('Order not found.');
        }

        return $this->success($order);
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $store = Auth::user()->store;

        if (!$store) {
            return $this->forbidden('No store found for this account.');
        }

        $request->validate([
            'status' => 'required|in:' . implode(',', OrderStatus::values()),
        ]);

        $order = Order::where('id', $id)
            ->where('store_id', $store->id)
            ->with('items.food')
            ->first();

        if (!$order) {
            return $this->notFound('Order not found.');
        }

        $newStatus = OrderStatus::from($request->status);
        $oldStatus = $order->status;

        if (!in_array($oldStatus->value, OrderStatus::terminal()) && !$oldStatus->canTransitionTo($newStatus)) {
            return $this->error(
                "Cannot transition from {$oldStatus->value} to {$newStatus->value}.",
                422
            );
        }

        if (in_array($oldStatus->value, OrderStatus::terminal())) {
            return $this->error('Order is already in a terminal state.', 422);
        }

        $order->status = $newStatus->value;
        $order->save();

        if ($newStatus === OrderStatus::Confirmed && $oldStatus !== OrderStatus::Confirmed) {
            foreach ($order->items as $item) {
                $item->food()->increment('bought_count', $item->quantity);
            }
        }

        $order->load(['items.food', 'client', 'deliveryGuy.deliveryProfile']);

        return $this->success($order, 200, 'Order status updated successfully.');
    }

    public function bulkStatus(Request $request): JsonResponse
    {
        $store = Auth::user()->store;

        if (!$store) {
            return $this->forbidden('No store found for this account.');
        }

        $request->validate([
            'order_ids' => 'required|array|min:1',
            'order_ids.*' => 'integer|exists:orders,id',
            'status' => 'required|in:' . implode(',', OrderStatus::values()),
        ]);

        $newStatus = OrderStatus::from($request->status);

        $orders = Order::whereIn('id', $request->order_ids)
            ->where('store_id', $store->id)
            ->get();

        $updated = 0;
        $skipped = [];

        foreach ($orders as $order) {
            if (in_array($order->status->value, OrderStatus::terminal())) {
                $skipped[] = $order->id;
                continue;
            }

            $orderStatus = $order->status;
            if (!$orderStatus->canTransitionTo($newStatus)) {
                $skipped[] = $order->id;
                continue;
            }

            $order->status = $newStatus->value;
            $order->save();
            $updated++;
        }

        return $this->success([
            'updated' => $updated,
            'skipped' => $skipped,
        ], 200, "{$updated} orders updated, " . count($skipped) . " skipped.");
    }

    public function riders(Request $request): JsonResponse
    {
        $store = Auth::user()->store;

        if (!$store) {
            return $this->forbidden('No store found for this account.');
        }

        $riders = User::where('role', 'delivery')
            ->whereHas('deliveryProfile', function ($q) {
                $q->where('is_working', true);
            })
            ->with('deliveryProfile')
            ->orderBy('name')
            ->cursorPaginate(min((int)$request->input('per_page', 20), 100));

        return $this->success($riders);
    }

    public function assign(Request $request, int $id): JsonResponse
    {
        $store = Auth::user()->store;

        if (!$store) {
            return $this->forbidden('No store found for this account.');
        }

        $request->validate([
            'delivery_id' => 'required|integer|exists:users,id',
        ]);

        $order = Order::where('id', $id)->where('store_id', $store->id)->first();

        if (!$order) {
            return $this->notFound('Order not found.');
        }

        $deliveryUser = User::where('id', $request->delivery_id)
            ->where('role', 'delivery')
            ->first();

        if (!$deliveryUser) {
            return $this->error('Invalid delivery user.', 422);
        }

        $order->update(['delivery_id' => $request->delivery_id]);
        $order->load(['items.food', 'client', 'deliveryGuy.deliveryProfile']);

        $this->broadcastService->deliveryAssigned($order->fresh());

        return $this->success($order, 200, 'Delivery person assigned successfully.');
    }

    public function bulkAssign(Request $request): JsonResponse
    {
        $store = Auth::user()->store;

        if (!$store) {
            return $this->forbidden('No store found for this account.');
        }

        $request->validate([
            'order_ids' => 'required|array|min:1',
            'order_ids.*' => 'integer|exists:orders,id',
            'delivery_id' => 'required|integer|exists:users,id',
        ]);

        $deliveryUser = User::where('id', $request->delivery_id)
            ->where('role', 'delivery')
            ->first();

        if (!$deliveryUser) {
            return $this->error('Invalid delivery user.', 422);
        }

        $updated = Order::whereIn('id', $request->order_ids)
            ->where('store_id', $store->id)
            ->update(['delivery_id' => $request->delivery_id]);

        return $this->success(['updated' => $updated], 200, "{$updated} orders assigned.");
    }

    public function bulkDelete(Request $request): JsonResponse
    {
        $store = Auth::user()->store;

        if (!$store) {
            return $this->forbidden('No store found for this account.');
        }

        $request->validate([
            'order_ids' => 'required|array|min:1',
            'order_ids.*' => 'integer|exists:orders,id',
        ]);

        $deleted = Order::whereIn('id', $request->order_ids)
            ->where('store_id', $store->id)
            ->delete();

        return $this->success(['deleted' => $deleted], 200, "{$deleted} orders deleted.");
    }

    public function toggleFavoriteRider(int $userId): JsonResponse
    {
        $store = Auth::user()->store;

        if (!$store) {
            return $this->forbidden('No store found for this account.');
        }

        $user = Auth::user();
        $deliveryUser = User::where('id', $userId)->where('role', 'delivery')->first();

        if (!$deliveryUser) {
            return $this->notFound('Delivery user not found.');
        }

        $isFavorited = $user->favoriteRiders()->toggle($userId);

        $favorited = $isFavorited['attached'] ?? [];

        return $this->success([
            'is_favorited' => !empty($favorited),
        ], 200, 'Favorite rider toggled successfully.');
    }
}
