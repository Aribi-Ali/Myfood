<?php

namespace Tests\Feature\Api;

use App\Enums\Role;
use App\Models\DeliveryProfile;
use App\Models\Order;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DeliveryTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_view_pending_orders(): void
    {
        $store = Store::factory()->create();
        $delivery = User::factory()->create(['role' => Role::Delivery]);
        DeliveryProfile::factory()->create(['user_id' => $delivery->id]);
        Order::factory()->count(3)->create(['store_id' => $store->id, 'status' => 'ready', 'delivery_id' => null]);
        Order::factory()->create(['store_id' => $store->id, 'status' => 'pending']);

        $response = $this->actingAs($delivery)->getJson('/api/v1/delivery/pending');

        $response->assertStatus(200);
        $response->assertJsonCount(3, 'data');
    }

    public function test_can_accept_order(): void
    {
        $store = Store::factory()->create();
        $delivery = User::factory()->create(['role' => Role::Delivery]);
        DeliveryProfile::factory()->create(['user_id' => $delivery->id]);
        $order = Order::factory()->create(['store_id' => $store->id, 'status' => 'ready']);

        $response = $this->actingAs($delivery)->postJson("/api/v1/delivery/orders/{$order->id}/accept");

        $response->assertStatus(200);
        $this->assertEquals('delivering', $order->fresh()->status->value);
        $this->assertEquals($delivery->id, $order->fresh()->delivery_id);
    }

    public function test_can_complete_order(): void
    {
        $store = Store::factory()->create();
        $delivery = User::factory()->create(['role' => Role::Delivery]);
        DeliveryProfile::factory()->create(['user_id' => $delivery->id]);
        $order = Order::factory()->create([
            'store_id' => $store->id,
            'status' => 'delivering',
            'delivery_id' => $delivery->id,
        ]);

        $response = $this->actingAs($delivery)->postJson("/api/v1/delivery/orders/{$order->id}/complete");

        $response->assertStatus(200);
        $this->assertEquals('delivered', $order->fresh()->status->value);
    }

    public function test_can_toggle_working_status(): void
    {
        $delivery = User::factory()->create(['role' => Role::Delivery]);
        DeliveryProfile::factory()->create(['user_id' => $delivery->id, 'is_working' => false]);

        $response = $this->actingAs($delivery)->postJson('/api/v1/delivery/status');

        $response->assertStatus(200);
        $this->assertTrue($delivery->deliveryProfile->fresh()->is_working);
    }

    public function test_unauthenticated_user_cannot_access_delivery(): void
    {
        $response = $this->getJson('/api/v1/delivery/pending');

        $response->assertStatus(401);
    }
}
