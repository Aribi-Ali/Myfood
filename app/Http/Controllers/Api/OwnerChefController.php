<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChefProfile;
use App\Models\ChefStoreHire;
use App\Models\User;
use App\Services\Feature;
use App\Services\WebSocketBroadcastService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OwnerChefController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected WebSocketBroadcastService $broadcastService
    ) {}

    public function index(Request $request): JsonResponse
    {
        if (Feature::disabled('chef_hiring')) {
            return response()->json(['message' => 'This feature is not available.'], 404);
        }

        try {
            $store = Auth::user()->store;

            if (!$store) {
                return $this->forbidden('No store found for this account.');
            }

            $query = ChefProfile::with(['user', 'skills', 'diplomas', 'images'])
                ->available()
                ->where('is_verified', true);

            if ($request->filled('specialization')) {
                $query->bySpecialization($request->specialization);
            }

            if ($request->filled('cuisine')) {
                $query->byCuisine($request->cuisine);
            }
     
            if ($request->filled('min_rating')) {
                $query->minRating((float) $request->min_rating);
            }

            if ($request->filled('search')) {
                $search = '%' . $request->search . '%';
                $query->whereHas('user', function ($q) use ($search) {
                    $q->where('name', 'like', $search)
                      ->orWhere('email', 'like', $search);
                });
            }

            $chefs = $query->orderBy('average_rating', 'desc')
                ->paginate(min((int)$request->input('per_page', 15), 100));

            return $this->success($chefs);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    public function hired(Request $request): JsonResponse
    {
        if (Feature::disabled('chef_hiring')) {
            return response()->json(['message' => 'This feature is not available.'], 404);
        }

        try {
            $store = Auth::user()->store;

            if (!$store) {
                return $this->forbidden('No store found for this account.');
            }

            $hires = ChefStoreHire::where('store_id', $store->id)
                ->where('is_active', true)
                ->with(['chefProfile.user', 'chefProfile.skills', 'chefProfile.diplomas', 'chefProfile.images'])
                ->orderByDesc('hired_at')
                ->paginate(min((int)$request->input('per_page', 15), 100));

            return $this->success($hires);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    public function hire(int $chefId): JsonResponse
    {
        if (Feature::disabled('chef_hiring')) {
            return response()->json(['message' => 'This feature is not available.'], 404);
        }

        try {
            $store = Auth::user()->store;

            if (!$store) {
                return $this->forbidden('No store found for this account.');
            }

            $chefProfile = ChefProfile::where('user_id', $chefId)
                ->where('is_available', true)
                ->first();

            if (!$chefProfile) {
                return $this->notFound('Chef not found or not available.');
            }

            $existingHire = ChefStoreHire::where('chef_profile_id', $chefProfile->id)
                ->where('store_id', $store->id)
                ->where('is_active', true)
                ->first();

            if ($existingHire) {
                return $this->error('Chef is already hired by this store.', 422);
            }

            $hire = ChefStoreHire::create([
                'chef_profile_id' => $chefProfile->id,
                'store_id' => $store->id,
                'hired_by' => Auth::id(),
                'hired_at' => now(),
                'is_active' => true,
            ]);

            $hire->load(['chefProfile.user', 'store']);

            $this->broadcastService->chefHired($hire);

            return $this->success($hire, 201, 'Chef hired successfully.');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    public function fire(int $chefId): JsonResponse
    {
        if (Feature::disabled('chef_hiring')) {
            return response()->json(['message' => 'This feature is not available.'], 404);
        }

        try {
            $store = Auth::user()->store;

            if (!$store) {
                return $this->forbidden('No store found for this account.');
            }

            $chefProfile = ChefProfile::where('user_id', $chefId)->first();

            if (!$chefProfile) {
                return $this->notFound('Chef not found.');
            }

            $hire = ChefStoreHire::where('chef_profile_id', $chefProfile->id)
                ->where('store_id', $store->id)
                ->where('is_active', true)
                ->first();

            if (!$hire) {
                return $this->notFound('No active hire record found for this chef.');
            }

            $hire->update(['is_active' => false]);
            $hire->load(['chefProfile.user', 'store']);

            $this->broadcastService->chefFired($hire);

            return $this->success(null, 200, 'Chef has been fired successfully.');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }
}