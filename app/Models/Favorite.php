<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Favorite extends Model
{
    protected $fillable = ['user_id', 'store_id', 'food_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
