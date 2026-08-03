<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Store;
use App\Models\StoreBranch;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BranchController extends Controller
{
    use ApiResponse;

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
            'description'             => 'nullable|string',
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
            'avg_prep_time'           => 'nullable|integer|min:0',
            'delivery_zone_radius'    => 'nullable|numeric|min:0',
            'base_delivery_fee'       => 'nullable|integer|min:0',
            'ordering_enabled'        => 'nullable|boolean',
            'allows_pre_orders'       => 'nullable|boolean',
            'pre_order_lead_time_hours' => 'nullable|integer|min:0',
            'is_paused'               => 'nullable|boolean',
            'pause_note'              => 'nullable|string|max:500',
            'break_start'             => 'nullable|date',
            'break_end'               => 'nullable|date|after:break_start',
            'break_note'              => 'nullable|string|max:500',
            'order_prefix'            => 'nullable|string|max:20',
            'order_suffix'            => 'nullable|string|max:20',
            'order_padding'           => 'nullable|integer|min:0|max:10',
            'order_start_number'      => 'nullable|integer|min:1',
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
            'description'             => 'nullable|string',
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
            'avg_prep_time'           => 'nullable|integer|min:0',
            'delivery_zone_radius'    => 'nullable|numeric|min:0',
            'base_delivery_fee'       => 'nullable|integer|min:0',
            'ordering_enabled'        => 'nullable|boolean',
            'allows_pre_orders'       => 'nullable|boolean',
            'pre_order_lead_time_hours' => 'nullable|integer|min:0',
            'is_paused'               => 'nullable|boolean',
            'pause_note'              => 'nullable|string|max:500',
            'break_start'             => 'nullable|date',
            'break_end'               => 'nullable|date|after:break_start',
            'break_note'              => 'nullable|string|max:500',
            'order_prefix'            => 'nullable|string|max:20',
            'order_suffix'            => 'nullable|string|max:20',
            'order_padding'           => 'nullable|integer|min:0|max:10',
            'order_start_number'      => 'nullable|integer|min:1',
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
}
