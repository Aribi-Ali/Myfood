<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChefDiploma extends Model
{
  protected $fillable = [
    'chef_id',
    'diploma_name',
    'issuing_institution',
    'issue_date',
    'diploma_file',
    'verified',
  ];

  protected $casts = [
    'issue_date' => 'integer', // year
    'verified' => 'boolean',
  ];

  /**
   * Get the chef who has this diploma.
   */
  public function chef()
  {
    return $this->belongsTo(User::class, 'chef_id');
  }
}
