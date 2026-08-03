<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeliveryPricingTier extends Model
{
    use HasFactory;

    protected $fillable = [
        'model_type',
        'name',
        'tier_level',
        'min_monthly_orders',
        'max_monthly_orders',
        'commission_percent',
        'flat_fee_per_delivery',
        'monthly_price',
        'max_deliveries',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'commission_percent' => 'float',
        'flat_fee_per_delivery' => 'float',
        'monthly_price' => 'float',
        'is_active' => 'boolean',
        'tier_level' => 'integer',
        'min_monthly_orders' => 'integer',
        'max_monthly_orders' => 'integer',
        'max_deliveries' => 'integer',
        'sort_order' => 'integer',
    ];

    /**
     * Scope: filter tiers by pricing model type.
     */
    public function scopeOfModel(Builder $query, string $type): void
    {
        $query->where('model_type', $type);
    }

    /**
     * Scope: filter tiers that can handle a given order count.
     */
    public function scopeByOrders(Builder $query, int $count): void
    {
        $query->where('min_monthly_orders', '<=', $count);
    }

    /**
     * Scope: return the single applicable tier for a delivery profile
     * based on total monthly orders. Orders are sorted by tier_level descending
     * so the highest matching tier wins.
     */
    public function scopeApplicableForDelivery(Builder $query, int $totalOrders): void
    {
        $query->where('is_active', true)
            ->where('min_monthly_orders', '<=', $totalOrders)
            ->where(function (Builder $q) use ($totalOrders) {
                $q->whereNull('max_monthly_orders')
                  ->orWhere('max_monthly_orders', '>=', $totalOrders);
            })
            ->orderBy('tier_level', 'desc')
            ->limit(1);
    }
}
