<?php

namespace Tests\Unit\Services;

use App\Models\Store;
use App\Services\ETAService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ETAServiceTest extends TestCase
{
  use RefreshDatabase;

  private ETAService $etaService;

  protected function setUp(): void
  {
    parent::setUp();
    $this->etaService = app(ETAService::class);
  }

  /**
   * Test ETA calculation with default store values.
   */
  public function test_calculate_eta_with_defaults()
  {
    $store = Store::factory()->create([
      'avg_prep_time' => 25,
      'delivery_zone_radius' => 5,
      'avg_delivery_time_per_km' => 3,
    ]);

    // Distance = 5 km (zone radius), so ETA = 25 (prep) + 15 (delivery) = 40 mins
    $eta = $this->etaService->calculateETA($store, 5);
    $this->assertEquals(40, $eta);
  }

  /**
   * Test ETA calculation with custom distance within zone.
   */
  public function test_calculate_eta_within_zone()
  {
    $store = Store::factory()->create([
      'avg_prep_time' => 20,
      'avg_delivery_time_per_km' => 3,
    ]);

    // Distance = 2 km, ETA = 20 + 6 = 26 mins
    $eta = $this->etaService->calculateETA($store, 2);
    $this->assertEquals(26, $eta);
  }

  /**
   * Test ETA never goes below minimum 15 minutes.
   */
  public function test_calculate_eta_minimum()
  {
    $store = Store::factory()->create([
      'avg_prep_time' => 10,
      'avg_delivery_time_per_km' => 2,
    ]);

    $eta = $this->etaService->calculateETA($store, 1);
    $this->assertGreaterThanOrEqual(15, $eta);
  }

  /**
   * Test delivery fee calculation within zone.
   */
  public function test_calculate_delivery_fee_within_zone()
  {
    $store = Store::factory()->create([
      'base_delivery_fee' => 200,
      'delivery_zone_radius' => 5,
    ]);

    $fee = $this->etaService->calculateDeliveryFee($store, 3);
    $this->assertEquals(200, $fee); // Base fee only
  }

  /**
   * Test delivery fee surge pricing outside zone.
   */
  public function test_calculate_delivery_fee_outside_zone()
  {
    $store = Store::factory()->create([
      'base_delivery_fee' => 200,
      'delivery_zone_radius' => 5,
    ]);

    // Distance = 7 km, outside by 2 km, surge = 2 * 50 = 100, total = 300 DA
    $fee = $this->etaService->calculateDeliveryFee($store, 7);
    $this->assertEquals(300, $fee);
  }

  /**
   * Test ETA label formatting.
   */
  public function test_get_eta_label()
  {
    $store = Store::factory()->create([
      'avg_prep_time' => 25,
      'avg_delivery_time_per_km' => 3,
    ]);

    $label = $this->etaService->getETALabel($store, 2);
    $this->assertStringContainsString('mins', $label);
  }
}
