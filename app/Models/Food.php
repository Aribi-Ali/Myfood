<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Food extends Model
{
    use HasFactory;

    // Explicitly define the table name since plural of food is foods (non-standard in Laravel which expects food to be food or foods)
    protected $table = 'foods';

    protected $fillable = [
        'store_id',
        'category_id',
        'name',
        'description',
        'image',
        'price',
        'price_usd',
        'price_eur',
        'new_price',
        'new_price_usd',
        'new_price_eur',
        'is_available',
        'is_offer',
        'ingredients',
        'cooking_time',
        'bought_count',
    ];

    protected $casts = [
        'is_available' => 'boolean',
        'is_offer' => 'boolean',
        'price' => 'decimal:2',
        'price_usd' => 'decimal:2',
        'price_eur' => 'decimal:2',
        'new_price' => 'decimal:2',
        'new_price_usd' => 'decimal:2',
        'new_price_eur' => 'decimal:2',
        'cooking_time' => 'integer',
        'bought_count' => 'integer',
    ];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class);
    }

    public function additionalImages()
    {
        return $this->hasMany(FoodImage::class, 'food_id');
    }

    /**
     * Component items inside this package offer (if is_offer is true).
     */
    public function packageItems()
    {
        return $this->belongsToMany(Food::class, 'food_offer_items', 'parent_food_id', 'child_food_id')
            ->withPivot('quantity')
            ->withTimestamps();
    }

    // Helper to get effective price
    public function getEffectivePriceAttribute()
    {
        if ($this->new_price !== null && $this->new_price < $this->price) {
            return $this->new_price;
        }
        return $this->price;
    }

    // Helper to check if item is currently on offer
    public function getIsOnOfferAttribute(): bool
    {
        return $this->is_offer || ($this->new_price !== null && $this->new_price < $this->price);
    }
}