<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Platform Commission
    |--------------------------------------------------------------------------
    | Percentage taken by the platform on each order subtotal (0.10 = 10%).
    */
    'commission_percentage' => (float) env('BUSINESS_COMMISSION', 0.10),

    /*
    |--------------------------------------------------------------------------
    | Delivery Fee
    |--------------------------------------------------------------------------
    | Flat delivery fee added to orders with delivery_type=delivery (in DA).
    */
    'delivery_fee' => (int) env('BUSINESS_DELIVERY_FEE', 200),

    /*
    |--------------------------------------------------------------------------
    | Order Statuses
    |--------------------------------------------------------------------------
    */
    'order_statuses' => [
        'pending',
        'confirmed',
        'preparing',
        'ready',
        'delivering',
        'delivered',
        'cancelled',
    ],

    /*
    |--------------------------------------------------------------------------
    | Feature Flags
    |--------------------------------------------------------------------------
    */
    'features' => [
        'chef_hiring'       => env('FEATURE_CHEF_HIRING', true),
        'promo_codes'       => env('FEATURE_PROMO_CODES', true),
        'reservations'      => env('FEATURE_RESERVATIONS', true),
        'reviews'           => env('FEATURE_REVIEWS', true),
        'zone_delivery'     => env('FEATURE_ZONE_DELIVERY', false),
        'notifications_push'=> env('FEATURE_PUSH_NOTIFICATIONS', false),
    ],

    /*
    |--------------------------------------------------------------------------
    | Pagination Sizes
    |--------------------------------------------------------------------------
    */
    'pagination' => [
        'orders'  => 15,
        'foods'   => 20,
        'chefs'   => 12,
        'stores'  => 20,
        'reviews' => 10,
        'pos'     => 50,
    ],

    /*
    |--------------------------------------------------------------------------
    | File Upload Limits
    |--------------------------------------------------------------------------
    */
    'uploads' => [
        'max_image_kb'    => 5120,   // 5 MB
        'max_document_kb' => 5120,
        'allowed_images'  => ['jpeg', 'jpg', 'png', 'webp'],
        'allowed_docs'    => ['pdf', 'jpg', 'jpeg', 'png', 'webp'],
    ],

    /*
    |--------------------------------------------------------------------------
    | Cache TTLs (seconds)
    |--------------------------------------------------------------------------
    */
    /*
    |--------------------------------------------------------------------------
    | Fake domain verification (testing only – never enable in production)
    |--------------------------------------------------------------------------
    */
    'fake_domain_verification' => (bool) env('DOMAIN_FAKE_VERIFICATION', false),

    'cache' => [
        'categories'    => 3600,
        'stores_list'   => 1800,
        'store_detail'  => 900,
        'food_list'     => 600,
        'pending_orders'=> 30,
    ],

];
