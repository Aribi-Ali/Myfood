<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClientBan;
use App\Models\ClientReport;
use App\Models\ClientTrustScore;
use App\Models\Order;
use App\Models\Review;
use App\Models\User;
use App\Models\Complaint;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OwnerClientController extends Controller
{
    use ApiResponse;

    private function getStore()
    {
        $store = Auth::user()->store;
        if (!$store) {
            abort(403, 'No store found for this account.');
        }
        return $store;
    }

    /**
     * List clients who have ordered from this store, with trust scores.
     */
    public function index(Request $request): JsonResponse
    {
        $store = $this->getStore();

        $bannedIds = ClientBan::where('store_id', $store->id)
            ->pluck('client_id')
            ->toArray();

        $trustScores = ClientTrustScore::where('store_id', $store->id)
            ->get()
            ->keyBy('client_id');

        $clientIds = Order::where('store_id', $store->id)
            ->where('status', 'delivered')
            ->pluck('client_id')
            ->unique()
            ->values();

        $clients = User::whereIn('id', $clientIds)
            ->withCount(['orders', 'reviews'])
            ->get()
            ->keyBy('id');

        $results = $clientIds->map(function ($clientId) use ($clients, $trustScores, $store, $bannedIds) {
            $client = $clients[$clientId] ?? null;
            if (!$client) return null;

            $trustScore = $trustScores[$clientId] ?? null;
            if (!$trustScore) {
                $trustScore = $this->recalculateTrustScore($clientId, $store->id);
            }

            return [
                'id' => $client->id,
                'name' => $client->name,
                'email' => $client->email,
                'phone' => $client->phone,
                'profile_image' => $client->profile_image,
                'total_orders' => $client->orders_count ?? 0,
                'is_banned' => in_array($client->id, $bannedIds),
                'trust_score' => $trustScore ? [
                    'score' => $trustScore->score,
                    'completed_orders' => $trustScore->completed_orders,
                    'cancelled_orders' => $trustScore->cancelled_orders,
                    'avg_rating_given' => (float) $trustScore->avg_rating_given,
                    'total_complaints' => $trustScore->total_complaints,
                    'total_reports_against' => $trustScore->total_reports_against,
                    'last_calculated_at' => $trustScore->last_calculated_at,
                ] : null,
            ];
        })->filter()->values();

        $sortBy = $request->input('sort_by', 'trust_score');
        $sortDir = $request->input('sort_dir', 'desc');

        if ($sortBy === 'trust_score') {
            $results = $results->sortBy(function ($item) {
                return $item['trust_score']['score'] ?? 0;
            }, SORT_REGULAR, $sortDir === 'desc')->values();
        } elseif ($sortBy === 'name') {
            $results = $results->sortBy('name', SORT_REGULAR, $sortDir === 'desc')->values();
        } elseif ($sortBy === 'total_orders') {
            $results = $results->sortBy('total_orders', SORT_REGULAR, $sortDir === 'desc')->values();
        }

        return $this->success($results);
    }

    /**
     * Ban a client from this store.
     */
    public function ban(Request $request, int $clientId): JsonResponse
    {
        $store = $this->getStore();

        $client = User::findOrFail($clientId);

        if (!$client->isClient()) {
            return $this->error('Only clients can be banned.', 422);
        }

        $existing = ClientBan::where('store_id', $store->id)
            ->where('client_id', $clientId)
            ->first();

        if ($existing) {
            return $this->error('Client is already banned from this store.', 422);
        }

        $request->validate([
            'reason' => 'nullable|string|max:500',
        ]);

        ClientBan::create([
            'store_id' => $store->id,
            'client_id' => $clientId,
            'reason' => $request->reason,
            'banned_at' => now(),
        ]);

        return $this->success(['message' => 'Client banned successfully.'], 201);
    }

    /**
     * Unban a client from this store.
     */
    public function unban(int $clientId): JsonResponse
    {
        $store = $this->getStore();

        $ban = ClientBan::where('store_id', $store->id)
            ->where('client_id', $clientId)
            ->first();

        if (!$ban) {
            return $this->error('Client is not banned.', 404);
        }

        $ban->delete();

        return $this->success(['message' => 'Client unbanned successfully.']);
    }

    /**
     * Report a client.
     */
    public function report(Request $request, int $clientId): JsonResponse
    {
        $store = $this->getStore();

        $client = User::findOrFail($clientId);

        $request->validate([
            'reason' => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
        ]);

        $report = ClientReport::create([
            'store_id' => $store->id,
            'client_id' => $clientId,
            'reporter_id' => Auth::id(),
            'reason' => $request->reason,
            'description' => $request->description,
            'status' => 'pending',
        ]);

        return $this->success($report, 201);
    }

    /**
     * Get detailed trust score for a client in this store.
     */
    public function trustScore(int $clientId): JsonResponse
    {
        $store = $this->getStore();

        $client = User::findOrFail($clientId);

        $trustScore = ClientTrustScore::where('client_id', $clientId)
            ->where('store_id', $store->id)
            ->first();

        if (!$trustScore) {
            $trustScore = $this->recalculateTrustScore($clientId, $store->id);
        }

        // Optionally recalculate if stale (older than 1 hour)
        if ($trustScore->last_calculated_at && $trustScore->last_calculated_at->diffInMinutes(now()) > 60) {
            $trustScore = $this->recalculateTrustScore($clientId, $store->id);
        }

        $ban = ClientBan::where('store_id', $store->id)
            ->where('client_id', $clientId)
            ->first();

        $reports = ClientReport::where('store_id', $store->id)
            ->where('client_id', $clientId)
            ->orderByDesc('created_at')
            ->get();

        return $this->success([
            'client' => [
                'id' => $client->id,
                'name' => $client->name,
                'email' => $client->email,
                'phone' => $client->phone,
                'profile_image' => $client->profile_image,
            ],
            'trust_score' => $trustScore ? [
                'score' => $trustScore->score,
                'level' => $this->getScoreLevel($trustScore->score),
                'completed_orders' => $trustScore->completed_orders,
                'cancelled_orders' => $trustScore->cancelled_orders,
                'completion_rate' => $trustScore->completed_orders + $trustScore->cancelled_orders > 0
                    ? round(($trustScore->completed_orders / ($trustScore->completed_orders + $trustScore->cancelled_orders)) * 100, 1)
                    : 0,
                'avg_rating_given' => (float) $trustScore->avg_rating_given,
                'total_complaints' => $trustScore->total_complaints,
                'total_reports_against' => $trustScore->total_reports_against,
                'last_calculated_at' => $trustScore->last_calculated_at,
            ] : null,
            'is_banned' => $ban ? true : false,
            'ban_reason' => $ban->reason ?? null,
            'banned_at' => $ban->banned_at ?? null,
            'reports' => $reports,
        ]);
    }

    /**
     * Recalculate and persist trust score for a client within a store.
     */
    private function recalculateTrustScore(int $clientId, int $storeId): ClientTrustScore
    {
        $score = ClientTrustScore::calculate($clientId, $storeId);

        $completedOrders = Order::where('client_id', $clientId)
            ->where('store_id', $storeId)
            ->where('status', 'delivered')
            ->count();

        $cancelledOrders = Order::where('client_id', $clientId)
            ->where('store_id', $storeId)
            ->where('status', 'cancelled')
            ->count();

        $avgRating = Review::where('client_id', $clientId)
            ->where('store_id', $storeId)
            ->avg('rating') ?? 0;

        $complaints = Complaint::where('client_id', $clientId)
            ->where('store_id', $storeId)
            ->count();

        $reportsAgainst = ClientReport::where('client_id', $clientId)
            ->where('store_id', $storeId)
            ->count();

        return ClientTrustScore::updateOrCreate(
            ['client_id' => $clientId, 'store_id' => $storeId],
            [
                'score' => $score,
                'completed_orders' => $completedOrders,
                'cancelled_orders' => $cancelledOrders,
                'avg_rating_given' => $avgRating,
                'total_complaints' => $complaints,
                'total_reports_against' => $reportsAgainst,
                'last_calculated_at' => now(),
            ]
        );
    }

    private function getScoreLevel(int $score): string
    {
        if ($score >= 80) return 'trustworthy';
        if ($score >= 50) return 'neutral';
        return 'at_risk';
    }
}