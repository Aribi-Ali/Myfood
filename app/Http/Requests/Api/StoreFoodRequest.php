<?php

declare(strict_types=1);

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class StoreFoodRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->store !== null;
    }

    public function rules(): array
    {
        $rules = [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'price_usd' => 'nullable|numeric|min:0',
            'price_eur' => 'nullable|numeric|min:0',
            'new_price' => 'nullable|numeric|min:0|lt:price',
            'new_price_usd' => 'nullable|numeric|min:0',
            'new_price_eur' => 'nullable|numeric|min:0',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:categories,id',
            'cooking_time' => 'nullable|integer|min:1',
            'is_available' => 'boolean',
            'is_offer' => 'boolean',
            'ingredients' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'food_items' => 'nullable|array',
            'food_items.*.id' => 'required_with:food_items|exists:foods,id',
            'food_items.*.quantity' => 'required_with:food_items|integer|min:1',
        ];

        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            $rules['name'] = 'sometimes|string|max:255';
            $rules['price'] = 'sometimes|numeric|min:0';
            $rules['price_usd'] = 'nullable|numeric|min:0';
            $rules['price_eur'] = 'nullable|numeric|min:0';
            $rules['new_price'] = 'nullable|numeric|min:0';
            $rules['new_price_usd'] = 'nullable|numeric|min:0';
            $rules['new_price_eur'] = 'nullable|numeric|min:0';
            $rules['food_items.*.id'] = 'sometimes|exists:foods,id';
            $rules['food_items.*.quantity'] = 'sometimes|integer|min:1';
        }

        return $rules;
    }
}
