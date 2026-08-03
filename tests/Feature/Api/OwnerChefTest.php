<?php

namespace Tests\Feature\Api;

use App\Models\User;
use App\Models\Store;
use App\Models\ChefProfile;
use App\Models\ChefStoreHire;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OwnerChefTest extends TestCase
{
    use RefreshDatabase;

    private User $owner;
    private Store $store;
    private User $chefUser;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->store = Store::factory()->create(['owner_id' => $this->owner->id]);
        $this->chefUser = User::factory()->create();
    }

    public function test_can_browse_available_chefs(): void
    {
        ChefProfile::create([
            'user_id' => $this->chefUser->id,
            'bio' => 'Experienced chef',
            'specialization' => 'Italian',
            'years_of_experience' => 5,
            'is_available' => true,
            'is_verified' => true,
        ]);

        $response = $this->actingAs($this->owner)->getJson('/api/v1/owner/chefs');

        $response->assertStatus(200)
            ->assertJsonStructure(['data']);
    }

    public function test_can_hire_chef(): void
    {
        ChefProfile::create([
            'user_id' => $this->chefUser->id,
            'bio' => 'Experienced chef',
            'specialization' => 'Italian',
            'years_of_experience' => 5,
            'is_available' => true,
            'is_verified' => true,
        ]);

        $response = $this->actingAs($this->owner)->postJson("/api/v1/owner/chefs/{$this->chefUser->id}/hire");

        $response->assertStatus(201);
    }

    public function test_can_list_hired_chefs(): void
    {
        $profile = ChefProfile::create([
            'user_id' => $this->chefUser->id,
            'bio' => 'Hired chef',
            'specialization' => 'Algerian',
            'years_of_experience' => 3,
            'is_available' => false,
            'is_verified' => true,
        ]);

        ChefStoreHire::create([
            'store_id' => $this->store->id,
            'chef_profile_id' => $profile->id,
            'hired_by' => $this->owner->id,
            'is_active' => true,
        ]);

        $response = $this->actingAs($this->owner)->getJson('/api/v1/owner/chefs/hired');

        $response->assertStatus(200)
            ->assertJsonStructure(['data']);
    }

    public function test_unauthenticated_user_cannot_access_chefs(): void
    {
        $this->getJson('/api/v1/owner/chefs')->assertStatus(401);
        $this->postJson('/api/v1/owner/chefs/1/hire')->assertStatus(401);
    }

    public function test_returns_403_without_store(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user)->getJson('/api/v1/owner/chefs')->assertStatus(403);
    }
}
