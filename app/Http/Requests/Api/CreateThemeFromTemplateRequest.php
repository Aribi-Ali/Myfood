<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class CreateThemeFromTemplateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user();
    }

    public function rules(): array
    {
        return [
            'template_id' => 'required|exists:templates,id',
            'name'        => 'nullable|string|max:255',
        ];
    }
}
