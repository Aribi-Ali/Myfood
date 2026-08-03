<?php

namespace Tests\Feature\Api;

use App\Models\ChefProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ChefTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_verified_chefs(): void
    {
        ChefProfile::factory()->count(3)->create(['is_verified' => true]);
        ChefProfile::factory()->create(['is_verified' => false]);

        $response = $this->getJson('/api/v1/chefs');

        $response->assertStatus(200);
        $response->assertJsonCount(3, 'data');
    }

    public function test_can_show_chef_profile(): void
    {
        $chef = ChefProfile::factory()->create(['is_verified' => true]);

        $response = $this->getJson("/api/v1/chefs/{$chef->id}");

        $response->assertStatus(200);
        $response->assertJsonPath('data.id', $chef->id);
    }

    public function test_returns_404_for_unverified_chef(): void
    {
        $chef = ChefProfile::factory()->create(['is_verified' => false]);

        $response = $this->getJson("/api/v1/chefs/{$chef->id}");

        $response->assertStatus(404);
    }

    public function test_can_filter_chefs_by_specialization(): void
    {
        ChefProfile::factory()->create(['specialization' => 'Pizza', 'is_verified' => true]);
        ChefProfile::factory()->create(['specialization' => 'Sushi', 'is_verified' => true]);

        $response = $this->getJson('/api/v1/chefs?specialization=Pizza');

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');
    }
}
