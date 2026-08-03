<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\ApiResponse;
use App\Models\BillingInvoice;
use App\Models\StoreSubscription;
use App\Services\BillingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminBillingController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected BillingService $billingService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'status' => 'nullable|in:pending,pending_cash,paid,failed,refunded,cancelled,void',
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);

        $query = BillingInvoice::with([
            'subscription.store:id,name,alias,owner_id',
            'subscription.store.owner:id,name',
            'paidBy:id,name',
        ]);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $invoices = $query->orderByDesc('created_at')
            ->paginate(min((int)$request->input('per_page', 20), 100));

        return $this->success($invoices);
    }

    public function markAsPaid(Request $request, BillingInvoice $billingInvoice): JsonResponse
    {
        $admin = $request->user();

        $invoice = $this->billingService->markAsPaid($billingInvoice, $admin, 'cash');

        return $this->success($invoice, 200, 'Invoice marked as paid.');
    }

    public function stats(): JsonResponse
    {
        $now = now();
        $monthStart = $now->copy()->startOfMonth();

        $activeSubscriptions = StoreSubscription::whereIn('status', ['active', 'trialing'])->count();
        $trialing = StoreSubscription::where('status', 'trialing')->count();
        $cancelled = StoreSubscription::where('status', 'cancelled')->count();
        $expired = StoreSubscription::where('status', 'expired')->count();

        $mrr = (float) StoreSubscription::whereIn('status', ['active', 'trialing'])
            ->sum('monthly_price_snapshot');

        $pendingInvoices = BillingInvoice::whereIn('status', ['pending', 'pending_cash'])->count();
        $overdueInvoices = BillingInvoice::where('status', 'pending')
            ->where('created_at', '<', $monthStart)
            ->count();

        $totalPaidThisMonth = (float) BillingInvoice::where('status', 'paid')
            ->where('paid_at', '>=', $monthStart)
            ->sum('total_amount');

        $totalPendingAmount = (float) BillingInvoice::whereIn('status', ['pending', 'pending_cash'])
            ->sum('total_amount');

        $churnRate = 0;
        $totalSubs = $activeSubscriptions + $cancelled + $expired;
        if ($totalSubs > 0) {
            $churnRate = round(($cancelled / $totalSubs) * 100, 2);
        }

        return $this->success([
            'active_subscriptions'  => $activeSubscriptions,
            'trialing'              => $trialing,
            'cancelled'             => $cancelled,
            'expired'               => $expired,
            'mrr'                   => $mrr,
            'mrr_formatted'         => number_format($mrr, 2) . ' DZD',
            'pending_invoices'      => $pendingInvoices,
            'overdue_invoices'      => $overdueInvoices,
            'total_paid_this_month' => $totalPaidThisMonth,
            'total_pending_amount'  => $totalPendingAmount,
            'churn_rate'            => $churnRate,
        ]);
    }
}
