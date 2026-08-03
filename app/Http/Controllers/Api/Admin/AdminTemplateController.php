<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Template;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class AdminTemplateController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Template::with(['blocks' => fn($q) => $q->orderBy('sort_order'), 'themePresets']);

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('search')) {
            $s = str_replace(['%', '_'], ['\\%', '\\_'], $request->search);
            $query->where(function ($q) use ($s) {
                $q->where('name', 'like', "%{$s}%")
                  ->orWhere('description', 'like', "%{$s}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->boolean('active_only')) {
            $query->where('is_active', true)->where('status', 'active');
        }

        $templates = $query->orderBy('sort_order')->paginate(min((int)$request->input('per_page', 50), 100));

        return response()->json($templates);
    }

    public function show(Template $template): JsonResponse
    {
        $template->load(['blocks' => fn($q) => $q->orderBy('sort_order'), 'themePresets', 'defaultPreset']);
        return response()->json(['data' => $template]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:100',
            'thumbnail' => 'nullable|string|max:500',
            'html_content' => 'nullable|string',
            'css_content' => 'nullable|string',
            'has_react_component' => 'nullable|boolean',
            'component_path' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
            'status' => 'nullable|in:draft,testing,active',
        ])->validate();

        $slug = Str::slug($validated['name']);
        $validated['slug'] = $slug;

        if (Template::where('slug', $slug)->exists()) {
            $baseSlug = $slug;
            $i = 2;
            while (Template::where('slug', $baseSlug . '-' . $i)->exists()) {
                $i++;
            }
            $validated['slug'] = $baseSlug . '-' . $i;
        }

        $validated['sort_order'] = $validated['sort_order'] ?? 0;
        $validated['status'] = $validated['status'] ?? 'draft';
        $validated['is_active'] = $validated['is_active'] ?? ($validated['status'] === 'active');
        $validated['has_react_component'] = $validated['has_react_component'] ?? false;

        $template = Template::create($validated);

        Cache::forget('templates.active.all');

        return response()->json(['data' => $template], 201);
    }

    public function update(Request $request, Template $template): JsonResponse
    {
        $rules = [
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:100',
            'thumbnail' => 'nullable|string|max:500',
            'html_content' => 'nullable|string',
            'css_content' => 'nullable|string',
            'has_react_component' => 'nullable|boolean',
            'component_path' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
            'status' => 'nullable|in:draft,testing,active',
        ];

        $validated = Validator::make($request->all(), $rules)->validate();

        $status = $validated['status'] ?? $template->status;
        $hasReact = $validated['has_react_component'] ?? $template->has_react_component;
        if ($status === 'active' && !$hasReact) {
            $htmlContent = $validated['html_content'] ?? $template->html_content;
            if (!$htmlContent || trim($htmlContent) === '') {
                return response()->json([
                    'message' => 'Template must have html_content when set to active without a React component.',
                    'errors' => ['html_content' => ['HTML content is required for active templates without a React component.']],
                ], 422);
            }
        }

        if (isset($validated['name']) && !isset($validated['slug'])) {
            $newSlug = Str::slug($validated['name']);
            if ($newSlug !== $template->slug && Template::where('slug', $newSlug)->exists()) {
                $baseSlug = $newSlug;
                $i = 2;
                while (Template::where('slug', $baseSlug . '-' . $i)->exists()) {
                    $i++;
                }
                $newSlug = $baseSlug . '-' . $i;
            }
            $validated['slug'] = $newSlug;
        }

        $template->update($validated);

        Cache::forget('templates.active.all');

        return response()->json(['data' => $template->fresh()]);
    }

    public function destroy(Template $template): JsonResponse
    {
        $storeCount = DB::table('stores')->where('template_slug', $template->slug)->count();

        if ($storeCount > 0) {
            return response()->json([
                'message' => "Cannot delete template: {$storeCount} store(s) are using it. Reassign them first.",
                'store_count' => $storeCount,
            ], 422);
        }

        $template->delete();

        Cache::forget('templates.active.all');

        return response()->json(['message' => 'Template deleted.']);
    }
}
