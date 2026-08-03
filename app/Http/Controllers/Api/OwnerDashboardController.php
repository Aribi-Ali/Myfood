<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Reservation;
use App\Models\Food;
use App\Models\StoreStaff;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class OwnerDashboardController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $store = Auth::user()->store;

        if (!$store) {
            return $this->forbidden('No store found for this account.');
        }

        $cacheKey = "owner_dashboard_{$store->id}";
        $data = Cache::remember($cacheKey, 120, function () use ($store) {
            $aggregated = Order::where('store_id', $store->id)
                ->selectRaw("
                    COUNT(*) as total_orders,
                    SUM(CASE WHEN status = ? THEN total_amount ELSE 0 END) as total_revenue,
                    SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as pending_orders,
                    SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as preparing_orders
                ", [OrderStatus::Delivered->value, OrderStatus::Pending->value, OrderStatus::Preparing->value])
                ->first();

            $pendingReservationCount = Reservation::where('store_id', $store->id)
                ->where('status', 'pending')
                ->count();

            $weeklyRevenue = Order::where('store_id', $store->id)
                ->where('status', OrderStatus::Delivered->value)
                ->where('created_at', '>=', now()->subDays(7))
                ->selectRaw("DATE(created_at) as date, SUM(total_amount) as revenue")
                ->groupBy('date')
                ->pluck('revenue', 'date');

            $weeklyRevenueCollection = collect();
            for ($i = 6; $i >= 0; $i--) {
                $date = now()->subDays($i)->format('Y-m-d');
                $weeklyRevenueCollection->push([
                    'date' => $date,
                    'revenue' => (float) ($weeklyRevenue[$date] ?? 0),
                ]);
            }

            $topFoods = Order::where('orders.store_id', $store->id)
                ->where('orders.status', OrderStatus::Delivered->value)
                ->join('order_items', 'orders.id', '=', 'order_items.order_id')
                ->join('foods', 'order_items.food_id', '=', 'foods.id')
                ->select('foods.id', 'foods.name', 'foods.image', DB::raw('SUM(order_items.quantity) as total_sold'))
                ->groupBy('foods.id', 'foods.name', 'foods.image')
                ->orderByDesc('total_sold')
                ->limit(5)
                ->get();

            $store->load(['badges', 'staff.user']);
            $staffCount = $store->staff->count();
            $reviewsCount = $store->reviews()->count();
            $avgRating = (float) $store->reviews()->avg('rating') ?? 0;

            return [
                'stats' => [
                    'total_revenue' => (float) ($aggregated->total_revenue ?? 0),
                    'total_orders' => (int) ($aggregated->total_orders ?? 0),
                    'pending_order_count' => (int) ($aggregated->pending_orders ?? 0),
                    'pending_reservation_count' => $pendingReservationCount,
                ],
                'weekly_revenue' => $weeklyRevenueCollection,
                'top_foods' => $topFoods,
                'store' => [
                    'id' => $store->id,
                    'name' => $store->name,
                    'alias' => $store->alias,
                    'description' => $store->description,
                    'phone' => $store->phone,
                    'email' => $store->email,
                    'address' => $store->address,
                    'logo_path' => $store->logo_path,
                    'cover_image' => $store->cover_image,
                    'is_active' => $store->is_active,
                    'is_approved' => $store->is_approved,
                    'average_rating' => $avgRating,
                    'staff_count' => $staffCount,
                    'reviews_count' => $reviewsCount,
                    'badges' => $store->badges,
                    'staff' => $store->staff->map(function ($s) {
                        return [
                            'id' => $s->id,
                            'name' => $s->user?->name,
                            'role' => $s->store_role,
                            'display_on_profile' => $s->display_on_profile,
                        ];
                    }),
                ],
            ];
        });

        return $this->success($data);
    }
}
