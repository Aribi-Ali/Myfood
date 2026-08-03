<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreReviewRequest;
use App\Models\Review;
use App\Models\Store;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ReviewController extends Controller
{
    use ApiResponse;
    public function __construct(private readonly OrderService $orderService) {}

    public function index(string $alias): JsonResponse
    {
        $store   = Store::where('alias', $alias)->where('is_approved', true)->firstOrFail();
        $reviews = $store->reviews()
            ->with('client:id,name,profile_image')
            ->orderByDesc('created_at')
            ->paginate(config('business.pagination.reviews', 10));

        return $this->success($reviews);
    }

    public function store(StoreReviewRequest $request, string $alias): JsonResponse
    {
        $store = Store::where('alias', $alias)->where('is_approved', true)->firstOrFail();
        $user  = $request->user();

        if (!$this->orderService->canSubmitReview($user->id, $store->id)) {
            return $this->error('Vous devez avoir au moins une commande livrée pour laisser un avis.', 403);
        }

        $review = Review::firstOrCreate(
            ['client_id' => $user->id, 'store_id' => $store->id],
            ['rating' => $request->rating, 'comment' => $request->comment ?? null]
        );

        if (!$review->wasRecentlyCreated) {
            return response()->json(['message' => 'Vous avez déjà laissé un avis pour ce restaurant.'], 422);
        }

        Log::info('Review submitted', ['review_id' => $review->id, 'store_id' => $store->id]);

        return $this->success($review->load('client:id,name,profile_image'), 201);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $review = Review::where('id', $id)->where('client_id', $request->user()->id)->firstOrFail();
        $review->delete();

        return $this->success(null, 200, 'Avis supprimé.');
    }
}
