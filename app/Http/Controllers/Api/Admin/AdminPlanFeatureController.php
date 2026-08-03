<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\ApiResponse;
use App\Models\PlanFeature;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminPlanFeatureController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        return $this->success(PlanFeature::orderBy('name')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'code'        => 'required|string|max:100|unique:plan_features,code',
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string|max:5000',
            'icon'        => 'nullable|string|max:100',
        ]);

        $feature = PlanFeature::create($data);

        return $this->success($feature, 201, 'Feature created.');
    }

    public function update(Request $request, PlanFeature $planFeature): JsonResponse
    {
        $data = $request->validate([
            'code'        => 'sometimes|required|string|max:100|unique:plan_features,code,' . $planFeature->id,
            'name'        => 'sometimes|required|string|max:255',
            'description' => 'nullable|string|max:5000',
            'icon'        => 'nullable|string|max:100',
        ]);

        $planFeature->update($data);

        return $this->success($planFeature, 200, 'Feature updated.');
    }

    public function destroy(PlanFeature $planFeature): JsonResponse
    {
        $planFeature->delete();

        return $this->success(null, 200, 'Feature deleted.');
    }
}
