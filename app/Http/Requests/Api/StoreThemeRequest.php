<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class StoreThemeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user();
    }

    public function rules(): array
    {
        return [
            'name'        => 'required|string|max:255',
            'slug'        => 'nullable|string|max:255|unique:themes,slug',
            'description' => 'nullable|string|max:1000',
            'emoji'       => 'nullable|string|max:10',
            'layout'      => 'nullable|array',
            'styles'      => 'nullable|array',
            'sections'    => 'nullable|array',
            'css_vars'    => 'nullable|array',
            'food_card_style' => 'nullable|string|in:grid,list,compact',
            'variables'   => 'nullable|array',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Theme name is required.',
            'slug.unique'   => 'This slug is already in use.',
        ];
    }
}
