<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeliverySubscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'delivery_profile_id',
        'tier_id',
        'duration_offer_id',
        'start_date',
        'end_date',
        'status',
        'auto_renew',
        'monthly_price_snapshot',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'auto_renew' => 'boolean',
        'monthly_price_snapshot' => 'float',
    ];

    public function profile(): BelongsTo
    {
        return $this->belongsTo(DeliveryProfile::class, 'delivery_profile_id');
    }

    public function tier(): BelongsTo
    {
        return $this->belongsTo(DeliveryPricingTier::class, 'tier_id');
    }

    public function durationOffer(): BelongsTo
    {
        return $this->belongsTo(PlanDurationOffer::class, 'duration_offer_id');
    }
}
