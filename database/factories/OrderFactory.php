<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\Store;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
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
            'delivery_id' => null,
            'status' => $this->faker->randomElement(['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled']),
            'delivery_type' => $this->faker->randomElement(['delivery', 'pickup']),
            'pickup_time' => $this->faker->optional()->randomElement(['soon', '30min', '1hr', 'custom']),
            'total_amount' => $this->faker->randomFloat(1, 20, 500),
            'commission_amount' => $this->faker->randomFloat(1, 2, 50),
            'address' => $this->faker->address(),
            'phone' => $this->faker->phoneNumber(),
            'notes' => $this->faker->optional()->text(),
            'latitude' => $this->faker->optional()->latitude(),
            'longitude' => $this->faker->optional()->longitude(),
            'promo_code_id' => null,
            'discount_amount' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}