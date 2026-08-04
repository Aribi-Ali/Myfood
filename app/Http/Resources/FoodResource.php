<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FoodResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'name'          => $this->name,
            'description'   => $this->description,
            'price'           => (float) $this->price,
            'price_usd'       => $this->price_usd ? (float) $this->price_usd : null,
            'price_eur'       => $this->price_eur ? (float) $this->price_eur : null,
            'new_price'       => $this->new_price ? (float) $this->new_price : null,
            'new_price_usd'   => $this->new_price_usd ? (float) $this->new_price_usd : null,
            'new_price_eur'   => $this->new_price_eur ? (float) $this->new_price_eur : null,
            'effective_price' => (float) $this->effective_price,
            'is_available'  => $this->is_available,
            'is_offer'      => $this->is_offer,
            'is_today_special' => $this->is_today_special,
            'today_special_expires_at' => $this->today_special_expires_at,
            'is_on_offer'   => $this->is_on_offer,
            'ingredients'   => $this->ingredients,
            'cooking_time'  => $this->cooking_time,
            'bought_count'  => $this->bought_count,
            'image'         => $this->image ? asset('storage/' . $this->image) : null,
            'categories'    => $this->whenLoaded('categories', fn () =>
                $this->categories->map(fn ($cat) => ['id' => $cat->id, 'name' => $cat->name])
            ),
            'additional_images' => $this->whenLoaded('additionalImages', fn () =>
                $this->additionalImages->map(fn ($img) => asset('storage/' . $img->image_path))
            ),
            'store_id'      => $this->store_id,
        ];
    }
}
