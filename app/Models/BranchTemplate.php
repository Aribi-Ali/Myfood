<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Represents a branch‑specific UI template.
 *
 * A branch can either have its own independent copy of a template
 * (is_linked = false) or be linked to a source template (is_linked = true).
 * When linked, changes to the source template can be propagated via a job.
 * The `version` column tracks history for the duplicated template.
 */
class BranchTemplate extends Model
{
    protected $table = 'branch_templates';

    protected $fillable = [
        'branch_id',
        'template_id',
        'is_linked',   // boolean, true if linked to a source template
        'version',     // integer for versioning / history
        // optional linking fields – kept for flexibility
        'source_branch_id',
        'source_template_id',
    ];

    protected $casts = [
        'is_linked' => 'boolean',
        'version'   => 'integer',
    ];

    public function branch(): BelongsTo
    {
        return $this->belongsTo(StoreBranch::class, 'branch_id');
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(Template::class, 'template_id');
    }

    // Optional source relationships for linked templates
    public function sourceBranch(): BelongsTo
    {
        return $this->belongsTo(StoreBranch::class, 'source_branch_id');
    }

    public function sourceTemplate(): BelongsTo
    {
        return $this->belongsTo(Template::class, 'source_template_id');
    }
}
