<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\ApiResponse;
use App\Models\StorePayout;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminPayoutController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'status' => 'nullable|in:pending,approved,rejected,paid',
            'store_id' => 'nullable|integer|exists:stores,id',
        ]);

        $query = StorePayout::with(['store:id,name,alias', 'approver:id,name']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('store_id')) {
            $query->where('store_id', $request->store_id);
        }

        $payouts = $query->orderByDesc('created_at')
            ->paginate(config('business.pagination.orders', 15));

        return $this->success($payouts);
    }

    public function approve(int $id): JsonResponse
    {
        $payout = StorePayout::findOrFail($id);

        if ($payout->status !== 'pending') {
            return $this->error('Payout is not pending.', 422);
        }

        $payout->update([
            'status' => 'approved',
            'approved_by' => Auth::id(),
            'approved_at' => now(),
        ]);

        return $this->success($payout->fresh()->load(['store', 'approver']), 200, 'Payout approved.');
    }

    public function reject(Request $request, int $id): JsonResponse
    {
        $payout = StorePayout::findOrFail($id);

        if ($payout->status !== 'pending') {
            return $this->error('Payout is not pending.', 422);
        }

        $validated = $request->validate([
            'notes' => 'nullable|string|max:500',
        ]);

        $payout->update([
            'status' => 'rejected',
            'notes' => $validated['notes'] ?? null,
            'approved_by' => Auth::id(),
        ]);

        return $this->success($payout->fresh()->load(['store', 'approver']), 200, 'Payout rejected.');
    }

    public function markPaid(int $id): JsonResponse
    {
        $payout = StorePayout::findOrFail($id);

        if ($payout->status !== 'approved') {
            return $this->error('Payout must be approved first.', 422);
        }

        $payout->update([
            'status' => 'paid',
            'paid_at' => now(),
        ]);

        return $this->success($payout->fresh(), 200, 'Payout marked as paid.');
    }

    public function stats(): JsonResponse
    {
        return $this->success([
            'total_pending' => StorePayout::where('status', 'pending')->sum('amount'),
            'total_approved' => StorePayout::where('status', 'approved')->sum('amount'),
            'total_paid' => StorePayout::where('status', 'paid')->sum('amount'),
            'pending_count' => StorePayout::where('status', 'pending')->count(),
        ]);
    }
}
