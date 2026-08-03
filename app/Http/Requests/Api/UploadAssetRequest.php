<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class UploadAssetRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user();
    }

    public function rules(): array
    {
        return [
            'image' => 'required|image|mimes:jpeg,png,webp,gif|max:5120',
            'group' => 'nullable|string|in:general,logo,cover,food,gallery,block',
        ];
    }

    public function messages(): array
    {
        return [
            'image.required' => 'An image file is required.',
            'image.max'      => 'Image size must not exceed 5MB.',
            'image.mimes'    => 'Allowed formats: JPEG, PNG, WebP, GIF.',
        ];
    }
}
