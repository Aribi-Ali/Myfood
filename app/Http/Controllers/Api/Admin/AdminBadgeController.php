<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\ApiResponse;
use App\Models\Badge;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminBadgeController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        return $this->success(Badge::orderBy('name')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'color_code'  => 'nullable|string|max:50',
            'icon'        => 'nullable|string|max:500',
        ]);

        $badge = Badge::create($data);

        return $this->success($badge, 201, 'Badge créé.');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $badge = Badge::findOrFail($id);

        $data = $request->validate([
            'name'        => 'sometimes|string|max:255',
            'description' => 'nullable|string|max:1000',
            'color_code'  => 'nullable|string|max:50',
            'icon'        => 'nullable|string|max:500',
        ]);

        $badge->update($data);

        return $this->success($badge->fresh(), 200, 'Badge mis à jour.');
    }

    public function destroy(int $id): JsonResponse
    {
        $badge = Badge::findOrFail($id);
        $badge->stores()->detach();
        $badge->delete();

        return $this->success(null, 200, 'Badge supprimé.');
    }
}
