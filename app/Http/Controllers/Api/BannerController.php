<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\JsonResponse;

class BannerController extends Controller
{
    use ApiResponse;

    public function active(): JsonResponse
    {
        $banners = Banner::with('store:id,name,alias')
            ->where('active', true)
            ->orderByDesc('created_at')
            ->get();

        return $this->success($banners);
    }

    public function storeBanners(string $alias): JsonResponse
    {
        $banners = Banner::whereHas('store', fn($q) => $q->where('alias', $alias))
            ->where('active', true)
            ->orderByDesc('created_at')
            ->get();

        return $this->success($banners);
    }
}
