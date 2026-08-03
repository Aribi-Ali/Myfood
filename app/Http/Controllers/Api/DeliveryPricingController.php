<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DeliveryPricingTier;
use App\Models\DeliverySubscription;
use App\Models\PlanDurationOffer;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DeliveryPricingController extends Controller
{
    use ApiResponse;

    /**
     * Show current pricing model, tier, earnings, and subscription (if any).
     */
    public function show(Request $request): JsonResponse
    {
        $profile = $request->user()->deliveryProfile;

        if (!$profile) {
            return $this->error('Delivery profile not found.', 404);
        }

        $profile->load('currentTier', 'activeSubscription.tier');

        $settings = Setting::getAll();
        $modelsEnabled = json_decode($settings['delivery.models_enabled'] ?? '["commission"]', true);

        return $this->success([
            'pricing_model'               => $profile->pricing_model,
            'current_tier'                => $profile->currentTier,
            'applicable_tier'             => $profile->applicable_tier,
            'current_month_orders'        => $profile->current_month_orders,
            'total_earnings'              => $profile->total_earnings,
            'total_platform_fees'         => $profile->total_platform_fees,
            'net_earnings'                => max(0, (float) $profile->total_earnings - (float) $profile->total_platform_fees),
            'active_subscription'         => $profile->activeSubscription,
            'models_enabled'              => $modelsEnabled,
            'subscription_commission_reduction' => (float) ($settings['delivery.subscription_commission_reduction'] ?? 50),
            'subscription_flat_fee_reduction'   => (float) ($settings['delivery.subscription_flat_fee_reduction'] ?? 50),
        ]);
    }

    /**
     * List available pricing tiers by model type.
     */
    public function tiers(Request $request): JsonResponse
    {
        $request->validate([
            'model_type' => 'nullable|string|in:commission,flat_fee,subscription',
        ]);

        $query = DeliveryPricingTier::where('is_active', true);

        if ($request->filled('model_type')) {
            $query->where('model_type', $request->model_type);
        }

        $tiers = $query->orderBy('sort_order')->get();

        return $this->success($tiers);
    }

    /**
     * Choose a pricing model (commission, flat_fee, subscription, etc.).
     */
    public function chooseModel(Request $request): JsonResponse
    {
        $profile = $request->user()->deliveryProfile;

        if (!$profile) {
            return $this->error('Delivery profile not found.', 404);
        }

        $data = $request->validate([
            'pricing_model' => 'required|string|in:commission,flat_fee,subscription,commission_plus_subscription,flat_fee_plus_subscription',
        ]);

        $profile->update([
            'pricing_model' => $data['pricing_model'],
        ]);

        return $this->success([
            'pricing_model' => $profile->fresh()->pricing_model,
        ], 200, 'Pricing model updated.');
    }

    /**
     * Subscribe (or update) to a delivery subscription with a tier + optional duration offer.
     */
    public function subscribe(Request $request): JsonResponse
    {
        $profile = $request->user()->deliveryProfile;

        if (!$profile) {
            return $this->error('Delivery profile not found.', 404);
        }

        $data = $request->validate([
            'tier_id'           => 'required|integer|exists:delivery_pricing_tiers,id',
            'duration_offer_id' => 'nullable|integer|exists:plan_duration_offers,id',
        ]);

        $tier = DeliveryPricingTier::findOrFail($data['tier_id']);

        if ($tier->model_type !== 'subscription') {
            return $this->error('Selected tier is not a subscription model.', 422);
        }

        if (!$tier->is_active) {
            return $this->error('Selected tier is not active.', 422);
        }

        $offer = null;
        $price = (float) ($tier->monthly_price ?? 0);

        if ($data['duration_offer_id'] ?? null) {
            $offer = PlanDurationOffer::findOrFail($data['duration_offer_id']);
            $discount = $price * ((float) $offer->discount_percent / 100);
            $price = round($price - $discount, 2);
        }

        // Cancel any existing active subscription
        $profile->activeSubscription()?->update(['status' => 'cancelled', 'end_date' => now()]);

        // Create new subscription
        $subscription = DeliverySubscription::create([
            'delivery_profile_id'  => $profile->id,
            'tier_id'              => $tier->id,
            'duration_offer_id'    => $offer?->id,
            'start_date'           => now(),
            'end_date'             => now()->addMonth(),
            'status'               => 'active',
            'auto_renew'           => true,
            'monthly_price_snapshot'=> $price,
        ]);

        // Update profile's current tier
        $profile->update(['current_tier_id' => $tier->id]);

        $subscription->load('tier');

        return $this->success($subscription, 201, 'Delivery subscription activated.');
    }

    /**
     * Current month earnings breakdown.
     */
    public function earnings(Request $request): JsonResponse
    {
        $profile = $request->user()->deliveryProfile;

        if (!$profile) {
            return $this->error('Delivery profile not found.', 404);
        }

        $gross = (float) $profile->total_earnings;
        $fees = (float) $profile->total_platform_fees;
        $net = max(0, $gross - $fees);

        return $this->success([
            'current_month_orders' => $profile->current_month_orders,
            'gross_earnings'       => $gross,
            'platform_fees'        => $fees,
            'net_earnings'         => $net,
            'pricing_model'        => $profile->pricing_model,
            'current_tier'         => $profile->currentTier,
        ]);
    }

    /**
     * Monthly earnings history (from orders).
     */
    public function earningsHistory(Request $request): JsonResponse
    {
        $user = $request->user();
        $profile = $user->deliveryProfile;

        if (!$profile) {
            return $this->error('Delivery profile not found.', 404);
        }

        // Aggregate monthly earnings from completed delivery orders
        $history = \App\Models\Order::where('delivery_id', $user->id)
            ->where('status', \App\Enums\OrderStatus::Delivered)
            ->selectRaw("
                DATE_FORMAT(created_at, '%Y-%m') as month,
                COUNT(*) as total_orders,
                COALESCE(SUM(delivery_fee), 0) as gross_earnings,
                COALESCE(SUM(commission_amount), 0) as platform_fees
            ")
            ->groupBy('month')
            ->orderByDesc('month')
            ->limit(12)
            ->get()
            ->map(fn ($item) => [
                'month'          => $item->month,
                'total_orders'   => (int) $item->total_orders,
                'gross_earnings' => (float) $item->gross_earnings,
                'platform_fees'  => (float) $item->platform_fees,
                'net_earnings'   => max(0, (float) $item->gross_earnings - (float) $item->platform_fees),
            ]);

        return $this->success($history);
    }
}
