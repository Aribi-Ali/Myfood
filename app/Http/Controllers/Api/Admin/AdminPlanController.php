<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\ApiResponse;
use App\Models\Plan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminPlanController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $plans = Plan::with([
            'features',
            'tiers' => fn ($q) => $q->with('activeDurationOffers'),
        ])
            ->orderBy('sort_order')
            ->get();

        return $this->success($plans);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'slug'        => 'required|string|max:255|unique:plans,slug',
            'description' => 'nullable|string|max:5000',
            'is_active'   => 'nullable|boolean',
            'sort_order'  => 'nullable|integer|min:0',
            'features'    => 'nullable|array',
            'features.*'  => 'integer|exists:plan_features,id',
        ]);

        $plan = Plan::create([
            'name'        => $data['name'],
            'slug'        => $data['slug'],
            'description' => $data['description'] ?? null,
            'is_active'   => $data['is_active'] ?? true,
            'sort_order'  => $data['sort_order'] ?? 0,
        ]);

        if (!empty($data['features'])) {
            $plan->features()->sync($data['features']);
        }

        $plan->load(['features', 'tiers']);

        return $this->success($plan, 201, 'Plan created.');
    }

    public function show(Plan $plan): JsonResponse
    {
        $plan->load([
            'features',
            'tiers' => fn ($q) => $q->with('activeDurationOffers'),
        ]);

        return $this->success($plan);
    }

    public function update(Request $request, Plan $plan): JsonResponse
    {
        $data = $request->validate([
            'name'        => 'sometimes|required|string|max:255',
            'slug'        => 'sometimes|required|string|max:255|unique:plans,slug,' . $plan->id,
            'description' => 'nullable|string|max:5000',
            'is_active'   => 'nullable|boolean',
            'sort_order'  => 'nullable|integer|min:0',
            'features'    => 'nullable|array',
            'features.*'  => 'integer|exists:plan_features,id',
        ]);

        $plan->update($data);

        if (isset($data['features'])) {
            $plan->features()->sync($data['features']);
        }

        $plan->load(['features', 'tiers']);

        return $this->success($plan, 200, 'Plan updated.');
    }

    public function destroy(Plan $plan): JsonResponse
    {
        if ($plan->tiers()->where('is_active', true)->exists()) {
            $hasActiveSubscriptions = \App\Models\StoreSubscription::whereIn('plan_tier_id', $plan->tiers()->pluck('id'))
                ->whereIn('status', ['trialing', 'active'])
                ->exists();

            if ($hasActiveSubscriptions) {
                return $this->error('Cannot delete a plan with active subscriptions.', 409);
            }
        }

        $plan->delete();

        return $this->success(null, 200, 'Plan deleted.');
    }
}
