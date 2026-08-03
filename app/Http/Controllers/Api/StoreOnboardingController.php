<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StoreTypeCategory;
use App\Services\StoreOnboardingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StoreOnboardingController extends Controller
{
    use ApiResponse;

    protected StoreOnboardingService $onboardingService;

    public function __construct(StoreOnboardingService $onboardingService)
    {
        $this->onboardingService = $onboardingService;
    }

    /**
     * Get onboarding status and current draft values of the owner's store.
     */
    public function getStatus(Request $request): JsonResponse
    {
        $store = $request->user()->store;

        if (!$store) {
            return $this->error('User does not have an associated store.', 404);
        }

        // Load relations
        $store->load(['socialLinks', 'typeCategories']);

        $currentStep = $this->onboardingService->getCurrentStep($store);

        return $this->success([
            'onboarding_status' => $store->onboarding_status,
            'current_step'      => $currentStep,
            'store'             => $store,
        ], 200, 'Onboarding status retrieved');
    }

    /**
     * Get available store type categories.
     */
    public function getStoreTypes(): JsonResponse
    {
        return $this->success(
            StoreTypeCategory::where('is_active', true)->orderBy('name')->get()
        );
    }

    /**
     * Step 1: Save basic info.
     */
    public function saveBasicInfo(Request $request): JsonResponse
    {
        $store = $request->user()->store;
        if (!$store) {
            return $this->error('Store not found', 404);
        }

        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'phone'       => 'nullable|string|max:20',
            'phones'      => 'nullable|array',
            'phones.*'    => 'required|string|max:30',
            'email'       => 'required|email|max:255',
            'address'     => 'required|string|max:500',
        ]);

        $store = $this->onboardingService->saveBasicInfo($store, $validated);

        return $this->success($store, 200, 'Basic info saved successfully');
    }

    /**
     * Step 2: Save store types.
     */
    public function saveStoreTypes(Request $request): JsonResponse
    {
        $store = $request->user()->store;
        if (!$store) {
            return $this->error('Store not found', 404);
        }

        $validated = $request->validate([
            'type_ids'   => 'required|array',
            'type_ids.*' => 'exists:store_type_categories,id',
        ]);

        $store = $this->onboardingService->saveStoreTypes($store, $validated['type_ids']);

        return $this->success($store->load('typeCategories'), 200, 'Store types saved successfully');
    }

    /**
     * Step 3: Save geographic location coordinates.
     */
    public function saveLocation(Request $request): JsonResponse
    {
        $store = $request->user()->store;
        if (!$store) {
            return $this->error('Store not found', 404);
        }

        $validated = $request->validate([
            'latitude'  => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'address'   => 'required|string|max:500',
            'wilaya'    => 'nullable|string|max:255',
            'daira'     => 'nullable|string|max:255',
            'commune'   => 'nullable|string|max:255',
        ]);

        $store = $this->onboardingService->saveLocation($store, $validated);

        return $this->success($store, 200, 'Location saved successfully');
    }

    /**
     * Step 4: Save social links.
     */
    public function saveSocialLinks(Request $request): JsonResponse
    {
        $store = $request->user()->store;
        if (!$store) {
            return $this->error('Store not found', 404);
        }

        $validated = $request->validate([
            'links'            => 'required|array',
            'links.*.platform' => 'required|string|in:facebook,instagram,tiktok,youtube,x,snapchat,whatsapp,website',
            'links.*.url'      => 'required|url|max:255',
            'links.*.label'    => 'nullable|string|max:50',
        ]);

        $store = $this->onboardingService->saveSocialLinks($store, $validated['links']);

        return $this->success($store->load('socialLinks'), 200, 'Social links saved successfully');
    }

    /**
     * Step 5: Save break settings.
     */
    public function saveBreakSettings(Request $request): JsonResponse
    {
        $store = $request->user()->store;
        if (!$store) {
            return $this->error('Store not found', 404);
        }

        $validated = $request->validate([
            'is_active'   => 'required|boolean',
            'break_start' => 'nullable|date',
            'break_end'   => 'nullable|date|after_or_equal:break_start',
            'break_note'  => 'nullable|string|max:1000',
        ]);

        $store = $this->onboardingService->saveBreakSettings($store, $validated);

        return $this->success($store, 200, 'Availability settings saved successfully');
    }

    /**
     * Step 6: Complete onboarding.
     */
    public function completeOnboarding(Request $request): JsonResponse
    {
        $store = $request->user()->store;
        if (!$store) {
            return $this->error('Store not found', 404);
        }

        try {
            $store = $this->onboardingService->completeOnboarding($store);
        } catch (\InvalidArgumentException $e) {
            return $this->error($e->getMessage(), 422);
        }

        return $this->success($store, 200, 'Onboarding completed successfully');
    }
}
