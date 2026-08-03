<?php

namespace Database\Factories;

use App\Models\Store;
use App\Models\StoreDomain;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class StoreDomainFactory extends Factory
{
    protected $model = StoreDomain::class;

    public function definition(): array
    {
        return [
            'store_id' => Store::factory(),
            'domain' => $this->faker->unique()->domainName(),
            'verification_code' => Str::random(32),
            'verified_at' => null,
            'is_primary' => false,
        ];
    }

    public function verified(): static
    {
        return $this->state(fn (array $attrs) => [
            'verified_at' => now(),
        ]);
    }

    public function primary(): static
    {
        return $this->state(fn (array $attrs) => [
            'is_primary' => true,
            'verified_at' => now(),
        ]);
    }
}
