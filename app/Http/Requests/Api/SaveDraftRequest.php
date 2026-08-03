<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class SaveDraftRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user();
    }

    public function rules(): array
    {
        return [
            'html'       => 'nullable|string',
            'css'        => 'nullable|string',
            'grapes_data' => 'nullable|array',
            'theme_id'   => 'nullable|string|max:255',
        ];
    }
}
