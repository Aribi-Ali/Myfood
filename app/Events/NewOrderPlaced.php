<?php

namespace App\Events;

use App\Models\Order;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

class NewOrderPlaced implements ShouldBroadcastNow
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
        return 'order.placed';
    }

    public function broadcastWith(): array
    {
        $order = $this->order->loadMissing([
            'items.food:id,name,cooking_time',
            'store:id,name,alias',
            'client:id,name',
        ]);

        return [
            'id' => $order->id,
            'status' => $order->status->value,
            'status_label' => $order->status->label(),
            'delivery_type' => $order->delivery_type,
            'total_amount' => $order->total_amount,
            'client' => [
                'id' => $order->client?->id,
                'name' => $order->client?->name,
            ],
            'store' => [
                'id' => $order->store?->id,
                'name' => $order->store?->name,
                'alias' => $order->store?->alias,
            ],
            'items' => $order->items->map(fn($i) => [
                'id' => $i->id,
                'name' => $i->food?->name,
                'quantity' => $i->quantity,
                'cooking_time' => $i->food?->cooking_time,
            ]),
            'created_at' => $order->created_at,
        ];
    }
}
