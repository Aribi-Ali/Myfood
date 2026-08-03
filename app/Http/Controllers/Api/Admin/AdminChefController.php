<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\ApiResponse;
use App\Enums\Role;
use App\Models\ChefProfile;
use App\Models\User;
use App\Notifications\ChefApproved;
use App\Services\Feature;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AdminChefController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        if (Feature::disabled('chef_hiring')) {
            return response()->json(['message' => 'This feature is not available.'], 404);
        }

        $request->validate([
            'filter' => 'nullable|in:pending,verified,rejected,all',
        ]);

        $filter = $request->input('filter', 'pending');

        $query = ChefProfile::with(['user:id,name,email,phone,profile_image']);

        if ($filter === 'pending') {
            $query->where('is_verified', false)->whereNull('rejected_at');
        } elseif ($filter === 'verified') {
            $query->where('is_verified', true);
        } elseif ($filter === 'rejected') {
            $query->whereNotNull('rejected_at');
        }

        $chefs = $query->orderByDesc('created_at')
            ->paginate(config('business.pagination.chefs', 20));

        return $this->success($chefs);
    }

    public function show(int $id): JsonResponse
    {
        if (Feature::disabled('chef_hiring')) {
            return response()->json(['message' => 'This feature is not available.'], 404);
        }

        $chef = ChefProfile::with(['user:id,name,email,phone,profile_image'])
            ->findOrFail($id);

        return $this->success($chef);
    }

    public function approve(int $id): JsonResponse
    {
        if (Feature::disabled('chef_hiring')) {
            return response()->json(['message' => 'This feature is not available.'], 404);
        }

        $chefProfile = ChefProfile::findOrFail($id);
        $chefProfile->update([
            'is_verified' => true,
            'verified_at' => now(),
            'rejected_at' => null,
            'rejection_reason' => null,
        ]);

        $user = User::findOrFail($chefProfile->user_id);
        if ($user->role === Role::Client) {
            $user->update(['role' => Role::Chef]);
        }

        try {
            $user->notify(new ChefApproved($chefProfile));
        } catch (\Exception $e) {
            Log::warning('Chef approval notification failed: ' . $e->getMessage());
        }

        return $this->success($chefProfile->fresh()->load('user:id,name,email'), 200, 'Chef approuvé.');
    }

    public function reject(Request $request, int $id): JsonResponse
    {
        if (Feature::disabled('chef_hiring')) {
            return response()->json(['message' => 'This feature is not available.'], 404);
        }

        $validated = $request->validate([
            'reason' => 'nullable|string|max:500',
        ]);

        $chefProfile = ChefProfile::findOrFail($id);
        $chefProfile->update([
            'is_verified' => false,
            'rejected_at' => now(),
            'rejection_reason' => $validated['reason'] ?? null,
        ]);

        return $this->success($chefProfile->fresh()->load('user:id,name,email'), 200, 'Chef rejected.');
    }

    public function destroy(int $id): JsonResponse
    {
        if (Feature::disabled('chef_hiring')) {
            return response()->json(['message' => 'This feature is not available.'], 404);
        }

        $chefProfile = ChefProfile::findOrFail($id);
        $userId = $chefProfile->user_id;
        $chefProfile->delete();

        User::where('id', $userId)->where('role', Role::Chef)->update(['role' => Role::Client]);

        return $this->success(null, 200, 'Chef profile deleted.');
    }
}
