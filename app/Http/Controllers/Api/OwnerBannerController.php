<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class OwnerBannerController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $store = Auth::user()->store;
        if (!$store) {
            return $this->error('No store found.', 403);
        }

        $banners = Banner::where('store_id', $store->id)
            ->orderByDesc('created_at')
            ->get();

        return $this->success($banners);
    }

    public function store(Request $request): JsonResponse
    {
        $store = Auth::user()->store;
        if (!$store) {
            return $this->error('No store found.', 403);
        }

        $validated = $request->validate([
            'image' => 'required_without:image_path|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'image_path' => 'required_without:image|string|max:500',
            'link_url' => 'nullable|string|max:500',
            'active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            $validated['image_path'] = $request->file('image')->store('banners', 'public');
        }

        $validated['store_id'] = $store->id;

        $banner = Banner::create($validated);

        return $this->success($banner, 201, 'Banner created.');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $store = Auth::user()->store;
        if (!$store) {
            return $this->error('No store found.', 403);
        }

        $banner = Banner::where('store_id', $store->id)->findOrFail($id);

        $validated = $request->validate([
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'image_path' => 'nullable|string|max:500',
            'link_url' => 'nullable|string|max:500',
            'active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            if ($banner->image_path && !str_starts_with($banner->image_path, 'http')) {
                Storage::disk('public')->delete($banner->image_path);
            }
            $validated['image_path'] = $request->file('image')->store('banners', 'public');
        }

        $banner->update($validated);

        return $this->success($banner->fresh(), 200, 'Banner updated.');
    }

    public function destroy(int $id): JsonResponse
    {
        $store = Auth::user()->store;
        if (!$store) {
            return $this->error('No store found.', 403);
        }

        $banner = Banner::where('store_id', $store->id)->findOrFail($id);
        if ($banner->image_path && !str_starts_with($banner->image_path, 'http')) {
            Storage::disk('public')->delete($banner->image_path);
        }
        $banner->delete();

        return $this->success(null, 200, 'Banner deleted.');
    }
}
