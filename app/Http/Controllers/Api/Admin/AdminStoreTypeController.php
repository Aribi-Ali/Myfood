<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\ApiResponse;
use App\Models\StoreTypeCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminStoreTypeController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        return $this->success(
            StoreTypeCategory::orderBy('name')->get()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'      => 'required|string|max:255',
            'slug'      => 'nullable|string|max:255|unique:store_type_categories,slug',
            'icon'      => 'nullable|string|max:10',
            'is_active' => 'nullable|boolean',
        ]);

        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $type = StoreTypeCategory::create($data);

        return $this->success($type, 201, 'Type créé.');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $type = StoreTypeCategory::findOrFail($id);

        $data = $request->validate([
            'name'      => 'sometimes|string|max:255',
            'slug'      => 'nullable|string|max:255|unique:store_type_categories,slug,' . $id,
            'icon'      => 'nullable|string|max:10',
            'is_active' => 'nullable|boolean',
        ]);

        $type->update($data);

        return $this->success($type->fresh(), 200, 'Type mis à jour.');
    }

    public function destroy(int $id): JsonResponse
    {
        $type = StoreTypeCategory::findOrFail($id);
        $type->stores()->detach();
        $type->delete();

        return $this->success(null, 200, 'Type supprimé.');
    }
}
