<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    protected static function booted(): void
    {
        static::creating(function (Reservation $reservation) {
            if ($reservation->store_reservation_number === null && $reservation->store_id) {
                $max = static::where('store_id', $reservation->store_id)
                    ->max('store_reservation_number') ?? 0;
                $reservation->store_reservation_number = $max + 1;
            }
        });
    }

    protected $fillable = [
        'store_reservation_number',
        'store_id',
        'client_id',
        'name',
        'email',
        'phone',
        'party_size',
        'reservation_date',
        'reservation_time',
        'notes',
        'special_requests',
        'status',
        'cancellation_reason',
        'cancelled_at',
    ];

    protected $casts = [
        'reservation_date' => 'date',
        'reservation_time' => 'string',
        'cancelled_at' => 'datetime',
    ];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function scopePending($q)
    {
        return $q->where('status', 'pending');
    }

    public function scopeConfirmed($q)
    {
        return $q->where('status', 'confirmed');
    }

    public function scopeForStore($q, $storeId)
    {
        return $q->where('store_id', $storeId);
    }

    public function scopeForDate($q, $date)
    {
        return $q->where('reservation_date', $date);
    }
}
