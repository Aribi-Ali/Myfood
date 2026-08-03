<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChefProfile;
use App\Services\Feature;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ChefController extends Controller
{
    /**
     * GET /api/v1/chefs — public listing of verified chefs.
     */
    public function index(Request $request): JsonResponse
    {
        if (Feature::disabled('chef_hiring')) {
            return response()->json(['message' => 'This feature is not available.'], 404);
        }

        $request->validate([
            'specialization' => 'nullable|string|max:100',
            'cuisine'        => 'nullable|string|max:100',
        ]);

        $page = $request->integer('page', 1);
        $cacheKey = 'chefs:verified:page_' . $page;

        $chefs = Cache::remember($cacheKey, 3600, function () use ($request) {
            return ChefProfile::where('is_verified', true)
                ->with('user:id,name,profile_image')
                ->when($request->specialization, fn ($q, $s) => $q->where('specialization', 'like', "%{$s}%"))
                ->paginate(config('business.pagination.chefs', 12));
        });

        return response()->json($chefs);
    }

    /**
     * GET /api/v1/chefs/{id} — public chef profile.
     */
    public function show(int $id): JsonResponse
    {
        if (Feature::disabled('chef_hiring')) {
            return response()->json(['message' => 'This feature is not available.'], 404);
        }

        $chef = ChefProfile::where('id', $id)
            ->where('is_verified', true)
            ->with([
                'user:id,name,profile_image',
                'skills',
                'workHistory',
            ])
            ->firstOrFail();

        return response()->json([
            'data' => [
                'id'                  => $chef->id,
                'bio'                 => $chef->bio,
                'specialization'      => $chef->specialization,
                'years_of_experience' => $chef->years_of_experience,
                'cuisines_expertise'  => $chef->getCuisinesArray(),
                'name'                => $chef->user->name,
                'profile_image'       => $chef->user->profile_image
                    ? asset('storage/' . $chef->user->profile_image)
                    : null,
                'skills'              => $chef->skills,
                'work_history'        => $chef->workHistory,
            ],
        ]);
    }
}
