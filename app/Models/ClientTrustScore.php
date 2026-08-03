<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClientTrustScore extends Model
{
    protected $table = 'client_trust_scores';

    protected $fillable = [
        'client_id',
        'store_id',
        'score',
        'completed_orders',
        'cancelled_orders',
        'avg_rating_given',
        'total_complaints',
        'total_reports_against',
        'last_calculated_at',
    ];

    protected $casts = [
        'score' => 'integer',
        'avg_rating_given' => 'decimal:2',
        'last_calculated_at' => 'datetime',
    ];

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * Calculate trust score based on order behavior.
     * Score 0-100, higher = more trustworthy.
     */
    public static function calculate(int $clientId, ?int $storeId = null): int
    {
        $query = Order::where('client_id', $clientId);
        if ($storeId) {
            $query->where('store_id', $storeId);
        }

        $completed = (clone $query)->where('status', 'delivered')->count();
        $cancelled = (clone $query)->where('status', 'cancelled')->count();
        $totalOrders = $completed + $cancelled;

        // Completion rate (40% weight)
        $completionRate = $totalOrders > 0 ? ($completed / $totalOrders) * 100 : 50;

        // Average rating given by client (25% weight)
        $avgRatingQuery = Review::where('client_id', $clientId);
        if ($storeId) {
            $avgRatingQuery->where('store_id', $storeId);
        }
        $avgRating = (float) $avgRatingQuery->avg('rating') ?? 0;
        $ratingScore = $avgRating > 0 ? ($avgRating / 5) * 100 : 50;

        // Complaints made (20% weight) - fewer = better
        $complaintQuery = Complaint::where('client_id', $clientId);
        if ($storeId) {
            $complaintQuery->where('store_id', $storeId);
        }
        $complaints = $complaintQuery->count();
        $complaintScore = $complaints === 0 ? 100 : max(0, 100 - ($complaints * 20));

        // Reports against (15% weight) - fewer = better
        $reportQuery = ClientReport::where('client_id', $clientId);
        if ($storeId) {
            $reportQuery->where('store_id', $storeId);
        }
        $reportsAgainst = $reportQuery->count();
        $reportScore = $reportsAgainst === 0 ? 100 : max(0, 100 - ($reportsAgainst * 25));

        // Weighted score
        $score = (int) round(
            ($completionRate * 0.40) +
            ($ratingScore * 0.25) +
            ($complaintScore * 0.20) +
            ($reportScore * 0.15)
        );

        return max(0, min(100, $score));
    }
}
