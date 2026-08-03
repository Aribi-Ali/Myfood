<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SavedSection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OwnerSavedSectionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $store = $request->user()->store;
        $sections = SavedSection::where('store_id', $store->id)
            ->orderBy('sort_order')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['data' => $sections]);
    }

    public function store(Request $request): JsonResponse
    {
        $store = $request->user()->store;

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'html' => 'required|string',
            'css' => 'nullable|string',
            'thumbnail' => 'nullable|string|max:500',
        ]);

        $maxOrder = SavedSection::where('store_id', $store->id)->max('sort_order') ?? 0;

        $section = SavedSection::create([
            'store_id' => $store->id,
            'name' => $data['name'],
            'html' => $data['html'],
            'css' => $data['css'] ?? '',
            'thumbnail' => $data['thumbnail'] ?? null,
            'sort_order' => $maxOrder + 1,
        ]);

        return response()->json(['data' => $section], 201);
    }

    public function update(Request $request, SavedSection $savedSection): JsonResponse
    {
        $store = $request->user()->store;
        if ($savedSection->store_id !== $store->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'html' => 'sometimes|string',
            'css' => 'nullable|string',
            'thumbnail' => 'nullable|string|max:500',
            'sort_order' => 'sometimes|integer',
        ]);

        $savedSection->update($data);

        return response()->json(['data' => $savedSection]);
    }

    public function destroy(Request $request, SavedSection $savedSection): JsonResponse
    {
        $store = $request->user()->store;
        if ($savedSection->store_id !== $store->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $savedSection->delete();

        return response()->json(['message' => 'Section deleted.']);
    }
}
