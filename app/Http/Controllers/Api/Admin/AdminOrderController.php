<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\ApiResponse;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminOrderController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'status' => 'nullable|string',
            'store_id' => 'nullable|integer|exists:stores,id',
            'search' => 'nullable|string|max:100',
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date|after_or_equal:date_from',
        ]);

        $query = Order::with([
            'store:id,name,alias',
            'client:id,name,email,phone',
            'items.food:id,name',
        ]);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('store_id')) {
            $query->where('store_id', $request->store_id);
        }

        if ($request->filled('search')) {
            $s = '%' . $request->search . '%';
            $query->where(function ($q) use ($s) {
                $q->where('id', 'like', $s)
                  ->orWhereHas('client', fn ($cq) => $cq->where('name', 'like', $s))
                  ->orWhereHas('store', fn ($sq) => $sq->where('name', 'like', $s));
            });
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $orders = $query->orderByDesc('created_at')
            ->paginate(config('business.pagination.orders', 15));

        return $this->success($orders);
    }

    public function show(int $id): JsonResponse
    {
        $order = Order::with([
            'store:id,name,alias,phone,address',
            'client:id,name,email,phone',
            'deliveryGuy:id,name,phone',
            'items.food:id,name,price',
            'complaints',
        ])->findOrFail($id);

        return $this->success($order);
    }

    public function cancel(int $id): JsonResponse
    {
        $order = Order::findOrFail($id);

        if (!in_array($order->status, [OrderStatus::Pending->value, OrderStatus::Confirmed->value])) {
            return $this->error('Order cannot be cancelled at this stage.', 422);
        }

        $order->update([
            'status' => OrderStatus::Cancelled->value,
            'cancelled_at' => now(),
        ]);

        return $this->success($order->fresh(), 200, 'Order cancelled.');
    }

    public function refund(int $id): JsonResponse
    {
        $order = Order::findOrFail($id);

        if ($order->status !== OrderStatus::Cancelled->value) {
            return $this->error('Only cancelled orders can be refunded.', 422);
        }

        $order->update(['refunded_at' => now()]);

        return $this->success($order->fresh(), 200, 'Order refunded.');
    }
}
