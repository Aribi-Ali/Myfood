<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Template;
use App\Models\ThemePreset;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class AdminThemePresetController extends Controller
{
    public function index(Template $template): JsonResponse
    {
        $presets = $template->themePresets()->orderBy('id')->get();
        return response()->json(['data' => $presets]);
    }

    public function store(Request $request, Template $template): JsonResponse
    {
        $validated = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'css_vars' => 'required|array',
            'colors' => 'nullable|array',
            'is_default' => 'nullable|boolean',
        ])->validate();

        $validated['template_id'] = $template->id;

        $preset = DB::transaction(function () use ($validated, $template) {
            if ($validated['is_default'] ?? false) {
                $template->themePresets()->where('is_default', true)->update(['is_default' => false]);
            }

            return ThemePreset::create($validated);
        });

        return response()->json(['data' => $preset], 201);
    }

    public function show(ThemePreset $themePreset): JsonResponse
    {
        return response()->json(['data' => $themePreset]);
    }

    public function update(Request $request, ThemePreset $themePreset): JsonResponse
    {
        $validated = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'css_vars' => 'sometimes|array',
            'colors' => 'nullable|array',
            'is_default' => 'nullable|boolean',
        ])->validate();

        DB::transaction(function () use ($validated, $themePreset) {
            if ($validated['is_default'] ?? false) {
                $themePreset->template->themePresets()
                    ->where('is_default', true)
                    ->where('id', '!=', $themePreset->id)
                    ->update(['is_default' => false]);
            }

            $themePreset->update($validated);
        });

        return response()->json(['data' => $themePreset->fresh()]);
    }

    public function destroy(ThemePreset $themePreset): JsonResponse
    {
        $themePreset->delete();
        return response()->json(['message' => 'Theme preset deleted.']);
    }

    public function setDefault(ThemePreset $themePreset): JsonResponse
    {
        DB::transaction(function () use ($themePreset) {
            $themePreset->template->themePresets()
                ->where('is_default', true)
                ->where('id', '!=', $themePreset->id)
                ->update(['is_default' => false]);

            $themePreset->update(['is_default' => true]);
        });

        return response()->json(['data' => $themePreset->fresh()]);
    }
}
