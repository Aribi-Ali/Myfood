<?php

namespace Tests\Feature\Api;

use App\Models\User;
use App\Models\ChefProfile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClientChefTest extends TestCase
{
    use RefreshDatabase;

    private User $client;

    protected function setUp(): void
    {
        parent::setUp();
        $this->client = User::factory()->create();
    }

    public function test_can_create_chef_profile(): void
    {
        $response = $this->actingAs($this->client)->postJson('/api/v1/client/chef', [
            'bio' => 'Passionate chef with 10 years of experience',
            'specialization' => 'Italian',
            'years_of_experience' => 10,
            'cuisines' => ['Italian', 'French'],
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['data' => ['id', 'bio', 'specialization']]);

        $this->assertDatabaseHas('chef_profiles', [
            'user_id' => $this->client->id,
            'specialization' => 'Italian',
        ]);
    }

    public function test_can_view_chef_profile(): void
    {
        ChefProfile::create([
            'user_id' => $this->client->id,
            'bio' => 'Experienced chef',
            'specialization' => 'Algerian',
            'years_of_experience' => 5,
        ]);

        $response = $this->actingAs($this->client)->getJson('/api/v1/client/chef');

        $response->assertStatus(200)
            ->assertJsonStructure(['data' => ['id', 'bio', 'specialization']]);
    }

    public function test_can_update_chef_profile(): void
    {
        ChefProfile::create([
            'user_id' => $this->client->id,
            'bio' => 'Old bio',
            'specialization' => 'Italian',
            'years_of_experience' => 3,
        ]);

        $response = $this->actingAs($this->client)->postJson('/api/v1/client/chef', [
            'bio' => 'Updated bio',
            'specialization' => 'Fusion',
            'years_of_experience' => 5,
            'cuisines' => ['Asian', 'Mexican'],
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.bio', 'Updated bio');
    }

    public function test_unauthenticated_user_cannot_access_chef_profile(): void
    {
        $this->getJson('/api/v1/client/chef')->assertStatus(401);
        $this->postJson('/api/v1/client/chef')->assertStatus(401);
    }
}
