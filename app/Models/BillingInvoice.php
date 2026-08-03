<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BillingInvoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'store_subscription_id',
        'invoice_number',
        'period_start',
        'period_end',
        'total_orders',
        'tier_applied',
        'plan_name',
        'base_amount',
        'discount_amount',
        'tax_amount',
        'total_amount',
        'currency',
        'status',
        'payment_method_type',
        'gateway_transaction_id',
        'paid_at',
        'paid_by_user_id',
        'notes',
    ];

    protected $casts = [
        'base_amount' => 'float',
        'discount_amount' => 'float',
        'tax_amount' => 'float',
        'total_amount' => 'float',
        'total_orders' => 'integer',
        'period_start' => 'datetime',
        'period_end' => 'datetime',
        'paid_at' => 'datetime',
    ];

    public function subscription(): BelongsTo
    {
        return $this->belongsTo(StoreSubscription::class, 'store_subscription_id');
    }

    public function paidBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'paid_by_user_id');
    }
}
