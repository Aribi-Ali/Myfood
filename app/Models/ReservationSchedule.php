<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReservationSchedule extends Model
{
    protected $fillable = [
        'store_id',
        'day_of_week',
        'enabled',
        'open_time',
        'close_time',
    ];

    protected $casts = [
        'enabled' => 'boolean',
    ];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }
}
