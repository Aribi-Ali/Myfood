<?php

namespace App\Events;

use App\Models\ChefProfile;
use App\Models\Store;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

class ChefInvitation implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets;

    public function __construct(
        public ChefProfile $chef,
        public Store $store
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('private-chef.' . $this->chef->user_id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'chef.invitation';
    }

    public function broadcastWith(): array
    {
        return [
            'chef_profile_id' => $this->chef->id,
            'store' => [
                'id' => $this->store->id,
                'name' => $this->store->name,
                'alias' => $this->store->alias,
            ],
            'invited_at' => now(),
        ];
    }
}
