<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\ApiResponse;
use App\Models\Food;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminFoodController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'search' => 'nullable|string|max:100',
            'store_id' => 'nullable|integer|exists:stores,id',
            'category_id' => 'nullable|integer',
        ]);

        $query = Food::with(['store:id,name,alias', 'categories:id,name']);

        if ($request->filled('search')) {
            $s = '%' . $request->search . '%';
            $query->where('name', 'like', $s);
        }

        if ($request->filled('store_id')) {
            $query->where('store_id', $request->store_id);
        }

        if ($request->filled('category_id')) {
            $query->whereHas('categories', fn ($q) => $q->where('categories.id', $request->category_id));
        }

        $foods = $query->orderByDesc('created_at')
            ->paginate(config('business.pagination.orders', 20));

        return $this->success($foods);
    }

    public function show(int $id): JsonResponse
    {
        $food = Food::with(['store:id,name,alias', 'categories:id,name'])->findOrFail($id);
        return $this->success($food);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $food = Food::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string|max:2000',
            'price' => 'sometimes|numeric|min:0',
            'new_price' => 'nullable|numeric|min:0',
            'new_price_usd' => 'nullable|numeric|min:0',
            'new_price_eur' => 'nullable|numeric|min:0',
            'is_available' => 'sometimes|boolean',
            'image_path' => 'nullable|string|max:500',
        ]);

        $food->update($validated);

        return $this->success($food->fresh()->load(['store:id,name,alias', 'categories:id,name']), 200, 'Food updated.');
    }

    public function destroy(int $id): JsonResponse
    {
        $food = Food::findOrFail($id);
        $food->delete();

        return $this->success(null, 200, 'Food deleted.');
    }
}
