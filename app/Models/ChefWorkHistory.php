<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChefWorkHistory extends Model
{
  protected $table = 'chef_work_history';

  protected $fillable = [
    'chef_id',
    'restaurant_name',
    'position',
    'start_year',
    'end_year',
    'description',
    'location',
  ];

  protected $casts = [
    'start_year' => 'integer',
    'end_year' => 'integer',
  ];

  /**
   * Get the chef who has this work history.
   */
  public function chef()
  {
    return $this->belongsTo(User::class, 'chef_id');
  }

  /**
   * Get human-readable duration.
   */
  public function getDuration(): string
  {
    $end = $this->end_year ?? date('Y');
    $years = $end - $this->start_year;

    if ($years === 0) {
      return 'Less than 1 year';
    }

    return "$years year" . ($years > 1 ? 's' : '');
  }

  /**
   * Check if currently working at this position.
   */
  public function isCurrentPosition(): bool
  {
    return is_null($this->end_year);
  }
}
