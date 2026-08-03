<?php

namespace Database\Factories;

use App\Models\ChefProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ChefProfileFactory extends Factory
{
    protected $model = ChefProfile::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'bio' => $this->faker->paragraph(),
            'specialization' => $this->faker->randomElement(['Pizza', 'Pasta', 'Sushi', 'Grill', 'Desserts']),
            'years_of_experience' => $this->faker->numberBetween(1, 20),
            'cuisines_expertise' => json_encode([$this->faker->word()]),
            'is_available' => true,
            'is_verified' => false,
            'average_rating' => 0,
            'reviews_count' => 0,
        ];
    }
}
