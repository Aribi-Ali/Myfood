<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Password;
use Tests\TestCase;

class AuthPasswordTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_send_password_reset_link(): void
    {
        $user = User::factory()->create(['email' => 'test@example.com']);

        $response = $this->postJson('/api/v1/forgot-password', [
            'email' => 'test@example.com',
        ]);

        $response->assertStatus(200);
    }

    public function test_cannot_send_reset_link_for_nonexistent_email(): void
    {
        $response = $this->postJson('/api/v1/forgot-password', [
            'email' => 'nonexistent@example.com',
        ]);

        $this->assertContains($response->status(), [400, 422, 500]);
    }

    public function test_can_get_current_user(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->getJson('/api/v1/user');

        $response->assertStatus(200)
            ->assertJson(['id' => $user->id, 'email' => $user->email]);
    }

    public function test_unauthenticated_user_can_access_forgot_password(): void
    {
        $response = $this->postJson('/api/v1/forgot-password', [
            'email' => 'test@example.com',
        ]);
        // Should not require auth
        $this->assertNotEquals(401, $response->status());
    }
}
