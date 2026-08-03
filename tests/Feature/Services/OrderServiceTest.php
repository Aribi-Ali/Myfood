<?php

namespace Tests\Feature\Services;

use App\Enums\OrderStatus;
use App\Models\Food;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Store;
use App\Models\User;
use App\Services\OrderService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderServiceTest extends TestCase
{
    use RefreshDatabase;

    protected OrderService $orderService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->orderService = app(OrderService::class);
    }

    public function test_create_order_successfully(): void
    {
        $client = User::factory()->create();
        $store = Store::factory()->create();
        $food = Food::factory()->create([
            'store_id' => $store->id,
            'price' => 10.00,
            'new_price' => null,
        ]);
        $cart = [
            $food->id => [
                'id' => $food->id,
                'name' => $food->name,
                'price' => $food->effective_price,
                'quantity' => 2,
            ]
        ];
        $orderData = [
            'delivery_type' => 'delivery',
            'pickup_time' => 'soon',
            'address' => '123 Main St',
            'phone' => '1234567890',
            'notes' => 'Test notes',
            'latitude' => 40.7128,
            'longitude' => -74.0060,
            'discount_amount' => 0,
        ];
        $promoCodeId = null;

        $order = $this->orderService->createOrder($cart, $orderData, $client->id, $store->id, $promoCodeId);

        $this->assertInstanceOf(Order::class, $order);
        $this->assertEquals($client->id, $order->client_id);
        $this->assertEquals($store->id, $order->store_id);
        $this->assertEquals(OrderStatus::Pending, $order->status);
        $this->assertEquals('delivery', $order->delivery_type);
        $this->assertEquals(220, $order->total_amount); // (10 * 2) + 200 delivery fee
        $this->assertEquals(2, $order->commission_amount); // 10% of 20 subtotal
        $this->assertEquals('123 Main St', $order->address);
        $this->assertEquals('1234567890', $order->phone);
        $this->assertEquals('Test notes', $order->notes);
        $this->assertEquals(40.7128, $order->latitude);
        $this->assertEquals(-74.0060, $order->longitude);
        $this->assertEquals(0, $order->discount_amount);
        $this->assertEquals(0, $order->promo_code_id);

        $this->assertCount(1, $order->items);
        $this->assertEquals($food->id, $order->items[0]->food_id);
        $this->assertEquals(2, $order->items[0]->quantity);
        $this->assertEquals($food->effective_price, $order->items[0]->price);
    }

    public function test_update_profile_if_needed_successfully(): void
    {
        $user = User::factory()->create();
        $orderData = [
            'save_to_profile' => true,
            'delivery_type' => 'delivery',
            'phone' => '1234567890',
            'address' => '123 Main St',
            'wilaya' => 'Algiers',
            'daira' => 'El Madania',
            'commune' => 'Bab Ezzouar',
            'latitude' => 40.7128,
            'longitude' => -74.0060,
        ];
        $profileData = [
            'phone' => '1234567890',
            'address' => '123 Main St',
            'wilaya' => 'Algiers',
            'daira' => 'El Madania',
            'commune' => 'Bab Ezzouar',
            'latitude' => 40.7128,
            'longitude' => -74.0060,
        ];

        $this->orderService->updateProfileIfNeeded($user, $orderData, $profileData);

        $this->assertEquals('1234567890', $user->phone);
        $this->assertEquals('123 Main St', $user->address);
        $this->assertEquals('Algiers', $user->wilaya);
        $this->assertEquals('El Madania', $user->daira);
        $this->assertEquals('Bab Ezzouar', $user->commune);
        $this->assertEquals(40.7128, $user->latitude);
        $this->assertEquals(-74.0060, $user->longitude);
    }

    public function test_update_profile_if_needed_does_not_update_when_not_checked(): void
    {
        $user = User::factory()->create();
        $orderData = [
            'save_to_profile' => false,
            'delivery_type' => 'delivery',
            'phone' => '1234567890',
            'address' => '123 Main St',
            'wilaya' => 'Algiers',
            'daira' => 'El Madania',
            'commune' => 'Bab Ezzouar',
            'latitude' => 40.7128,
            'longitude' => -74.0060,
        ];
        $profileData = [
            'phone' => '1234567890',
            'address' => '123 Main St',
            'wilaya' => 'Algiers',
            'daira' => 'El Madania',
            'commune' => 'Bab Ezzouar',
            'latitude' => 40.7128,
            'longitude' => -74.0060,
        ];

        $this->orderService->updateProfileIfNeeded($user, $orderData, $profileData);

        $this->assertNull($user->phone);
        $this->assertNull($user->address);
        $this->assertNull($user->wilaya);
        $this->assertNull($user->daira);
        $this->assertNull($user->commune);
        $this->assertNull($user->latitude);
        $this->assertNull($user->longitude);
    }

    public function test_can_submit_review_successfully(): void
    {
        $client = User::factory()->create();
        $store = Store::factory()->create();
        $food = Food::factory()->create(['store_id' => $store->id]);
        $order = Order::factory()->create([
            'client_id' => $client->id,
            'store_id' => $store->id,
            'status' => 'delivered',
            'phone' => '0555000000',
        ]);
        OrderItem::factory()->create(['order_id' => $order->id, 'food_id' => $food->id]);

        $canSubmit = $this->orderService->canSubmitReview($client->id, $store->id);

        $this->assertTrue($canSubmit);
    }

    public function test_can_submit_review_returns_false_when_not_delivered(): void
    {
        $client = User::factory()->create();
        $store = Store::factory()->create();
        $food = Food::factory()->create(['store_id' => $store->id]);
        $order = Order::factory()->create([
            'client_id' => $client->id,
            'store_id' => $store->id,
            'status' => 'pending',
            'phone' => '0555000000',
        ]);
        OrderItem::factory()->create(['order_id' => $order->id, 'food_id' => $food->id]);

        $canSubmit = $this->orderService->canSubmitReview($client->id, $store->id);

        $this->assertFalse($canSubmit);
    }
}
