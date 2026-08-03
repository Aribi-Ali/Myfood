<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // ── Plan Features ──
        $features = [
            ['code' => 'store_profile',       'name' => 'Store Profile & Menu',     'icon' => 'Store'],
            ['code' => 'online_orders',        'name' => 'Online Orders',            'icon' => 'ClipboardList'],
            ['code' => 'delivery_zones',       'name' => 'Delivery Zones',           'icon' => 'Truck'],
            ['code' => 'payment_gateway',      'name' => 'Payment Gateway',          'icon' => 'CreditCard'],
            ['code' => 'sales_analytics',      'name' => 'Sales Analytics',          'icon' => 'TrendingUp'],
            ['code' => 'staff_management',     'name' => 'Staff Management',         'icon' => 'Users'],
            ['code' => 'chef_hiring',          'name' => 'Chef Hiring',              'icon' => 'ChefHat'],
            ['code' => 'reservations',         'name' => 'Table Reservations',       'icon' => 'CalendarClock'],
            ['code' => 'custom_domain',        'name' => 'Custom Domain',            'icon' => 'Globe'],
            ['code' => 'promo_codes',          'name' => 'Promo Codes',              'icon' => 'Percent'],
            ['code' => 'multiple_templates',   'name' => 'All Templates',            'icon' => 'Palette'],
            ['code' => 'priority_support',     'name' => 'Priority Support',         'icon' => 'Shield'],
        ];

        $featureIds = [];
        foreach ($features as $f) {
            $featureIds[$f['code']] = DB::table('plan_features')->insertGetId([
                'code' => $f['code'],
                'name' => $f['name'],
                'icon' => $f['icon'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // ── Plans ──
        $plan1Id = DB::table('plans')->insertGetId([
            'name'       => 'Menu Only',
            'slug'       => 'menu-only',
            'description'=> 'Basic store profile and menu listing',
            'sort_order' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $plan2Id = DB::table('plans')->insertGetId([
            'name'       => 'Menu + Online Orders',
            'slug'       => 'menu-plus-online',
            'description'=> 'Full online ordering and management suite',
            'sort_order' => 2,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // ── Feature Assignments ──
        // Plan 1 (Menu Only): only store_profile
        DB::table('plan_feature_assignments')->insert([
            'plan_id' => $plan1Id,
            'plan_feature_id' => $featureIds['store_profile'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Plan 2 (Menu+Online): all features
        foreach ($featureIds as $featureId) {
            DB::table('plan_feature_assignments')->insert([
                'plan_id' => $plan2Id,
                'plan_feature_id' => $featureId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // ── Plan Tiers ──
        // Plan 1: Menu Only (4 tiers)
        $tierData = [
            // plan_id, name, min_orders, max_orders, monthly_price, sort_order
            [$plan1Id, 'Starter',    0,    99,   1500.00, 1],
            [$plan1Id, 'Growth',     100,  499,  2500.00, 2],
            [$plan1Id, 'Pro',        500,  999,  4500.00, 3],
            [$plan1Id, 'Enterprise', 1000, null, 8000.00, 4],
            // Plan 2: Menu + Online Orders (4 tiers)
            [$plan2Id, 'Starter',    0,    99,   3000.00,  1],
            [$plan2Id, 'Growth',     100,  499,  5000.00,  2],
            [$plan2Id, 'Pro',        500,  999,  8500.00,  3],
            [$plan2Id, 'Enterprise', 1000, null, 15000.00, 4],
        ];

        $tierIds = [];
        foreach ($tierData as $i => $t) {
            $tierIds[$i + 1] = DB::table('plan_tiers')->insertGetId([
                'plan_id'      => $t[0],
                'name'         => $t[1],
                'min_orders'   => $t[2],
                'max_orders'   => $t[3],
                'monthly_price'=> $t[4],
                'sort_order'   => $t[5],
                'created_at'   => now(),
                'updated_at'   => now(),
            ]);
        }

        // ── Duration Offers (for each tier 1-8) ──
        $durationOffers = [
            ['months' => 3,  'discount_percent' => 10.00, 'discount_label' => 'Save 10%', 'is_popular' => false],
            ['months' => 6,  'discount_percent' => 20.00, 'discount_label' => 'Save 20%', 'is_popular' => true],
            ['months' => 12, 'discount_percent' => 35.00, 'discount_label' => 'Save 35%', 'is_popular' => false],
        ];

        foreach ($tierIds as $tierId) {
            foreach ($durationOffers as $offer) {
                DB::table('plan_duration_offers')->insert([
                    'plan_tier_id'    => $tierId,
                    'months'          => $offer['months'],
                    'discount_percent'=> $offer['discount_percent'],
                    'discount_label'  => $offer['discount_label'],
                    'is_popular'      => $offer['is_popular'],
                    'is_active'       => true,
                    'created_at'      => now(),
                    'updated_at'      => now(),
                ]);
            }
        }

        // ── Payment Gateways ──
        $gateways = [
            [
                'code' => 'satim',
                'name' => 'SATIM',
                'is_active' => true,
                'config' => json_encode(['mode' => 'test', 'merchant_id' => null, 'api_key' => null]),
            ],
            [
                'code' => 'cash',
                'name' => 'Cash (Office)',
                'is_active' => true,
                'config' => json_encode(['notes' => 'Collect at physical office location']),
            ],
            [
                'code' => 'bank_transfer',
                'name' => 'Bank Transfer',
                'is_active' => true,
                'config' => json_encode(['bank_name' => null, 'account_number' => null, 'iban' => null]),
            ],
            [
                'code' => 'stripe',
                'name' => 'Stripe',
                'is_active' => false,
                'config' => json_encode(['publishable_key' => null, 'secret_key' => null, 'webhook_secret' => null]),
            ],
        ];

        foreach ($gateways as $gw) {
            DB::table('payment_gateways')->insert([
                'code'       => $gw['code'],
                'name'       => $gw['name'],
                'is_active'  => $gw['is_active'],
                'config'     => $gw['config'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // ── Delivery Pricing Tiers ──
        $deliveryTiers = [
            // Commission model
            ['model_type' => 'commission',   'name' => 'Bronze',   'tier_level' => 1, 'min_monthly_orders' => 0,    'max_monthly_orders' => 49,   'commission_percent' => 20.00, 'sort_order' => 1],
            ['model_type' => 'commission',   'name' => 'Silver',   'tier_level' => 2, 'min_monthly_orders' => 50,   'max_monthly_orders' => 199,  'commission_percent' => 15.00, 'sort_order' => 2],
            ['model_type' => 'commission',   'name' => 'Gold',     'tier_level' => 3, 'min_monthly_orders' => 200,  'max_monthly_orders' => 499,  'commission_percent' => 10.00, 'sort_order' => 3],
            ['model_type' => 'commission',   'name' => 'Platinum', 'tier_level' => 4, 'min_monthly_orders' => 500,  'max_monthly_orders' => null, 'commission_percent' => 5.00,  'sort_order' => 4],
            // Flat fee model
            ['model_type' => 'flat_fee',     'name' => 'Bronze',   'tier_level' => 1, 'min_monthly_orders' => 0,    'max_monthly_orders' => 49,   'flat_fee_per_delivery' => 20.00, 'sort_order' => 5],
            ['model_type' => 'flat_fee',     'name' => 'Silver',   'tier_level' => 2, 'min_monthly_orders' => 50,   'max_monthly_orders' => 199,  'flat_fee_per_delivery' => 15.00, 'sort_order' => 6],
            ['model_type' => 'flat_fee',     'name' => 'Gold',     'tier_level' => 3, 'min_monthly_orders' => 200,  'max_monthly_orders' => 499,  'flat_fee_per_delivery' => 10.00, 'sort_order' => 7],
            ['model_type' => 'flat_fee',     'name' => 'Platinum', 'tier_level' => 4, 'min_monthly_orders' => 500,  'max_monthly_orders' => null, 'flat_fee_per_delivery' => 5.00,  'sort_order' => 8],
            // Subscription model
            ['model_type' => 'subscription', 'name' => 'Unlimited','tier_level' => 1, 'min_monthly_orders' => 0,    'max_monthly_orders' => null, 'monthly_price' => 1500.00, 'max_deliveries' => null, 'sort_order' => 9],
        ];

        foreach ($deliveryTiers as $dt) {
            DB::table('delivery_pricing_tiers')->insert(array_merge($dt, [
                'is_active'  => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }

        // ── Settings ──
        $settings = [
            ['key' => 'subscription.trial_days',               'value' => '14',  'type' => 'integer'],
            ['key' => 'subscription.grace_days_existing',       'value' => '90',  'type' => 'integer'],
            ['key' => 'subscription.grace_days_failed_payment', 'value' => '7',   'type' => 'integer'],
            ['key' => 'subscription.cash_grace_days',           'value' => '15',  'type' => 'integer'],
            ['key' => 'subscription.suspension_days',           'value' => '30',  'type' => 'integer'],
            ['key' => 'subscription.currency',                  'value' => 'DZD', 'type' => 'string'],
            ['key' => 'subscription.tax_rate',                  'value' => '0',   'type' => 'float'],
            ['key' => 'subscription.tax_inclusive',             'value' => '1',   'type' => 'boolean'],
            ['key' => 'subscription.multi_store_discount',      'value' => '10',  'type' => 'float'],
            ['key' => 'delivery.models_enabled',                'value' => '["commission"]', 'type' => 'json'],
            ['key' => 'delivery.subscription_commission_reduction', 'value' => '50', 'type' => 'float'],
            ['key' => 'delivery.subscription_flat_fee_reduction',   'value' => '50', 'type' => 'float'],
        ];

        foreach ($settings as $s) {
            DB::table('settings')->updateOrInsert(
                ['key' => $s['key']],
                ['value' => $s['value'], 'type' => $s['type'], 'created_at' => now(), 'updated_at' => now()]
            );
        }
    }

    public function down(): void
    {
        // Delete seeded data in reverse order
        DB::table('settings')->where('key', 'like', 'subscription.%')->delete();
        DB::table('settings')->where('key', 'like', 'delivery.models_enabled')->delete();
        DB::table('settings')->where('key', 'like', 'delivery.subscription_commission_reduction')->delete();
        DB::table('settings')->where('key', 'like', 'delivery.subscription_flat_fee_reduction')->delete();

        DB::table('delivery_pricing_tiers')->delete();
        DB::table('payment_gateways')->delete();
        DB::table('plan_duration_offers')->delete();
        DB::table('plan_tiers')->delete();
        DB::table('plan_feature_assignments')->delete();
        DB::table('plans')->delete();
        DB::table('plan_features')->delete();
    }
};
