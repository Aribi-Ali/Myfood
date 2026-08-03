<?php

namespace Database\Factories;

use App\Models\Store;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Store>
 */
class StoreFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'owner_id' => User::factory(),
            'name' => $this->faker->company(),
            'alias' => $this->faker->slug(),
            'description' => $this->faker->text(),
            'opening_hours' => ['default' => '09:00 - 22:00'],
            'is_approved' => true,
            'avg_prep_time' => 25,
            'delivery_zone_radius' => 5,
            'base_delivery_fee' => 200,
            'avg_delivery_time_per_km' => 3,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}