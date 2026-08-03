<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RestaurantTable extends Model
{
    protected $table = 'restaurant_tables';

    protected $fillable = [
        'store_id', 'name', 'table_number', 'capacity',
        'min_capacity', 'location', 'description', 'status',
    ];

    protected $casts = [
        'capacity' => 'integer',
        'min_capacity' => 'integer',
    ];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }
}
