<?php

namespace App\Services;

use App\Models\BillingInvoice;
use App\Models\Setting;
use App\Models\StoreSubscription;
use App\Models\User;
use Illuminate\Support\Str;

class BillingService
{
    /**
     * Generate an invoice for a subscription period.
     */
    public function generateInvoice(StoreSubscription $sub): BillingInvoice
    {
        $settings = Setting::getAll();
        $taxRate = (float) ($settings['subscription.tax_rate'] ?? 0);
        $currency = $settings['subscription.currency'] ?? 'DZD';

        $baseAmount = (float) $sub->monthly_price_snapshot;
        $durationOffer = $sub->durationOffer;
        $discountPercent = $durationOffer ? (float) $durationOffer->discount_percent : 0;
        $discountAmount = round($baseAmount * $discountPercent / 100, 2);
        $afterDiscount = round($baseAmount - $discountAmount, 2);
        $taxAmount = round($afterDiscount * $taxRate / 100, 2);
        $totalAmount = round($afterDiscount + $taxAmount, 2);

        $tier = $sub->planTier;
        $planName = $tier?->plan?->name ?? 'Unknown';
        $tierName = $tier?->name ?? 'Unknown';

        return BillingInvoice::create([
            'store_subscription_id' => $sub->id,
            'invoice_number'        => $this->generateInvoiceNumber($sub),
            'period_start'          => $sub->start_date,
            'period_end'            => $sub->end_date ?? now()->addMonth(),
            'total_orders'          => $sub->current_period_orders,
            'tier_applied'          => $tierName,
            'plan_name'             => $planName,
            'base_amount'           => $baseAmount,
            'discount_amount'       => $discountAmount,
            'tax_amount'            => $taxAmount,
            'total_amount'          => $totalAmount,
            'currency'              => $currency,
            'status'                => 'pending',
        ]);
    }

    /**
     * Mark an invoice as paid.
     */
    public function markAsPaid(BillingInvoice $invoice, User $admin, string $method = 'cash'): BillingInvoice
    {
        $invoice->update([
            'status'             => 'paid',
            'paid_at'            => now(),
            'paid_by_user_id'    => $admin->id,
            'payment_method_type'=> $method,
        ]);

        return $invoice->fresh();
    }

    /**
     * Mark an invoice as failed.
     */
    public function markAsFailed(BillingInvoice $invoice): BillingInvoice
    {
        $invoice->update([
            'status' => 'failed',
        ]);

        // TODO: trigger dunning process / notification

        return $invoice->fresh();
    }

    /**
     * Refund an invoice.
     */
    public function refund(BillingInvoice $invoice): BillingInvoice
    {
        $invoice->update([
            'status' => 'refunded',
        ]);

        return $invoice->fresh();
    }

    /**
     * Generate a unique invoice number.
     */
    protected function generateInvoiceNumber(StoreSubscription $sub): string
    {
        $prefix = 'INV';
        $storeId = $sub->store_id;
        $date = now()->format('Ymd');
        $random = strtoupper(Str::random(6));

        return "{$prefix}-{$storeId}-{$date}-{$random}";
    }
}
