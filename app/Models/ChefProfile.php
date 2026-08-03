<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ChefProfile extends Model
{
  use HasFactory;

  protected $table = 'chef_profiles';

  protected $fillable = [
    'user_id',
    'bio',
    'specialization',
    'years_of_experience',
    'cuisines_expertise',
    'is_available',
    'working_hours',
    'average_rating',
    'reviews_count',
    'hourly_rate',
    'base_menu_rate',
    'is_verified',
    'verified_at',
    'rejected_at',
    'rejection_reason',
    'verification_document',
  ];

  protected $casts = [
    'is_available' => 'boolean',
    'is_verified' => 'boolean',
    'cuisines_expertise' => 'array',
    'working_hours' => 'array',
    'verified_at' => 'datetime',
    'rejected_at' => 'datetime',
    'average_rating' => 'decimal:2',
  ];

  /**
   * Get the chef (User) associated with this profile.
   */
  public function user(): BelongsTo
  {
    return $this->belongsTo(User::class);
  }

  /**
   * Get all skills of the chef.
   */
  public function skills(): HasMany
  {
    return $this->hasMany(ChefSkill::class, 'chef_id', 'user_id');
  }

  /**
   * Get all diplomas of the chef.
   */
  public function diplomas(): HasMany
  {
    return $this->hasMany(ChefDiploma::class, 'chef_id', 'user_id');
  }

  /**
   * Get all images of the chef.
   */
  public function images(): HasMany
  {
    return $this->hasMany(ChefImage::class, 'chef_profile_id', 'id');
  }

  /**
   * Get featured portfolio images.
   */
  public function featuredImages(): HasMany
  {
    return $this->hasMany(ChefImage::class, 'chef_profile_id', 'id')
      ->where('is_featured', true)
      ->orderBy('sort_order');
  }

    /**
     * Get the hire records linking this chef to stores.
     */
    public function hires(): HasMany
    {
        return $this->hasMany(ChefStoreHire::class, 'chef_profile_id');
    }

    /**
     * Get active hires only.
     */
    public function activeHires(): HasMany
    {
        return $this->hasMany(ChefStoreHire::class, 'chef_profile_id')
            ->where('is_active', true);
    }

    /**
     * Get stores the chef is actively hired at.
     */
    public function stores()
    {
        return $this->hasManyThrough(
            Store::class,
            ChefStoreHire::class,
            'chef_profile_id',
            'id',
            'id',
            'store_id'
        )->where('chef_store_hires.is_active', true);
    }

    /**
     * Get work history of the chef.
     */
    public function workHistory(): HasMany
    {
        return $this->hasMany(ChefWorkHistory::class, 'chef_id', 'user_id')
            ->orderBy('start_year', 'desc');
    }

  /**
   * Scope to get only available chefs.
   */
  public function scopeAvailable($query)
  {
    return $query->where('is_available', true);
  }

  /**
   * Scope to get only verified chefs.
   */
  public function scopeVerified($query)
  {
    return $query->where('is_verified', true);
  }

  /**
   * Scope to get chefs by specialization.
   */
  public function scopeBySpecialization($query, $specialization)
  {
    return $query->where('specialization', $specialization);
  }

  /**
   * Scope to filter by cuisine expertise.
   */
  public function scopeByCuisine($query, $cuisine)
  {
    return $query->whereRaw("JSON_CONTAINS(cuisines_expertise, ?)", ['"' . $cuisine . '"']);
  }

  /**
   * Scope to filter by minimum rating.
   */
  public function scopeMinRating($query, $rating)
  {
    return $query->where('average_rating', '>=', $rating);
  }

  /**
   * Get cuisines as array.
   */
  public function getCuisinesArray(): array
  {
    if (!$this->cuisines_expertise) {
      return [];
    }

    if (is_array($this->cuisines_expertise)) {
      return $this->cuisines_expertise;
    }

    return json_decode($this->cuisines_expertise, true) ?? [];
  }
}
