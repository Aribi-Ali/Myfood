<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChefStoreHire extends Model
{
  protected $table = 'chef_store_hires';

  protected $fillable = [
    'chef_profile_id',
    'store_id',
    'hired_by',
    'hired_at',
    'is_active',
  ];

  protected $casts = [
    'hired_at' => 'datetime',
    'is_active' => 'boolean',
  ];

  public function chefProfile()
  {
    return $this->belongsTo(ChefProfile::class, 'chef_profile_id');
  }

  public function store()
  {
    return $this->belongsTo(Store::class);
  }

  public function hiredBy()
  {
    return $this->belongsTo(User::class, 'hired_by');
  }
}
