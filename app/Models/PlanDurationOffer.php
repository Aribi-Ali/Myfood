<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PlanDurationOffer extends Model
{
    use HasFactory;

    protected $fillable = [
        'plan_tier_id',
        'months',
        'discount_percent',
        'discount_label',
        'is_popular',
        'is_active',
    ];

    protected $casts = [
        'months' => 'integer',
        'discount_percent' => 'float',
        'is_popular' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function planTier(): BelongsTo
    {
        return $this->belongsTo(PlanTier::class);
    }
}
