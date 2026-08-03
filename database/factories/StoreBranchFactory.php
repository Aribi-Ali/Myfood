<?php

namespace Database\Factories;

use App\Models\Store;
use App\Models\StoreBranch;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<StoreBranch>
 */
class StoreBranchFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'store_id' => Store::factory(),
            'name' => $this->faker->company(),
            'alias' => $this->faker->slug(),
            'is_active' => true,
            'avg_prep_time' => 25,
            'delivery_zone_radius' => 5,
            'base_delivery_fee' => 200,
            'avg_delivery_time_per_km' => 3,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
