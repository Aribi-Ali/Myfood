<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PlanTier extends Model
{
    use HasFactory;

    protected $fillable = [
        'plan_id',
        'name',
        'min_orders',
        'max_orders',
        'monthly_price',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'monthly_price' => 'float',
        'min_orders' => 'integer',
        'max_orders' => 'integer',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    public function durationOffers(): HasMany
    {
        return $this->hasMany(PlanDurationOffer::class)->orderBy('months');
    }

    public function activeDurationOffers(): HasMany
    {
        return $this->hasMany(PlanDurationOffer::class)
            ->where('is_active', true)
            ->orderBy('months');
    }
}
