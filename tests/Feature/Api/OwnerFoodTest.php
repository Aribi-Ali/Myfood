<?php

namespace Tests\Feature\Api;

use App\Models\User;
use App\Models\Store;
use App\Models\Food;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OwnerFoodTest extends TestCase
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

    public function test_can_list_foods(): void
    {
        Food::factory()->count(3)->create(['store_id' => $this->store->id]);

        $response = $this->actingAs($this->owner)->getJson('/api/v1/owner/foods');

        $response->assertStatus(200)
            ->assertJsonStructure(['data'])
            ->assertJsonCount(3, 'data');
    }

    public function test_can_create_food(): void
    {
        $category = Category::factory()->create();

        $response = $this->actingAs($this->owner)->postJson('/api/v1/owner/foods', [
            'name' => 'Pizza Margherita',
            'description' => 'Classic tomato and mozzarella',
            'price' => 1200.00,
            'new_price' => null,
            'category_id' => $category->id,
            'cooking_time' => 15,
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['data' => ['id', 'name', 'price']])
            ->assertJsonPath('data.name', 'Pizza Margherita');

        $this->assertDatabaseHas('foods', [
            'store_id' => $this->store->id,
            'name' => 'Pizza Margherita',
        ]);
    }

    public function test_can_show_food(): void
    {
        $food = Food::factory()->create(['store_id' => $this->store->id]);

        $response = $this->actingAs($this->owner)->getJson("/api/v1/owner/foods/{$food->id}");

        $response->assertStatus(200)
            ->assertJsonStructure(['data' => ['id', 'name', 'price']])
            ->assertJsonPath('data.id', $food->id);
    }

    public function test_can_update_food(): void
    {
        $food = Food::factory()->create([
            'store_id' => $this->store->id,
            'name' => 'Old Name',
            'price' => 1000,
        ]);

        $response = $this->actingAs($this->owner)->putJson("/api/v1/owner/foods/{$food->id}", [
            'name' => 'Updated Name',
            'price' => 1500,
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.name', 'Updated Name')
            ->assertJsonPath('data.price', '1500.00');

        $this->assertDatabaseHas('foods', [
            'id' => $food->id,
            'name' => 'Updated Name',
        ]);
    }

    public function test_can_delete_food(): void
    {
        $food = Food::factory()->create(['store_id' => $this->store->id]);

        $response = $this->actingAs($this->owner)->deleteJson("/api/v1/owner/foods/{$food->id}");

        $response->assertStatus(200);

        $this->assertDatabaseMissing('foods', ['id' => $food->id]);
    }

    public function test_cannot_access_another_stores_food(): void
    {
        $otherStore = Store::factory()->create();
        $food = Food::factory()->create(['store_id' => $otherStore->id]);

        $response = $this->actingAs($this->owner)->getJson("/api/v1/owner/foods/{$food->id}");

        $response->assertStatus(404);
    }

    public function test_can_list_categories(): void
    {
        Category::factory()->count(2)->create();

        $response = $this->actingAs($this->owner)->getJson('/api/v1/owner/foods/categories');

        $response->assertStatus(200)
            ->assertJsonStructure(['data']);
    }

    public function test_unauthenticated_user_cannot_access_endpoints(): void
    {
        $this->getJson('/api/v1/owner/foods')->assertStatus(401);
        $this->postJson('/api/v1/owner/foods')->assertStatus(401);
    }

    public function test_returns_403_without_store(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->getJson('/api/v1/owner/foods')->assertStatus(403);
    }
}
