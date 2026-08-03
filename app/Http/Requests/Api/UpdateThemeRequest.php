<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class UpdateThemeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user();
    }

    public function rules(): array
    {
        return [
            'name'        => 'sometimes|string|max:255',
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
}
