<?php

namespace App\Events;

use App\Models\Order;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

class RiderLocationUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets;

    public function __construct(
        public Order $order,
        public float $latitude,
        public float $longitude
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('orders.client.' . $this->order->client_id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'rider.location.updated';
    }

    public function broadcastWith(): array
    {
        return [
            'order_id' => $this->order->id,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'updated_at' => now(),
        ];
    }
}
