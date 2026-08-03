<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\DeliveryProfile;
use Illuminate\Console\Command;

class ResetDeliveryMonthlyOrders extends Command
{
    protected $signature = 'delivery:reset-monthly-orders {--keep-totals : Keep cumulative totals (earnings/fees) and only reset order count}';
    protected $description = 'Reset monthly order counters on delivery profiles';

    public function handle(): int
    {
        $keepTotals = (bool) $this->option('keep-totals');

        $profiles = DeliveryProfile::query();

        $profileCount = $profiles->count();

        if ($profileCount === 0) {
            $this->info('No delivery profiles found.');

            return Command::SUCCESS;
        }

        $updateData = ['current_month_orders' => 0];

        if (!$keepTotals) {
            $updateData['total_earnings'] = 0;
            $updateData['total_platform_fees'] = 0;
        }

        DeliveryProfile::query()->update($updateData);

        if ($keepTotals) {
            $this->info("Reset monthly orders for {$profileCount} delivery profile(s) (kept cumulative totals).");
        } else {
            $this->info("Reset monthly orders, earnings, and platform fees for {$profileCount} delivery profile(s).");
        }

        return Command::SUCCESS;
    }
}
