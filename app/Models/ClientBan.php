<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClientBan extends Model
{
    protected $fillable = [
        'store_id',
        'client_id',
        'reason',
        'banned_at',
    ];

    protected $casts = [
        'banned_at' => 'datetime',
    ];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }
}
