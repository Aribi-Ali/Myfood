<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChefImage extends Model
{
  protected $fillable = [
    'chef_profile_id',
    'chef_id',
    'path',
    'image_type',
    'caption',
    'is_featured',
    'sort_order',
  ];

  protected $casts = [
    'is_featured' => 'boolean',
  ];

  /**
   * Get the chef who owns this image.
   */
  public function chef()
  {
    return $this->belongsTo(User::class, 'chef_id');
  }

  public function chefProfile()
  {
    return $this->belongsTo(ChefProfile::class, 'chef_profile_id');
  }
}
