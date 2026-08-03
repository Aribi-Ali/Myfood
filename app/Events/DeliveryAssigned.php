<?php

namespace App\Events;

use App\Models\Order;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

class DeliveryAssigned implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets;

    public function __construct(
        public Order $order
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('private-delivery.' . $this->order->delivery_id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'delivery.assigned';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->order->id,
            'store_order_number' => $this->order->store_order_number,
            'store' => [
                'id' => $this->order->store->id,
                'name' => $this->order->store->name,
                'alias' => $this->order->store->alias,
                'address' => $this->order->store->address,
                'latitude' => $this->order->store->latitude,
                'longitude' => $this->order->store->longitude,
            ],
            'client' => [
                'id' => $this->order->client->id,
                'name' => $this->order->client->name,
                'phone' => $this->order->client->phone,
                'address' => $this->order->client->address,
                'latitude' => $this->order->client->latitude,
                'longitude' => $this->order->client->longitude,
            ],
            'items' => $this->order->items->map(fn ($item) => [
                'id' => $item->id,
                'name' => $item->name,
                'quantity' => $item->pivot->quantity,
            ]),
            'delivery_type' => $this->order->delivery_type,
            'estimated_delivery_minutes' => $this->order->estimated_delivery_minutes,
            'created_at' => $this->order->created_at,
        ];
    }
}
