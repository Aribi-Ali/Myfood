<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\ApiResponse;
use App\Models\Reservation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminReservationController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'status' => 'nullable|in:pending,confirmed,cancelled,completed',
            'store_id' => 'nullable|integer|exists:stores,id',
            'date' => 'nullable|date',
        ]);

        $query = Reservation::with([
            'client:id,name,email,phone',
            'store:id,name,alias',
        ]);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('store_id')) {
            $query->where('store_id', $request->store_id);
        }

        if ($request->filled('date')) {
            $query->whereDate('reservation_date', $request->date);
        }

        $reservations = $query->orderByDesc('created_at')
            ->paginate(config('business.pagination.orders', 15));

        return $this->success($reservations);
    }

    public function show(int $id): JsonResponse
    {
        $reservation = Reservation::with([
            'client:id,name,email,phone',
            'store:id,name,alias,phone,address',
        ])->findOrFail($id);

        return $this->success($reservation);
    }

    public function cancel(int $id): JsonResponse
    {
        $reservation = Reservation::findOrFail($id);
        $reservation->update(['status' => 'cancelled']);

        return $this->success($reservation->fresh(), 200, 'Reservation cancelled.');
    }
}
