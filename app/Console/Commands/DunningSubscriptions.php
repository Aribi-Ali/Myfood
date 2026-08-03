<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\BillingInvoice;
use App\Models\Setting;
use Illuminate\Console\Command;

class DunningSubscriptions extends Command
{
    protected $signature = 'subscriptions:dunning';
    protected $description = 'Process dunning for failed invoices and suspend past-due subscriptions';

    public function handle(): int
    {
        $settings = Setting::getAll();
        $graceDays = (int) ($settings['subscription.grace_days_failed_payment'] ?? 7);
        $suspensionDays = (int) ($settings['subscription.suspension_days'] ?? 14);

        $failedInvoices = BillingInvoice::where('status', 'failed')
            ->whereNull('paid_at')
            ->get();

        if ($failedInvoices->isEmpty()) {
            $this->info('No failed invoices to process.');

            return Command::SUCCESS;
        }

        $reminders = 0;
        $suspended = 0;

        foreach ($failedInvoices as $invoice) {
            $subscription = $invoice->subscription;

            if (!$subscription) {
                continue;
            }

            $daysSinceFailure = $invoice->updated_at->diffInDays(now());

            if ($daysSinceFailure <= $graceDays) {
                $this->line("Reminder: Subscription #{$subscription->id} invoice #{$invoice->invoice_number} failed {$daysSinceFailure} day(s) ago.");
                $reminders++;
            } elseif ($daysSinceFailure <= $suspensionDays) {
                $this->line("Warning: Subscription #{$subscription->id} is {$daysSinceFailure} day(s) past due.");
                $reminders++;
            } else {
                $subscription->update(['status' => 'past_due']);
                $this->line("Suspended: Subscription #{$subscription->id} set to past_due.");
                $suspended++;
            }
        }

        $this->info("Sent {$reminders} reminder(s) and suspended {$suspended} subscription(s).");

        return Command::SUCCESS;
    }
}
