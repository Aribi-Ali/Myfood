<?php

namespace App\Services;

use App\Models\BranchTemplate;
use App\Models\StoreBranch;
use App\Models\Template;
use App\Jobs\PropagateBranchTemplateChanges;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class BranchTemplateService
{
    /**
     * Create a branch template either by cloning an existing template or by using provided data.
     *
     * @param StoreBranch $branch
     * @param array $data ['source_template_id' => ?int, 'template_data' => ?array, 'is_synced' => bool]
     * @return BranchTemplate
     */
    public function createOrClone(StoreBranch $branch, array $data): BranchTemplate
    {
        return DB::transaction(function () use ($branch, $data) {
            $branchTemplate = new BranchTemplate();
            $branchTemplate->branch_id = $branch->id;
            $branchTemplate->is_synced = $data['is_synced'] ?? false;

            // If cloning from an existing template
            if (!empty($data['source_template_id'])) {
                $source = Template::findOrFail($data['source_template_id']);
                $branchTemplate->template_id = $source->id;
                $branchTemplate->source_template_id = $source->id;
                $branchTemplate->source_branch_id = $source->branch_id ?? null; // optional relationship
                if (!$branchTemplate->is_synced) {
                    // Duplicate content for independent copy
                    $newTemplate = $source->replicate();
                    // Ensure slug uniqueness
                    $newTemplate->slug = $this->uniqueSlug($source->slug);
                    $newTemplate->save();
                    // Duplicate blocks
                    foreach ($source->blocks as $block) {
                        $newBlock = $block->replicate();
                        $newBlock->template_id = $newTemplate->id;
                        $newBlock->save();
                    }
                    $branchTemplate->template_id = $newTemplate->id;
                }
            } elseif (!empty($data['template_data'])) {
                // Create a fresh template from supplied data
                $newTemplate = Template::create($data['template_data']);
                $branchTemplate->template_id = $newTemplate->id;
            }

            $branchTemplate->save();
            return $branchTemplate;
        });
    }

    /**
     * Toggle sync status. When turning sync off, we clone current source content.
     */
    public function toggleSync(BranchTemplate $branchTemplate, bool $sync): void
    {
        if ($branchTemplate->is_synced === $sync) {
            return; // no change
        }
        $branchTemplate->is_synced = $sync;
        $branchTemplate->save();

        if (!$sync && $branchTemplate->source_template_id) {
            // Clone source template into an independent copy
            $source = Template::findOrFail($branchTemplate->source_template_id);
            $newTemplate = $source->replicate();
            $newTemplate->slug = $this->uniqueSlug($source->slug);
            $newTemplate->save();
            foreach ($source->blocks as $block) {
                $newBlock = $block->replicate();
                $newBlock->template_id = $newTemplate->id;
                $newBlock->save();
            }
            $branchTemplate->template_id = $newTemplate->id;
            $branchTemplate->save();
        }

        if ($sync) {
            // dispatch job to keep it in sync on future changes
            PropagateBranchTemplateChanges::dispatch($branchTemplate->source_template_id);
        }
    }

    /**
     * Helper to generate a unique slug when duplicating.
     */
    protected function uniqueSlug(string $baseSlug): string
    {
        $slug = $baseSlug . '-' . Str::random(6);
        while (Template::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . Str::random(6);
        }
        return $slug;
    }
}
?>
