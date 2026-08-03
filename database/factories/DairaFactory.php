<?php

namespace Database\Factories;

use App\Models\Daira;
use App\Models\Wilaya;
use Illuminate\Database\Eloquent\Factories\Factory;

class DairaFactory extends Factory
{
    protected $model = Daira::class;

    public function definition(): array
    {
        return [
            'wilaya_id' => Wilaya::factory(),
            'name_fr' => $this->faker->city(),
            'name_ar' => $this->faker->word(),
        ];
    }
}
