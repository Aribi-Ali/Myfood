<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\ApiResponse;
use App\Models\Review;
use App\Models\ReviewFlag;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminReviewController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'rating' => 'nullable|integer|min:1|max:5',
            'search' => 'nullable|string|max:100',
            'store_id' => 'nullable|integer|exists:stores,id',
        ]);

        $query = Review::with([
            'client:id,name',
            'store:id,name,alias',
        ]);

        if ($request->filled('rating')) {
            $query->where('rating', $request->rating);
        }

        if ($request->filled('store_id')) {
            $query->where('store_id', $request->store_id);
        }

        if ($request->filled('search')) {
            $s = '%' . $request->search . '%';
            $query->where(function ($q) use ($s) {
                $q->where('comment', 'like', $s)
                  ->orWhereHas('client', fn ($cq) => $cq->where('name', 'like', $s))
                  ->orWhereHas('store', fn ($sq) => $sq->where('name', 'like', $s));
            });
        }

        $reviews = $query->orderByDesc('created_at')
            ->paginate(config('business.pagination.reviews', 20));

        return $this->success($reviews);
    }

    public function flaggedReviews(): JsonResponse
    {
        $flags = ReviewFlag::with([
            'review.client:id,name',
            'review.store:id,name',
            'user:id,name',
        ])
            ->orderByDesc('created_at')
            ->paginate(config('business.pagination.reviews', 20));

        return $this->success($flags);
    }

    public function dismissFlag(int $id): JsonResponse
    {
        $flag = ReviewFlag::findOrFail($id);
        $flag->delete();

        return $this->success(null, 200, 'Signalement ignoré.');
    }

    public function deleteFlaggedReview(int $id): JsonResponse
    {
        $flag = ReviewFlag::findOrFail($id);
        $review = Review::findOrFail($flag->review_id);
        $review->delete();
        $flag->delete();

        return $this->success(null, 200, 'Avis et signalement supprimés.');
    }

    public function destroy(int $id): JsonResponse
    {
        $review = Review::findOrFail($id);
        $review->delete();

        return $this->success(null, 200, 'Review deleted.');
    }

    public function reply(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'admin_reply' => 'required|string|max:2000',
        ]);

        $review = Review::findOrFail($id);
        $review->update(['admin_reply' => $validated['admin_reply']]);

        return $this->success($review->fresh(), 200, 'Réponse enregistrée.');
    }
}
