<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\ApiResponse;
use App\Models\Complaint;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminComplaintController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'filter' => 'nullable|in:pending,in_review,resolved,all',
        ]);

        $filter = $request->input('filter', 'all');

        $query = Complaint::with([
            'client:id,name,email',
            'store:id,name,alias',
            'order:id',
        ]);

        if ($filter !== 'all') {
            $query->where('status', $filter);
        }

        $complaints = $query->orderByDesc('created_at')
            ->paginate(config('business.pagination.complaints', 20));

        return $this->success($complaints);
    }

    public function show(int $id): JsonResponse
    {
        $complaint = Complaint::with([
            'client:id,name,email,phone',
            'store:id,name,alias,phone',
            'order:id,total,status',
            'food:id,name,price',
        ])->findOrFail($id);

        return $this->success($complaint);
    }

    public function reply(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'admin_reply' => 'required|string|max:5000',
        ]);

        $complaint = Complaint::findOrFail($id);
        $complaint->update([
            'admin_reply' => $validated['admin_reply'],
            'status' => 'in_review',
        ]);

        return $this->success($complaint->fresh(), 200, 'Reply added.');
    }

    public function categorize(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'category' => 'required|string|max:100',
        ]);

        $complaint = Complaint::findOrFail($id);
        $complaint->update(['category' => $validated['category']]);

        return $this->success($complaint->fresh(), 200, 'Category set.');
    }

    public function resolve(int $id): JsonResponse
    {
        $complaint = Complaint::findOrFail($id);
        $complaint->update([
            'status' => 'resolved',
            'resolved_at' => now(),
        ]);

        return $this->success($complaint->fresh(), 200, 'Réclamation résolue.');
    }

    public function reopen(int $id): JsonResponse
    {
        $complaint = Complaint::findOrFail($id);
        $complaint->update([
            'status' => 'pending',
            'resolved_at' => null,
        ]);

        return $this->success($complaint->fresh(), 200, 'Complaint reopened.');
    }
}
