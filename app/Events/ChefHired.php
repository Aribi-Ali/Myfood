<?php

namespace App\Events;

use App\Models\ChefStoreHire;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

class ChefHired implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets;

    public function __construct(
        public ChefStoreHire $hire
    ) {
        $this->hire->loadMissing(['chefProfile.user', 'store']);
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('private-chef.' . $this->hire->chefProfile->user_id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'chef.hired';
    }

    public function broadcastWith(): array
    {
        return [
            'hire_id' => $this->hire->id,
            'chef_profile_id' => $this->hire->chef_profile_id,
            'store' => [
                'id' => $this->hire->store->id,
                'name' => $this->hire->store->name,
                'alias' => $this->hire->store->alias,
            ],
            'hired_at' => $this->hire->hired_at,
            'hired_by' => [
                'id' => $this->hire->hiredBy->id,
                'name' => $this->hire->hiredBy->name,
            ],
        ];
    }
}
