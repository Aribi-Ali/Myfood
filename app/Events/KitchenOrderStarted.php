<?php

namespace App\Events;

use App\Models\Order;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

class KitchenOrderStarted implements ShouldBroadcastNow
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
        return 'kitchen.order.started';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->order->id,
            'store_order_number' => $this->order->store_order_number,
            'status' => $this->order->status->value,
            'status_label' => $this->order->status->label(),
            'assigned_chef_id' => $this->order->assigned_chef_id,
            'updated_at' => $this->order->updated_at,
        ];
    }
}
