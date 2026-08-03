<?php

namespace App\Services;

use App\Models\ChefProfile;
use App\Models\Store;
use Illuminate\Database\Eloquent\Builder;

class ChefService
{
  /**
   * Get available chefs matching criteria (only for store owners).
   * Filters: specialization, cuisine, minimum rating, availability
   *
   * @param array $filters
   * @return Builder
   */
  public function searchChefs(array $filters = []): Builder
  {
    $query = ChefProfile::with(['user', 'skills', 'diplomas:id,chef_id,diploma_name,issuing_institution', 'featuredImages'])
      ->available()
      ->verified();

    // Filter by specialization
    if (!empty($filters['specialization'])) {
      $query->where('specialization', $filters['specialization']);
    }

    // Filter by cuisine expertise
    if (!empty($filters['cuisine'])) {
      $query->byCuisine($filters['cuisine']);
    }

    // Filter by minimum rating
    if (!empty($filters['min_rating'])) {
      $query->minRating($filters['min_rating']);
    }

    // Filter by minimum experience
    if (!empty($filters['min_experience'])) {
      $query->where('years_of_experience', '>=', $filters['min_experience']);
    }

    // Search by name (chef name)
    if (!empty($filters['search'])) {
      $search = '%' . $filters['search'] . '%';
      $query->whereHas('user', function (Builder $q) use ($search) {
        $q->where('name', 'like', $search);
      });
    }

    // Sort
    $sortBy = $filters['sort_by'] ?? 'average_rating';
    $sortDir = $filters['sort_dir'] ?? 'desc';

    if ($sortBy === 'average_rating') {
      $query->orderBy('average_rating', $sortDir);
    } elseif ($sortBy === 'experience') {
      $query->orderBy('years_of_experience', $sortDir);
    } elseif ($sortBy === 'recent') {
      $query->latest();
    }

    return $query;
  }

  /**
   * Hire a chef for a store (owner action).
   */
  public function hireChef(int $chefId, int $storeId, int $hiredBy): bool
  {
    $profile = ChefProfile::where('user_id', $chefId)->first();
    if (!$profile) return false;

    // mark previous hires inactive
    \App\Models\ChefStoreHire::where('chef_profile_id', $profile->id)->where('store_id', $storeId)->update(['is_active' => false]);

    \App\Models\ChefStoreHire::create([
      'chef_profile_id' => $profile->id,
      'store_id' => $storeId,
      'hired_by' => $hiredBy,
      'hired_at' => now(),
      'is_active' => true,
    ]);

    return true;
  }

  public function unhireChef(int $chefId, int $storeId): bool
  {
    $profile = ChefProfile::where('user_id', $chefId)->first();
    if (!$profile) return false;

    return \App\Models\ChefStoreHire::where('chef_profile_id', $profile->id)->where('store_id', $storeId)->update(['is_active' => false]) > 0;
  }

  public function isChefHired(int $chefId, int $storeId): bool
  {
    $profile = ChefProfile::where('user_id', $chefId)->first();
    if (!$profile) return false;
    return \App\Models\ChefStoreHire::where('chef_profile_id', $profile->id)->where('store_id', $storeId)->where('is_active', true)->exists();
  }

  /**
   * Get a chef's full profile including all details.
   */
  public function getChefProfile(int $chefId)
  {
    return ChefProfile::with([
      'user',
      'skills',
      'diplomas',
      'images' => fn($q) => $q->orderBy('is_featured', 'desc')->orderBy('sort_order'),
      'workHistory',
    ])
      ->where('user_id', $chefId)
      ->firstOrFail();
  }

  /**
   * Verify chef profile (admin action).
   */
  public function verifyChef(int $chefId): bool
  {
    return ChefProfile::where('user_id', $chefId)
      ->update([
        'is_verified' => true,
        'verified_at' => now(),
      ]) > 0;
  }

  /**
   * Toggle chef availability status.
   */
  public function toggleAvailability(int $chefId): bool
  {
    $profile = ChefProfile::where('user_id', $chefId)->first();
    if (!$profile) {
      return false;
    }

    return $profile->update([
      'is_available' => !$profile->is_available,
    ]);
  }

  /**
   * Get available specializations for filter dropdown.
   */
  public function getAvailableSpecializations(): array
  {
    return [
      'Italian' => 'Italian',
      'Traditional Algerian' => 'Traditional Algerian',
      'Mediterranean' => 'Mediterranean',
      'Grill & BBQ' => 'Grill & BBQ',
      'Pastry & Desserts' => 'Pastry & Desserts',
      'Fusion' => 'Fusion',
      'Vegetarian/Vegan' => 'Vegetarian/Vegan',
    ];
  }

  /**
   * Get available cuisine types.
   */
  public function getAvailableCuisines(): array
  {
    return [
      'Italian' => 'Italian',
      'Algerian' => 'Algerian',
      'Mediterranean' => 'Mediterranean',
      'Middle Eastern' => 'Middle Eastern',
      'French' => 'French',
      'Asian' => 'Asian',
      'International' => 'International',
    ];
  }
}
