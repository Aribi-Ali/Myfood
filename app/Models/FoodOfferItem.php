<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FoodOfferItem extends Model
{
    protected $table = 'food_offer_items';

    protected $fillable = [
        'parent_food_id',
        'child_food_id',
        'quantity',
    ];

    protected $casts = [
        'parent_food_id' => 'integer',
        'child_food_id' => 'integer',
        'quantity' => 'integer',
    ];

    public function parentFood()
    {
        return $this->belongsTo(Food::class, 'parent_food_id');
    }

    public function childFood()
    {
        return $this->belongsTo(Food::class, 'child_food_id');
    }
}
