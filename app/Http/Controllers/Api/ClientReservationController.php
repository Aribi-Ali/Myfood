<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\ReservationSchedule;
use App\Models\ReservationSetting;
use App\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ClientReservationController extends Controller
{
    use ApiResponse;

    private function getStoreByAlias(string $alias): Store
    {
        $store = Store::where('alias', $alias)->where('is_approved', true)->first();

        if (!$store) {
            abort(404, 'Restaurant introuvable.');
        }

        return $store;
    }

    public function settings(string $alias): JsonResponse
    {
        try {
            $store = $this->getStoreByAlias($alias);

            $settings = $store->reservationSetting;

            if (!$settings) {
                return $this->notFound('Paramètres de réservation non configurés pour ce restaurant.');
            }

            $schedules = $store->reservationSchedules()->orderBy('day_of_week')->get();

            return $this->success([
                'settings'  => $settings,
                'schedules' => $schedules,
            ]);
        } catch (\Exception $e) {
            if ($e->getCode() === 404) {
                return $this->notFound($e->getMessage());
            }
            return $this->error($e->getMessage(), 500);
        }
    }

    public function checkAvailability(Request $request, string $alias): JsonResponse
    {
        try {
            $store = $this->getStoreByAlias($alias);

            $data = $request->validate([
                'date'   => 'required|date_format:Y-m-d|after_or_equal:today',
                'time'   => 'required|date_format:H:i',
                'guests' => 'required|integer|min:1',
            ]);

            $settings = $store->reservationSetting;

            if (!$settings || !$settings->enabled) {
                return $this->error('Les réservations ne sont pas disponibles pour ce restaurant.', 400);
            }

            if ($data['guests'] < ($settings->min_party_size ?? 1)) {
                return $this->error('Le nombre de convives est inférieur au minimum requis.', 400);
            }

            if ($data['guests'] > ($settings->max_party_size ?? 50)) {
                return $this->error('Le nombre de convives dépasse la capacité maximale.', 400);
            }

            $dayOfWeek = \Carbon\Carbon::parse($data['date'])->dayOfWeek;

            $schedule = ReservationSchedule::where('store_id', $store->id)
                ->where('day_of_week', $dayOfWeek)
                ->where('enabled', true)
                ->first();

            if (!$schedule) {
                return $this->success([
                    'available' => false,
                    'message'   => 'Le restaurant est fermé ce jour-là.',
                ]);
            }

            if ($data['time'] < $schedule->open_time || $data['time'] > $schedule->close_time) {
                return $this->success([
                    'available' => false,
                    'message'   => 'Le restaurant est fermé à cette heure.',
                ]);
            }

            $existingCount = Reservation::where('store_id', $store->id)
                ->where('reservation_date', $data['date'])
                ->where('reservation_time', $data['time'])
                ->whereIn('status', ['pending', 'confirmed'])
                ->count();

            $maxPerSlot = config('business.max_reservations_per_slot', 5);

            if ($existingCount >= $maxPerSlot) {
                return $this->success([
                    'available' => false,
                    'message'   => 'Créneau horaire complet.',
                ]);
            }

            return $this->success([
                'available' => true,
                'message'   => 'Créneau disponible.',
            ]);
        } catch (\Exception $e) {
            if ($e->getCode() === 404) {
                return $this->notFound($e->getMessage());
            }
            return $this->error($e->getMessage(), 500);
        }
    }

    public function store(Request $request, string $alias): JsonResponse
    {
        try {
            $store = $this->getStoreByAlias($alias);

            $data = $request->validate([
                'date'              => 'required|date_format:Y-m-d|after_or_equal:today',
                'time'              => 'required|date_format:H:i',
                'party_size'        => 'required|integer|min:1',
                'notes'             => 'nullable|string|max:1000',
                'special_requests'  => 'nullable|string|max:2000',
            ]);

            $settings = $store->reservationSetting;

            if (!$settings || !$settings->enabled) {
                return $this->error('Les réservations ne sont pas disponibles pour ce restaurant.', 400);
            }

            $dayOfWeek = \Carbon\Carbon::parse($data['date'])->dayOfWeek;

            $schedule = ReservationSchedule::where('store_id', $store->id)
                ->where('day_of_week', $dayOfWeek)
                ->where('enabled', true)
                ->first();

            if (!$schedule) {
                return $this->error('Le restaurant est fermé ce jour-là.', 400);
            }

            if ($data['time'] < $schedule->open_time || $data['time'] > $schedule->close_time) {
                return $this->error('Le restaurant est fermé à cette heure.', 400);
            }

            $status = $settings->auto_confirm ? 'confirmed' : 'pending';

            $user = Auth::user();

            $maxPerSlot = config('business.max_reservations_per_slot', 5);

            // Re-check slot capacity inside a transaction with a lock so concurrent
            // requests cannot both pass the count check and overbook the slot.
            $reservation = DB::transaction(function () use ($store, $data, $status, $user, $maxPerSlot) {
                $existingCount = Reservation::where('store_id', $store->id)
                    ->where('reservation_date', $data['date'])
                    ->where('reservation_time', $data['time'])
                    ->whereIn('status', ['pending', 'confirmed'])
                    ->lockForUpdate()
                    ->count();

                if ($existingCount >= $maxPerSlot) {
                    throw new \RuntimeException('Créneau horaire complet.');
                }

                return Reservation::create([
                    'store_id'          => $store->id,
                    'client_id'         => $user->id,
                    'name'              => $user->name,
                    'email'             => $user->email,
                    'phone'             => $user->phone,
                    'party_size'        => $data['party_size'],
                    'reservation_date'  => $data['date'],
                    'reservation_time'  => $data['time'],
                    'notes'             => $data['notes'] ?? null,
                    'special_requests'  => $data['special_requests'] ?? null,
                    'status'            => $status,
                ]);
            });

            return $this->success(
                $reservation->load('store'),
                201,
                $status === 'confirmed'
                    ? 'Réservation confirmée.'
                    : 'Réservation soumise, en attente de confirmation.'
            );
        } catch (\RuntimeException $e) {
            return $this->error($e->getMessage(), 422);
        } catch (\Exception $e) {
            if ($e->getCode() === 404) {
                return $this->notFound($e->getMessage());
            }
            return $this->error($e->getMessage(), 500);
        }
    }

    public function index(): JsonResponse
    {
        try {
            $reservations = Reservation::where('client_id', Auth::id())
                ->with('store')
                ->orderByDesc('reservation_date')
                ->orderByDesc('reservation_time')
                ->paginate(config('business.pagination.reservations', 15));

            return $this->success($reservations);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $reservation = Reservation::where('id', $id)
                ->where('client_id', Auth::id())
                ->first();

            if (!$reservation) {
                return $this->notFound('Réservation introuvable.');
            }

            if ($reservation->status === 'cancelled') {
                return $this->error('Cette réservation est déjà annulée.', 400);
            }

            $reservation->update([
                'status'              => 'cancelled',
                'cancellation_reason' => 'Annulée par le client',
                'cancelled_at'        => now(),
            ]);

            return $this->success(null, 200, 'Réservation annulée avec succès.');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }
}
