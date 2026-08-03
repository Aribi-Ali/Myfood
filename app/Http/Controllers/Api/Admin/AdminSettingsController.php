<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\ApiResponse;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class AdminSettingsController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        return $this->success(Setting::getAll());
    }

    public function update(Request $request): JsonResponse
    {
        $data = $request->validate([
            'commission_percentage' => 'nullable|numeric|min:0|max:100',
            'delivery_fee'          => 'nullable|numeric|min:0',
            'chef_hiring_enabled'   => 'nullable|boolean',
            'promo_codes_enabled'   => 'nullable|boolean',
            'reservations_enabled'  => 'nullable|boolean',
            'reviews_enabled'       => 'nullable|boolean',
            'zone_delivery_enabled' => 'nullable|boolean',
            'notifications_push_enabled' => 'nullable|boolean',
            'orders_per_page'       => 'nullable|integer|min:1',
            'foods_per_page'        => 'nullable|integer|min:1',
            'stores_per_page'       => 'nullable|integer|min:1',
            'default_locale'        => 'nullable|in:en,fr,ar',
            // Subscription settings
            'subscription.trial_days'               => 'nullable|integer|min:0|max:365',
            'subscription.grace_days_existing'       => 'nullable|integer|min:0|max:365',
            'subscription.grace_days_failed_payment' => 'nullable|integer|min:0|max:90',
            'subscription.cash_grace_days'           => 'nullable|integer|min:0|max:90',
            'subscription.suspension_days'           => 'nullable|integer|min:0|max:365',
            'subscription.currency'                  => 'nullable|string|size:3',
            'subscription.tax_rate'                  => 'nullable|numeric|min:0|max:100',
            'subscription.tax_inclusive'             => 'nullable|boolean',
            'subscription.multi_store_discount'      => 'nullable|numeric|min:0|max:100',
            // Delivery pricing settings
            'delivery.models_enabled'                => 'nullable|json',
            'delivery.subscription_commission_reduction' => 'nullable|numeric|min:0|max:100',
            'delivery.subscription_flat_fee_reduction'   => 'nullable|numeric|min:0|max:100',
        ]);

        foreach ($data as $key => $value) {
            $type = match (true) {
                is_bool($value)   => 'boolean',
                is_int($value)    => 'integer',
                is_float($value)  => 'float',
                is_string($value) => 'string',
                default           => 'string',
            };
            Setting::set($key, $value, $type);
        }

        return $this->success(Setting::getAll(), 200, 'Settings updated.');
    }

    public function clearCache(Request $request): JsonResponse
    {
        $type = $request->input('type', 'all');

        switch ($type) {
            case 'stores':
                Cache::forget('stores:approved:page_1');
                break;
            case 'categories':
                Cache::forget('categories');
                break;
            case 'foods':
                Cache::flush();
                break;
            case 'all':
            default:
                Cache::flush();
                break;
        }

        return $this->success(null, 200, 'Cache vidé (' . $type . ').');
    }
}
