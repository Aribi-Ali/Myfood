<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Template extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'category',
        'thumbnail',
        'html_content',
        'css_content',
        'has_react_component',
        'component_path',
        'sort_order',
        'is_active',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'sort_order' => 'integer',
            'status' => 'string',
            'has_react_component' => 'boolean',
        ];
    }

    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function scopeAvailable($query)
    {
        return $query->where('status', 'active')->where('is_active', true);
    }

    public function blocks(): HasMany
    {
        return $this->hasMany(TemplateBlock::class)->orderBy('sort_order');
    }

    public function activeBlocks(): HasMany
    {
        return $this->hasMany(TemplateBlock::class)->where('is_active', true)->orderBy('sort_order');
    }

    public function themePresets(): HasMany
    {
        return $this->hasMany(ThemePreset::class);
    }

    public function defaultPreset()
    {
        return $this->hasOne(ThemePreset::class)->where('is_default', true);
    }
}
