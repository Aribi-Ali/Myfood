<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\PlanTier;
use App\Models\StoreSubscription;
use App\Services\SubscriptionService;
use Illuminate\Console\Command;

class CheckSubscriptionTierUpgrades extends Command
{
    protected $signature = 'subscriptions:check-tier-upgrades';
    protected $description = 'Auto-upgrade subscriptions to higher tiers when order thresholds are exceeded';

    public function handle(): int
    {
        $subscriptions = StoreSubscription::where('auto_upgrade', true)
            ->whereIn('status', ['active', 'trialing'])
            ->get();

        if ($subscriptions->isEmpty()) {
            $this->info('No subscriptions eligible for tier upgrade check.');

            return Command::SUCCESS;
        }

        $upgraded = 0;

        foreach ($subscriptions as $sub) {
            try {
                $currentTier = $sub->planTier;

                if (!$currentTier) {
                    continue;
                }

                $orders = $sub->current_period_orders;

                if ($currentTier->max_orders !== null && $orders <= $currentTier->max_orders) {
                    continue;
                }

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
                    continue;
                }

                app(SubscriptionService::class)->checkTierUpgrade($sub);

                $upgraded++;
                $this->line("Subscription #{$sub->id} upgraded to tier '{$nextTier->name}'.");
            } catch (\Exception $e) {
                $this->error("Failed to check tier upgrade for subscription #{$sub->id}: {$e->getMessage()}");
            }
        }

        $this->info("Auto-upgraded {$upgraded} subscription(s).");

        return Command::SUCCESS;
    }
}
