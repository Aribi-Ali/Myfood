<?php

namespace App\Events;

use App\Models\Order;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

class KitchenOrderAdded implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets;

    public function __construct(
        public Order $order
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('private-kds.' . $this->order->store_id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'kitchen.order.added';
    }

    public function broadcastWith(): array
    {
        $order = $this->order->loadMissing([
            'items.food:id,name,cooking_time,price',
            'client:id,name',
            'store:id,name,alias,order_prefix,order_suffix,order_padding',
        ]);

        return [
            'id' => $order->id,
            'store_order_number' => $order->store_order_number,
            'status' => $order->status->value,
            'status_label' => $order->status->label(),
            'delivery_type' => $order->delivery_type,
            'client_name' => $order->client?->name,
            'notes' => $order->notes,
            'items' => $order->items->map(fn($i) => [
                'id' => $i->id,
                'name' => $i->food?->name,
                'quantity' => $i->quantity,
                'cooking_time' => $i->food?->cooking_time ?? 0,
            ]),
            'created_at' => $order->created_at,
        ];
    }
}
