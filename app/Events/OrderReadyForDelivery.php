<?php

namespace App\Events;

use App\Models\Order;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

class OrderReadyForDelivery implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets;

    public function __construct(
        public Order $order
    ) {}

    public function broadcastOn(): array
    {
        $channels = [
            new PrivateChannel('orders.store.' . $this->order->store_id),
        ];

        if ($this->order->delivery_id) {
            $channels[] = new PrivateChannel('private-delivery.' . $this->order->delivery_id);
        }

        return $channels;
    }

    public function broadcastAs(): string
    {
        return 'order.ready';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->order->id,
            'store_order_number' => $this->order->store_order_number,
            'status' => $this->order->status->value,
            'status_label' => $this->order->status->label(),
            'delivery_type' => $this->order->delivery_type,
            'items_count' => $this->order->items->count(),
            'created_at' => $this->order->created_at,
            'store' => [
                'id' => $this->order->store->id,
                'name' => $this->order->store->name,
                'alias' => $this->order->store->alias,
            ],
        ];
    }
}
