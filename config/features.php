<?php

declare(strict_types=1);

return [

    /*
    |--------------------------------------------------------------------------
    | Feature Flags
    |--------------------------------------------------------------------------
    |
    | Toggle features on/off without deploying code changes.
    | Used by App\Services\Feature and exposed via GET /api/v1/features.
    |
    */

    'chef_hiring' => env('FEATURE_CHEF_HIRING', true),

    'promo_codes' => env('FEATURE_PROMO_CODES', true),

    'reservations' => env('FEATURE_RESERVATIONS', true),

    'pre_orders' => env('FEATURE_PRE_ORDERS', false),

    'delivery_tracking' => env('FEATURE_DELIVERY_TRACKING', true),

    'banners' => env('FEATURE_BANNERS', true),

    'multi_currency' => env('FEATURE_MULTI_CURRENCY', true),

];
