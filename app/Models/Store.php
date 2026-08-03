<?php

namespace App\Models;

use App\Models\Zone;
use App\Models\StoreImage;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    use HasFactory;

    protected $fillable = [
        'owner_id',
        'name',
        'alias',
        'description',
        'opening_hours',
        'cover_image',
        'document_path',
        'is_approved',
        'onboarding_status',
        'cover_image_id',
        'main_image_id',
        'avg_prep_time',
        'delivery_zone_radius',
        'base_delivery_fee',
        'avg_delivery_time_per_km',
        // Onboarding fields
        'address',
        'latitude',
        'longitude',
        'email',
        'phone',
        'is_active',
        'break_start',
        'break_end',
        'break_note',
        'wilaya',
        'daira',
        'commune',
        'logo_path',
        'template_slug',
        'theme_preset_id',
        'ordering_enabled',
        'allows_pre_orders',
        'pre_order_lead_time_hours',
        'is_paused',
        'pause_note',
        'order_prefix',
        'order_suffix',
        'order_padding',
        'order_start_number',
    ];

    protected $casts = [
        'opening_hours'     => 'array',
        'is_approved'       => 'boolean',
        'is_active'         => 'boolean',
        'ordering_enabled'         => 'boolean',
        'allows_pre_orders'        => 'boolean',
        'pre_order_lead_time_hours'=> 'integer',
        'is_paused'                => 'boolean',
        'order_padding'            => 'integer',
        'order_start_number'       => 'integer',
        'break_start'       => 'datetime',
        'break_end'         => 'datetime',
    ];

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function branches()
    {
        return $this->hasMany(StoreBranch::class);
    }

    public function defaultBranch()
    {
        return $this->hasOne(StoreBranch::class)->orderBy('id');
    }

    public function foods()
    {
        return $this->hasMany(Food::class);
    }

    public function staff()
    {
        return $this->hasMany(StoreStaff::class);
    }

    public function badges()
    {
        return $this->belongsToMany(Badge::class, 'store_badge');
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    // Store gallery images
    public function images()
    {
        return $this->hasMany(StoreImage::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function complaints()
    {
        return $this->hasMany(Complaint::class);
    }

    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    public function banners()
    {
        return $this->hasMany(Banner::class);
    }

    /**
     * The store's custom page builder configuration.
     */
    public function themePreset()
    {
        return $this->belongsTo(ThemePreset::class);
    }

    // Offers relationship
    public function offers()
    {
        return $this->hasMany(Offer::class);
    }

    public function domains()
    {
        return $this->hasMany(\App\Models\StoreDomain::class);
    }

    public function primaryDomain()
    {
        return $this->hasOne(\App\Models\StoreDomain::class)->where('is_primary', true);
    }

    public function pageAssets()
    {
        return $this->hasMany(PageAsset::class);
    }

    public function chefStoreHires()
    {
        return $this->hasMany(\App\Models\ChefStoreHire::class);
    }

    public function clientBans()
    {
        return $this->hasMany(\App\Models\ClientBan::class);
    }

    public function clientReports()
    {
        return $this->hasMany(\App\Models\ClientReport::class);
    }

    public function clientTrustScores()
    {
        return $this->hasMany(\App\Models\ClientTrustScore::class);
    }

    public function subscription(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(StoreSubscription::class);
    }

    public function activeSubscription(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(StoreSubscription::class)
            ->whereIn('status', ['trialing', 'active']);
    }

    public function activePaymentMethods(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(PaymentMethod::class)->where('is_verified', true);
    }

    public function billingInvoices(): \Illuminate\Database\Eloquent\Relations\HasManyThrough
    {
        return $this->hasManyThrough(
            BillingInvoice::class,
            StoreSubscription::class,
            'store_id',
            'store_subscription_id',
            'id',
            'id'
        );
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    public function reservationSetting()
    {
        return $this->hasOne(ReservationSetting::class);
    }

    public function reservationSchedules()
    {
        return $this->hasMany(ReservationSchedule::class);
    }

    // â”€â”€â”€ Onboarding relationships â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    public function socialLinks()
    {
        return $this->hasMany(StoreSocialLink::class);
    }

    public function phones()
    {
        return $this->hasMany(StorePhone::class)->orderBy('order_index');
    }

    public function primaryPhone()
    {
        return $this->hasOne(StorePhone::class)->where('is_primary', true);
    }

    public function typeCategories()
    {
        return $this->belongsToMany(
            StoreTypeCategory::class,
            'store_type_category',
            'store_id',
            'store_type_category_id'
        );
    }

    /**
     * Check whether the store is currently on a scheduled break.
     */
    public function isOnBreak(): bool
    {
        if (!$this->break_start || !$this->break_end) {
            return false;
        }
        $now = now();
        return $now->between($this->break_start, $this->break_end);
    }

    /**
     * Check whether the store is temporarily paused by the owner.
     */
    public function isPaused(): bool
    {
        return $this->is_paused ?? false;
    }

    /**
     * Determine if the store is effectively open (approved + active + not on break + not paused).
     */
    public function isEffectivelyOpen(): bool
    {
        return $this->is_approved && $this->is_active && !$this->isOnBreak() && !$this->isPaused();
    }

    // Helper to calculate average rating
    public function getAverageRatingAttribute()
    {
        return round($this->reviews()->avg('rating') ?? 5.0, 1);
    }

    /**
     * Apply client-side filters: category, search, price range and min rating.
     * Usage: Store::applyClientFilters($category, $search, $minPrice, $maxPrice, $minRating)
     */
    public function scopeApplyClientFilters($query, $categoryId = null, $search = null, $minPrice = null, $maxPrice = null, $minRating = null)
    {
        $query->where('is_approved', true)
            ->with(['badges'])
            ->withAvg('reviews', 'rating')
            ->withCount('reviews');

        if (!empty($search)) {
            $s = '%' . $search . '%';
            $query->where(function ($q) use ($s) {
                $q->where('name', 'like', $s)
                    ->orWhereHas('foods', function ($fQuery) use ($s) {
                        $fQuery->where('name', 'like', $s);
                    });
            });
        }

        if ($categoryId) {
            $query->whereHas('foods', function ($q) use ($categoryId) {
                $q->where('category_id', $categoryId);
            });
        }

        if (!is_null($minPrice) || !is_null($maxPrice)) {
            $min = $minPrice;
            $max = $maxPrice;
            $query->whereHas('foods', function ($q) use ($min, $max) {
                if (!is_null($min)) {
                    $q->where('price', '>=', (int)$min);
                }
                if (!is_null($max)) {
                    $q->where('price', '<=', (int)$max);
                }
            });
        }

        if (!is_null($minRating)) {
            $query->having('reviews_avg_rating', '>=', (float)$minRating);
        }

        return $query;
    }

    /**
     * Get estimated delivery time in minutes.
     * @param float|null $distanceInKm Distance from store to delivery address
     * @return int Estimated delivery time in minutes
     */
    public function getEstimatedDeliveryTime(?float $distanceInKm = null): int
    {
        $etaService = app(\App\Services\ETAService::class);
        return $etaService->calculateETA($this, $distanceInKm);
    }

    /**
     * Get delivery fee in DZD.
     * @param float|null $distanceInKm
     * @return int Delivery fee in DZD
     */
    public function getDeliveryFee(?float $distanceInKm = null): int
    {
        $etaService = app(\App\Services\ETAService::class);
        return $etaService->calculateDeliveryFee($this, $distanceInKm);
    }
}
