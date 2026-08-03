<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Badge extends Model
{
    protected $fillable = ['name', 'description', 'color_code', 'icon'];

    public function stores()
    {
        return $this->belongsToMany(Store::class, 'store_badge');
    }
}
