<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_can_view_profile(): void
    {
        $response = $this->actingAs($this->user)->getJson('/api/v1/user');

        $response->assertStatus(200)
            ->assertJsonStructure(['id', 'name', 'email']);
    }

    public function test_can_update_profile(): void
    {
        $response = $this->actingAs($this->user)->putJson('/api/v1/user', [
            'name' => 'Updated Name',
            'phone' => '0777123456',
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('users', [
            'id' => $this->user->id,
            'name' => 'Updated Name',
        ]);
    }

    public function test_can_change_password(): void
    {
        $this->user->update(['password' => bcrypt('CurrentPass1')]);

        $response = $this->actingAs($this->user)->postJson('/api/v1/user/password', [
            'current_password' => 'CurrentPass1',
            'password' => 'NewPass123',
            'password_confirmation' => 'NewPass123',
        ]);

        $response->assertStatus(200);
    }

    public function test_cannot_change_password_with_wrong_current(): void
    {
        $this->user->update(['password' => bcrypt('CurrentPass1')]);

        $response = $this->actingAs($this->user)->postJson('/api/v1/user/password', [
            'current_password' => 'WrongPass1',
            'password' => 'NewPass123',
            'password_confirmation' => 'NewPass123',
        ]);

        $response->assertStatus(422);
    }

    public function test_can_view_order_history(): void
    {
        $response = $this->actingAs($this->user)->getJson('/api/v1/client/orders');

        $response->assertStatus(200)
            ->assertJsonStructure(['data']);
    }

    public function test_unauthenticated_user_cannot_access_profile(): void
    {
        $this->getJson('/api/v1/user')->assertStatus(401);
        $this->putJson('/api/v1/user')->assertStatus(401);
        $this->postJson('/api/v1/user/password')->assertStatus(401);
    }
}
