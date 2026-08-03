<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\ApiResponse;
use App\Models\DeliveryPricingTier;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminDeliveryPricingController extends Controller
{
    use ApiResponse;

    public function settings(): JsonResponse
    {
        $all = Setting::getAll();

        return $this->success([
            'models_enabled'                   => json_decode($all['delivery.models_enabled'] ?? '["commission"]', true),
            'subscription_commission_reduction' => (float) ($all['delivery.subscription_commission_reduction'] ?? 50),
            'subscription_flat_fee_reduction'   => (float) ($all['delivery.subscription_flat_fee_reduction'] ?? 50),
        ]);
    }

    public function updateSettings(Request $request): JsonResponse
    {
        $data = $request->validate([
            'models_enabled'                   => 'nullable|json',
            'subscription_commission_reduction' => 'nullable|numeric|min:0|max:100',
            'subscription_flat_fee_reduction'   => 'nullable|numeric|min:0|max:100',
        ]);

        if (isset($data['models_enabled'])) {
            Setting::set('delivery.models_enabled', $data['models_enabled'], 'json');
        }
        if (isset($data['subscription_commission_reduction'])) {
            Setting::set('delivery.subscription_commission_reduction', (string) $data['subscription_commission_reduction'], 'float');
        }
        if (isset($data['subscription_flat_fee_reduction'])) {
            Setting::set('delivery.subscription_flat_fee_reduction', (string) $data['subscription_flat_fee_reduction'], 'float');
        }

        return $this->success($this->settings()->getData()->data, 200, 'Delivery pricing settings updated.');
    }

    public function tiers(): JsonResponse
    {
        $tiers = DeliveryPricingTier::orderBy('sort_order')->get();

        return $this->success($tiers);
    }

    public function storeTier(Request $request): JsonResponse
    {
        $data = $request->validate([
            'model_type'           => 'required|string|in:commission,flat_fee,subscription',
            'name'                 => 'required|string|max:255',
            'tier_level'           => 'nullable|integer|min:1',
            'min_monthly_orders'   => 'nullable|integer|min:0',
            'max_monthly_orders'   => 'nullable|integer|min:0',
            'commission_percent'   => 'nullable|numeric|min:0|max:100',
            'flat_fee_per_delivery'=> 'nullable|numeric|min:0',
            'monthly_price'        => 'nullable|numeric|min:0',
            'max_deliveries'       => 'nullable|integer|min:0',
            'is_active'            => 'nullable|boolean',
            'sort_order'           => 'nullable|integer|min:0',
        ]);

        $tier = DeliveryPricingTier::create($data);

        return $this->success($tier, 201, 'Delivery pricing tier created.');
    }

    public function updateTier(Request $request, DeliveryPricingTier $deliveryPricingTier): JsonResponse
    {
        $data = $request->validate([
            'model_type'           => 'sometimes|required|string|in:commission,flat_fee,subscription',
            'name'                 => 'sometimes|required|string|max:255',
            'tier_level'           => 'nullable|integer|min:1',
            'min_monthly_orders'   => 'nullable|integer|min:0',
            'max_monthly_orders'   => 'nullable|integer|min:0',
            'commission_percent'   => 'nullable|numeric|min:0|max:100',
            'flat_fee_per_delivery'=> 'nullable|numeric|min:0',
            'monthly_price'        => 'nullable|numeric|min:0',
            'max_deliveries'       => 'nullable|integer|min:0',
            'is_active'            => 'nullable|boolean',
            'sort_order'           => 'nullable|integer|min:0',
        ]);

        $deliveryPricingTier->update($data);

        return $this->success($deliveryPricingTier, 200, 'Delivery pricing tier updated.');
    }

    public function deleteTier(DeliveryPricingTier $deliveryPricingTier): JsonResponse
    {
        $deliveryPricingTier->delete();

        return $this->success(null, 200, 'Delivery pricing tier deleted.');
    }
}
