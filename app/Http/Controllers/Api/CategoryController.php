<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Cache::remember('categories_all', now()->addHour(), function () {
            return Category::orderBy('name')->get();
        });

        return response()->json($categories)
            ->header('Cache-Control', 'public, max-age=3600');
    }
}
