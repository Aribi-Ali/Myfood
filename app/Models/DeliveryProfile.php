<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeliveryProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'phone',
        'image',
        'transporter_type',
        'is_working',
        'day_price',
        'night_price',
        // Subscription fields
        'pricing_model',
        'current_tier_id',
        'current_month_orders',
        'total_earnings',
        'total_platform_fees',
    ];

    protected $casts = [
        'is_working' => 'boolean',
        'day_price' => 'decimal:2',
        'night_price' => 'decimal:2',
        'current_month_orders' => 'integer',
        'total_earnings' => 'float',
        'total_platform_fees' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function deliveryAreas(): HasMany
    {
        return $this->hasMany(DeliveryProfileArea::class);
    }

    public function currentTier(): BelongsTo
    {
        return $this->belongsTo(DeliveryPricingTier::class, 'current_tier_id');
    }

    public function activeSubscription(): HasOne
    {
        return $this->hasOne(DeliverySubscription::class, 'delivery_profile_id')
            ->where('status', 'active');
    }

    /**
     * Accessor: return the applicable delivery pricing tier based on current_month_orders.
     */
    public function getApplicableTierAttribute()
    {
        return DeliveryPricingTier::query()
            ->where('is_active', true)
            ->where('min_monthly_orders', '<=', $this->current_month_orders)
            ->where(function ($q) {
                $q->whereNull('max_monthly_orders')
                  ->orWhere('max_monthly_orders', '>=', $this->current_month_orders);
            })
            ->orderBy('tier_level', 'desc')
            ->first();
    }
}
