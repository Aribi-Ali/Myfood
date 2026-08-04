<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\FoodResource;
use App\Http\Resources\StoreResource;
use App\Models\Food;
use App\Models\Store;
use App\Services\PageStorageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

/**
 * @OA\Info(
 *     version="1.0.0",
 *     title="Pizza Delivery API",
 *     description="API Documentation for the Food Delivery Application"
 * )
 * @OA\Server(
 *     url="http://localhost:8000",
 *     description="Local API Server"
 * )
 */
class StoreController extends Controller
{
    use ApiResponse;
    public function __construct(
        protected PageStorageService $pageStorage,
    ) {}

    /**
     * @OA\Get(
     *     path="/api/v1/stores",
     *     summary="List all approved stores",
     *     tags={"Stores"},
     *     @OA\Parameter(
     *         name="page",
     *         in="query",
     *         description="Page number",
     *         required=false,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation"
     *     )
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = config('business.pagination.stores', 20);
        $page    = $request->integer('page', 1);
        $cacheKey = 'stores:approved:page_' . $page;

        $query = Store::where('is_approved', true)
            ->with(['badges', 'typeCategories'])
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->orderBy('name');

        if ($request->filled('wilaya')) {
            $query->where('wilaya', $request->wilaya);
            $stores = $query->paginate($perPage);
        } else {
            $stores = Cache::remember(
                $cacheKey,
                config('business.cache.stores_list', 1800),
                fn () => $query->paginate($perPage)
            );
        }

        return $this->success([
            'stores' => StoreResource::collection($stores),
            'meta' => [
                'current_page' => $stores->currentPage(),
                'last_page'    => $stores->lastPage(),
                'per_page'     => $stores->perPage(),
                'total'        => $stores->total(),
            ],
        ])->header('Cache-Control', 'public, max-age=1800');
    }

    /**
     * Return store details by alias (with cached lookup).
     */
    public function show(string $alias): JsonResponse
    {
        $cacheKey = 'store:alias_' . $alias;
        $store = Cache::remember(
            $cacheKey,
            config('business.cache.store_detail', 900),
            fn () => Store::where('alias', $alias)
                ->where('is_approved', true)
                ->with([
                    'badges',
                    'foods' => fn ($q) => $q->where('is_available', true)->with('categories', 'additionalImages'),
                    'posts',
                    'staff' => fn ($q) => $q->where('display_on_profile', true)->with('user:id,name'),
                    'socialLinks',
                    'images',
                    'offers' => fn ($q) => $q->where('active', true)->latest(),
                    'banners' => fn ($q) => $q->where('active', true)->latest(),
                    'reservationSetting',
                    'phones',
                    'typeCategories',
                ])
                ->withAvg('reviews', 'rating')
                ->withCount('reviews')
                ->first()
        );

        if (!$store) {
            return $this->error('Restaurant introuvable.', 404);
        }

        // Get today's special foods for this store
        $todaySpecialFoods = Food::where('store_id', $store->id)
            ->where('is_today_special', true)
            ->where('is_available', true)
            ->where('today_special_expires_at', '>', now())
            ->orderBy('name')
            ->get();

        $reviews = $store->reviews()
            ->with('client:id,name,profile_image')
            ->orderByDesc('created_at')
            ->paginate(config('business.pagination.reviews', 10));

        $isBanned = false;
        if (Auth::check()) {
            $isBanned = \App\Models\ClientBan::where('store_id', $store->id)
                ->where('client_id', Auth::id())
                ->exists();
        }

        return $this->success([
            'store'   => StoreResource::make($store),
            'foods'   => FoodResource::collection($store->foods),
            'today_special_foods' => FoodResource::collection($todaySpecialFoods),
            'reviews' => collect($reviews->items())->map(fn ($r) => [
                'id'         => $r->id,
                'rating'     => $r->rating,
                'comment'    => $r->comment,
                'user'       => $r->client?->name ?? 'Anonymous',
                'avatar'     => $r->client?->profile_image
                    ? asset('storage/' . $r->client->profile_image) : null,
                'created_at' => $r->created_at?->toIso8601String(),
            ]),
            'reviews_meta' => [
                'current_page' => $reviews->currentPage(),
                'last_page'    => $reviews->lastPage(),
                'total'        => $reviews->total(),
            ],
            'is_banned' => $isBanned,
            'is_paused' => $store->isPaused(),
            'pause_note' => $store->pause_note,
        ])->header('Cache-Control', 'public, max-age=900');
    }

    /**
     * Return the authenticated user's own store (with template_slug, subscription status, and features).
     */
    public function showOwner(Request $request): JsonResponse
    {
        $store = $request->user()->store;

        if (!$store) {
            return $this->error('No store found', 404);
        }

        $store->load(['badges']);

        // Subscription & feature info
        $subscription = $store->activeSubscription()->with('planTier.plan.features')->first();
        $subscriptionStatus = $subscription?->status ?? 'none';
        $features = [];

        if ($subscription && $subscription->planTier && $subscription->planTier->plan) {
            $features = $subscription->planTier->plan->features->pluck('code')->toArray();
        } elseif (!$store->is_subscription_managed) {
            // Legacy stores have all features
            $features = \App\Models\PlanFeature::pluck('code')->toArray();
        }

        $onlineOrdersAvailable = in_array('online_orders', $features, true);

        return response()->json([
            'store'                   => new StoreResource($store),
            'subscription_status'     => $subscriptionStatus,
            'features'                => $features,
            'online_orders_available' => $onlineOrdersAvailable,
        ]);
    }

    /**
     * Update the store's selected template and optional theme preset.
     */
    public function updateTemplate(Request $request): JsonResponse
    {
        $data = $request->validate([
            'template_slug'   => 'required|string|exists:templates,slug',
            'theme_preset_id' => 'nullable|integer|exists:theme_presets,id',
        ]);

        $store = $request->user()->store;

        $template = \App\Models\Template::where('slug', $data['template_slug'])->first();
        if (!$template || !$template->is_active || $template->status !== 'active') {
            return response()->json(['message' => 'Selected template is not available.'], 422);
        }

        if ($data['theme_preset_id'] ?? null) {
            $preset = \App\Models\ThemePreset::findOrFail($data['theme_preset_id']);
            if ($preset->template->slug !== $data['template_slug']) {
                return response()->json(['message' => 'Theme preset does not belong to selected template.'], 422);
            }
            $store->theme_preset_id = $preset->id;
        } else {
            $store->theme_preset_id = null;
        }

        $previousTemplate = $store->template_slug;
        $store->template_slug = $data['template_slug'];
        $store->save();

        if ($previousTemplate && $previousTemplate !== $data['template_slug']) {
            $pageData = $this->pageStorage->get($store->id);
            if ($pageData && !empty($pageData['html']) && trim($pageData['html']) !== '') {
                $backupDir = storage_path("app/page_backups/{$store->id}/{$previousTemplate}");
                if (!is_dir($backupDir)) {
                    mkdir($backupDir, 0755, true);
                }
                file_put_contents($backupDir . '/index.html', $pageData['html']);
                if (!empty($pageData['css'])) {
                    file_put_contents($backupDir . '/styles.css', $pageData['css']);
                }
                if (!empty($pageData['grapes_data'])) {
                    file_put_contents($backupDir . '/grapes.json', is_string($pageData['grapes_data']) ? $pageData['grapes_data'] : json_encode($pageData['grapes_data']));
                }
            }
            $this->pageStorage->delete($store->id);
        }

        Cache::forget('public_store_' . $store->alias);
        Cache::forget('store:alias_' . $store->alias);
        Cache::forget('store_foods_' . $store->id);
        Cache::forget('templates.active.all');

        return $this->success([
            'template_slug'   => $store->template_slug,
            'theme_preset_id' => $store->theme_preset_id,
            'previous_template' => $previousTemplate,
        ]);
    }

    /**
     * Full-text search across stores and foods.
     */
    public function search(Request $request): JsonResponse
    {
        $request->validate([
            'query'      => 'required|string|min:2|max:100',
            'category'   => 'nullable|integer|exists:categories,id',
            'min_rating' => 'nullable|numeric|min:0|max:5',
        ]);

        $query      = $request->query('query', '');
        $categoryId = $request->integer('category') ?: null;
        $minRating  = $request->input('min_rating');

        $stores = Store::applyClientFilters($categoryId, $query, null, null, $minRating)
            ->paginate(config('business.pagination.stores', 20));

        $foods = Food::where('is_available', true)
            ->where(function ($q) use ($query) {
                $escaped = addcslashes($query, '%_');
                $q->where('name', 'like', "%{$escaped}%")
                  ->orWhere('description', 'like', "%{$escaped}%")
                  ->orWhere('ingredients', 'like', "%{$escaped}%");
            })
            ->when($categoryId, fn ($q) => $q->whereHas('categories', fn ($q) => $q->where('categories.id', $categoryId)))
            ->with(['store', 'categories', 'additionalImages'])
            ->paginate(config('business.pagination.foods', 20));

        return $this->success([
            'stores' => StoreResource::collection($stores),
            'foods'  => FoodResource::collection($foods),
        ]);
    }

    /**
     * Return foods for a specific store (used by mobile app food listing).
     */
    public function foods(string $alias): JsonResponse
    {
        $store = Store::where('alias', $alias)->where('is_approved', true)->firstOrFail();

        $cacheKey = 'store_foods_' . $store->id;
        $foods = Cache::remember(
            $cacheKey,
            config('business.cache.food_list', 600),
            fn () => Food::where('store_id', $store->id)
                ->where('is_available', true)
                ->with(['categories', 'additionalImages'])
                ->orderBy('name')
                ->paginate(config('business.pagination.foods', 20))
        );

        return $this->success(FoodResource::collection($foods))
            ->header('Cache-Control', 'public, max-age=600');
    }

    public function createStore(Request $request): JsonResponse
    {
        $user = Auth::user();
        if ($user->store) {
            return $this->error('Store already exists.', 422);
        }

        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'alias'   => 'required|string|max:255|unique:stores,alias',
            'phone'   => 'nullable|string|max:20',
            'phones'  => 'nullable|array',
            'phones.*' => 'required|string|max:30',
            'email'   => 'nullable|email|max:255',
            'address' => 'nullable|string|max:500',
        ]);

        $store = $user->store()->create([
            'name'              => $validated['name'],
            'alias'             => $validated['alias'],
            'phone'             => $validated['phone'] ?? $user->phone,
            'email'             => $validated['email'] ?? $user->email,
            'address'           => $validated['address'] ?? null,
            'is_approved'       => false,
            'onboarding_status' => 'pending',
        ]);

        $store->branches()->create([
            'name'              => $validated['name'],
            'alias'             => $validated['alias'],
            'email'             => $validated['email'] ?? $user->email,
            'phone'             => $validated['phone'] ?? $user->phone,
            'address'           => $validated['address'] ?? null,
            'is_active'         => true,
            'ordering_enabled'  => true,
        ]);

        if (!empty($validated['phones'])) {
            foreach ($validated['phones'] as $i => $phone) {
                if (empty($phone)) continue;
                $data = [
                    'phone'       => $phone,
                    'is_primary'  => $i === 0,
                    'order_index' => $i,
                ];
                if ($user->isPhoneVerified() && $phone === $user->phone) {
                    $data['verified_at'] = now();
                }
                $store->phones()->create($data);
            }
        }

        return $this->success($store->load(['phones', 'branches']), 201);
    }
}
