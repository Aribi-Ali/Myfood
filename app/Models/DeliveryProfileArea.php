<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeliveryProfileArea extends Model
{
    protected $fillable = [
        'delivery_profile_id',
        'wilaya_id',
        'daira_id',
        'commune_id',
        'day_price',
        'night_price',
    ];

    protected $casts = [
        'day_price' => 'decimal:2',
        'night_price' => 'decimal:2',
    ];

    public function deliveryProfile(): BelongsTo
    {
        return $this->belongsTo(DeliveryProfile::class);
    }

    public function wilaya(): BelongsTo
    {
        return $this->belongsTo(Wilaya::class);
    }

    public function daira(): BelongsTo
    {
        return $this->belongsTo(Daira::class);
    }

    public function commune(): BelongsTo
    {
        return $this->belongsTo(Commune::class);
    }
}
