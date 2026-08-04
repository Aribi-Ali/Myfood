<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Snapshot of a page (store or branch) at a point in time.
 * Used for the page builder's version history / rollback.
 */
class PageVersion extends Model
{
    public const UPDATED_AT = null;

    protected $fillable = [
        'entity_type',
        'entity_id',
        'slug',
        'version',
        'html',
        'css',
        'js',
        'grapes_data',
        'meta',
        'created_by',
    ];

    protected $casts = [
        'grapes_data' => 'array',
        'meta' => 'array',
        'created_at' => 'datetime',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
