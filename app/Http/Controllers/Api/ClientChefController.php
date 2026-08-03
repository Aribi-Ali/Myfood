<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChefProfile;
use App\Enums\Role;
use App\Models\Store;
use App\Services\Feature;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ClientChefController extends Controller
{
    use ApiResponse;

    public function show(): JsonResponse
    {
        if (Feature::disabled('chef_hiring')) {
            return response()->json(['message' => 'This feature is not available.'], 404);
        }

        $profile = ChefProfile::where('user_id', Auth::id())
            ->with(['skills', 'workHistory', 'diplomas', 'images'])
            ->first();

        if (!$profile) {
            return $this->notFound('Vous n\'avez pas encore de profil chef.');
        }

        return $this->success($profile);
    }

    public function update(Request $request): JsonResponse
    {
        if (Feature::disabled('chef_hiring')) {
            return response()->json(['message' => 'This feature is not available.'], 404);
        }

        $data = $request->validate([
            'bio'                  => 'nullable|string|max:2000',
            'specialization'       => 'nullable|string|max:255',
            'years_of_experience'  => 'nullable|integer|min:0|max:100',
            'cuisines'             => 'nullable|array',
            'cuisines.*'           => 'string|max:100',
            'verification_document' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
        ]);

        $user = Auth::user();
        $profile = ChefProfile::where('user_id', $user->id)->first();

        $updateData = [];

        if ($request->filled('bio')) {
            $updateData['bio'] = $data['bio'];
        }
        if ($request->filled('specialization')) {
            $updateData['specialization'] = $data['specialization'];
        }
        if ($request->has('years_of_experience')) {
            $updateData['years_of_experience'] = (int) $data['years_of_experience'];
        }
        if ($request->has('cuisines')) {
            $updateData['cuisines_expertise'] = json_encode($data['cuisines']);
        }
        if ($request->hasFile('verification_document')) {
            if ($profile && $profile->verification_document) {
                Storage::disk('public')->delete($profile->verification_document);
            }
            $updateData['verification_document'] = $request->file('verification_document')
                ->store('chef-documents', 'public');
        }

        if ($profile) {
            $profile->update($updateData);
        } else {
            $updateData['user_id'] = $user->id;
            $updateData['is_verified'] = false;
            $updateData['cuisines_expertise'] = isset($data['cuisines']) ? json_encode($data['cuisines']) : '[]';
            $profile = ChefProfile::create($updateData);
        }

        return $this->success(
            $profile->fresh()->load(['skills', 'workHistory', 'diplomas', 'images']),
            200,
            'Profil chef enregistré.'
        );
    }

    public function uploadDocument(Request $request): JsonResponse
    {
        if (Feature::disabled('chef_hiring')) {
            return response()->json(['message' => 'This feature is not available.'], 404);
        }

        $data = $request->validate([
            'document' => 'required|file|mimes:pdf,jpg,jpeg,png|max:10240',
        ]);

        $profile = ChefProfile::where('user_id', Auth::id())->firstOrFail();

        if ($profile->verification_document) {
            Storage::disk('public')->delete($profile->verification_document);
        }

        $path = $request->file('document')->store('chef-documents', 'public');
        $profile->update(['verification_document' => $path]);

        return $this->success([
            'verification_document' => asset('storage/' . $path),
        ], 200, 'Document téléchargé.');
    }

    /**
     * Get stores the authenticated chef is hired at.
     */
    public function stores(): JsonResponse
    {
        if (Feature::disabled('chef_hiring')) {
            return response()->json(['message' => 'This feature is not available.'], 404);
        }

        $profile = ChefProfile::where('user_id', Auth::id())->first();

        if (!$profile) {
            return $this->success([]);
        }

        $stores = Store::whereHas('chefStoreHires', function ($q) use ($profile) {
            $q->where('chef_profile_id', $profile->id)
              ->where('is_active', true);
        })
            ->with(['badges'])
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->orderBy('name')
            ->get();

        return $this->success($stores);
    }
}
