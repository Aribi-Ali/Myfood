<?php

namespace Database\Factories;

use App\Models\Complaint;
use App\Models\Order;
use App\Models\Store;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ComplaintFactory extends Factory
{
    protected $model = Complaint::class;

    public function definition(): array
    {
        return [
            'client_id' => User::factory(),
            'store_id' => Store::factory(),
            'order_id' => Order::factory(),
            'subject' => $this->faker->sentence(),
            'description' => $this->faker->paragraph(),
            'status' => 'pending',
        ];
    }
}
