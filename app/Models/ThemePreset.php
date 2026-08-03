<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ThemePreset extends Model
{
    protected $fillable = [
        'template_id',
        'name',
        'description',
        'css_vars',
        'colors',
        'is_default',
    ];

    protected function casts(): array
    {
        return [
            'css_vars' => 'array',
            'colors' => 'array',
            'is_default' => 'boolean',
        ];
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(Template::class);
    }
}
