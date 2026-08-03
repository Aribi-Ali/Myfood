<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PaymentGateway extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'is_active',
        'config',
        'supported_currencies',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'config' => 'array',
        'supported_currencies' => 'array',
        'sort_order' => 'integer',
    ];

    public function paymentMethods(): HasMany
    {
        return $this->hasMany(PaymentMethod::class, 'gateway_id');
    }
}
