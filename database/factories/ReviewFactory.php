<?php

namespace Database\Factories;

use App\Models\Review;
use App\Models\User;
use App\Models\Store;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Review>
 */
class ReviewFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'client_id' => User::factory(),
            'store_id' => Store::factory(),
            'rating' => $this->faker->numberBetween(1, 5),
            'comment' => $this->faker->text(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}