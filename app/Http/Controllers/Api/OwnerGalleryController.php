<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StoreImage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class OwnerGalleryController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $store = $request->attributes->get('store') ?? Auth::user()->store;

        if (!$store) {
            return $this->forbidden('No store found for this account.');
        }

        $images = StoreImage::where('store_id', $store->id)
            ->orderByDesc('created_at')
            ->paginate(min((int)$request->input('per_page', 20), 100));

        return $this->success($images);
    }

    public function store(Request $request): JsonResponse
    {
        $store = $request->attributes->get('store') ?? Auth::user()->store;

        if (!$store) {
            return $this->forbidden('No store found for this account.');
        }

        $request->validate([
            'image' => 'required|image|max:4096',
            'is_cover' => 'boolean',
        ]);

        $path = $request->file('image')->store('gallery', 'public');

        $image = StoreImage::create([
            'store_id' => $store->id,
            'path' => $path,
            'is_cover' => $request->boolean('is_cover', false),
        ]);

        return $this->success($image, 201);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $store = $request->attributes->get('store') ?? Auth::user()->store;

        if (!$store) {
            return $this->forbidden('No store found for this account.');
        }

        $image = StoreImage::where('id', $id)->where('store_id', $store->id)->first();

        if (!$image) {
            return $this->notFound('Image not found.');
        }

        Storage::disk('public')->delete($image->path);
        $image->delete();

        return $this->success(null, 200, 'Image deleted.');
    }
}
