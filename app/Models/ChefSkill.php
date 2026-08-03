<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChefSkill extends Model
{
  protected $fillable = [
    'chef_id',
    'skill_name',
    'proficiency_level',
    'description',
    'certified_year',
  ];

  protected $casts = [
    'certified_year' => 'integer',
  ];

  /**
   * Get the chef who has this skill.
   */
  public function chef()
  {
    return $this->belongsTo(User::class, 'chef_id');
  }

  /**
   * Get proficiency level label.
   */
  public function getProficiencyLabel(): string
  {
    return match ($this->proficiency_level) {
      1 => 'Beginner',
      2 => 'Intermediate',
      3 => 'Competent',
      4 => 'Advanced',
      5 => 'Expert',
      default => 'Unknown',
    };
  }
}
