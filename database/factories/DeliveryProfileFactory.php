<?php

namespace Database\Factories;

use App\Models\DeliveryProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class DeliveryProfileFactory extends Factory
{
    protected $model = DeliveryProfile::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'phone' => $this->faker->phoneNumber(),
            'transporter_type' => $this->faker->randomElement(['bike', 'motorcycle', 'car']),
            'is_working' => false,
        ];
    }
}
