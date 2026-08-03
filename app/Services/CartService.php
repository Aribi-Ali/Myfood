<?php

namespace App\Services;

use App\Models\Food;
use App\Models\PromoCode;
use Illuminate\Support\Facades\Session;

class CartService
{
    public function addToCart(int $foodId, int $storeId, array $cart): array
    {
        $food = Food::findOrFail($foodId);
        if ($food->store_id !== $storeId) {
            return $cart; // Can only order from this store
        }

        $price = $food->effective_price;

        if (isset($cart[$foodId])) {
            $cart[$foodId]['quantity']++;
        } else {
            $cart[$foodId] = [
                'id' => $food->id,
                'name' => $food->name,
                'price' => $price,
                'quantity' => 1,
            ];
        }

        return $cart;
    }

    public function updateQuantity(int $foodId, int $qty, array $cart): array
    {
        if (isset($cart[$foodId])) {
            if ($qty <= 0) {
                unset($cart[$foodId]);
            } else {
                $cart[$foodId]['quantity'] = intval($qty);
            }
        }
        return $cart;
    }

    public function removeFromCart(int $foodId, array $cart): array
    {
        if (isset($cart[$foodId])) {
            unset($cart[$foodId]);
        }
        return $cart;
    }

    public function clearCart(array $cart): array
    {
        return [];
    }

    public function saveCart(array $cart, int $storeId): void
    {
        Session::put('cart_' . $storeId, $cart);
    }

    public function getCartTotal(array $cart): float
    {
        return array_sum(array_map(function ($item) {
            return $item['price'] * $item['quantity'];
        }, $cart));
    }

    public function getDeliveryFee(string $deliveryType): int
    {
        return $deliveryType === 'delivery' ? 200 : 0;
    }

    public function getOrderTotal(array $cart, float $discountAmount, string $deliveryType): float
    {
        $subtotal = $this->getCartTotal($cart);
        $deliveryFee = $this->getDeliveryFee($deliveryType);
        return max(0, $subtotal - $discountAmount) + $deliveryFee;
    }

    public function applyPromoCode(string $code, array $cart, int $storeId): array
    {
        $result = ['appliedPromoCode' => null, 'discountAmount' => 0.00, 'error' => ''];

        $code = trim(strtoupper($code));
        if (empty($code)) {
            $result['error'] = 'Veuillez saisir un code promo.';
            return $result;
        }

        $promo = PromoCode::where('code', $code)->first();

        if (!$promo) {
            $result['error'] = 'Code promo invalide.';
            return $result;
        }

        if (!$promo->isValidForStore($storeId)) {
            $result['error'] = 'Ce code promo est expiré ou inapplicable à ce restaurant.';
            return $result;
        }

        $subtotal = $this->getCartTotal($cart);
        if ($subtotal <= 0) {
            $result['error'] = 'Votre panier est vide.';
            return $result;
        }

        $result['appliedPromoCode'] = $promo;
        $result['discountAmount'] = $promo->calculateDiscount($subtotal);

        return $result;
    }

    public function recalculateDiscount(array $cart, ?PromoCode $appliedPromoCode): array
    {
        $result = ['discountAmount' => 0.00];

        if ($appliedPromoCode) {
            $subtotal = $this->getCartTotal($cart);
            if ($subtotal > 0) {
                $result['discountAmount'] = $appliedPromoCode->calculateDiscount($subtotal);
            }
        }

        return $result;
    }
}
