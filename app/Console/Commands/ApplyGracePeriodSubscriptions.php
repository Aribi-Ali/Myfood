<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\PlanTier;
use App\Models\Setting;
use App\Models\Store;
use App\Models\StoreSubscription;
use Illuminate\Console\Command;

class ApplyGracePeriodSubscriptions extends Command
{
    protected $signature = 'subscriptions:apply-grace-period {--days= : Number of trial days}';
    protected $description = 'Create trial subscriptions for stores without one';

    public function handle(): int
    {
        $settings = Setting::getAll();
        $days = (int) ($this->option('days') ?? $settings['subscription.trial_days'] ?? 90);

        $defaultTier = PlanTier::where('is_active', true)
            ->orderBy('sort_order')
            ->first();

        if (!$defaultTier) {
            $this->error('No active default plan tier found. Please seed plans first.');

            return Command::FAILURE;
        }

        $stores = Store::whereDoesntHave('subscription')->get();

        if ($stores->isEmpty()) {
            $this->info('All stores already have a subscription.');

            return Command::SUCCESS;
        }

        $affected = 0;

        foreach ($stores as $store) {
            try {
                StoreSubscription::create([
                    'store_id'               => $store->id,
                    'plan_tier_id'           => $defaultTier->id,
                    'status'                 => 'trialing',
                    'trial_ends_at'          => now()->addDays($days),
                    'start_date'             => now(),
                    'end_date'               => now()->addDays($days),
                    'monthly_price_snapshot' => (float) $defaultTier->monthly_price,
                    'current_period_orders'  => 0,
                    'auto_upgrade'           => true,
                ]);

                $affected++;
            } catch (\Exception $e) {
                $this->error("Failed to create subscription for store #{$store->id}: {$e->getMessage()}");
            }
        }

        $this->info("Created trial subscriptions for {$affected} store(s).");

        return Command::SUCCESS;
    }
}
