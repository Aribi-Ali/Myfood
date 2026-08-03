<?php

namespace Tests\Feature\Api;

use App\Models\User;
use App\Models\Store;
use App\Models\StoreStaff;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OwnerStaffTest extends TestCase
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

    public function test_can_list_staff(): void
    {
        $staffUser = User::factory()->create();
        StoreStaff::create([
            'store_id' => $this->store->id,
            'user_id' => $staffUser->id,
            'store_role' => 'manager',
            'display_on_profile' => true,
        ]);

        $response = $this->actingAs($this->owner)->getJson('/api/v1/owner/staff');

        $response->assertStatus(200)
            ->assertJsonStructure(['data']);
    }

    public function test_can_create_staff(): void
    {
        $staffUser = User::factory()->create();

        $response = $this->actingAs($this->owner)->postJson('/api/v1/owner/staff', [
            'user_id' => $staffUser->id,
            'store_role' => 'cook',
            'display_on_profile' => true,
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['data' => ['id', 'store_role']]);

        $this->assertDatabaseHas('store_staff', [
            'store_id' => $this->store->id,
            'user_id' => $staffUser->id,
            'store_role' => 'cook',
        ]);
    }

    public function test_can_update_staff(): void
    {
        $staffUser = User::factory()->create();
        $staff = StoreStaff::create([
            'store_id' => $this->store->id,
            'user_id' => $staffUser->id,
            'store_role' => 'cashier',
            'display_on_profile' => false,
        ]);

        $response = $this->actingAs($this->owner)->putJson("/api/v1/owner/staff/{$staff->id}", [
            'store_role' => 'manager',
            'display_on_profile' => true,
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('store_staff', [
            'id' => $staff->id,
            'store_role' => 'manager',
        ]);
    }

    public function test_can_delete_staff(): void
    {
        $staffUser = User::factory()->create();
        $staff = StoreStaff::create([
            'store_id' => $this->store->id,
            'user_id' => $staffUser->id,
            'store_role' => 'cashier',
        ]);

        $response = $this->actingAs($this->owner)->deleteJson("/api/v1/owner/staff/{$staff->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('store_staff', ['id' => $staff->id]);
    }

    public function test_unauthenticated_user_cannot_access_staff(): void
    {
        $this->getJson('/api/v1/owner/staff')->assertStatus(401);
        $this->postJson('/api/v1/owner/staff')->assertStatus(401);
    }

    public function test_returns_403_without_store(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user)->getJson('/api/v1/owner/staff')->assertStatus(403);
    }
}
