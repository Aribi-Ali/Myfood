<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\BillingInvoice;
use App\Models\Setting;
use App\Models\StoreSubscription;
use Illuminate\Console\Command;

class SuspendExpiredSubscriptions extends Command
{
    protected $signature = 'subscriptions:suspend-expired';
    protected $description = 'Suspend subscriptions that have been past due beyond the suspension period';

    public function handle(): int
    {
        $settings = Setting::getAll();
        $suspensionDays = (int) ($settings['subscription.suspension_days'] ?? 14);

        $subscriptions = StoreSubscription::where('status', 'past_due')
            ->whereDoesntHave('invoices', function ($q) {
                $q->where('status', 'paid');
            })
            ->get();

        if ($subscriptions->isEmpty()) {
            $this->info('No past-due subscriptions to evaluate.');

            return Command::SUCCESS;
        }

        $suspended = 0;

        foreach ($subscriptions as $sub) {
            $lastFailedInvoice = $sub->invoices()
                ->where('status', 'failed')
                ->latest('updated_at')
                ->first();

            if (!$lastFailedInvoice) {
                continue;
            }

            $daysPastDue = $lastFailedInvoice->updated_at->diffInDays(now());

            if ($daysPastDue > $suspensionDays) {
                $sub->update(['status' => 'suspended']);
                $this->line("Subscription #{$sub->id} suspended (past due for {$daysPastDue} days).");
                $suspended++;
            }
        }

        $this->info("Suspended {$suspended} subscription(s).");

        return Command::SUCCESS;
    }
}
