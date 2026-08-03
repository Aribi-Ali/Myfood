<?php

namespace App\Events;

use App\Models\Order;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

class KitchenOrderCompleted implements ShouldBroadcastNow
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
        return 'kitchen.order.completed';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->order->id,
            'store_order_number' => $this->order->store_order_number,
            'status' => $this->order->status->value,
            'status_label' => $this->order->status->label(),
            'updated_at' => $this->order->updated_at,
        ];
    }
}
