<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReservationSetting extends Model
{
    protected $fillable = [
        'store_id',
        'enabled',
        'auto_confirm',
        'manual_confirm',
        'duration_minutes',
        'slot_interval_minutes',
        'min_advance_hours',
        'max_booking_days',
        'min_party_size',
        'max_party_size',
        'allow_notes',
        'allow_special_requests',
        'allow_cancellation',
        'cancellation_deadline_hours',
        'reminder_24h',
        'reminder_2h',
    ];

    protected $casts = [
        'enabled' => 'boolean',
        'auto_confirm' => 'boolean',
        'manual_confirm' => 'boolean',
        'allow_notes' => 'boolean',
        'allow_special_requests' => 'boolean',
        'allow_cancellation' => 'boolean',
        'reminder_24h' => 'boolean',
        'reminder_2h' => 'boolean',
    ];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }
}
