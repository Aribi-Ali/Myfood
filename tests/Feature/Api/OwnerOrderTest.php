<?php

namespace Tests\Feature\Api;

use App\Models\User;
use App\Models\Store;
use App\Models\Order;
use App\Models\Food;
use App\Models\OrderItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OwnerOrderTest extends TestCase
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

    public function test_can_list_orders(): void
    {
        $client = User::factory()->create();
        Order::factory()->count(3)->create([
            'store_id' => $this->store->id,
            'client_id' => $client->id,
        ]);

        $response = $this->actingAs($this->owner)->getJson('/api/v1/owner/orders');

        $response->assertStatus(200)
            ->assertJsonStructure(['data']);
    }

    public function test_can_update_order_status(): void
    {
        $client = User::factory()->create();
        $order = Order::factory()->create([
            'store_id' => $this->store->id,
            'client_id' => $client->id,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($this->owner)->putJson("/api/v1/owner/orders/{$order->id}/status", [
            'status' => 'confirmed',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => 'confirmed',
        ]);
    }

    public function test_can_assign_delivery(): void
    {
        $client = User::factory()->create();
        $deliveryPerson = User::factory()->create(['role' => 'delivery']);
        $order = Order::factory()->create([
            'store_id' => $this->store->id,
            'client_id' => $client->id,
            'status' => 'ready',
            'delivery_type' => 'delivery',
        ]);

        $response = $this->actingAs($this->owner)->postJson("/api/v1/owner/orders/{$order->id}/assign", [
            'delivery_id' => $deliveryPerson->id,
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'delivery_id' => $deliveryPerson->id,
        ]);
    }

    public function test_can_mark_delivered(): void
    {
        $client = User::factory()->create();
        $deliveryPerson = User::factory()->create();
        $order = Order::factory()->create([
            'store_id' => $this->store->id,
            'client_id' => $client->id,
            'delivery_id' => $deliveryPerson->id,
            'status' => 'delivering',
            'delivery_type' => 'delivery',
        ]);

        $response = $this->actingAs($this->owner)->putJson("/api/v1/owner/orders/{$order->id}/status", [
            'status' => 'delivered',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => 'delivered',
        ]);
    }

    public function test_can_bulk_update_status(): void
    {
        $client = User::factory()->create();
        $order1 = Order::factory()->create([
            'store_id' => $this->store->id,
            'client_id' => $client->id,
            'status' => 'pending',
        ]);
        $order2 = Order::factory()->create([
            'store_id' => $this->store->id,
            'client_id' => $client->id,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($this->owner)->postJson('/api/v1/owner/orders/bulk/status', [
            'order_ids' => [$order1->id, $order2->id],
            'status' => 'confirmed',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('orders', ['id' => $order1->id, 'status' => 'confirmed']);
        $this->assertDatabaseHas('orders', ['id' => $order2->id, 'status' => 'confirmed']);
    }

    public function test_unauthenticated_user_cannot_access_orders(): void
    {
        $this->getJson('/api/v1/owner/orders')->assertStatus(401);
        $this->postJson('/api/v1/owner/orders/bulk/status')->assertStatus(401);
    }

    public function test_returns_403_without_store(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user)->getJson('/api/v1/owner/orders')->assertStatus(403);
    }
}
