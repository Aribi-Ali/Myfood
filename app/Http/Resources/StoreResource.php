<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StoreResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'name'           => $this->name,
            'alias'          => $this->alias,
            'description'    => $this->description,
            'is_approved'    => $this->is_approved,
            'cover_image'    => $this->cover_image
                ? asset('storage/' . $this->cover_image)
                : null,
            'avg_rating'     => $this->average_rating ?? round(
                $this->reviews_avg_rating ?? 0,
                1
            ),
            'reviews_count'  => $this->reviews_count ?? 0,
            'opening_hours'  => $this->opening_hours,
            'avg_prep_time'     => $this->avg_prep_time,
            'ordering_enabled'  => $this->ordering_enabled,
            'badges'            => $this->whenLoaded('badges', fn () =>
                $this->badges->map(fn ($b) => [
                    'id'    => $b->id,
                    'name'  => $b->name,
                    'color' => $b->color ?? null,
                    'icon'  => $b->icon ?? null,
                ])
            ),
            'foods_count'    => $this->whenLoaded('foods', fn () => $this->foods->count()),
            'template_slug'  => $this->template_slug,
            'theme_preset_id' => $this->theme_preset_id,
            'logo'           => $this->logo_path
                ? asset('storage/' . $this->logo_path)
                : null,
            'wilaya'         => $this->wilaya,
            'daira'          => $this->daira,
            'commune'        => $this->commune,
            'phone'          => $this->phone,
            'phones'         => $this->whenLoaded('phones', fn () =>
                $this->phones->map(fn ($p) => [
                    'id'          => $p->id,
                    'phone'       => $p->phone,
                    'is_primary'  => $p->is_primary,
                    'verified_at' => $p->verified_at?->toIso8601String(),
                ])
            ),
            'email'          => $this->email,
            'address'        => $this->address,
            'staff'          => $this->whenLoaded('staff', fn () =>
                $this->staff->map(fn ($s) => [
                    'name' => $s->name,
                    'role' => $s->role,
                ])
            ),
            'type_categories' => $this->whenLoaded('typeCategories', fn () =>
                $this->typeCategories->map(fn ($tc) => [
                    'id'   => $tc->id,
                    'name' => $tc->name,
                    'slug' => $tc->slug,
                    'icon' => $tc->icon,
                ])
            ),

            // New fields
            'social_links' => $this->whenLoaded('socialLinks', fn () =>
                $this->socialLinks->map(fn ($sl) => [
                    'id'       => $sl->id,
                    'platform' => $sl->platform,
                    'url'      => $sl->url,
                    'label'    => $sl->label,
                    'icon'     => $sl->icon,
                ])
            ),
            'images' => $this->whenLoaded('images', fn () =>
                $this->images->map(fn ($img) => [
                    'id'       => $img->id,
                    'path'     => $img->path ? asset('storage/' . $img->path) : null,
                    'is_cover' => $img->is_cover,
                ])
            ),
            'offers' => $this->whenLoaded('offers', fn () =>
                $this->offers->map(fn ($offer) => [
                    'id'          => $offer->id,
                    'title'       => $offer->title,
                    'description' => $offer->description,
                    'active'      => $offer->active,
                    'valid_from'  => $offer->valid_from?->toIso8601String(),
                    'valid_to'    => $offer->valid_to?->toIso8601String(),
                ])
            ),
            'banners' => $this->whenLoaded('banners', fn () =>
                $this->banners->map(fn ($banner) => [
                    'id'       => $banner->id,
                    'image'    => $banner->image_path ? asset('storage/' . $banner->image_path) : null,
                    'link_url' => $banner->link_url,
                    'active'   => $banner->active,
                ])
            ),
            'reservation_enabled' => $this->whenLoaded('reservationSetting', fn () =>
                $this->reservationSetting?->enabled ?? false
            ),
            'latitude'                => $this->latitude,
            'longitude'               => $this->longitude,
            'avg_prep_time'           => $this->avg_prep_time,
            'base_delivery_fee'       => $this->base_delivery_fee,
            'delivery_zone_radius'    => $this->delivery_zone_radius,
            'avg_delivery_time_per_km'=> $this->avg_delivery_time_per_km,
            'allows_pre_orders'       => $this->allows_pre_orders ?? false,
            'pre_order_lead_time_hours' => $this->pre_order_lead_time_hours,
            'is_paused'               => $this->is_paused ?? false,
            'pause_note'              => $this->pause_note,
        ];
    }
}
