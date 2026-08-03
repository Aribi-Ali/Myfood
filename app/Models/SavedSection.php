<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SavedSection extends Model
{
    protected $fillable = [
        'store_id',
        'name',
        'html',
        'css',
        'thumbnail',
        'sort_order',
    ];

    protected $casts = [
        'sort_order' => 'integer',
    ];

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }
}
