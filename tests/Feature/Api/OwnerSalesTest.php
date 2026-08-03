<?php

namespace Tests\Feature\Api;

use App\Models\User;
use App\Models\Store;
use App\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OwnerSalesTest extends TestCase
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

    public function test_can_view_sales_stats(): void
    {
        $client = User::factory()->create();
        Order::factory()->create([
            'store_id' => $this->store->id,
            'client_id' => $client->id,
            'total_amount' => 2000,
            'commission_amount' => 200,
            'status' => 'delivered',
        ]);

        $response = $this->actingAs($this->owner)->getJson('/api/v1/owner/sales/stats');

        $response->assertStatus(200);
    }

    public function test_can_view_filtered_sales(): void
    {
        $client = User::factory()->create();
        Order::factory()->count(3)->create([
            'store_id' => $this->store->id,
            'client_id' => $client->id,
            'status' => 'delivered',
        ]);

        $response = $this->actingAs($this->owner)->getJson('/api/v1/owner/sales?per_page=10');

        $response->assertStatus(200)
            ->assertJsonStructure(['data']);
    }

    public function test_can_view_monthly_breakdown(): void
    {
        $client = User::factory()->create();
        Order::factory()->count(2)->create([
            'store_id' => $this->store->id,
            'client_id' => $client->id,
            'total_amount' => 1000,
            'commission_amount' => 100,
            'status' => 'delivered',
        ]);

        $response = $this->actingAs($this->owner)->getJson('/api/v1/owner/sales/monthly');

        $response->assertStatus(200);
    }

    public function test_can_view_yearly_breakdown(): void
    {
        $client = User::factory()->create();
        Order::factory()->create([
            'store_id' => $this->store->id,
            'client_id' => $client->id,
            'total_amount' => 5000,
            'commission_amount' => 500,
            'status' => 'delivered',
        ]);

        $response = $this->actingAs($this->owner)->getJson('/api/v1/owner/sales/yearly');

        $response->assertStatus(200);
    }

    public function test_can_view_today_stats(): void
    {
        $client = User::factory()->create();
        Order::factory()->create([
            'store_id' => $this->store->id,
            'client_id' => $client->id,
            'total_amount' => 1500,
            'commission_amount' => 150,
            'status' => 'delivered',
            'created_at' => now(),
        ]);

        $response = $this->actingAs($this->owner)->getJson('/api/v1/owner/sales/stats?period=today');

        $response->assertStatus(200);
    }

    public function test_unauthenticated_user_cannot_access_sales(): void
    {
        $this->getJson('/api/v1/owner/sales/stats')->assertStatus(401);
    }

    public function test_returns_403_without_store(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user)->getJson('/api/v1/owner/sales/stats')->assertStatus(403);
    }
}
