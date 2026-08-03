<?php

namespace Tests\Feature\Api;

use App\Models\PromoCode;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PromoCodeTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_validate_valid_promo_code(): void
    {
        $store = Store::factory()->create();
        $promo = PromoCode::factory()->create([
            'store_id' => $store->id,
            'type' => 'percentage',
            'value' => 10.00,
            'is_active' => true,
        ]);
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/v1/promo/validate', [
            'code' => $promo->code,
            'store_id' => $store->id,
            'subtotal' => 1000.00,
        ]);

        $response->assertStatus(200);
        $response->assertJsonPath('data.discount_amount', 100);
    }

    public function test_rejects_expired_promo_code(): void
    {
        $store = Store::factory()->create();
        $promo = PromoCode::factory()->create([
            'store_id' => $store->id,
            'is_active' => true,
            'expires_at' => now()->subDay(),
        ]);
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/v1/promo/validate', [
            'code' => $promo->code,
            'store_id' => $store->id,
            'subtotal' => 1000.00,
        ]);

        $response->assertStatus(404);
    }

    public function test_rejects_invalid_promo_code(): void
    {
        $user = User::factory()->create();
        $store = Store::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/v1/promo/validate', [
            'code' => 'INVALID',
            'store_id' => $store->id,
            'subtotal' => 1000.00,
        ]);

        $response->assertStatus(404);
    }

    public function test_unauthenticated_user_cannot_validate_promo(): void
    {
        $response = $this->postJson('/api/v1/promo/validate', [
            'code' => 'TEST',
            'store_id' => 1,
            'subtotal' => 1000.00,
        ]);

        $response->assertStatus(401);
    }
}
