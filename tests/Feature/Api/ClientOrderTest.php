<?php

namespace Tests\Feature\Api;

use App\Models\User;
use App\Models\Store;
use App\Models\Food;
use App\Models\Category;
use App\Models\PromoCode;
use App\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClientOrderTest extends TestCase
{
    use RefreshDatabase;

    private User $client;
    private Store $store;
    private Food $food;
    private Category $category;

    protected function setUp(): void
    {
        parent::setUp();

        $this->client = User::factory()->create();
        $owner = User::factory()->create();
        $this->store = Store::factory()->create(['owner_id' => $owner->id]);
        $this->category = Category::factory()->create();
        $this->food = Food::factory()->create([
            'store_id' => $this->store->id,
            'category_id' => $this->category->id,
            'price' => 1000,
        ]);
    }

    private function addToCart(int $quantity = 1): void
    {
        $this->actingAs($this->client)->postJson('/api/v1/client/cart/add', [
            'store_id' => $this->store->id,
            'food_id' => $this->food->id,
            'quantity' => $quantity,
        ]);
    }

    public function test_can_get_cart(): void
    {
        $response = $this->actingAs($this->client)->getJson('/api/v1/client/cart');
        $response->assertStatus(200)->assertJsonStructure(['data']);
    }

    public function test_can_add_to_cart(): void
    {
        $response = $this->actingAs($this->client)->postJson('/api/v1/client/cart/add', [
            'store_id' => $this->store->id,
            'food_id' => $this->food->id,
            'quantity' => 2,
        ]);
        $response->assertStatus(200);
    }

    public function test_can_update_cart_item(): void
    {
        $this->addToCart(1);
        $response = $this->actingAs($this->client)->postJson('/api/v1/client/cart/update', [
            'food_id' => $this->food->id,
            'quantity' => 3,
        ]);
        $response->assertStatus(200);
    }

    public function test_can_remove_from_cart(): void
    {
        $this->addToCart(1);
        $response = $this->actingAs($this->client)->postJson('/api/v1/client/cart/remove', [
            'food_id' => $this->food->id,
        ]);
        $response->assertStatus(200);
    }

    public function test_can_place_order_pickup(): void
    {
        $this->addToCart(2);
        $response = $this->actingAs($this->client)->postJson('/api/v1/client/orders', [
            'delivery_type' => 'pickup',
            'phone' => '0555123456',
            'notes' => 'Extra cheese please',
        ]);
        $response->assertStatus(201)->assertJsonStructure(['data' => ['id', 'status', 'total_amount']]);
        $response->assertJsonPath('data.status', 'pending');
        $response->assertJsonPath('data.delivery_type', 'pickup');
    }

    public function test_can_place_order_delivery(): void
    {
        $this->addToCart(1);
        $response = $this->actingAs($this->client)->postJson('/api/v1/client/orders', [
            'delivery_type' => 'delivery',
            'phone' => '0666777888',
            'address' => '123 Main St',
            'wilaya' => 'Algiers',
            'daira' => 'El Madania',
            'commune' => 'Bab Ezzouar',
            'notes' => 'Ring the bell',
        ]);
        $response->assertStatus(201);
        $response->assertJsonPath('data.delivery_type', 'delivery');

        $this->assertDatabaseHas('orders', [
            'store_id' => $this->store->id,
            'delivery_type' => 'delivery',
            'address' => '123 Main St',
            'phone' => '0666777888',
        ]);
    }

    public function test_requires_phone_for_order(): void
    {
        $this->addToCart(1);
        $response = $this->actingAs($this->client)->postJson('/api/v1/client/orders', [
            'delivery_type' => 'pickup',
        ]);
        $response->assertStatus(422);
    }

    public function test_cannot_order_with_empty_cart(): void
    {
        $response = $this->actingAs($this->client)->postJson('/api/v1/client/orders', [
            'delivery_type' => 'pickup',
            'phone' => '0555123456',
        ]);
        $response->assertStatus(400);
    }

    public function test_can_place_order_with_promo_code(): void
    {
        $promo = PromoCode::factory()->create([
            'store_id' => $this->store->id,
            'type' => 'percentage',
            'value' => 10,
            'is_active' => true,
        ]);

        $this->addToCart(2);

        $response = $this->actingAs($this->client)->postJson('/api/v1/client/orders', [
            'delivery_type' => 'pickup',
            'phone' => '0555123456',
            'promo_code' => $promo->code,
        ]);
        $response->assertStatus(201);

        $orderId = $response->json('data.id');
        $this->assertDatabaseHas('orders', [
            'id' => $orderId,
            'promo_code_id' => $promo->id,
        ]);
        $this->assertTrue($response->json('data.discount_amount') > 0);
    }

    public function test_rejects_invalid_promo_code(): void
    {
        $this->addToCart(1);
        $response = $this->actingAs($this->client)->postJson('/api/v1/client/orders', [
            'delivery_type' => 'pickup',
            'phone' => '0555123456',
            'promo_code' => 'INVALID123',
        ]);
        $response->assertStatus(400);
    }

    public function test_order_creates_order_items(): void
    {
        $this->addToCart(3);
        $response = $this->actingAs($this->client)->postJson('/api/v1/client/orders', [
            'delivery_type' => 'pickup',
            'phone' => '0555123456',
        ]);
        $response->assertStatus(201);

        $orderId = $response->json('data.id');
        $this->assertDatabaseHas('order_items', [
            'order_id' => $orderId,
            'food_id' => $this->food->id,
            'quantity' => 3,
        ]);
    }

    public function test_order_with_multiple_items(): void
    {
        $cheese = Food::factory()->create([
            'store_id' => $this->store->id,
            'category_id' => $this->category->id,
            'price' => 800,
            'name' => 'Cheese Pizza',
        ]);

        $this->actingAs($this->client)->postJson('/api/v1/client/cart/add', [
            'store_id' => $this->store->id,
            'food_id' => $this->food->id,
            'quantity' => 1,
        ]);
        $this->actingAs($this->client)->postJson('/api/v1/client/cart/add', [
            'store_id' => $this->store->id,
            'food_id' => $cheese->id,
            'quantity' => 2,
        ]);

        $response = $this->actingAs($this->client)->postJson('/api/v1/client/orders', [
            'delivery_type' => 'pickup',
            'phone' => '0555123456',
        ]);
        $response->assertStatus(201);

        $orderId = $response->json('data.id');
        $this->assertDatabaseCount('order_items', 2);
    }

    public function test_unauthenticated_user_cannot_access_cart(): void
    {
        $this->getJson('/api/v1/client/cart')->assertStatus(401);
        $this->postJson('/api/v1/client/orders')->assertStatus(401);
    }
}
