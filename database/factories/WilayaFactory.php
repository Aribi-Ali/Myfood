<?php

namespace Database\Factories;

use App\Models\Wilaya;
use Illuminate\Database\Eloquent\Factories\Factory;

class WilayaFactory extends Factory
{
    protected $model = Wilaya::class;

    public function definition(): array
    {
        return [
            'code' => $this->faker->unique()->numerify('##'),
            'name_fr' => $this->faker->city(),
            'name_ar' => $this->faker->word(),
        ];
    }
}
