<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StoreSubscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'store_id',
        'plan_tier_id',
        'plan_duration_offer_id',
        'status',
        'trial_ends_at',
        'start_date',
        'end_date',
        'cancelled_at',
        'monthly_price_snapshot',
        'current_period_orders',
        'auto_upgrade',
        'last_tier_check_at',
    ];

    protected $casts = [
        'monthly_price_snapshot' => 'float',
        'current_period_orders' => 'integer',
        'auto_upgrade' => 'boolean',
        'trial_ends_at' => 'datetime',
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'cancelled_at' => 'datetime',
        'last_tier_check_at' => 'datetime',
    ];

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    public function planTier(): BelongsTo
    {
        return $this->belongsTo(PlanTier::class);
    }

    public function durationOffer(): BelongsTo
    {
        return $this->belongsTo(PlanDurationOffer::class, 'plan_duration_offer_id');
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(BillingInvoice::class, 'store_subscription_id');
    }

    /**
     * Scope: active subscriptions (trialing or active status).
     */
    public function scopeActive(Builder $query): void
    {
        $query->whereIn('status', ['trialing', 'active']);
    }

    /**
     * Scope: currently trialing subscriptions.
     */
    public function scopeTrialing(Builder $query): void
    {
        $query->where('status', 'trialing');
    }
}
