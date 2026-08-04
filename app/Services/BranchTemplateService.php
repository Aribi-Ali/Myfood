<?php

namespace App\Services;

use App\Models\BranchTemplate;
use App\Models\StoreBranch;
use App\Models\Template;
use App\Models\TemplateBlock;
use App\Jobs\PropagateBranchTemplateChanges;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use RuntimeException;

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
                    $newTemplate = $this->duplicateTemplate($source);
                    $branchTemplate->template_id = $newTemplate->id;
                }
            } elseif (!empty($data['template_data'])) {
                // Create a fresh template from supplied data
                $newTemplate = $this->createTemplateFromData($data['template_data']);
                $branchTemplate->template_id = $newTemplate->id;
            }

            $branchTemplate->save();
            return $branchTemplate;
        });
    }

    /**
     * Set custom theme variables for a branch template.
     * 
     * @param BranchTemplate $branchTemplate
     * @param array $variables
     * @return BranchTemplate
     */
    public function linkToParent(StoreBranch $branch, StoreBranch $parentBranch): BranchTemplate
    {
        return DB::transaction(function () use ($branch, $parentBranch) {
            // Get the parent's template
            $parentBranchTemplate = BranchTemplate::where('branch_id', $parentBranch->id)->first();
            
            if (!$parentBranchTemplate) {
                throw new \RuntimeException('Parent branch does not have a template configured');
            }
            
            // Create or update branch template to sync with parent
            $branchTemplate = BranchTemplate::updateOrCreate(
                ['branch_id' => $branch->id],
                [
                    'template_id' => $parentBranchTemplate->template_id,
                    'is_synced' => true,
                    'source_template_id' => $parentBranchTemplate->source_template_id ?? $parentBranchTemplate->template_id,
                    'source_branch_id' => $parentBranch->id,
                ]
            );
            
            return $branchTemplate;
        });
    }
    
    /**
     * Create a branch that inherits from the parent store's main branch
     * 
     * @param StoreBranch $branch The new branch to create
     * @return BranchTemplate
     */
    public function inheritFromParent(StoreBranch $branch): BranchTemplate
    {
        return DB::transaction(function () use ($branch) {
            // Get the parent store's main branch
            $parentStore = $branch->store;
            $mainBranch = $parentStore->mainBranch;
            
            if (!$mainBranch) {
                throw new \RuntimeException('Parent store does not have a main branch configured');
            }
            
            return $this->linkToParent($branch, $mainBranch);
        });
    }

    /**
     * Clone another branch's template (same or different store) into this branch
     * as an independent copy.
     */
    public function cloneToBranch(StoreBranch $branch, BranchTemplate $source): BranchTemplate
    {
        return DB::transaction(function () use ($branch, $source) {
            $newTemplate = $this->duplicateTemplate($source->template);

            $branchTemplate = new BranchTemplate();
            $branchTemplate->branch_id = $branch->id;
            $branchTemplate->template_id = $newTemplate->id;
            $branchTemplate->is_synced = false;
            $branchTemplate->source_template_id = $source->template_id;
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
            $newTemplate = $this->duplicateTemplate($source);
            $branchTemplate->template_id = $newTemplate->id;
            $branchTemplate->save();
        }

        if ($sync) {
            // dispatch job to keep it in sync on future changes
            PropagateBranchTemplateChanges::dispatch($branchTemplate->source_template_id);
        }
    }

    /**
     * Export a branch's template as a portable JSON array (backup / duplication).
     */
    public function exportTemplate(StoreBranch $branch): array
    {
        $branchTemplate = BranchTemplate::where('branch_id', $branch->id)->first();
        $template = $branchTemplate?->template;

        return [
            'format' => 'yallahkool-branch-template',
            'is_synced' => (bool) $branchTemplate?->is_synced,
            'template' => $template ? [
                'name' => $template->name,
                'slug' => $template->slug,
                'description' => $template->description,
                'category' => $template->category,
                'html_content' => $template->html_content,
                'css_content' => $template->css_content,
                'theme_variables' => $template->theme_variables,
                'default_blocks' => $template->default_blocks,
                'blocks' => $template->blocks->map(fn ($b) => [
                    'type' => $b->type,
                    'label' => $b->label,
                    'description' => $b->description,
                    'category' => $b->category,
                    'config_schema' => $b->config_schema,
                    'default_config' => $b->default_config,
                    'is_required' => $b->is_required,
                    'is_active' => $b->is_active,
                    'sort_order' => $b->sort_order,
                ])->values()->toArray(),
            ] : null,
            'exported_at' => now()->toIso8601String(),
        ];
    }

    /**
     * Import a previously exported template into a branch.
     */
    public function importTemplate(StoreBranch $branch, array $payload): BranchTemplate
    {
        return DB::transaction(function () use ($branch, $payload) {
            $templateData = $payload['template'] ?? null;
            if (!$templateData) {
                throw new RuntimeException('Invalid template export: missing template data.');
            }

            $newTemplate = $this->createTemplateFromData($templateData, true);

            $branchTemplate = BranchTemplate::updateOrCreate(
                ['branch_id' => $branch->id],
                [
                    'template_id' => $newTemplate->id,
                    'is_synced' => (bool) ($payload['is_synced'] ?? false),
                    'source_template_id' => $newTemplate->id,
                ]
            );

            return $branchTemplate;
        });
    }

    /**
     * Duplicate a template with all its blocks and content.
     */
    protected function duplicateTemplate(Template $source): Template
    {
        $newTemplate = $source->replicate();
        $newTemplate->slug = $this->uniqueSlug($source->slug);
        $newTemplate->save();

        foreach ($source->blocks as $block) {
            $newBlock = $block->replicate();
            $newBlock->template_id = $newTemplate->id;
            $newBlock->save();
        }

        return $newTemplate;
    }

    /**
     * Create a template from a data array (optionally with blocks).
     */
    protected function createTemplateFromData(array $data, bool $keepSlug = false): Template
    {
        $fillable = $data;
        $blocks = $data['blocks'] ?? [];
        unset($fillable['blocks']);

        if (!$keepSlug || empty($fillable['slug'])) {
            $fillable['slug'] = $this->uniqueSlug($fillable['slug'] ?? 'template-' . Str::random(6));
        }

        $newTemplate = Template::create($fillable);

        foreach ($blocks as $blockData) {
            TemplateBlock::create(array_merge($blockData, ['template_id' => $newTemplate->id]));
        }

        return $newTemplate;
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

    /**
     * Update template blocks for a branch template.
     * 
     * @param BranchTemplate $branchTemplate
     * @param array $blocksData
     * @return BranchTemplate
     */
    public function updateTemplateBlocks(BranchTemplate $branchTemplate, array $blocksData): BranchTemplate
    {
        return DB::transaction(function () use ($branchTemplate, $blocksData) {
            // If template is synced, we need to create an independent copy first
            if ($branchTemplate->is_synced) {
                $this->toggleSync($branchTemplate, false);
            }
            
            // Clear existing blocks
            TemplateBlock::where('template_id', $branchTemplate->template_id)->delete();
            
            // Create new blocks
            foreach ($blocksData as $blockData) {
                TemplateBlock::create([
                    'template_id' => $branchTemplate->template_id,
                    'type' => $blockData['type'],
                    'label' => $blockData['label'] ?? '',
                    'description' => $blockData['description'] ?? '',
                    'category' => $blockData['category'] ?? 'default',
                    'config_schema' => $blockData['config_schema'] ?? [],
                    'default_config' => $blockData['config'] ?? [],
                    'is_required' => $blockData['required'] ?? false,
                    'is_active' => $blockData['active'] ?? true,
                    'sort_order' => $blockData['sort_order'] ?? 0,
                ]);
            }
            
            return $branchTemplate;
        });
    }

    /**
     * Set custom theme variables for a branch template.
     * 
     * @param BranchTemplate $branchTemplate
     * @param array $variables
     * @return BranchTemplate
     */
    public function setThemeVariables(BranchTemplate $branchTemplate, array $variables): BranchTemplate
    {
        return DB::transaction(function () use ($branchTemplate, $variables) {
            // If template is synced, we need to create an independent copy first
            if ($branchTemplate->is_synced) {
                $this->toggleSync($branchTemplate, false);
            }
            
            $template = $branchTemplate->template;
            $template->theme_variables = $variables;
            $template->save();
            
            return $branchTemplate;
        });
    }

    /**
     * Update template content (HTML/CSS) for a branch template.
     * 
     * @param BranchTemplate $branchTemplate
     * @param array $contentData
     * @return BranchTemplate
     */
    public function updateTemplateContent(BranchTemplate $branchTemplate, array $contentData): BranchTemplate
    {
        return DB::transaction(function () use ($branchTemplate, $contentData) {
            // If template is synced, we need to create an independent copy first
            if ($branchTemplate->is_synced) {
                $this->toggleSync($branchTemplate, false);
            }
            
            $template = $branchTemplate->template;
            $template->fill($contentData);
            $template->save();
            
            return $branchTemplate;
        });
    }

    /**
     * Get the customization status of a branch template.
     * 
     * @param BranchTemplate $branchTemplate
     * @return array
     */
    public function getCustomizationStatus(BranchTemplate $branchTemplate): array
    {
        return [
            'is_synced' => (bool) $branchTemplate->is_synced,
            'source_template_id' => $branchTemplate->source_template_id,
            'template_id' => $branchTemplate->template_id,
            'has_customizations' => !$branchTemplate->is_synced,
        ];
    }

    /**
     * Reset a branch template to match its source template.
     * 
     * @param BranchTemplate $branchTemplate
     * @return BranchTemplate
     */
    public function resetToSource(BranchTemplate $branchTemplate): BranchTemplate
    {
        return DB::transaction(function () use ($branchTemplate) {
            if (!$branchTemplate->is_synced || !$branchTemplate->source_template_id) {
                throw new \RuntimeException('Cannot reset: template is not synced or has no source');
            }
            
            // Get the source template
            $sourceTemplate = Template::findOrFail($branchTemplate->source_template_id);
            
            // Update the branch template to match the source
            $template = $branchTemplate->template;
            $template->fill([
                'name' => $sourceTemplate->name,
                'slug' => $sourceTemplate->slug,
                'description' => $sourceTemplate->description,
                'category' => $sourceTemplate->category,
                'html_content' => $sourceTemplate->html_content,
                'css_content' => $sourceTemplate->css_content,
                'theme_variables' => $sourceTemplate->theme_variables,
                'default_blocks' => $sourceTemplate->default_blocks,
            ]);
            $template->save();
            
            // Update blocks to match source
            TemplateBlock::where('template_id', $branchTemplate->template_id)->delete();
            
            foreach ($sourceTemplate->blocks as $block) {
                $newBlock = $block->replicate();
                $newBlock->template_id = $branchTemplate->template_id;
                $newBlock->save();
            }
            
            return $branchTemplate;
        });
    }
}