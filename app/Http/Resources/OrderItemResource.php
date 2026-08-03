<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'       => $this->id,
            'quantity' => $this->quantity,
            'price'    => (float) $this->price,
            'subtotal' => (float) ($this->price * $this->quantity),
            'food'     => $this->whenLoaded('food', fn () => [
                'id'    => $this->food->id,
                'name'  => $this->food->name,
                'image' => $this->food->image_url ?? null,
            ]),
        ];
    }
}
