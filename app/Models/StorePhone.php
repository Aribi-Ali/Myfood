<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StorePhone extends Model
{
    protected $fillable = [
        'store_id',
        'phone',
        'is_primary',
        'order_index',
        'verified_at',
    ];

    protected function casts(): array
    {
        return [
            'is_primary'  => 'boolean',
            'order_index' => 'integer',
            'verified_at' => 'datetime',
        ];
    }

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    public function isVerified(): bool
    {
        return $this->verified_at !== null;
    }

    public function verificationCodes()
    {
        return $this->morphMany(PhoneVerificationCode::class, 'verifiable');
    }
}
