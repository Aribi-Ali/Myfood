<?php

namespace App\Jobs;

use App\Models\BranchTemplate;
use App\Models\Template;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

/**
 * Propagate changes from a source template to all branch templates that are linked
 * (i.e., have `is_synced` true and reference this source template).
 */
class PropagateBranchTemplateChanges implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected int $sourceTemplateId;

    /**
     * Create a new job instance.
     */
    public function __construct(int $sourceTemplateId)
    {
        $this->sourceTemplateId = $sourceTemplateId;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $source = Template::find($this->sourceTemplateId);
        if (!$source) {
            Log::warning("PropagateBranchTemplateChanges: source template not found: {$this->sourceTemplateId}");
            return;
        }

        // Find all branch templates that are synced to this source
        $branches = BranchTemplate::where('source_template_id', $this->sourceTemplateId)
            ->where('is_synced', true)
            ->get();

        foreach ($branches as $branchTemplate) {
            // Delete existing blocks of the branch's current template
            $currentTemplate = $branchTemplate->template;
            if ($currentTemplate) {
                $currentTemplate->blocks()->delete();
            }

            // Replicate each block from source to a new template for this branch
            $newTemplate = $source->replicate();
            $newTemplate->slug = $source->slug . '-' . uniqid();
            $newTemplate->save();

            foreach ($source->blocks as $block) {
                $newBlock = $block->replicate();
                $newBlock->template_id = $newTemplate->id;
                $newBlock->save();
            }

            // Update branch template to point to the newly created copy
            $branchTemplate->template_id = $newTemplate->id;
            $branchTemplate->save();
        }
    }
}
