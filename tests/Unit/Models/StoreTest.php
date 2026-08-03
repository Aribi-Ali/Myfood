<?php

namespace Tests\Unit\Models;

use App\Models\Store;
use App\Models\User;
use App\Models\Food;
use App\Models\Review;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StoreTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_store_with_minimal_data(): void
    {
        $owner = User::factory()->create();
        $store = Store::factory()->create([
            'owner_id' => $owner->id,
            'name' => 'Pizza Roma',
            'alias' => 'pizza-roma',
        ]);

        $this->assertDatabaseHas('stores', [
            'id' => $store->id,
            'name' => 'Pizza Roma',
            'alias' => 'pizza-roma',
            'owner_id' => $owner->id,
        ]);
    }

    public function test_opening_hours_are_stored_as_array(): void
    {
        $hours = [
            'monday'    => ['open' => '08:00', 'close' => '22:00', 'closed' => false],
            'tuesday'   => ['open' => '08:00', 'close' => '22:00', 'closed' => false],
            'wednesday' => ['open' => '08:00', 'close' => '22:00', 'closed' => false],
            'thursday'  => ['open' => '08:00', 'close' => '22:00', 'closed' => false],
            'friday'    => ['open' => '08:00', 'close' => '22:00', 'closed' => false],
            'saturday'  => ['open' => '09:00', 'close' => '23:00', 'closed' => false],
            'sunday'    => ['open' => '09:00', 'close' => '21:00', 'closed' => true],
        ];

        $store = Store::factory()->create(['opening_hours' => $hours]);

        $this->assertIsArray($store->opening_hours);
        $this->assertEquals('08:00', $store->opening_hours['monday']['open']);
        $this->assertEquals('22:00', $store->opening_hours['monday']['close']);
        $this->assertFalse($store->opening_hours['monday']['closed']);
        $this->assertTrue($store->opening_hours['sunday']['closed']);
    }

    public function test_is_on_break_returns_false_when_no_break_set(): void
    {
        $store = Store::factory()->create([
            'break_start' => null,
            'break_end' => null,
        ]);

        $this->assertFalse($store->isOnBreak());
    }

    public function test_is_on_break_returns_true_during_break(): void
    {
        $store = Store::factory()->create([
            'break_start' => now()->subHour(),
            'break_end' => now()->addHour(),
        ]);

        $this->assertTrue($store->isOnBreak());
    }

    public function test_is_on_break_returns_false_after_break(): void
    {
        $store = Store::factory()->create([
            'break_start' => now()->subDays(2),
            'break_end' => now()->subDays(1),
        ]);

        $this->assertFalse($store->isOnBreak());
    }

    public function test_is_effectively_open_requires_approved_active_and_not_on_break(): void
    {
        $store = Store::factory()->create([
            'is_approved' => true,
            'is_active' => true,
            'break_start' => null,
            'break_end' => null,
        ]);

        $this->assertTrue($store->isEffectivelyOpen());

        $store->is_approved = false;
        $this->assertFalse($store->isEffectivelyOpen());

        $store->is_approved = true;
        $store->is_active = false;
        $this->assertFalse($store->isEffectivelyOpen());

        $store->is_active = true;
        $store->break_start = now()->subHour();
        $store->break_end = now()->addHour();
        $this->assertFalse($store->isEffectivelyOpen());
    }

    public function test_average_rating_attribute_rounds_correctly(): void
    {
        $store = Store::factory()->create();

        Review::factory()->count(3)->create([
            'store_id' => $store->id,
            'rating' => 4,
        ]);

        $avg = $store->fresh()->average_rating;
        $this->assertEquals(4.0, $avg);
    }

    public function test_average_rating_returns_5_when_no_reviews(): void
    {
        $store = Store::factory()->create();

        $this->assertEquals(5.0, $store->average_rating);
    }

    public function test_average_rating_mixes_different_ratings(): void
    {
        $store = Store::factory()->create();

        Review::factory()->create(['store_id' => $store->id, 'rating' => 5]);
        Review::factory()->create(['store_id' => $store->id, 'rating' => 3]);
        Review::factory()->create(['store_id' => $store->id, 'rating' => 4]);

        $avg = $store->fresh()->average_rating;
        $this->assertEquals(4.0, $avg);
    }

    public function test_estimated_delivery_time_within_zone(): void
    {
        $store = Store::factory()->create([
            'avg_prep_time' => 20,
            'avg_delivery_time_per_km' => 3,
        ]);

        $eta = $store->getEstimatedDeliveryTime(5);
        $this->assertEquals(35, $eta);
    }

    public function test_delivery_fee_within_zone(): void
    {
        $store = Store::factory()->create([
            'base_delivery_fee' => 200,
            'delivery_zone_radius' => 5,
        ]);

        $fee = $store->getDeliveryFee(3);
        $this->assertEquals(200, $fee);
    }

    public function test_delivery_fee_outside_zone(): void
    {
        $store = Store::factory()->create([
            'base_delivery_fee' => 200,
            'delivery_zone_radius' => 5,
        ]);

        $fee = $store->getDeliveryFee(8);
        $this->assertEquals(350, $fee);
    }

    public function test_store_has_logo_path_when_set(): void
    {
        $store = Store::factory()->create([
            'logo_path' => 'stores/logos/test-logo.png',
        ]);

        $this->assertEquals('stores/logos/test-logo.png', $store->logo_path);
    }

    public function test_store_logo_is_null_by_default(): void
    {
        $store = Store::factory()->create();

        $this->assertNull($store->logo_path);
    }

    public function test_apply_client_filters_returns_approved_stores(): void
    {
        Store::factory()->create(['is_approved' => true, 'name' => 'Open Store']);
        Store::factory()->create(['is_approved' => false, 'name' => 'Hidden Store']);

        $results = Store::applyClientFilters()->get();

        $this->assertCount(1, $results);
        $this->assertEquals('Open Store', $results->first()->name);
    }

    public function test_apply_client_filters_with_search(): void
    {
        Store::factory()->create(['is_approved' => true, 'name' => 'Pizza Roma']);
        Store::factory()->create(['is_approved' => true, 'name' => 'Burger King']);

        $results = Store::applyClientFilters(null, 'Pizza')->get();

        $this->assertCount(1, $results);
        $this->assertEquals('Pizza Roma', $results->first()->name);
    }

    public function test_store_belongs_to_owner(): void
    {
        $owner = User::factory()->create();
        $store = Store::factory()->create(['owner_id' => $owner->id]);

        $this->assertTrue($store->owner->is($owner));
    }

    public function test_store_has_many_foods(): void
    {
        $store = Store::factory()->create();
        Food::factory()->count(3)->create(['store_id' => $store->id]);

        $this->assertCount(3, $store->foods);
    }

    public function test_store_has_many_reviews(): void
    {
        $store = Store::factory()->create();
        Review::factory()->count(5)->create(['store_id' => $store->id]);

        $this->assertCount(5, $store->reviews);
    }
}
