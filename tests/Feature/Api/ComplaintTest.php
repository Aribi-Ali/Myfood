<?php

namespace Tests\Feature\Api;

use App\Models\Complaint;
use App\Models\Order;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ComplaintTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_submit_complaint(): void
    {
        $user = User::factory()->create();
        $store = Store::factory()->create();
        $order = Order::factory()->create([
            'client_id' => $user->id,
            'store_id' => $store->id,
            'status' => 'delivered',
        ]);

        $response = $this->actingAs($user)->postJson('/api/v1/complaints', [
            'store_id' => $store->id,
            'order_id' => $order->id,
            'subject' => 'Late delivery',
            'description' => 'My order arrived 2 hours late.',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('complaints', [
            'client_id' => $user->id,
            'subject' => 'Late delivery',
        ]);
    }

    public function test_subject_is_required(): void
    {
        $user = User::factory()->create();
        $store = Store::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/v1/complaints', [
            'store_id' => $store->id,
            'description' => 'Bad experience.',
        ]);

        $response->assertStatus(422);
    }

    public function test_unauthenticated_user_cannot_submit_complaint(): void
    {
        $response = $this->postJson('/api/v1/complaints', [
            'store_id' => 1,
            'subject' => 'Test',
        ]);

        $response->assertStatus(401);
    }
}
