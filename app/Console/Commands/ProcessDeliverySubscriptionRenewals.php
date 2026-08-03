<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\DeliverySubscription;
use Illuminate\Console\Command;

class ProcessDeliverySubscriptionRenewals extends Command
{
    protected $signature = 'delivery:process-subscription-renewals';
    protected $description = 'Renew or expire delivery subscriptions that have reached their end date';

    public function handle(): int
    {
        $subscriptions = DeliverySubscription::where('end_date', '<=', now())
            ->where('status', 'active')
            ->get();

        if ($subscriptions->isEmpty()) {
            $this->info('No delivery subscriptions to process.');

            return Command::SUCCESS;
        }

        $renewed = 0;
        $expired = 0;

        foreach ($subscriptions as $sub) {
            try {
                if ($sub->auto_renew) {
                    $durationOffer = $sub->durationOffer;
                    $months = $durationOffer ? (int) $durationOffer->months : 1;

                    $sub->update([
                        'start_date' => now(),
                        'end_date'   => now()->addMonths($months),
                    ]);

                    $renewed++;
                } else {
                    $sub->update(['status' => 'expired']);

                    if ($sub->profile) {
                        $sub->profile->update([
                            'pricing_model'   => null,
                            'current_tier_id' => null,
                        ]);
                    }

                    $expired++;
                }
            } catch (\Exception $e) {
                $this->error("Failed to process delivery subscription #{$sub->id}: {$e->getMessage()}");
            }
        }

        $this->info("Renewed {$renewed} and expired {$expired} delivery subscription(s).");

        return Command::SUCCESS;
    }
}
