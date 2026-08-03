<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StoreTypeCategory extends Model
{
    protected $fillable = ['name', 'slug', 'icon', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function stores()
    {
        return $this->belongsToMany(Store::class, 'store_type_category', 'store_type_category_id', 'store_id');
    }
}
