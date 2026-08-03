<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderService
{
    /**
     * Create a new order inside a DB transaction.
     */
    public function createOrder(
        array $cart,
        array $orderData,
        int $clientId,
        int $storeId,
        ?int $promoCodeId = null
    ): Order {
        $deliveryFee   = $orderData['delivery_type'] === 'delivery'
            ? config('business.delivery_fee', 200)
            : 0;
        $commission    = config('business.commission_percentage', 0.10);

        $subtotal      = $this->calculateSubtotal($cart);
        $discountAmt   = (float) ($orderData['discount_amount'] ?? 0);
        $taxableAmount = max(0.0, $subtotal - $discountAmt);
        $total         = $taxableAmount + $deliveryFee;
        $commissionAmt = $taxableAmount * $commission;

        return DB::transaction(function () use (
            $cart, $orderData, $clientId, $storeId,
            $promoCodeId, $total, $commissionAmt, $discountAmt
        ) {
            $order = Order::create([
                'client_id'         => $clientId,
                'store_id'          => $storeId,
                'status'            => OrderStatus::Pending->value,
                'delivery_type'     => $orderData['delivery_type'],
                'pickup_time'       => $orderData['pickup_time'] ?? null,
                'total_amount'      => $total,
                'commission_amount' => $commissionAmt,
                'address'           => $orderData['address'] ?? null,
                'phone'             => $orderData['phone'] ?? null,
                'notes'             => $orderData['notes'] ?? null,
                'latitude'          => $orderData['latitude'] ?? null,
                'longitude'         => $orderData['longitude'] ?? null,
                'promo_code_id'     => $promoCodeId,
                'discount_amount'   => $discountAmt,
            ]);

            foreach ($cart as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'food_id'  => $item['id'],
                    'quantity' => $item['quantity'],
                    'price'    => $item['price'],
                ]);
            }

            $order->load('items');

            Log::info('Order created', [
                'order_id'     => $order->id,
                'client_id'    => $clientId,
                'store_id'     => $storeId,
                'total_amount' => $total,
            ]);

            return $order;
        });
    }

    /**
     * Optionally save address/phone back to the user's profile.
     */
    public function updateProfileIfNeeded(User $user, array $orderData, array $profileData): void
    {
        if (!($orderData['save_to_profile'] ?? false)) {
            return;
        }

        $updateData = ['phone' => $profileData['phone']];

        if ($orderData['delivery_type'] === 'delivery') {
            $updateData['address']   = $profileData['address'];
            $updateData['wilaya']    = $profileData['wilaya'];
            $updateData['daira']     = $profileData['daira'];
            $updateData['commune']   = $profileData['commune'];
            $updateData['latitude']  = $profileData['latitude'] ?? null;
            $updateData['longitude'] = $profileData['longitude'] ?? null;
        }

        $user->update($updateData);
    }

    /**
     * Check whether a client has at least one delivered order for a store,
     * which is required before leaving a review.
     */
    public function canSubmitReview(int $clientId, int $storeId): bool
    {
        return Order::where('client_id', $clientId)
            ->where('store_id', $storeId)
            ->where('status', OrderStatus::Delivered->value)
            ->exists();
    }

    // -------------------------------------------------------------------------

    private function calculateSubtotal(array $cart): float
    {
        return (float) array_sum(
            array_map(fn ($item) => $item['price'] * $item['quantity'], $cart)
        );
    }
}
