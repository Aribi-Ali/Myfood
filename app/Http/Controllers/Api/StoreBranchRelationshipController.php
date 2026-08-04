<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Store;
use App\Models\StoreBranch;
use App\Services\BranchTemplateService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StoreBranchRelationshipController extends Controller
{
    use ApiResponse;

    protected BranchTemplateService $branchTemplateService;

    public function __construct(BranchTemplateService $branchTemplateService)
    {
        $this->branchTemplateService = $branchTemplateService;
    }

    /**
     * Get all branches for a store with their relationship status
     */
    public function index(Store $store): JsonResponse
    {
        if ($store->owner_id !== Auth::id()) {
            return $this->forbidden('You do not own this store.');
        }

        $branches = $store->branches()->with(['assignedUsers', 'branchTemplate'])->orderBy('id')->get();
        
        $result = $branches->map(function ($branch) {
            $isMainBranch = $branch->isMainBranch();
            
            return [
                'id' => $branch->id,
                'name' => $branch->name,
                'alias' => $branch->alias,
                'is_main_branch' => $isMainBranch,
                'template_slug' => $branch->template_slug,
                'theme_preset_id' => $branch->theme_preset_id,
                'has_template' => !empty($branch->template),
                'parent_relationship' => $this->getRelationshipInfo($branch)
            ];
        });

        return $this->success($result);
    }

    /**
     * Set the main branch for a store
     */
    public function setMainBranch(Request $request, Store $store): JsonResponse
    {
        if ($store->owner_id !== Auth::id()) {
            return $this->forbidden('You do not own this store.');
        }

        $validated = $request->validate([
            'branch_id' => 'required|integer|exists:store_branches,id',
        ]);

        $branchId = (int) $validated['branch_id'];

        // Verify branch belongs to this store
        $branch = StoreBranch::where('id', $branchId)->where('store_id', $store->id)->first();
        if (!$branch) {
            return $this->error('Branch does not belong to this store.', 422);
        }

        $store->update(['main_branch_id' => $branchId]);

        return $this->success($store->fresh(), 200, 'Main branch set successfully.');
    }

    /**
     * Get relationship information for a branch
     */
    protected function getRelationshipInfo(StoreBranch $branch)
    {
        $relationship = [
            'is_linked_to_parent' => false,
            'parent_branch_id' => null,
            'parent_branch_name' => null,
            'sync_status' => null
        ];

        // Check if this branch has a linked template
        $branchTemplate = $branch->branchTemplate;
        if ($branchTemplate) {
            $relationship['is_linked_to_parent'] = $branchTemplate->is_synced;
            $relationship['parent_branch_id'] = $branchTemplate->source_branch_id;
            $relationship['sync_status'] = $branchTemplate->is_synced ? 'synced' : 'independent';
            
            // Get parent branch name if available
            if ($branchTemplate->source_branch_id) {
                $parentBranch = StoreBranch::find($branchTemplate->source_branch_id);
                if ($parentBranch) {
                    $relationship['parent_branch_name'] = $parentBranch->name;
                }
            }
        }

        return $relationship;
    }
}