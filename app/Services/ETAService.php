<?php

namespace App\Services;

use App\Models\Store;
use App\Models\Order;

class ETAService
{
  /**
   * Calculate estimated delivery time in minutes.
   * Formula: store_prep_time + (distance_km * delivery_time_per_km)
   *
   * @param Store $store
   * @param float|null $distanceInKm Distance from store to delivery address (if null, uses zone radius)
   * @return int Estimated delivery time in minutes
   */
  public function calculateETA(Store $store, ?float $distanceInKm = null): int
  {
    // Use provided distance or default to zone radius
    $distance = $distanceInKm ?? $store->delivery_zone_radius;

    // Calculate delivery time based on distance
    $deliveryTime = (int) ceil($distance * ($store->avg_delivery_time_per_km ?? 3));

    // Total ETA = prep time + delivery time
    $prepTime = $store->avg_prep_time ?? 25;
    $totalETA = $prepTime + $deliveryTime;

    return max($totalETA, 15); // Minimum 15 minutes
  }

  /**
   * Calculate delivery fee based on distance.
   * For Algerian market: base_fee + surge pricing if outside zone.
   *
   * @param Store $store
   * @param float|null $distanceInKm
   * @return int Delivery fee in DZD
   */
  public function calculateDeliveryFee(Store $store, ?float $distanceInKm = null): int
  {
    $baseFee = $store->base_delivery_fee ?? 200; // Default 200 DA
    $distance = $distanceInKm ?? $store->delivery_zone_radius;
    $zoneRadius = $store->delivery_zone_radius ?? 5;

    // If distance exceeds zone radius, add extra fee (50 DA per km)
    if ($distance > $zoneRadius) {
      $surgeKm = $distance - $zoneRadius;
      $surchargeFee = (int) ceil($surgeKm * 50);
      return $baseFee + $surchargeFee;
    }

    return $baseFee;
  }

  /**
   * Get human-readable ETA string.
   * Examples: "25-30 mins", "~ 35 mins"
   *
   * @param Store $store
   * @param float|null $distanceInKm
   * @return string
   */
  public function getETALabel(Store $store, ?float $distanceInKm = null): string
  {
    $eta = $this->calculateETA($store, $distanceInKm);

    if ($eta <= 30) {
      return "~ {$eta} mins";
    } elseif ($eta <= 60) {
      $min = max($eta - 5, 15);
      return "{$min}-{$eta} mins";
    } else {
      $hours = (int) floor($eta / 60);
      $mins = $eta % 60;
      return "~ {$hours}h {$mins}m";
    }
  }

  /**
   * Attach ETA and delivery fee to an Order before it's placed.
   *
   * @param Order $order
   * @param Store $store
   * @param float|null $distanceInKm
   * @return void
   */
  public function attachETAToOrder(Order $order, Store $store, ?float $distanceInKm = null): void
  {
    $order->estimated_delivery_minutes = $this->calculateETA($store, $distanceInKm);
    $order->delivery_fee = $this->calculateDeliveryFee($store, $distanceInKm);

    // Optionally save if order already exists
    if ($order->exists) {
      $order->save();
    }
  }
}
