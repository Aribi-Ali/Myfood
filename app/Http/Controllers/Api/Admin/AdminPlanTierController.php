<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\ApiResponse;
use App\Models\Plan;
use App\Models\PlanTier;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminPlanTierController extends Controller
{
    use ApiResponse;

    public function index(Plan $plan): JsonResponse
    {
        $tiers = $plan->tiers()->with('activeDurationOffers')->orderBy('sort_order')->get();

        return $this->success($tiers);
    }

    public function store(Request $request, Plan $plan): JsonResponse
    {
        $data = $request->validate([
            'name'          => 'required|string|max:255',
            'min_orders'    => 'nullable|integer|min:0',
            'max_orders'    => 'nullable|integer|min:0',
            'monthly_price' => 'required|numeric|min:0',
            'is_active'     => 'nullable|boolean',
            'sort_order'    => 'nullable|integer|min:0',
        ]);

        $tier = $plan->tiers()->create([
            'name'          => $data['name'],
            'min_orders'    => $data['min_orders'] ?? 0,
            'max_orders'    => $data['max_orders'] ?? null,
            'monthly_price' => $data['monthly_price'],
            'is_active'     => $data['is_active'] ?? true,
            'sort_order'    => $data['sort_order'] ?? 0,
        ]);

        $tier->load('activeDurationOffers');

        return $this->success($tier, 201, 'Tier created.');
    }

    public function show(PlanTier $planTier): JsonResponse
    {
        $planTier->load(['plan', 'activeDurationOffers']);

        return $this->success($planTier);
    }

    public function update(Request $request, PlanTier $planTier): JsonResponse
    {
        $data = $request->validate([
            'name'          => 'sometimes|required|string|max:255',
            'min_orders'    => 'nullable|integer|min:0',
            'max_orders'    => 'nullable|integer|min:0',
            'monthly_price' => 'sometimes|required|numeric|min:0',
            'is_active'     => 'nullable|boolean',
            'sort_order'    => 'nullable|integer|min:0',
        ]);

        $planTier->update($data);
        $planTier->load('activeDurationOffers');

        return $this->success($planTier, 200, 'Tier updated.');
    }

    public function destroy(PlanTier $planTier): JsonResponse
    {
        $hasActiveSubscriptions = \App\Models\StoreSubscription::where('plan_tier_id', $planTier->id)
            ->whereIn('status', ['trialing', 'active'])
            ->exists();

        if ($hasActiveSubscriptions) {
            return $this->error('Cannot delete a tier with active subscriptions.', 409);
        }

        $planTier->delete();

        return $this->success(null, 200, 'Tier deleted.');
    }
}
