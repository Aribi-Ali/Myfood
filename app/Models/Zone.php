<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Zone extends Model
{
    use HasFactory;

    protected $fillable = [
        'store_id',
        'name',
        'radius_km',
        'fee',
    ];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }
}
