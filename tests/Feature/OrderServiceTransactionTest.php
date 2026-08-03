<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Services\OrderService;
use App\Models\User;
use App\Models\Store;
use App\Models\Food;

class OrderServiceTransactionTest extends TestCase
{
  use RefreshDatabase;

  public function test_create_order_creates_items_and_order()
  {
    $user = User::factory()->create();
    $store = Store::factory()->create();

    $food = Food::factory()->create(['store_id' => $store->id, 'price' => 100]);

    $cart = [
      ['id' => $food->id, 'price' => 100, 'quantity' => 2],
    ];

    $orderData = [
      'delivery_type' => 'delivery',
      'pickup_time' => null,
      'address' => 'Some address',
      'phone' => '0555123456',
      'notes' => null,
      'latitude' => null,
      'longitude' => null,
      'discount_amount' => 0,
    ];

    $service = app(OrderService::class);
    $order = $service->createOrder($cart, $orderData, $user->id, $store->id, null);

    $this->assertDatabaseHas('orders', ['id' => $order->id, 'client_id' => $user->id, 'store_id' => $store->id]);
    $this->assertDatabaseHas('order_items', ['order_id' => $order->id, 'food_id' => $food->id, 'quantity' => 2]);
  }
}
