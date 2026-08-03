<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\ApiResponse;
use App\Models\Badge;
use App\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class AdminStoreController extends Controller
{
    use ApiResponse;

    private function clearStoreCaches(Store $store): void
    {
        Cache::forget('stores:approved:page_1');
        Cache::forget('store:alias_' . $store->alias);
        Cache::forget('public_store_' . $store->alias);
        Cache::forget('store_foods_' . $store->id);
    }

    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'filter' => 'nullable|in:pending,approved,suspended,all',
            'search' => 'nullable|string|max:100',
        ]);

        $filter = $request->input('filter', 'all');
        $search = $request->input('search');

        $query = Store::with(['owner:id,name,email,phone', 'badges'])
            ->withAvg('reviews', 'rating')
            ->withCount('reviews');

        if ($filter === 'pending') {
            $query->where('is_approved', false);
        } elseif ($filter === 'approved') {
            $query->where('is_approved', true)->where('is_active', true);
        } elseif ($filter === 'suspended') {
            $query->where('is_active', false);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $s = '%' . $search . '%';
                $q->where('name', 'like', $s)
                  ->orWhere('alias', 'like', $s)
                  ->orWhereHas('owner', fn ($oq) => $oq->where('name', 'like', $s));
            });
        }

        $stores = $query->orderByDesc('created_at')
            ->paginate(config('business.pagination.stores', 20));

        return $this->success($stores);
    }

    public function show(int $id): JsonResponse
    {
        $store = Store::with([
            'owner:id,name,email,phone',
            'badges',
            'foods',
        ])
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->findOrFail($id);

        return $this->success($store);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $store = Store::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string|max:5000',
            'phone' => 'sometimes|string|max:20',
            'phones' => 'nullable|array',
            'phones.*' => 'required|string|max:30',
            'address' => 'sometimes|string|max:500',
            'is_approved' => 'sometimes|boolean',
            'ordering_enabled' => 'sometimes|boolean',
        ]);

        $phones = $validated['phones'] ?? null;
        unset($validated['phones']);

        $store->update($validated);

        if ($phones !== null) {
            $store->phones()->delete();
            foreach ($phones as $i => $phone) {
                if (empty($phone)) continue;
                $store->phones()->create([
                    'phone'       => $phone,
                    'is_primary'  => $i === 0,
                    'order_index' => $i,
                ]);
            }
        }

        $this->clearStoreCaches($store);

        return $this->success($store->fresh()->load('phones'), 200, 'Store updated.');
    }

    public function toggleOrdering(int $id): JsonResponse
    {
        $store = Store::findOrFail($id);
        $store->update(['ordering_enabled' => !$store->ordering_enabled]);
        $this->clearStoreCaches($store);

        return $this->success($store->fresh(), 200, $store->ordering_enabled ? 'Ordering enabled.' : 'Ordering disabled.');
    }

    public function approve(int $id): JsonResponse
    {
        $store = Store::findOrFail($id);
        $store->update([
            'is_approved'       => true,
            'is_active'         => true,
            'onboarding_status' => 'approved',
        ]);
        $this->clearStoreCaches($store);

        return $this->success($store->fresh(), 200, 'Restaurant approuvé.');
    }

    public function reject(int $id): JsonResponse
    {
        $store = Store::findOrFail($id);
        $store->update(['is_approved' => false]);
        $this->clearStoreCaches($store);

        return $this->success($store->fresh(), 200, 'Restaurant refusé.');
    }

    public function suspend(int $id): JsonResponse
    {
        $store = Store::findOrFail($id);
        $store->update(['is_active' => false]);
        $this->clearStoreCaches($store);

        return $this->success($store->fresh(), 200, 'Store suspended.');
    }

    public function unsuspend(int $id): JsonResponse
    {
        $store = Store::findOrFail($id);
        $store->update(['is_active' => true]);
        $this->clearStoreCaches($store);

        return $this->success($store->fresh(), 200, 'Store unsuspended.');
    }

    public function assignBadge(int $storeId, int $badgeId): JsonResponse
    {
        $store = Store::findOrFail($storeId);
        $badge = Badge::findOrFail($badgeId);

        $store->badges()->syncWithoutDetaching([$badgeId]);

        return $this->success($store->fresh()->load('badges'), 200, 'Badge attribué.');
    }

    public function removeBadge(int $storeId, int $badgeId): JsonResponse
    {
        $store = Store::findOrFail($storeId);
        $store->badges()->detach($badgeId);

        return $this->success($store->fresh()->load('badges'), 200, 'Badge retiré.');
    }
}
