<?php

namespace Tests\Feature\Api;

use App\Models\User;
use App\Models\Store;
use App\Models\Badge;
use App\Models\Category;
use App\Enums\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminDashboardTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create(['role' => Role::Admin]);
    }

    public function test_admin_can_view_stats(): void
    {
        $response = $this->actingAs($this->admin)->getJson('/api/v1/admin/stats');

        $response->assertStatus(200);
    }

    public function test_admin_can_view_chart(): void
    {
        $response = $this->actingAs($this->admin)->getJson('/api/v1/admin/stats/chart');

        $response->assertStatus(200);
    }

    public function test_admin_can_list_stores(): void
    {
        Store::factory()->count(2)->create();

        $response = $this->actingAs($this->admin)->getJson('/api/v1/admin/stores');

        $response->assertStatus(200)
            ->assertJsonStructure(['data']);
    }

    public function test_admin_can_approve_store(): void
    {
        $owner = User::factory()->create();
        $store = Store::factory()->create(['owner_id' => $owner->id, 'is_approved' => false]);

        $response = $this->actingAs($this->admin)->postJson("/api/v1/admin/stores/{$store->id}/approve");

        $response->assertStatus(200);
        $this->assertDatabaseHas('stores', ['id' => $store->id, 'is_approved' => true]);
    }

    public function test_admin_can_list_categories(): void
    {
        Category::factory()->count(2)->create();

        $response = $this->actingAs($this->admin)->getJson('/api/v1/admin/categories');

        $response->assertStatus(200)
            ->assertJsonStructure(['data']);
    }

    public function test_admin_can_create_category(): void
    {
        $response = $this->actingAs($this->admin)->postJson('/api/v1/admin/categories', [
            'name' => 'Pizza',
            'short_description' => 'All kinds of pizza',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('categories', ['name' => 'Pizza']);
    }

    public function test_admin_can_list_badges(): void
    {
        Badge::create(['name' => 'Top Rated', 'description' => 'Highest rated store', 'color_code' => '#ff0000']);

        $response = $this->actingAs($this->admin)->getJson('/api/v1/admin/badges');

        $response->assertStatus(200)
            ->assertJsonStructure(['data']);
    }

    public function test_admin_can_create_badge(): void
    {
        $response = $this->actingAs($this->admin)->postJson('/api/v1/admin/badges', [
            'name' => 'Fast Delivery',
            'description' => 'Delivers within 30 min',
            'color' => '#00ff00',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('badges', ['name' => 'Fast Delivery']);
    }

    public function test_admin_can_list_chef_profiles(): void
    {
        $response = $this->actingAs($this->admin)->getJson('/api/v1/admin/chefs');

        $response->assertStatus(200)
            ->assertJsonStructure(['data']);
    }

    public function test_admin_can_list_complaints(): void
    {
        $response = $this->actingAs($this->admin)->getJson('/api/v1/admin/complaints');

        $response->assertStatus(200)
            ->assertJsonStructure(['data']);
    }

    public function test_admin_can_view_settings(): void
    {
        $response = $this->actingAs($this->admin)->getJson('/api/v1/admin/settings');

        $response->assertStatus(200);
    }

    public function test_admin_can_update_settings(): void
    {
        $response = $this->actingAs($this->admin)->putJson('/api/v1/admin/settings', [
            'commission_percentage' => 0.15,
            'delivery_fee' => 250,
        ]);

        $response->assertStatus(200);
    }

    public function test_non_admin_cannot_access_admin_endpoints(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user)->getJson('/api/v1/admin/stats')->assertStatus(403);
    }

    public function test_unauthenticated_user_cannot_access_admin_endpoints(): void
    {
        $this->getJson('/api/v1/admin/stats')->assertStatus(401);
    }
}
