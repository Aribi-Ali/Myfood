<?php

namespace Tests\Feature\Api;

use App\Models\Category;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StoreTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_approved_stores(): void
    {
        Store::factory()->count(3)->create(['is_approved' => true]);
        Store::factory()->create(['is_approved' => false]);

        $response = $this->getJson('/api/v1/stores');

        $response->assertStatus(200);
        $response->assertJsonCount(3, 'data.stores');
    }

    public function test_can_show_store_by_alias(): void
    {
        $store = Store::factory()->create(['is_approved' => true]);

        $response = $this->getJson("/api/v1/stores/{$store->alias}");

        $response->assertStatus(200);
        $response->assertJsonPath('data.store.alias', $store->alias);
    }

    public function test_returns_404_for_unapproved_store(): void
    {
        $store = Store::factory()->create(['is_approved' => false]);

        $response = $this->getJson("/api/v1/stores/{$store->alias}");

        $response->assertStatus(404);
    }

    public function test_returns_404_for_nonexistent_store(): void
    {
        $response = $this->getJson('/api/v1/stores/nonexistent');

        $response->assertStatus(404);
    }

    public function test_can_search_stores(): void
    {
        Store::factory()->create(['name' => 'Pizza Roma', 'is_approved' => true]);
        Store::factory()->create(['name' => 'Burger King', 'is_approved' => true]);

        $response = $this->getJson('/api/v1/search?query=Pizza');

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data.stores');
    }

    public function test_can_list_store_foods(): void
    {
        $store = Store::factory()->create(['is_approved' => true]);

        $response = $this->getJson("/api/v1/stores/{$store->alias}/foods");

        $response->assertStatus(200);
    }

    public function test_unauthenticated_user_can_browse_stores(): void
    {
        $response = $this->getJson('/api/v1/stores');

        $response->assertStatus(200);
    }
}
