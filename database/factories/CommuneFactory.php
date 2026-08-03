<?php

namespace Database\Factories;

use App\Models\Commune;
use App\Models\Daira;
use App\Models\Wilaya;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommuneFactory extends Factory
{
    protected $model = Commune::class;

    public function definition(): array
    {
        $wilaya = Wilaya::factory()->create();
        return [
            'daira_id' => Daira::factory()->create(['wilaya_id' => $wilaya->id]),
            'wilaya_id' => $wilaya->id,
            'name_fr' => $this->faker->city(),
            'name_ar' => $this->faker->word(),
        ];
    }
}
