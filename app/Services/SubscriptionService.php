<?php

namespace App\Services;

use App\Models\PlanDurationOffer;
use App\Models\PlanTier;
use App\Models\Setting;
use App\Models\Store;
use App\Models\StoreSubscription;

class SubscriptionService
{
    /**
     * Create a trial subscription for a store.
     */
    public function createTrial(Store $store, PlanTier $tier): StoreSubscription
    {
        $settings = Setting::getAll();
        $trialDays = (int) ($settings['subscription.trial_days'] ?? 14);

        return StoreSubscription::create([
            'store_id'              => $store->id,
            'plan_tier_id'          => $tier->id,
            'status'                => 'trialing',
            'trial_ends_at'         => now()->addDays($trialDays),
            'start_date'            => now(),
            'end_date'              => now()->addDays($trialDays),
            'monthly_price_snapshot'=> (float) $tier->monthly_price,
            'current_period_orders' => 0,
            'auto_upgrade'          => true,
        ]);
    }

    /**
     * Change the plan/tier/offer on an existing subscription.
     */
    public function changePlan(StoreSubscription $sub, PlanTier $tier, ?PlanDurationOffer $offer = null): StoreSubscription
    {
        $price = $this->calculatePrice($tier, $offer);

        $sub->update([
            'plan_tier_id'          => $tier->id,
            'plan_duration_offer_id'=> $offer?->id,
            'monthly_price_snapshot'=> $price,
            'start_date'            => now(),
        ]);

        return $sub->fresh();
    }

    /**
     * Cancel a subscription.
     */
    public function cancel(StoreSubscription $sub): StoreSubscription
    {
        $sub->update([
            'status'       => 'cancelled',
            'cancelled_at' => now(),
            'end_date'     => now(), // immediate cancellation
        ]);

        return $sub->fresh();
    }

    /**
     * Process a renewal for a subscription: generates an invoice and extends the period.
     */
    public function processRenewal(StoreSubscription $sub): \App\Models\BillingInvoice
    {
        $settings = Setting::getAll();
        $taxRate = (float) ($settings['subscription.tax_rate'] ?? 0);
        $currency = $settings['subscription.currency'] ?? 'DZD';

        $price = (float) $sub->monthly_price_snapshot;
        $taxAmount = round($price * $taxRate / 100, 2);

        $invoice = app(BillingService::class)->generateInvoice($sub);

        // Extend the subscription period
        $sub->update([
            'status'   => 'active',
            'end_date' => now()->addMonth(),
        ]);

        // Check for tier upgrade
        $this->checkTierUpgrade($sub);

        return $invoice;
    }

    /**
     * Check if the subscription should auto-upgrade to a higher tier based on order volume.
     */
    public function checkTierUpgrade(StoreSubscription $sub): bool
    {
        if (!$sub->auto_upgrade) {
            return false;
        }

        $currentTier = $sub->planTier;
        if (!$currentTier) {
            return false;
        }

        $orders = $sub->current_period_orders;

        $nextTier = PlanTier::where('plan_id', $currentTier->plan_id)
            ->where('is_active', true)
            ->where('min_orders', '<=', $orders)
            ->where(function ($q) use ($orders) {
                $q->whereNull('max_orders')
                  ->orWhere('max_orders', '>=', $orders);
            })
            ->where('monthly_price', '>', $currentTier->monthly_price)
            ->orderBy('monthly_price', 'asc')
            ->first();

        if (!$nextTier) {
            return false;
        }

        $sub->update([
            'plan_tier_id'       => $nextTier->id,
            'monthly_price_snapshot' => (float) $nextTier->monthly_price,
            'last_tier_check_at' => now(),
        ]);

        return true;
    }

    /**
     * Calculate the final monthly price after duration discount.
     */
    public function calculatePrice(PlanTier $tier, ?PlanDurationOffer $offer = null): float
    {
        $settings = Setting::getAll();
        $basePrice = (float) $tier->monthly_price;
        $discount = 0;

        if ($offer) {
            $discount = $basePrice * ((float) $offer->discount_percent / 100);
        }

        return round($basePrice - $discount, 2);
    }

    /**
     * Get full price breakdown: base, discount, tax, total.
     */
    public function getEffectivePrice(PlanTier $tier, ?PlanDurationOffer $offer = null): array
    {
        $settings = Setting::getAll();
        $taxRate = (float) ($settings['subscription.tax_rate'] ?? 0);
        $taxInclusive = (bool) ($settings['subscription.tax_inclusive'] ?? true);

        $base = (float) $tier->monthly_price;
        $discount = 0;

        if ($offer) {
            $discount = round($base * ((float) $offer->discount_percent / 100), 2);
        }

        $afterDiscount = round($base - $discount, 2);
        $tax = round($afterDiscount * $taxRate / 100, 2);
        $total = $taxInclusive ? $afterDiscount : round($afterDiscount + $tax, 2);

        return [
            'base'     => $base,
            'discount' => $discount,
            'tax'      => $tax,
            'total'    => $total,
        ];
    }
}
