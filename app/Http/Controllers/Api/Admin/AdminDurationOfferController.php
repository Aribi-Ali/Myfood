<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\ApiResponse;
use App\Models\PlanDurationOffer;
use App\Models\PlanTier;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminDurationOfferController extends Controller
{
    use ApiResponse;

    public function index(PlanTier $planTier): JsonResponse
    {
        $offers = $planTier->durationOffers;

        return $this->success($offers);
    }

    public function store(Request $request, PlanTier $planTier): JsonResponse
    {
        $data = $request->validate([
            'months'          => 'required|integer|min:1|max:60',
            'discount_percent'=> 'required|numeric|min:0|max:100',
            'discount_label'  => 'nullable|string|max:255',
            'is_popular'      => 'nullable|boolean',
            'is_active'       => 'nullable|boolean',
        ]);

        $offer = $planTier->durationOffers()->create([
            'months'          => $data['months'],
            'discount_percent'=> $data['discount_percent'],
            'discount_label'  => $data['discount_label'] ?? null,
            'is_popular'      => $data['is_popular'] ?? false,
            'is_active'       => $data['is_active'] ?? true,
        ]);

        return $this->success($offer, 201, 'Duration offer created.');
    }

    public function show(PlanDurationOffer $planDurationOffer): JsonResponse
    {
        $planDurationOffer->load('planTier');

        return $this->success($planDurationOffer);
    }

    public function update(Request $request, PlanDurationOffer $planDurationOffer): JsonResponse
    {
        $data = $request->validate([
            'months'          => 'sometimes|required|integer|min:1|max:60',
            'discount_percent'=> 'sometimes|required|numeric|min:0|max:100',
            'discount_label'  => 'nullable|string|max:255',
            'is_popular'      => 'nullable|boolean',
            'is_active'       => 'nullable|boolean',
        ]);

        $planDurationOffer->update($data);

        return $this->success($planDurationOffer, 200, 'Duration offer updated.');
    }

    public function destroy(PlanDurationOffer $planDurationOffer): JsonResponse
    {
        $planDurationOffer->delete();

        return $this->success(null, 200, 'Duration offer deleted.');
    }
}
