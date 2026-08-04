<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Represents a branch‑specific UI template.
 *
 * A branch can either have its own independent copy of a template
 * (is_synced = false) or be synced to a source template (is_synced = true).
 * When synced, changes to the source template are propagated via a job.
 */
class BranchTemplate extends Model
{
    protected $table = 'branch_templates';

    protected $fillable = [
        'branch_id',
        'template_id',
        'is_synced',
        'source_branch_id',
        'source_template_id',
    ];

    protected $casts = [
        'is_synced' => 'boolean',
    ];

    public function branch(): BelongsTo
    {
        return $this->belongsTo(StoreBranch::class, 'branch_id');
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(Template::class, 'template_id');
    }

    // Optional source relationships for synced templates
    public function sourceBranch(): BelongsTo
    {
        return $this->belongsTo(StoreBranch::class, 'source_branch_id');
    }

    public function sourceTemplate(): BelongsTo
    {
        return $this->belongsTo(Template::class, 'source_template_id');
    }
    
    /**
     * Get the parent store for this branch template
     */
    public function getParentStore()
    {
        if ($this->branch) {
            return $this->branch->store;
        }
        return null;
    }
}
