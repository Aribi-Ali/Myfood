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

        $bt = $this->service->createOrClone($branch, $validated);
        return $this->success($bt->load('template'), 201, 'Branch template created.');
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
}
?>
