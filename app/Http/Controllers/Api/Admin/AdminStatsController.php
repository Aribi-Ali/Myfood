<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\ApiResponse;
use App\Models\Order;
use App\Models\Store;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class AdminStatsController extends Controller
{
    use ApiResponse;

    public function stats(): JsonResponse
    {
        $stats = Cache::remember('admin.stats', 60, function () {
            $today = now()->format('Y-m-d');

            $aggregate = Order::selectRaw("
                COUNT(*) as total_orders,
                SUM(CASE WHEN status = 'delivered' THEN total_amount ELSE 0 END) as total_revenue,
                SUM(CASE WHEN status = 'delivered' THEN commission_amount ELSE 0 END) as platform_commission,
                SUM(CASE WHEN DATE(created_at) = ? THEN 1 ELSE 0 END) as today_orders,
                SUM(CASE WHEN DATE(created_at) = ? AND status = 'delivered' THEN total_amount ELSE 0 END) as today_revenue
            ", [$today, $today])->first();

            return [
                'total_users'         => User::count(),
                'total_stores'        => Store::count(),
                'total_orders'        => (int) $aggregate->total_orders,
                'total_revenue'       => (float) $aggregate->total_revenue,
                'platform_commission' => (float) $aggregate->platform_commission,
                'today_orders'        => (int) $aggregate->today_orders,
                'today_revenue'       => (float) $aggregate->today_revenue,
            ];
        });

        return $this->success($stats);
    }

    public function chart(): JsonResponse
    {
        $chartData = Order::where('created_at', '>=', now()->subDays(7))
            ->selectRaw("DATE(created_at) as date, 
                SUM(CASE WHEN status = ? THEN total_amount ELSE 0 END) as revenue,
                COUNT(*) as orders", [OrderStatus::Delivered->value])
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $chart = collect();
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $dayData = $chartData->get($date);
            $chart->push([
                'date'    => $date,
                'revenue' => (float) ($dayData->revenue ?? 0),
                'orders'  => (int) ($dayData->orders ?? 0),
            ]);
        }

        return $this->success($chart);
    }
}
