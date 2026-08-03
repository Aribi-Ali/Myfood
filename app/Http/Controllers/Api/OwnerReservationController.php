<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\ReservationSetting;
use App\Models\ReservationSchedule;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OwnerReservationController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        try {
            $store = Auth::user()->store;

            if (!$store) {
                return $this->forbidden('No store found for this account.');
            }

            $query = Reservation::forStore($store->id)
                ->with('client')
                ->orderByDesc('reservation_date')
                ->orderByDesc('reservation_time');

            if ($request->filled('status')) {
                $query->where('status', $request->status);
            }

            if ($request->filled('search')) {
                $s = '%' . $request->search . '%';
                $query->where(function ($q) use ($s) {
                    $q->where('name', 'like', $s)
                        ->orWhere('phone', 'like', $s)
                        ->orWhere('email', 'like', $s);
                });
            }

            if ($request->filled('date_from')) {
                $query->where('reservation_date', '>=', $request->date_from);
            }

            if ($request->filled('date_to')) {
                $query->where('reservation_date', '<=', $request->date_to);
            }

            $reservations = $query->paginate(min((int)$request->input('per_page', 20), 100));

            return $this->success($reservations);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $store = Auth::user()->store;

            if (!$store) {
                return $this->forbidden('No store found for this account.');
            }

            $reservation = Reservation::forStore($store->id)
                ->with('client')
                ->findOrFail($id);

            return $this->success($reservation);
        } catch (\Exception $e) {
            if ($e->getCode() === 404 || $e instanceof \Illuminate\Database\Eloquent\ModelNotFoundException) {
                return $this->notFound('Reservation not found.');
            }
            return $this->error($e->getMessage(), 500);
        }
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        try {
            $store = Auth::user()->store;

            if (!$store) {
                return $this->forbidden('No store found for this account.');
            }

            $data = $request->validate([
                'status' => 'required|in:pending,confirmed,cancelled,completed',
                'cancellation_reason' => 'nullable|string|max:1000',
            ]);

            $reservation = Reservation::forStore($store->id)->findOrFail($id);

            $updateData = ['status' => $data['status']];

            if ($data['status'] === 'cancelled') {
                $updateData['cancellation_reason'] = $data['cancellation_reason'] ?? 'Cancelled by store owner';
                $updateData['cancelled_at'] = now();
            }

            $reservation->update($updateData);

            return $this->success(
                $reservation->fresh()->load('client'),
                200,
                'Reservation ' . $data['status'] . ' successfully.'
            );
        } catch (\Exception $e) {
            if ($e->getCode() === 404 || $e instanceof \Illuminate\Database\Eloquent\ModelNotFoundException) {
                return $this->notFound('Reservation not found.');
            }
            return $this->error($e->getMessage(), 500);
        }
    }

    public function settings(): JsonResponse
    {
        try {
            $store = Auth::user()->store;

            if (!$store) {
                return $this->forbidden('No store found for this account.');
            }

            $settings = $store->reservationSetting;

            if (!$settings) {
                $settings = ReservationSetting::create([
                    'store_id' => $store->id,
                    'enabled' => true,
                    'auto_confirm' => false,
                    'duration_minutes' => 60,
                    'slot_interval_minutes' => 30,
                    'min_advance_hours' => 1,
                    'max_booking_days' => 30,
                    'min_party_size' => 1,
                    'max_party_size' => 20,
                    'allow_notes' => true,
                    'allow_special_requests' => true,
                    'allow_cancellation' => true,
                    'cancellation_deadline_hours' => 2,
                    'reminder_24h' => false,
                    'reminder_2h' => false,
                ]);
            }

            $schedules = $store->reservationSchedules()->orderBy('day_of_week')->get();

            return $this->success([
                'settings' => $settings,
                'schedules' => $schedules,
            ]);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    public function updateSettings(Request $request): JsonResponse
    {
        try {
            $store = Auth::user()->store;

            if (!$store) {
                return $this->forbidden('No store found for this account.');
            }

            $data = $request->validate([
                'enabled' => 'boolean',
                'auto_confirm' => 'boolean',
                'duration_minutes' => 'integer|min:15|max:480',
                'slot_interval_minutes' => 'integer|min:5|max:120',
                'min_advance_hours' => 'integer|min:0|max:168',
                'max_booking_days' => 'integer|min:1|max:365',
                'min_party_size' => 'integer|min:1|max:50',
                'max_party_size' => 'integer|min:1|max:100',
                'allow_notes' => 'boolean',
                'allow_special_requests' => 'boolean',
                'allow_cancellation' => 'boolean',
                'cancellation_deadline_hours' => 'integer|min:0|max:168',
                'reminder_24h' => 'boolean',
                'reminder_2h' => 'boolean',
            ]);

            $settings = $store->reservationSetting;

            if (!$settings) {
                $settings = ReservationSetting::create(array_merge(['store_id' => $store->id], $data));
            } else {
                $settings->update($data);
            }

            return $this->success($settings, 200, 'Settings saved successfully.');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    public function updateSchedules(Request $request): JsonResponse
    {
        try {
            $store = Auth::user()->store;

            if (!$store) {
                return $this->forbidden('No store found for this account.');
            }

            $data = $request->validate([
                'schedules' => 'required|array',
                'schedules.*.day_of_week' => 'required|integer|between:0,6',
                'schedules.*.enabled' => 'boolean',
                'schedules.*.open_time' => 'nullable|date_format:H:i',
                'schedules.*.close_time' => 'nullable|date_format:H:i',
            ]);

            foreach ($data['schedules'] as $scheduleData) {
                ReservationSchedule::updateOrCreate(
                    [
                        'store_id' => $store->id,
                        'day_of_week' => $scheduleData['day_of_week'],
                    ],
                    [
                        'enabled' => $scheduleData['enabled'] ?? true,
                        'open_time' => $scheduleData['open_time'] ?? '09:00',
                        'close_time' => $scheduleData['close_time'] ?? '21:00',
                    ]
                );
            }

            $schedules = $store->reservationSchedules()->orderBy('day_of_week')->get();

            return $this->success($schedules, 200, 'Schedules saved successfully.');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }
}
