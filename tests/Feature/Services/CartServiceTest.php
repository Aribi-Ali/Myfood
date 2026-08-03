<?php

namespace Tests\Feature\Services;

use App\Models\Food;
use App\Models\PromoCode;
use App\Models\Store;
use App\Services\CartService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CartServiceTest extends TestCase
{
    use RefreshDatabase;

    protected CartService $cartService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->cartService = app(CartService::class);
    }

    public function test_add_to_cart_successfully(): void
    {
        $store = Store::factory()->create();
        $food = Food::factory()->create(['store_id' => $store->id]);
        $cart = [];

        $result = $this->cartService->addToCart($food->id, $store->id, $cart);

        $this->assertCount(1, $result);
        $this->assertEquals($food->id, $result[$food->id]['id']);
        $this->assertEquals($food->name, $result[$food->id]['name']);
        $this->assertEquals($food->effective_price, $result[$food->id]['price']);
        $this->assertEquals(1, $result[$food->id]['quantity']);
    }

    public function test_add_to_cart_fails_when_food_from_different_store(): void
    {
        $store1 = Store::factory()->create();
        $store2 = Store::factory()->create();
        $food = Food::factory()->create(['store_id' => $store2->id]);
        $cart = [];

        $result = $this->cartService->addToCart($food->id, $store1->id, $cart);

        $this->assertEmpty($result);
    }

    public function test_update_quantity_successfully(): void
    {
        $store = Store::factory()->create();
        $food = Food::factory()->create(['store_id' => $store->id]);
        $cart = [
            $food->id => [
                'id' => $food->id,
                'name' => $food->name,
                'price' => $food->effective_price,
                'quantity' => 1,
            ]
        ];

        $result = $this->cartService->updateQuantity($food->id, 3, $cart);

        $this->assertEquals(3, $result[$food->id]['quantity']);
    }

    public function test_update_quantity_removes_item_when_zero(): void
    {
        $store = Store::factory()->create();
        $food = Food::factory()->create(['store_id' => $store->id]);
        $cart = [
            $food->id => [
                'id' => $food->id,
                'name' => $food->name,
                'price' => $food->effective_price,
                'quantity' => 1,
            ]
        ];

        $result = $this->cartService->updateQuantity($food->id, 0, $cart);

        $this->assertEmpty($result);
    }

    public function test_remove_from_cart_successfully(): void
    {
        $store = Store::factory()->create();
        $food = Food::factory()->create(['store_id' => $store->id]);
        $cart = [
            $food->id => [
                'id' => $food->id,
                'name' => $food->name,
                'price' => $food->effective_price,
                'quantity' => 1,
            ]
        ];

        $result = $this->cartService->removeFromCart($food->id, $cart);

        $this->assertEmpty($result);
    }

    public function test_clear_cart_successfully(): void
    {
        $store = Store::factory()->create();
        $food = Food::factory()->create(['store_id' => $store->id]);
        $cart = [
            $food->id => [
                'id' => $food->id,
                'name' => $food->name,
                'price' => $food->effective_price,
                'quantity' => 1,
            ]
        ];

        $result = $this->cartService->clearCart($cart);

        $this->assertEmpty($result);
    }

    public function test_get_cart_total_calculates_correctly(): void
    {
        $store = Store::factory()->create();
        $food1 = Food::factory()->create(['store_id' => $store->id, 'price' => 10]);
        $food2 = Food::factory()->create(['store_id' => $store->id, 'price' => 20]);
        $cart = [
            $food1->id => [
                'id' => $food1->id,
                'name' => $food1->name,
                'price' => $food1->effective_price,
                'quantity' => 2,
            ],
            $food2->id => [
                'id' => $food2->id,
                'name' => $food2->name,
                'price' => $food2->effective_price,
                'quantity' => 1,
            ]
        ];

        $total = $this->cartService->getCartTotal($cart);

        $this->assertEquals(40, $total); // (10 * 2) + (20 * 1)
    }

    public function test_get_delivery_fee_calculates_correctly(): void
    {
        $this->assertEquals(200, $this->cartService->getDeliveryFee('delivery'));
        $this->assertEquals(0, $this->cartService->getDeliveryFee('pickup'));
    }

    public function test_get_order_total_calculates_correctly(): void
    {
        $cart = [
            'food1' => [
                'id' => 'food1',
                'name' => 'Food 1',
                'price' => 10,
                'quantity' => 2,
            ]
        ];
        $discountAmount = 5;
        $deliveryType = 'delivery';

        $total = $this->cartService->getOrderTotal($cart, $discountAmount, $deliveryType);

        $this->assertEquals(215, $total); // ((10 * 2) - 5) + 200
    }

    public function test_apply_promo_code_successfully(): void
    {
        $store = Store::factory()->create();
        $promoCode = PromoCode::factory()->create(['store_id' => $store->id, 'code' => 'TEST10', 'type' => 'percentage', 'value' => 10]);
        $cart = [
            'food1' => [
                'id' => 'food1',
                'name' => 'Food 1',
                'price' => 100,
                'quantity' => 1,
            ]
        ];

        $result = $this->cartService->applyPromoCode('TEST10', $cart, $store->id);

        $this->assertNotEmpty($result['appliedPromoCode']);
        $this->assertEquals($promoCode->id, $result['appliedPromoCode']['id']);
        $this->assertEquals(10, $result['discountAmount']); // 10% of 100
        $this->assertEmpty($result['error']);
    }

    public function test_apply_promo_code_fails_when_code_invalid(): void
    {
        $store = Store::factory()->create();
        $cart = [
            'food1' => [
                'id' => 'food1',
                'name' => 'Food 1',
                'price' => 100,
                'quantity' => 1,
            ]
        ];

        $result = $this->cartService->applyPromoCode('INVALID', $cart, $store->id);

        $this->assertNull($result['appliedPromoCode']);
        $this->assertEquals(0, $result['discountAmount']);
        $this->assertNotEmpty($result['error']);
    }

    public function test_recalculate_discount_successfully(): void
    {
        $store = Store::factory()->create();
        $promoCode = PromoCode::factory()->create(['store_id' => $store->id, 'code' => 'TEST10', 'type' => 'percentage', 'value' => 10]);
        $cart = [
            'food1' => [
                'id' => 'food1',
                'name' => 'Food 1',
                'price' => 100,
                'quantity' => 1,
            ]
        ];

        $result = $this->cartService->recalculateDiscount($cart, $promoCode);

        $this->assertEquals(10, $result['discountAmount']); // 10% of 100
    }

    public function test_recalculate_discount_returns_zero_when_no_promo(): void
    {
        $cart = [
            'food1' => [
                'id' => 'food1',
                'name' => 'Food 1',
                'price' => 100,
                'quantity' => 1,
            ]
        ];

        $result = $this->cartService->recalculateDiscount($cart, null);

        $this->assertEquals(0, $result['discountAmount']);
    }
}
