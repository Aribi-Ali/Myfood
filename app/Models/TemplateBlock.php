<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TemplateBlock extends Model
{
    protected $fillable = [
        'template_id',
        'type',
        'label',
        'description',
        'category',
        'sort_order',
        'config_schema',
        'default_config',
        'is_required',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'config_schema' => 'array',
            'default_config' => 'array',
            'is_required' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(Template::class);
    }
}
