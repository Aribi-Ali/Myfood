<?php

namespace App\Events;

use App\Models\Order;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

class DeliveryCompleted implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets;

    public function __construct(
        public Order $order
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('orders.client.' . $this->order->client_id),
            new PrivateChannel('orders.store.' . $this->order->store_id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'delivery.completed';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->order->id,
            'store_order_number' => $this->order->store_order_number,
            'status' => $this->order->status->value,
            'status_label' => $this->order->status->label(),
            'delivered_at' => now(),
            'total_amount' => $this->order->total_amount,
            'store' => [
                'id' => $this->order->store->id,
                'name' => $this->order->store->name,
                'alias' => $this->order->store->alias,
            ],
        ];
    }
}
