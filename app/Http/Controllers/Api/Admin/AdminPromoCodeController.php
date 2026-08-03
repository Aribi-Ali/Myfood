<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\ApiResponse;
use App\Models\PromoCode;
use App\Services\Feature;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminPromoCodeController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        if (Feature::disabled('promo_codes')) {
            return response()->json(['message' => 'This feature is not available.'], 404);
        }

        $query = PromoCode::with('store:id,name,alias');

        if ($request->filled('search')) {
            $s = '%' . $request->search . '%';
            $query->where('code', 'like', $s);
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        if ($request->filled('store_id')) {
            $query->where('store_id', $request->store_id);
        }

        $promoCodes = $query->orderByDesc('created_at')
            ->paginate(config('business.pagination.orders', 15));

        return $this->success($promoCodes);
    }

    public function show(int $id): JsonResponse
    {
        if (Feature::disabled('promo_codes')) {
            return response()->json(['message' => 'This feature is not available.'], 404);
        }

        $promoCode = PromoCode::with('store:id,name,alias')->findOrFail($id);
        return $this->success($promoCode);
    }

    public function store(Request $request): JsonResponse
    {
        if (Feature::disabled('promo_codes')) {
            return response()->json(['message' => 'This feature is not available.'], 404);
        }

        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:promo_codes,code',
            'type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric|min:0.01',
            'store_id' => 'nullable|integer|exists:stores,id',
            'expires_at' => 'nullable|date|after:now',
            'is_active' => 'boolean',
        ]);

        $promoCode = PromoCode::create($validated);

        return $this->success($promoCode->load('store:id,name,alias'), 201, 'Promo code created.');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        if (Feature::disabled('promo_codes')) {
            return response()->json(['message' => 'This feature is not available.'], 404);
        }

        $promoCode = PromoCode::findOrFail($id);

        $validated = $request->validate([
            'code' => 'sometimes|string|max:50|unique:promo_codes,code,' . $id,
            'type' => 'sometimes|in:percentage,fixed',
            'value' => 'sometimes|numeric|min:0.01',
            'store_id' => 'nullable|integer|exists:stores,id',
            'expires_at' => 'nullable|date|after:now',
            'is_active' => 'boolean',
        ]);

        $promoCode->update($validated);

        return $this->success($promoCode->fresh()->load('store:id,name,alias'), 200, 'Promo code updated.');
    }

    public function destroy(int $id): JsonResponse
    {
        if (Feature::disabled('promo_codes')) {
            return response()->json(['message' => 'This feature is not available.'], 404);
        }

        $promoCode = PromoCode::findOrFail($id);
        $promoCode->delete();

        return $this->success(null, 200, 'Promo code deleted.');
    }
}
