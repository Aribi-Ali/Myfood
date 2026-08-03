<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Template;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class PublicTemplateController extends Controller
{
    public function listActive(): JsonResponse
    {
        $templates = Cache::remember('templates.active.all', 3600, function () {
            return Template::with([
                'blocks' => fn($q) => $q->where('is_active', true)->orderBy('sort_order'),
                'themePresets',
                'defaultPreset',
            ])
                ->available()
                ->orderBy('sort_order')
                ->get()
                ->toArray();
        });

        return response()->json(['data' => $templates])
            ->header('Cache-Control', 'public, max-age=3600');
    }

    public function show(string $slug): JsonResponse
    {
        $template = Template::with([
            'blocks' => fn($q) => $q->where('is_active', true)->orderBy('sort_order'),
            'themePresets',
            'defaultPreset',
        ])
            ->where('slug', $slug)
            ->available()
            ->firstOrFail();

        return response()->json(['data' => $template]);
    }

    public function getPresets(string $slug): JsonResponse
    {
        $template = Template::where('slug', $slug)
            ->available()
            ->firstOrFail();

        $presets = $template->themePresets()->orderBy('id')->get();

        return response()->json(['data' => $presets]);
    }
}
