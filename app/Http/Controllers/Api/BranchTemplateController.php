<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BranchTemplate;
use App\Models\StoreBranch;
use App\Services\BranchTemplateService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BranchTemplateController extends Controller
{
    use ApiResponse;

    protected BranchTemplateService $service;

    public function __construct(BranchTemplateService $service)
    {
        $this->service = $service;
    }

    /**
     * Get the template configuration for a branch.
     */
    public function show(StoreBranch $branch): JsonResponse
    {
        $bt = BranchTemplate::where('branch_id', $branch->id)->first();
        if (!$bt) {
            return $this->success(null);
        }
        $template = $bt->template;
        return $this->success([
            'template' => $template,
            'is_synced' => $bt->is_synced,
            'source_branch_id' => $bt->source_branch_id,
            'source_template_id' => $bt->source_template_id,
        ]);
    }

    /**
     * Create or clone a template for the branch.
     */
    public function store(Request $request, StoreBranch $branch): JsonResponse
    {
        $validated = $request->validate([
            'source_template_id' => 'nullable|integer|exists:templates,id',
            'template_data' => 'nullable|array',
            'is_synced' => 'boolean',
        ]);

        try {
            $bt = $this->service->createOrClone($branch, $validated);
            return $this->success($bt->load('template'), 201, 'Branch template created.');
        } catch (\Throwable $e) {
            return $this->error('Failed to create branch template: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Update the branch's template content (blocks, html, css, etc.).
     */
    public function update(Request $request, StoreBranch $branch): JsonResponse
    {
        $validated = $request->validate([
            'template_data' => 'required|array',
            'is_synced' => 'boolean',
        ]);

        try {
            $bt = BranchTemplate::where('branch_id', $branch->id)->first();
            if (!$bt) {
                return $this->notFound('Branch template not found.');
            }

            // Editing a synced template detaches it so the branch keeps its own copy.
            if (isset($validated['is_synced']) && !$validated['is_synced'] && $bt->is_synced) {
                $this->service->toggleSync($bt, false);
                $bt->refresh();
            }

            $bt->template->update($validated['template_data']);

            // Recreate blocks from the payload when provided.
            if (isset($validated['template_data']['blocks'])) {
                $bt->template->blocks()->delete();
                foreach ($validated['template_data']['blocks'] as $block) {
                    $bt->template->blocks()->create($block);
                }
            }

            return $this->success($bt->fresh()->load('template.blocks'), 200, 'Branch template updated.');
        } catch (\Throwable $e) {
            return $this->error('Failed to update branch template: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Toggle sync on/off.
     */
    public function updateSync(Request $request, StoreBranch $branch): JsonResponse
    {
        $validated = $request->validate([
            'is_synced' => 'required|boolean',
        ]);
        $bt = BranchTemplate::where('branch_id', $branch->id)->firstOrFail();
        $this->service->toggleSync($bt, $validated['is_synced']);
        return $this->success($bt->fresh()->load('template'), 200, 'Sync status updated.');
    }

    /**
     * Remove custom template for branch (fallback to default).
     */
    public function destroy(StoreBranch $branch): JsonResponse
    {
        $bt = BranchTemplate::where('branch_id', $branch->id)->first();
        if ($bt) {
            $bt->delete();
        }
        return $this->success(null, 200, 'Branch template removed.');
    }

    /**
     * Clone another branch's template into this branch.
     */
    public function clone(Request $request, StoreBranch $branch): JsonResponse
    {
        $validated = $request->validate([
            'source_branch_template_id' => 'required|integer|exists:branch_templates,id',
        ]);

        try {
            $source = BranchTemplate::findOrFail($validated['source_branch_template_id']);
            $bt = $this->service->cloneToBranch($branch, $source);
            return $this->success($bt->load('template'), 201, 'Branch template cloned.');
        } catch (\Throwable $e) {
            return $this->error('Failed to clone branch template: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Export the branch's template as JSON (backup / duplication).
     */
    public function export(StoreBranch $branch): JsonResponse
    {
        try {
            return $this->success($this->service->exportTemplate($branch));
        } catch (\Throwable $e) {
            return $this->error('Failed to export template: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Import a previously exported template into the branch.
     */
    public function import(Request $request, StoreBranch $branch): JsonResponse
    {
        $validated = $request->validate([
            'template' => 'required|array',
            'is_synced' => 'boolean',
        ]);

        try {
            $bt = $this->service->importTemplate($branch, $validated);
            return $this->success($bt->load('template'), 201, 'Branch template imported.');
        } catch (\Throwable $e) {
            return $this->error('Failed to import template: ' . $e->getMessage(), 500);
        }
    }
}
