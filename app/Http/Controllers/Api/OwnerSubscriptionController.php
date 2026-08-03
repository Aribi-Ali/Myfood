<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BillingInvoice;
use App\Models\PaymentGateway;
use App\Models\PaymentMethod;
use App\Models\Plan;
use App\Models\PlanDurationOffer;
use App\Models\PlanTier;
use App\Services\SubscriptionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OwnerSubscriptionController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected SubscriptionService $subscriptionService,
    ) {}

    /**
     * Get the current store's subscription with plan, tier, and features.
     */
    public function show(Request $request): JsonResponse
    {
        $store = $request->user()->store;

        if (!$store) {
            return $this->error('No store found.', 404);
        }

        $subscription = $store->activeSubscription()->with([
            'planTier.plan.features',
            'planTier.activeDurationOffers',
            'durationOffer',
        ])->first();

        if (!$subscription) {
            return $this->success([
                'subscription' => null,
                'is_trialing'  => false,
                'features'     => [],
            ]);
        }

        $features = $subscription->planTier?->plan?->features ?? collect();

        return $this->success([
            'subscription' => $subscription,
            'is_trialing'  => $subscription->status === 'trialing',
            'features'     => $features,
        ]);
    }

    /**
     * List all active plans with tiers and duration offers (for the subscription selector UI).
     */
    public function plans(): JsonResponse
    {
        $plans = Plan::where('is_active', true)
            ->with([
                'features',
                'activeTiers' => fn ($q) => $q->with('activeDurationOffers'),
            ])
            ->orderBy('sort_order')
            ->get();

        return $this->success($plans);
    }

    /**
     * Change the store's plan/tier/offer.
     */
    public function change(Request $request): JsonResponse
    {
        $store = $request->user()->store;

        if (!$store) {
            return $this->error('No store found.', 404);
        }

        $data = $request->validate([
            'plan_tier_id'           => 'required|integer|exists:plan_tiers,id',
            'plan_duration_offer_id' => 'nullable|integer|exists:plan_duration_offers,id',
        ]);

        $tier = PlanTier::findOrFail($data['plan_tier_id']);
        $offer = null;

        if ($data['plan_duration_offer_id'] ?? null) {
            $offer = PlanDurationOffer::findOrFail($data['plan_duration_offer_id']);

            // Ensure the offer belongs to the selected tier
            if ($offer->plan_tier_id !== $tier->id) {
                return $this->error('Duration offer does not belong to the selected tier.', 422);
            }
        }

        $subscription = $store->activeSubscription;

        if (!$subscription) {
            // Create a new subscription (non-trial — owner is explicitly choosing)
            $subscription = $store->subscription()->create([
                'plan_tier_id'           => $tier->id,
                'plan_duration_offer_id' => $offer?->id,
                'status'                 => 'active',
                'start_date'             => now(),
                'end_date'               => now()->addMonth(),
                'monthly_price_snapshot' => $this->subscriptionService->calculatePrice($tier, $offer),
                'current_period_orders'  => 0,
                'auto_upgrade'           => true,
            ]);
        } else {
            $subscription = $this->subscriptionService->changePlan($subscription, $tier, $offer);
        }

        $subscription->load([
            'planTier.plan.features',
            'durationOffer',
        ]);

        return $this->success($subscription, 200, 'Subscription plan updated.');
    }

    /**
     * Invoice history for the store's subscription.
     */
    public function invoices(Request $request): JsonResponse
    {
        $store = $request->user()->store;

        if (!$store) {
            return $this->error('No store found.', 404);
        }

        $invoices = BillingInvoice::whereHas('subscription', fn ($q) => $q->where('store_id', $store->id))
            ->orderByDesc('created_at')
            ->paginate(20);

        return $this->success($invoices);
    }

    /**
     * Save a payment method for the store.
     */
    public function savePaymentMethod(Request $request): JsonResponse
    {
        $store = $request->user()->store;

        if (!$store) {
            return $this->error('No store found.', 404);
        }

        $data = $request->validate([
            'type'       => 'required|string|in:cash,bank_transfer,card,satim',
            'gateway_id' => 'required|integer|exists:payment_gateways,id',
            'details'    => 'nullable|array',
            'is_default' => 'nullable|boolean',
        ]);

        // Verify gateway is active
        $gateway = PaymentGateway::findOrFail($data['gateway_id']);
        if (!$gateway->is_active) {
            return $this->error('Payment gateway is not active.', 422);
        }

        $method = PaymentMethod::create([
            'store_id'   => $store->id,
            'gateway_id' => $gateway->id,
            'type'       => $data['type'],
            'details'    => $data['details'] ?? [],
            'is_default' => $data['is_default'] ?? false,
            'is_verified'=> $data['type'] === 'cash', // cash is auto-verified
        ]);

        // If set as default, unmark others
        if ($method->is_default) {
            PaymentMethod::where('store_id', $store->id)
                ->where('id', '!=', $method->id)
                ->update(['is_default' => false]);
        }

        return $this->success($method, 201, 'Payment method saved.');
    }

    /**
     * Trigger payment for a specific invoice.
     */
    public function payInvoice(Request $request, BillingInvoice $billingInvoice): JsonResponse
    {
        $store = $request->user()->store;

        if (!$store) {
            return $this->error('No store found.', 404);
        }

        // Verify the invoice belongs to this store
        if ($billingInvoice->subscription->store_id !== $store->id) {
            return $this->error('Invoice not found.', 404);
        }

        if (!in_array($billingInvoice->status, ['pending', 'pending_cash'])) {
            return $this->error('Invoice is not payable.', 422);
        }

        // Determine payment method type from the store's default payment method
        $defaultPayment = $store->activePaymentMethods()->where('is_default', true)->first();
        $methodType = $defaultPayment?->type ?? 'cash';

        if ($methodType === 'satim') {
            // Return payment redirect info for SATIM gateway
            return $this->success([
                'invoice'          => $billingInvoice,
                'payment_url'      => '#', // Would be real SATIM redirect URL in production
                'method'           => 'satim',
                'gateway_redirect' => true,
            ], 200, 'Redirecting to payment gateway...');
        }

        // For cash/bank transfer, mark as pending_cash
        $billingInvoice->update([
            'status'             => 'pending_cash',
            'payment_method_type'=> $methodType,
        ]);

        return $this->success($billingInvoice->fresh(), 200, 'Invoice marked for ' . $methodType . ' payment.');
    }
}
