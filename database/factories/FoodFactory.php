<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Food;
use App\Models\Store;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Food>
 */
class FoodFactory extends Factory
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
            'category_id' => Category::factory(),
            'name' => $this->faker->word(),
            'description' => $this->faker->text(),
            'price' => $this->faker->randomFloat(1, 10, 100),
            'new_price' => $this->faker->optional()->randomFloat(1, 5, 50),
            'ingredients' => $this->faker->optional()->text(),
            'cooking_time' => $this->faker->numberBetween(10, 60),
            'is_available' => true,
            'is_offer' => false,
            'image' => null,
            'bought_count' => $this->faker->numberBetween(0, 100),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}