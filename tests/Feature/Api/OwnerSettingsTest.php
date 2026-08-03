<?php

namespace Tests\Feature\Api;

use App\Models\User;
use App\Models\Store;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OwnerSettingsTest extends TestCase
{
    use RefreshDatabase;

    private User $owner;
    private Store $store;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->store = Store::factory()->create(['owner_id' => $this->owner->id]);
    }

    public function test_can_view_settings(): void
    {
        $response = $this->actingAs($this->owner)->getJson('/api/v1/owner/settings');

        $response->assertStatus(200)
            ->assertJsonStructure(['data']);
    }

    public function test_can_update_general_settings(): void
    {
        $response = $this->actingAs($this->owner)->putJson('/api/v1/owner/settings', [
            'name' => 'Updated Store Name',
            'description' => 'Updated description',
            'phone' => '0555123456',
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('stores', [
            'id' => $this->store->id,
            'name' => 'Updated Store Name',
        ]);
    }

    public function test_can_update_opening_hours(): void
    {
        $hours = [
            'monday' => ['open' => '09:00', 'close' => '22:00', 'closed' => false],
            'tuesday' => ['open' => '09:00', 'close' => '22:00', 'closed' => true],
        ];

        $response = $this->actingAs($this->owner)->putJson('/api/v1/owner/settings', [
            'opening_hours' => $hours,
        ]);

        $response->assertStatus(200);
    }

    public function test_can_update_delivery_settings(): void
    {
        $response = $this->actingAs($this->owner)->putJson('/api/v1/owner/settings', [
            'avg_prep_time' => 20,
            'delivery_zone_radius' => 10,
            'base_delivery_fee' => 300,
            'avg_delivery_time_per_km' => 5,
        ]);

        $response->assertStatus(200);
    }

    public function test_can_update_social_links(): void
    {
        $response = $this->actingAs($this->owner)->putJson('/api/v1/owner/settings', [
            'social_links' => [
                ['platform' => 'facebook', 'url' => 'https://facebook.com/store'],
                ['platform' => 'instagram', 'url' => 'https://instagram.com/store'],
            ],
        ]);

        $response->assertStatus(200);
    }

    public function test_unauthenticated_user_cannot_access_settings(): void
    {
        $this->getJson('/api/v1/owner/settings')->assertStatus(401);
        $this->putJson('/api/v1/owner/settings')->assertStatus(401);
    }

    public function test_returns_403_without_store(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user)->getJson('/api/v1/owner/settings')->assertStatus(403);
    }
}
