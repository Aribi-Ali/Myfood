<?php

namespace Tests\Feature\Api;

use App\Models\User;
use App\Models\Store;
use App\Models\Offer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OwnerOfferTest extends TestCase
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

    public function test_can_list_offers(): void
    {
        Offer::create([
            'store_id' => $this->store->id,
            'title' => 'Summer Sale',
            'description' => '20% off all pizzas',
            'valid_from' => now(),
            'valid_to' => now()->addDays(7),
            'active' => true,
        ]);

        $response = $this->actingAs($this->owner)->getJson('/api/v1/owner/offers');

        $response->assertStatus(200)
            ->assertJsonStructure(['data']);
    }

    public function test_can_create_offer(): void
    {
        $response = $this->actingAs($this->owner)->postJson('/api/v1/owner/offers', [
            'title' => 'New Year Special',
            'description' => 'Buy one get one free',
            'valid_from' => now()->toDateString(),
            'valid_to' => now()->addDays(7)->toDateString(),
            'active' => true,
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['data' => ['id', 'title', 'description']])
            ->assertJsonPath('data.title', 'New Year Special');

        $this->assertDatabaseHas('offers', [
            'store_id' => $this->store->id,
            'title' => 'New Year Special',
        ]);
    }

    public function test_can_update_offer(): void
    {
        $offer = Offer::create([
            'store_id' => $this->store->id,
            'title' => 'Old Offer',
            'description' => 'Old description',
            'active' => true,
        ]);

        $response = $this->actingAs($this->owner)->putJson("/api/v1/owner/offers/{$offer->id}", [
            'title' => 'Updated Offer',
            'description' => 'Updated description',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.title', 'Updated Offer');

        $this->assertDatabaseHas('offers', [
            'id' => $offer->id,
            'title' => 'Updated Offer',
        ]);
    }

    public function test_can_delete_offer(): void
    {
        $offer = Offer::create([
            'store_id' => $this->store->id,
            'title' => 'To Delete',
            'active' => true,
        ]);

        $response = $this->actingAs($this->owner)->deleteJson("/api/v1/owner/offers/{$offer->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('offers', ['id' => $offer->id]);
    }

    public function test_cannot_access_another_stores_offer(): void
    {
        $otherStore = Store::factory()->create();
        $offer = Offer::create([
            'store_id' => $otherStore->id,
            'title' => 'Other Offer',
            'active' => true,
        ]);

        $response = $this->actingAs($this->owner)->getJson("/api/v1/owner/offers/{$offer->id}");
        $response->assertStatus(404);
    }

    public function test_unauthenticated_user_cannot_access_offers(): void
    {
        $this->getJson('/api/v1/owner/offers')->assertStatus(401);
        $this->postJson('/api/v1/owner/offers')->assertStatus(401);
    }

    public function test_returns_403_without_store(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user)->getJson('/api/v1/owner/offers')->assertStatus(403);
    }
}
