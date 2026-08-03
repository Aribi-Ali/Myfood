<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FoodImage extends Model
{
    protected $fillable = ['food_id', 'image_path'];

    public function food()
    {
        return $this->belongsTo(Food::class);
    }
}
