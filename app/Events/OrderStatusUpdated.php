<?php

namespace App\Events;

use App\Models\Order;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

class OrderStatusUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets;

    public function __construct(
        public Order $order
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('orders.store.' . $this->order->store_id),
            new PrivateChannel('orders.client.' . $this->order->client_id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'order.status.updated';
    }

    public function broadcastWith(): array
    {
        $order = $this->order->loadMissing(['items.food:id,name', 'store:id,name,alias']);

        return [
            'id' => $order->id,
            'status' => $order->status->value,
            'status_label' => $order->status->label(),
            'delivery_type' => $order->delivery_type,
            'total_amount' => $order->total_amount,
            'store' => [
                'id' => $order->store?->id,
                'name' => $order->store?->name,
                'alias' => $order->store?->alias,
            ],
            'items' => $order->items->map(fn($i) => [
                'id' => $i->id,
                'name' => $i->food?->name,
                'quantity' => $i->quantity,
            ]),
            'updated_at' => $order->updated_at,
        ];
    }
}
