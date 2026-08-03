<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\StoreSubscription;
use App\Services\BillingService;
use Illuminate\Console\Command;

class ProcessSubscriptionRenewals extends Command
{
    protected $signature = 'subscriptions:process-renewals';
    protected $description = 'Renew active subscriptions that have reached their end date';

    public function handle(): int
    {
        $subscriptions = StoreSubscription::where('end_date', '<=', now())
            ->where('status', 'active')
            ->get();

        if ($subscriptions->isEmpty()) {
            $this->info('No subscriptions to renew.');

            return Command::SUCCESS;
        }

        $processed = 0;

        foreach ($subscriptions as $sub) {
            try {
                app(BillingService::class)->generateInvoice($sub);

                $sub->update([
                    'end_date' => now()->addMonth(),
                ]);

                $processed++;
            } catch (\Exception $e) {
                $this->error("Failed to renew subscription #{$sub->id}: {$e->getMessage()}");
            }
        }

        $this->info("Processed {$processed} subscription renewal(s).");

        return Command::SUCCESS;
    }
}
