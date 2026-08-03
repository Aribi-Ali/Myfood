<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                          => $this->id,
            'store_order_number'          => $this->store_order_number,
            'order_number_formatted'      => $this->order_number_formatted,
            'status'                      => $this->status instanceof \App\Enums\OrderStatus
                ? $this->status->value
                : $this->status,
            'status_label'                => $this->status instanceof \App\Enums\OrderStatus
                ? $this->status->label()
                : $this->status,
            'delivery_type'               => $this->delivery_type,
            'pickup_time'                 => $this->pickup_time,
            'total_amount'                => (float) $this->total_amount,
            'discount_amount'             => (float) $this->discount_amount,
            'delivery_fee'                => (float) ($this->delivery_fee ?? 0),
            'address'                     => $this->delivery_type === 'delivery' ? $this->address : null,
            'phone'                       => $this->phone,
            'notes'                       => $this->notes,
            'estimated_delivery_minutes'  => $this->estimated_delivery_minutes,
            'store'                       => $this->whenLoaded('store', fn () => [
                'id'    => $this->store->id,
                'name'  => $this->store->name,
                'alias' => $this->store->alias,
            ]),
            'items'                       => OrderItemResource::collection($this->whenLoaded('items')),
            'delivery_guy'                => $this->whenLoaded('deliveryGuy', fn () => $this->deliveryGuy ? [
                'id'   => $this->deliveryGuy->id,
                'name' => $this->deliveryGuy->name,
            ] : null),
            'promo_code'                  => $this->whenLoaded('promoCode', fn () => $this->promoCode ? [
                'code'     => $this->promoCode->code,
                'discount' => $this->promoCode->discount_value,
            ] : null),
            'created_at'                  => $this->created_at?->toIso8601String(),
            'updated_at'                  => $this->updated_at?->toIso8601String(),
        ];
    }
}
