<?php

namespace App\Services;

use App\Models\PlanFeature;
use App\Models\Store;
use Symfony\Component\HttpKernel\Exception\HttpException;

class FeatureGateService
{
    /**
     * Check whether a store has access to a given feature.
     *
     * Returns true if:
     * - The store is not subscription_managed (legacy stores have full access).
     * - The store has an active subscription and its plan includes the feature.
     */
    public function storeCan(Store $store, string $featureCode): bool
    {
        // Legacy stores without subscription management get all features
        if (!$store->is_subscription_managed) {
            return true;
        }

        $subscription = $store->activeSubscription;

        if (!$subscription || !$subscription->planTier || !$subscription->planTier->plan) {
            return false;
        }

        return $subscription->planTier->plan->features()
            ->where('plan_features.code', $featureCode)
            ->exists();
    }

    /**
     * Require that a store has access to a feature, throwing 403 if not.
     *
     * @throws HttpException
     */
    public function requireStoreCan(Store $store, string $featureCode): void
    {
        if (!$this->storeCan($store, $featureCode)) {
            throw new HttpException(403, "Your current subscription plan does not include the feature: {$featureCode}.");
        }
    }
}
