<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\DeliveryPricingTier;
use App\Models\DeliveryProfile;
use Illuminate\Console\Command;

class CheckDeliveryTierUpgrades extends Command
{
    protected $signature = 'delivery:check-tier-upgrades';
    protected $description = 'Auto-upgrade delivery profiles to higher pricing tiers based on monthly order volume';

    public function handle(): int
    {
        $profiles = DeliveryProfile::whereNotNull('pricing_model')
            ->whereNotNull('current_tier_id')
            ->get();

        if ($profiles->isEmpty()) {
            $this->info('No delivery profiles eligible for tier upgrade.');

            return Command::SUCCESS;
        }

        $upgraded = 0;

        foreach ($profiles as $profile) {
            try {
                $currentTier = $profile->currentTier;

                if (!$currentTier) {
                    continue;
                }

                $currentOrders = (int) $profile->current_month_orders;

                if ($currentTier->max_monthly_orders !== null && $currentOrders <= $currentTier->max_monthly_orders) {
                    continue;
                }

                $applicableTier = DeliveryPricingTier::applicableForDelivery($currentOrders)->first();

                if (!$applicableTier || $applicableTier->id === $currentTier->id) {
                    continue;
                }

                $profile->update([
                    'current_tier_id' => $applicableTier->id,
                ]);

                $upgraded++;
                $this->line("Delivery profile #{$profile->id} upgraded to tier '{$applicableTier->name}'.");
            } catch (\Exception $e) {
                $this->error("Failed to check tier upgrade for profile #{$profile->id}: {$e->getMessage()}");
            }
        }

        $this->info("Upgraded {$upgraded} delivery profile(s).");

        return Command::SUCCESS;
    }
}
