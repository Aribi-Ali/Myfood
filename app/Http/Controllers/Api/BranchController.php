<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BranchTemplate;
use App\Models\Store;
use App\Models\StoreBranch;
use App\Models\User;
use App\Services\BranchTemplateService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BranchController extends Controller
{
    use ApiResponse;

    protected BranchTemplateService $branchTemplateService;

    public function __construct(BranchTemplateService $branchTemplateService)
    {
        $this->branchTemplateService = $branchTemplateService;
    }

    /**
     * List all branches for a store.
     * Owner-only: the store must belong to the authenticated user.
     */
    public function index(Store $store): JsonResponse
    {
        if ($store->owner_id !== Auth::id()) {
            return $this->forbidden('You do not own this store.');
        }

        $branches = $store->branches()->with(['assignedUsers'])->orderBy('id')->get();

        return $this->success($branches);
    }

    /**
     * Show a single branch with its relations.
     */
    public function show(StoreBranch $branch): JsonResponse
    {
        $store = $branch->store;

        if ($store->owner_id !== Auth::id()) {
            return $this->forbidden('You do not own this store.');
        }

        $branch->load(['store', 'assignedUsers']);

        return $this->success($branch);
    }

    /**
     * Create a new branch for the given store.
     */
    public function store(Store $store, Request $request): JsonResponse
    {
        if ($store->owner_id !== Auth::id()) {
            return $this->forbidden('You do not own this store.');
        }

        $validated = $request->validate([
            'name'                    => 'required|string|max:255',
            'alias'                   => 'required|string|max:255|unique:store_branches,alias',
            'description'             => 'nullable|string|max:1000',
            'wilaya'                  => 'nullable|string|max:255',
            'daira'                   => 'nullable|string|max:255',
            'commune'                 => 'nullable|string|max:255',
            'address'                 => 'nullable|string|max:500',
            'latitude'                => 'nullable|numeric|between:-90,90',
            'longitude'               => 'nullable|numeric|between:-180,180',
            'email'                   => 'nullable|email|max:255',
            'phone'                   => 'nullable|string|max:20',
            'template_slug'           => 'nullable|string|max:255',
            'theme_preset_id'         => 'nullable|integer|exists:theme_presets,id',
            'opening_hours'           => 'nullable|array',
            'avg_prep_time'           => 'nullable|integer|min:0|max:1440',
            'delivery_zone_radius'    => 'nullable|numeric|min:0|max:100',
            'base_delivery_fee'       => 'nullable|integer|min:0|max:5000',
            'ordering_enabled'        => 'nullable|boolean',
            'allows_pre_orders'       => 'nullable|boolean',
            'pre_order_lead_time_hours' => 'nullable|integer|min:0|max:72',
            'is_paused'               => 'nullable|boolean',
            'pause_note'              => 'nullable|string|max:500',
            'break_start'             => 'nullable|date',
            'break_end'               => 'nullable|date|after:break_start',
            'break_note'              => 'nullable|string|max:500',
            'order_prefix'            => 'nullable|string|max:20',
            'order_suffix'            => 'nullable|string|max:20',
            'order_padding'           => 'nullable|integer|min:0|max:10',
            'order_start_number'      => 'nullable|integer|min:1|max:999999',
        ]);

        $validated['store_id'] = $store->id;

        $branch = StoreBranch::create($validated);

        return $this->success($branch->load('assignedUsers'), 201, 'Branch created successfully.');
    }

    /**
     * Update a branch's fields.
     */
    public function update(Request $request, StoreBranch $branch): JsonResponse
    {
        $store = $branch->store;

        if ($store->owner_id !== Auth::id()) {
            return $this->forbidden('You do not own this store.');
        }

        $validated = $request->validate([
            'name'                    => 'sometimes|required|string|max:255',
            'alias'                   => 'sometimes|required|string|max:255|unique:store_branches,alias,' . $branch->id,
            'description'             => 'nullable|string|max:1000',
            'wilaya'                  => 'nullable|string|max:255',
            'daira'                   => 'nullable|string|max:255',
            'commune'                 => 'nullable|string|max:255',
            'address'                 => 'nullable|string|max:500',
            'latitude'                => 'nullable|numeric|between:-90,90',
            'longitude'               => 'nullable|numeric|between:-180,180',
            'email'                   => 'nullable|email|max:255',
            'phone'                   => 'nullable|string|max:20',
            'template_slug'           => 'nullable|string|max:255',
            'theme_preset_id'         => 'nullable|integer|exists:theme_presets,id',
            'opening_hours'           => 'nullable|array',
            'avg_prep_time'           => 'nullable|integer|min:0|max:1440',
            'delivery_zone_radius'    => 'nullable|numeric|min:0|max:100',
            'base_delivery_fee'       => 'nullable|integer|min:0|max:5000',
            'ordering_enabled'        => 'nullable|boolean',
            'allows_pre_orders'       => 'nullable|boolean',
            'pre_order_lead_time_hours' => 'nullable|integer|min:0|max:72',
            'is_paused'               => 'nullable|boolean',
            'pause_note'              => 'nullable|string|max:500',
            'break_start'             => 'nullable|date',
            'break_end'               => 'nullable|date|after:break_start',
            'break_note'              => 'nullable|string|max:500',
            'order_prefix'            => 'nullable|string|max:20',
            'order_suffix'            => 'nullable|string|max:20',
            'order_padding'           => 'nullable|integer|min:0|max:10',
            'order_start_number'      => 'nullable|integer|min:1|max:999999',
        ]);

        $branch->update($validated);

        return $this->success($branch->load('assignedUsers'), 200, 'Branch updated successfully.');
    }

    /**
     * Delete a branch. Cannot delete the only remaining branch.
     */
    public function destroy(StoreBranch $branch): JsonResponse
    {
        $store = $branch->store;

        if ($store->owner_id !== Auth::id()) {
            return $this->forbidden('You do not own this store.');
        }

        if ($store->branches()->count() <= 1) {
            return $this->error('Cannot delete the only branch of this store.', 422);
        }

        $branch->delete();

        return $this->success(null, 200, 'Branch deleted successfully.');
    }

    /**
     * Update only template_slug and/or theme_preset_id for a branch.
     */
    public function updateTemplate(Request $request, StoreBranch $branch): JsonResponse
    {
        $store = $branch->store;

        if ($store->owner_id !== Auth::id()) {
            return $this->forbidden('You do not own this store.');
        }

        $validated = $request->validate([
            'template_slug'   => 'nullable|string|max:255',
            'theme_preset_id' => 'nullable|integer|exists:theme_presets,id',
        ]);

        $branch->update($validated);

        return $this->success($branch, 200, 'Branch template updated successfully.');
    }

    /**
     * Assign a user to a branch with a role and optional permissions.
     */
    public function assignUser(Request $request, StoreBranch $branch): JsonResponse
    {
        $store = $branch->store;

        if ($store->owner_id !== Auth::id()) {
            return $this->forbidden('You do not own this store.');
        }

        $validated = $request->validate([
            'user_id'     => 'required|integer|exists:users,id',
            'role'        => 'required|string|max:50',
            'permissions' => 'nullable|array',
        ]);

        $userId = (int) $validated['user_id'];

        if ($branch->assignedUsers()->where('user_id', $userId)->exists()) {
            return $this->error('User is already assigned to this branch.', 422);
        }

        $branch->assignedUsers()->attach($userId, [
            'role'        => $validated['role'],
            'permissions' => json_encode($validated['permissions'] ?? []),
        ]);

        $branch->load('assignedUsers');

        return $this->success($branch, 201, 'User assigned to branch successfully.');
    }

    /**
     * Remove a user from a branch.
     */
    public function removeUser(StoreBranch $branch, User $user): JsonResponse
    {
        $store = $branch->store;

        if ($store->owner_id !== Auth::id()) {
            return $this->forbidden('You do not own this store.');
        }

        if (!$branch->assignedUsers()->where('user_id', $user->id)->exists()) {
            return $this->error('User is not assigned to this branch.', 404);
        }

        $branch->assignedUsers()->detach($user->id);

        return $this->success(null, 200, 'User removed from branch successfully.');
    }

    /**
     * Copy template settings (template_slug + theme_preset_id) from another branch of the same store.
     */
    public function duplicateTemplate(Request $request, StoreBranch $branch): JsonResponse
    {
        $store = $branch->store;

        if ($store->owner_id !== Auth::id()) {
            return $this->forbidden('You do not own this store.');
        }

        $validated = $request->validate([
            'source_branch_id' => 'required|integer|exists:store_branches,id',
        ]);

        $sourceBranchId = (int) $validated['source_branch_id'];

        if ($sourceBranchId === $branch->id) {
            return $this->error('Cannot duplicate template from the same branch.', 422);
        }

        $sourceBranch = StoreBranch::where('id', $sourceBranchId)
            ->where('store_id', $store->id)
            ->first();

        if (!$sourceBranch) {
            return $this->error('Source branch does not belong to the same store.', 422);
        }

        $branch->update([
            'template_slug'   => $sourceBranch->template_slug,
            'theme_preset_id' => $sourceBranch->theme_preset_id,
        ]);

        return $this->success($branch->fresh(), 200, 'Template settings duplicated successfully.');
    }
    
    /**
     * Link a branch to its parent store's main branch template
     */
    public function inheritFromParent(StoreBranch $branch): JsonResponse
    {
        $store = $branch->store;

        if ($store->owner_id !== Auth::id()) {
            return $this->forbidden('You do not own this store.');
        }

        try {
            $branchTemplate = $this->branchTemplateService->inheritFromParent($branch);
            return $this->success($branchTemplate, 200, 'Branch linked to parent template successfully.');
        } catch (\Exception $e) {
            return $this->error('Failed to link branch to parent: ' . $e->getMessage(), 500);
        }
    }
    
/**
 * Link a branch to another branch's template (can be from same or different store)
 */
    public function linkToBranch(Request $request, StoreBranch $branch): JsonResponse
    {
        $store = $branch->store;

        if ($store->owner_id !== Auth::id()) {
            return $this->forbidden('You do not own this store.');
        }

        $validated = $request->validate([
            'source_branch_id' => 'required|integer|exists:store_branches,id',
        ]);

        try {
            $sourceBranch = StoreBranch::findOrFail($validated['source_branch_id']);
            
            // Verify source branch belongs to the same store
            if ($sourceBranch->store_id !== $store->id) {
                return $this->error('Source branch must belong to the same store.', 422);
            }
            
            // Check that source branch has a template configured
            $sourceBranchTemplate = $sourceBranch->branchTemplate;
            if (!$sourceBranchTemplate) {
                return $this->error('Source branch does not have a template configured.', 422);
            }
            
            $branchTemplate = $this->branchTemplateService->linkToParent($branch, $sourceBranch);
            return $this->success($branchTemplate, 200, 'Branch linked to source branch template successfully.');
        } catch (\RuntimeException $e) {
            // Handle specific runtime exceptions from the service
            return $this->error('Failed to link branch: ' . $e->getMessage(), 422);
        } catch (\Exception $e) {
            // Handle any other unexpected errors
            return $this->error('Failed to link branch to source template.', 500);
        }
    }

    /**
     * Get customization status for a branch template
     */
    public function getCustomizationStatus(StoreBranch $branch): JsonResponse
    {
        $store = $branch->store;

        if ($store->owner_id !== Auth::id()) {
            return $this->forbidden('You do not own this store.');
        }

        $branchTemplate = $branch->branchTemplate;
        if (!$branchTemplate) {
            return $this->success([
                'is_synced' => false,
                'has_customizations' => false,
                'source_template_id' => null,
                'template_id' => null
            ]);
        }

        try {
            $status = $this->branchTemplateService->getCustomizationStatus($branchTemplate);
            return $this->success($status);
        } catch (\Exception $e) {
            return $this->error('Failed to get customization status: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Reset branch template to match its source template
     */
    public function resetToSource(StoreBranch $branch): JsonResponse
    {
        $store = $branch->store;

        if ($store->owner_id !== Auth::id()) {
            return $this->forbidden('You do not own this store.');
        }

        $branchTemplate = $branch->branchTemplate;
        if (!$branchTemplate) {
            return $this->error('Branch does not have a template configured.', 404);
        }

        try {
            $resetTemplate = $this->branchTemplateService->resetToSource($branchTemplate);
            return $this->success($resetTemplate, 200, 'Branch template reset to source successfully.');
        } catch (\RuntimeException $e) {
            return $this->error('Failed to reset branch template: ' . $e->getMessage(), 422);
        } catch (\Exception $e) {
            return $this->error('Failed to reset branch template: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Update branch template blocks
     */
    public function updateTemplateBlocks(Request $request, StoreBranch $branch): JsonResponse
    {
        $store = $branch->store;

        if ($store->owner_id !== Auth::id()) {
            return $this->forbidden('You do not own this store.');
        }

        $validated = $request->validate([
            'blocks' => 'required|array',
        ]);

        $branchTemplate = $branch->branchTemplate;
        if (!$branchTemplate) {
            return $this->error('Branch does not have a template configured.', 404);
        }

        try {
            $updatedTemplate = $this->branchTemplateService->updateTemplateBlocks($branchTemplate, $validated['blocks']);
            return $this->success($updatedTemplate->load('template.blocks'), 200, 'Branch template blocks updated successfully.');
        } catch (\Exception $e) {
            return $this->error('Failed to update branch template blocks: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Update branch theme variables
     */
    public function updateThemeVariables(Request $request, StoreBranch $branch): JsonResponse
    {
        $store = $branch->store;

        if ($store->owner_id !== Auth::id()) {
            return $this->forbidden('You do not own this store.');
        }

        $validated = $request->validate([
            'variables' => 'required|array',
        ]);

        $branchTemplate = $branch->branchTemplate;
        if (!$branchTemplate) {
            return $this->error('Branch does not have a template configured.', 404);
        }

        try {
            $updatedTemplate = $this->branchTemplateService->setThemeVariables($branchTemplate, $validated['variables']);
            return $this->success($updatedTemplate->load('template'), 200, 'Branch theme variables updated successfully.');
        } catch (\Exception $e) {
            return $this->error('Failed to update branch theme variables: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Update branch template content (HTML/CSS)
     */
    public function updateTemplateContent(Request $request, StoreBranch $branch): JsonResponse
    {
        $store = $branch->store;

        if ($store->owner_id !== Auth::id()) {
            return $this->forbidden('You do not own this store.');
        }

        $validated = $request->validate([
            'html_content' => 'nullable|string',
            'css_content' => 'nullable|string',
        ]);

        $branchTemplate = $branch->branchTemplate;
        if (!$branchTemplate) {
            return $this->error('Branch does not have a template configured.', 404);
        }

        try {
            $updatedTemplate = $this->branchTemplateService->updateTemplateContent($branchTemplate, $validated);
            return $this->success($updatedTemplate->load('template'), 200, 'Branch template content updated successfully.');
        } catch (\Exception $e) {
            return $this->error('Failed to update branch template content: ' . $e->getMessage(), 500);
        }
    }
}
