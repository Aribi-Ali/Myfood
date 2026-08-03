<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class StoreBranch extends Model
{
    use HasFactory;

    protected $fillable = [
        'store_id', 'name', 'alias', 'description',
        'template_slug', 'theme_preset_id',
        'cover_image', 'logo_path', 'document_path', 'opening_hours',
        'wilaya', 'daira', 'commune', 'address',
        'latitude', 'longitude', 'email', 'phone',
        'is_active', 'break_start', 'break_end', 'break_note',
        'avg_prep_time', 'delivery_zone_radius', 'base_delivery_fee', 'avg_delivery_time_per_km',
        'ordering_enabled', 'is_paused', 'pause_note',
        'allows_pre_orders', 'pre_order_lead_time_hours',
        'order_prefix', 'order_suffix', 'order_padding', 'order_start_number',
        'cover_image_id', 'main_image_id', 'is_subscription_managed',
    ];

    protected function casts(): array
    {
        return [
            'opening_hours' => 'array',
            'is_active' => 'boolean',
            'ordering_enabled' => 'boolean',
            'is_paused' => 'boolean',
            'allows_pre_orders' => 'boolean',
            'is_subscription_managed' => 'boolean',
            'break_start' => 'datetime',
            'break_end' => 'datetime',
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
            'avg_prep_time' => 'integer',
            'delivery_zone_radius' => 'decimal:2',
            'base_delivery_fee' => 'integer',
            'avg_delivery_time_per_km' => 'integer',
            'order_padding' => 'integer',
            'order_start_number' => 'integer',
            'pre_order_lead_time_hours' => 'integer',
        ];
    }

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    public function assignedUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'branch_user', 'branch_id', 'user_id')
            ->withPivot(['role', 'permissions'])
            ->withTimestamps();
    }

    public function isOnBreak(): bool
    {
        if (!$this->break_start || !$this->break_end) {
            return false;
        }
        $now = now();
        return $now >= $this->break_start && $now <= $this->break_end;
    }

    public function isEffectivelyOpen(): bool
    {
        return $this->is_active && !$this->is_paused && !$this->isOnBreak();
    }

    public function getEstimatedDeliveryTime(): int
    {
        return $this->avg_prep_time + ($this->avg_delivery_time_per_km * ($this->delivery_zone_radius > 0 ? ceil($this->delivery_zone_radius / 2) : 1));
    }

    public function getDeliveryFee(): int
    {
        return $this->base_delivery_fee;
    }

    /**
     * One‑to‑one relationship to the branch‑specific template configuration.
     */
    public function branchTemplate(): HasOne
    {
        return $this->hasOne(BranchTemplate::class, 'branch_id');
    }
}
