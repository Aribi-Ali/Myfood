<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\UploadAssetRequest;
use App\Models\PageAsset;
use App\Models\Store;
use App\Services\AssetService;
use Illuminate\Http\JsonResponse;

class AssetController extends Controller
{
    public function __construct(
        protected AssetService $assetService,
    ) {}

    protected function getStore(): Store
    {
        $store = request()->user()?->store;
        if (!$store) {
            abort(404, 'Store not found.');
        }
        return $store;
    }

    protected function resolveUrl(string $url): string
    {
        if (str_starts_with($url, 'http')) return $url;
        return asset(ltrim($url, '/'));
    }

    public function index(): JsonResponse
    {
        $store = $this->getStore();
        $group = request()->input('group');
        $assets = $this->assetService->list($store, $group);
        $items = collect($assets->items())->map(fn (PageAsset $a) => [
            'id'            => $a->id,
            'url'           => $this->resolveUrl($a->url),
            'original_name' => $a->original_name,
            'mime_type'     => $a->mime_type,
            'width'         => $a->width,
            'height'        => $a->height,
            'group'         => $a->group,
            'created_at'    => $a->created_at,
        ]);
        return response()->json(['data' => $items, 'meta' => [
            'current_page' => $assets->currentPage(),
            'last_page'    => $assets->lastPage(),
            'total'        => $assets->total(),
        ]]);
    }

    public function store(UploadAssetRequest $request): JsonResponse
    {
        $store = $this->getStore();
        $asset = $this->assetService->upload(
            $store,
            $request->file('image'),
            $request->input('group', 'general'),
            $request->user()->id,
        );
        $data = $asset->toArray();
        $data['url'] = $this->resolveUrl($asset->url);
        return response()->json(['data' => $data], 201);
    }

    public function destroy(PageAsset $asset): JsonResponse
    {
        $store = $this->getStore();
        if ($asset->store_id !== $store->id) {
            abort(403, 'Unauthorized.');
        }
        $this->assetService->delete($asset);
        return response()->json(['message' => 'Asset deleted.']);
    }
}
