<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Template;
use App\Models\TemplateBlock;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AdminTemplateBlockController extends Controller
{
    public function index(Template $template): JsonResponse
    {
        $blocks = $template->blocks()->orderBy('sort_order')->get()
            ->groupBy('category');

        return response()->json(['data' => $blocks]);
    }

    public function store(Request $request, Template $template): JsonResponse
    {
        $validated = Validator::make($request->all(), [
            'type' => 'required|string|max:100',
            'label' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:100',
            'sort_order' => 'nullable|integer|min:0',
            'config_schema' => 'nullable|array',
            'default_config' => 'nullable|array',
            'is_required' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
        ])->validate();

        $validated['template_id'] = $template->id;
        $validated['sort_order'] = $validated['sort_order']
            ?? $template->blocks()->max('sort_order') + 1;
        $validated['is_active'] = $validated['is_active'] ?? true;

        $block = TemplateBlock::create($validated);

        return response()->json(['data' => $block], 201);
    }

    public function show(TemplateBlock $templateBlock): JsonResponse
    {
        return response()->json(['data' => $templateBlock]);
    }

    public function update(Request $request, TemplateBlock $templateBlock): JsonResponse
    {
        $validated = Validator::make($request->all(), [
            'type' => 'sometimes|string|max:100',
            'label' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:100',
            'sort_order' => 'nullable|integer|min:0',
            'config_schema' => 'nullable|array',
            'default_config' => 'nullable|array',
            'is_required' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
        ])->validate();

        $templateBlock->update($validated);

        return response()->json(['data' => $templateBlock->fresh()]);
    }

    public function destroy(TemplateBlock $templateBlock): JsonResponse
    {
        $templateBlock->delete();
        return response()->json(['message' => 'Block deleted.']);
    }

    public function reorder(Request $request, Template $template): JsonResponse
    {
        $validated = Validator::make($request->all(), [
            'blocks' => 'required|array',
            'blocks.*.id' => 'required|integer|exists:template_blocks,id',
            'blocks.*.sort_order' => 'required|integer|min:0',
            'blocks.*.category' => 'nullable|string|max:100',
        ])->validate();

        foreach ($validated['blocks'] as $item) {
            TemplateBlock::where('id', $item['id'])
                ->where('template_id', $template->id)
                ->update([
                    'sort_order' => $item['sort_order'],
                    'category' => $item['category'] ?? null,
                ]);
        }

        return response()->json(['message' => 'Blocks reordered.']);
    }
}
