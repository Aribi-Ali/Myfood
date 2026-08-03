<?php

declare(strict_types=1);

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class PlaceOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'delivery_type' => 'nullable|string|in:delivery,pickup',
            'scheduled_at' => 'nullable|date|after:now',
            'pickup_time' => 'nullable|string',
            'address' => 'nullable|required_if:delivery_type,delivery|string|max:500',
            'phone' => 'required|string|max:20',
            'notes' => 'nullable|string|max:1000',
            'promo_code' => 'nullable|string|max:50',
        ];
    }

    public function messages(): array
    {
        return [
            'address.required_if' => 'L\'adresse est requise pour la livraison.',
            'phone.required' => 'Le numéro de téléphone est requis.',
        ];
    }
}
