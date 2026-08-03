<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Plan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function tiers(): HasMany
    {
        return $this->hasMany(PlanTier::class)->orderBy('sort_order');
    }

    public function activeTiers(): HasMany
    {
        return $this->hasMany(PlanTier::class)->where('is_active', true)->orderBy('sort_order');
    }

    public function features(): BelongsToMany
    {
        return $this->belongsToMany(
            PlanFeature::class,
            'plan_feature_assignments',
            'plan_id',
            'plan_feature_id'
        );
    }
}
