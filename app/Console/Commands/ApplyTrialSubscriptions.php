<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\StoreSubscription;
use Illuminate\Console\Command;

class ApplyTrialSubscriptions extends Command
{
    protected $signature = 'subscriptions:apply-trial';
    protected $description = 'Convert expired trial subscriptions to active';

    public function handle(): int
    {
        $subscriptions = StoreSubscription::where('status', 'trialing')
            ->where('trial_ends_at', '<', now())
            ->get();

        if ($subscriptions->isEmpty()) {
            $this->info('No expired trials to convert.');

            return Command::SUCCESS;
        }

        $converted = 0;

        foreach ($subscriptions as $sub) {
            try {
                $sub->update([
                    'status'     => 'active',
                    'start_date' => now(),
                    'end_date'   => now()->addMonth(),
                ]);

                $converted++;
            } catch (\Exception $e) {
                $this->error("Failed to convert trial #{$sub->id}: {$e->getMessage()}");
            }
        }

        $this->info("Converted {$converted} trial subscription(s) to active.");

        return Command::SUCCESS;
    }
}
