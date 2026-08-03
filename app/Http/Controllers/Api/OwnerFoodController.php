<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreFoodRequest;
use App\Models\Food;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class OwnerFoodController extends Controller
{
    use ApiResponse;
    public function index(Request $request): JsonResponse
    {
        $store = Auth::user()->store;
        if (!$store) {
            return response()->json(['message' => 'No store found'], 403);
        }

        $foods = Food::where('store_id', $store->id)
            ->with('categories', 'packageItems.categories')
            ->orderBy('name')
            ->get();

        return $this->success($foods);
    }

    public function store(StoreFoodRequest $request): JsonResponse
    {
        $store = Auth::user()->store;
        if (!$store) {
            return $this->error('No store found', 403);
        }

        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('foods', 'public');
        }

        $categoryIds = $data['category_ids'] ?? [];
        unset($data['category_ids'], $data['category_id']);

        $foodItems = $data['food_items'] ?? null;
        unset($data['food_items']);

        if ($data['is_offer'] ?? false) {
            $originalPrice = 0;
            $syncData = [];
            foreach ($foodItems ?? [] as $item) {
                $child = Food::where('id', $item['id'])->where('store_id', $store->id)->firstOrFail();
                $qty = max(1, (int) ($item['quantity'] ?? 1));
                $originalPrice += (float) $child->price * $qty;
                $syncData[$item['id']] = ['quantity' => $qty];
            }
            $data['price'] = $originalPrice;
        }

        $data['store_id'] = $store->id;
        $food = Food::create($data);

        if (!empty($categoryIds)) {
            $food->categories()->sync($categoryIds);
        }

        if (($data['is_offer'] ?? false) && !empty($syncData)) {
            $food->packageItems()->sync($syncData);
            $food->load('packageItems.categories');
        }

        return $this->success($food->load('categories'), 201);
    }

    public function show(int $id): JsonResponse
    {
        $store = Auth::user()->store;
        $food = Food::where('id', $id)->where('store_id', $store->id)->with('categories')->first();
        if (!$food) {
            return $this->error('Food not found', 404);
        }

        return $this->success($food);
    }

    public function update(StoreFoodRequest $request, int $id): JsonResponse
    {
        $store = Auth::user()->store;
        $food = Food::where('id', $id)->where('store_id', $store->id)->first();
        if (!$food) {
            return $this->error('Food not found', 404);
        }

        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('foods', 'public');
        }

        $categoryIds = $data['category_ids'] ?? null;
        unset($data['category_ids'], $data['category_id']);

        $foodItems = $data['food_items'] ?? null;
        unset($data['food_items']);

        if ($foodItems !== null) {
            $originalPrice = 0;
            $syncData = [];
            foreach ($foodItems as $item) {
                $child = Food::where('id', $item['id'])->where('store_id', $store->id)->firstOrFail();
                $qty = max(1, (int) ($item['quantity'] ?? 1));
                $originalPrice += (float) $child->price * $qty;
                $syncData[$item['id']] = ['quantity' => $qty];
            }
            $data['price'] = $originalPrice;
            $food->packageItems()->sync($syncData);
        }

        $food->update($data);

        if ($categoryIds !== null) {
            $food->categories()->sync($categoryIds);
        }

        return $this->success($food->fresh()->load(['categories', 'packageItems.categories']));
    }

    public function destroy(int $id): JsonResponse
    {
        $store = Auth::user()->store;
        $food = Food::where('id', $id)->where('store_id', $store->id)->first();
        if (!$food) {
            return $this->error('Food not found', 404);
        }

        $food->delete();

        return $this->success(null, 200, 'Food deleted');
    }

    public function uploadImage(Request $request, int $id): JsonResponse
    {
        $store = Auth::user()->store;
        $food = Food::where('id', $id)->where('store_id', $store->id)->first();
        if (!$food) {
            return $this->error('Food not found', 404);
        }

        $request->validate(['image' => ['required', 'file', 'image', 'max:2048']]);
        $path = $request->file('image')->store('foods', 'public');
        $food->update(['image' => $path]);

        return $this->success($food->fresh());
    }

    public function categories(): JsonResponse
    {
        $categories = Cache::remember('categories', 86400, function () {
            return Category::orderBy('name')->get();
        });

        return response()->json(['data' => $categories]);
    }
}
