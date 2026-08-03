<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\ApiResponse;
use App\Models\Banner;
use App\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminBannerController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = Banner::with('store:id,name,alias');

        if ($request->has('active')) {
            $query->where('active', $request->boolean('active'));
        }

        if ($request->filled('store_id')) {
            $query->where('store_id', $request->store_id);
        }

        $banners = $query->orderByDesc('created_at')
            ->paginate(config('business.pagination.orders', 15));

        return $this->success($banners);
    }

    public function show(int $id): JsonResponse
    {
        $banner = Banner::with('store:id,name,alias')->findOrFail($id);
        return $this->success($banner);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'store_id' => 'nullable|integer|exists:stores,id',
            'image' => 'required_without:image_path|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'image_path' => 'required_without:image|string|max:500',
            'link_url' => 'nullable|string|max:500',
            'active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            $validated['image_path'] = $request->file('image')->store('banners', 'public');
        }

        $banner = Banner::create($validated);

        return $this->success($banner->load('store:id,name,alias'), 201, 'Banner created.');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $banner = Banner::findOrFail($id);

        $validated = $request->validate([
            'store_id' => 'nullable|integer|exists:stores,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'image_path' => 'nullable|string|max:500',
            'link_url' => 'nullable|string|max:500',
            'active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            if ($banner->image_path) {
                Storage::disk('public')->delete($banner->image_path);
            }
            $validated['image_path'] = $request->file('image')->store('banners', 'public');
        }

        $banner->update($validated);

        return $this->success($banner->fresh()->load('store:id,name,alias'), 200, 'Banner updated.');
    }

    public function destroy(int $id): JsonResponse
    {
        $banner = Banner::findOrFail($id);
        if ($banner->image_path && !str_starts_with($banner->image_path, 'http')) {
            Storage::disk('public')->delete($banner->image_path);
        }
        $banner->delete();

        return $this->success(null, 200, 'Banner deleted.');
    }

    public function uploadImage(Request $request): JsonResponse
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        $path = $request->file('image')->store('banners', 'public');

        return $this->success([
            'image_path' => $path,
            'url' => asset('storage/' . $path),
        ], 201, 'Image uploaded.');
    }
}
