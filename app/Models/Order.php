<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\OrderStatus;
use App\Events\KitchenOrderAdded;
use App\Events\KitchenOrderCompleted;
use App\Events\KitchenOrderStarted;
use App\Events\NewOrderPlaced;
use App\Events\OrderReadyForDelivery;
use App\Events\OrderStatusUpdated;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Order extends Model
{
    use HasFactory;

    protected static function booted(): void
    {
        static::creating(function (Order $order) {
            if ($order->store_order_number === null && $order->store_id) {
                DB::transaction(function () use ($order) {
                    // Lock the store row so concurrent order creation serializes
                    // per store — otherwise max()+1 can assign duplicate numbers.
                    $store = Store::whereKey($order->store_id)->lockForUpdate()->first();
                    $max = static::where('store_id', $order->store_id)
                        ->max('store_order_number') ?? 0;
                    $order->store_order_number = $max === 0
                        ? ($store?->order_start_number ?: 1)
                        : $max + 1;
                });
            }
        });

        static::created(function (Order $order) {
            try {
                NewOrderPlaced::dispatch($order);
            } catch (\Throwable $e) {
                report($e);
            }
        });

        static::updated(function (Order $order) {
            if ($order->wasChanged('status')) {
                try {
                    OrderStatusUpdated::dispatch($order);

                    // Dispatch KDS / ready-for-delivery events on specific transitions
                    $newStatus = $order->status->value;

                    if ($newStatus === 'confirmed') {
                        KitchenOrderAdded::dispatch($order);
                    }

                    if ($newStatus === 'preparing') {
                        KitchenOrderStarted::dispatch($order);
                    }

                    if ($newStatus === 'ready') {
                        KitchenOrderCompleted::dispatch($order);
                        OrderReadyForDelivery::dispatch($order);
                    }
                } catch (\Throwable $e) {
                    report($e);
                }
            }
        });
    }

    protected $fillable = [
        'store_order_number',
        'client_id',
        'store_id',
        'delivery_id',
        'assigned_chef_id',
        'status',
        'delivery_type',
        'scheduled_at',
        'pickup_time',
        'total_amount',
        'commission_amount',
        'address',
        'phone',
        'notes',
        'latitude',
        'longitude',
        'promo_code_id',
        'discount_amount',
        'estimated_delivery_minutes',
        'delivery_fee',
    ];

    /**
     * Fields hidden from API serialization (sensitive financial/location data).
     */
    protected $hidden = [
        'commission_amount',
        'latitude',
        'longitude',
    ];

    protected $casts = [
        'total_amount'      => 'decimal:2',
        'commission_amount' => 'decimal:2',
        'discount_amount'   => 'decimal:2',
        'scheduled_at'      => 'datetime',
        'status'            => OrderStatus::class,
    ];

    // -------------------------------------------------------------------------
    // Relationships
    // -------------------------------------------------------------------------

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function deliveryGuy()
    {
        return $this->belongsTo(User::class, 'delivery_id');
    }

    public function chef()
    {
        return $this->belongsTo(User::class, 'assigned_chef_id');
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function promoCode()
    {
        return $this->belongsTo(PromoCode::class);
    }

    // -------------------------------------------------------------------------
    // Scopes
    // -------------------------------------------------------------------------

    /** Orders that belong to the authenticated (or given) client. */
    public function scopeForClient(Builder $query, ?int $clientId = null): Builder
    {
        return $query->where('client_id', $clientId ?? auth()->id());
    }

    /** Orders that belong to a specific store. */
    public function scopeForStore(Builder $query, int $storeId): Builder
    {
        return $query->where('store_id', $storeId);
    }

    /** Filter by status. */
    public function scopeWithStatus(Builder $query, string $status): Builder
    {
        return $query->where('status', $status);
    }

    /** Pending orders only. */
    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', OrderStatus::Pending->value);
    }

    /** Active (not delivered or cancelled) orders. */
    public function scopeActive(Builder $query): Builder
    {
        return $query->whereNotIn('status', OrderStatus::terminal());
    }

    // -------------------------------------------------------------------------
    // Accessors
    // -------------------------------------------------------------------------

    /** Net store payout after platform commission. */
    public function getStorePayoutAttribute(): float
    {
        return (float) $this->total_amount - (float) $this->commission_amount;
    }

    protected $appends = [
        'order_number_formatted',
    ];

    /** Formatted order number using store's prefix/suffix/padding. */
    public function getOrderNumberFormattedAttribute(): string
    {
        $num = $this->store_order_number ?? $this->id;

        if ($this->relationLoaded('store') && $this->store) {
            $s = $this->store;
            $padding = $s->order_padding ?? 0;
            if ($padding > 0) {
                $num = str_pad((string) $num, $padding, '0', STR_PAD_LEFT);
            }
            return ($s->order_prefix ?? '') . $num . ($s->order_suffix ?? '');
        }

        return '#' . $num;
    }
}