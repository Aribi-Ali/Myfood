<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StoreDomain extends Model
{
    use HasFactory;
    protected $fillable = [
        'store_id',
        'domain',
        'verification_code',
        'verified_at',
        'is_primary',
    ];

    protected $casts = [
        'verified_at' => 'datetime',
        'is_primary'  => 'boolean',
    ];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function scopeVerified($query)
    {
        return $query->whereNotNull('verified_at');
    }
}
