<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OwnerSalesController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        try {
            $store = Auth::user()->store;

            if (!$store) {
                return $this->forbidden('No store found for this account.');
            }

            $query = Order::where('store_id', $store->id)
                ->where('status', 'delivered')
                ->with(['items.food', 'client', 'store'])
                ->orderByDesc('created_at');

            if ($request->filled('search')) {
                $search = '%' . $request->search . '%';
                $query->where(function ($q) use ($search) {
                    $q->where('id', 'like', $search)
                        ->orWhere('phone', 'like', $search)
                        ->orWhereHas('client', function ($cq) use ($search) {
                            $cq->where('name', 'like', $search);
                        });
                });
            }

            if ($request->filled('dateFrom')) {
                $query->whereDate('created_at', '>=', $request->dateFrom);
            }

            if ($request->filled('dateTo')) {
                $query->whereDate('created_at', '<=', $request->dateTo);
            }

            if ($request->filled('period')) {
                $now = now();
                $query->whereDate('created_at', '>=', match ($request->period) {
                    'today' => $now->copy()->startOfDay(),
                    'week' => $now->copy()->startOfWeek(),
                    'month' => $now->copy()->startOfMonth(),
                    'year' => $now->copy()->startOfYear(),
                    default => $now->copy()->startOfDay(),
                });
            }

            $orders = $query->paginate(min((int)$request->input('per_page', 15), 100));

            return $this->success($orders);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    public function stats(Request $request): JsonResponse
    {
        try {
            $store = Auth::user()->store;

            if (!$store) {
                return $this->forbidden('No store found for this account.');
            }

            $query = Order::where('store_id', $store->id)->where('status', 'delivered');

            if ($request->filled('dateFrom')) {
                $query->whereDate('created_at', '>=', $request->dateFrom);
            }

            if ($request->filled('dateTo')) {
                $query->whereDate('created_at', '<=', $request->dateTo);
            }

            if ($request->filled('period')) {
                $now = now();
                $query->whereDate('created_at', '>=', match ($request->period) {
                    'today' => $now->copy()->startOfDay(),
                    'week' => $now->copy()->startOfWeek(),
                    'month' => $now->copy()->startOfMonth(),
                    'year' => $now->copy()->startOfYear(),
                    default => $now->copy()->startOfDay(),
                });
            }

            $aggregates = (clone $query)
                ->select(
                    DB::raw('COUNT(*) as order_count'),
                    DB::raw('COALESCE(SUM(total_amount), 0) as total_revenue'),
                    DB::raw('COALESCE(SUM(commission_amount), 0) as total_commission')
                )
                ->first();

            $data = [
                'order_count' => (int) $aggregates->order_count,
                'total_revenue' => (float) $aggregates->total_revenue,
                'total_commission' => (float) $aggregates->total_commission,
                'net_profit' => (float) ($aggregates->total_revenue - $aggregates->total_commission),
            ];

            return $this->success($data);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    public function monthly(Request $request): JsonResponse
    {
        try {
            $store = Auth::user()->store;

            if (!$store) {
                return $this->forbidden('No store found for this account.');
            }

            $year = $request->input('year', now()->year);

            $monthly = Order::where('store_id', $store->id)
                ->where('status', 'delivered')
                ->whereYear('created_at', $year)
                ->select(
                    DB::raw(self::monthExpr() . ' as month'),
                    DB::raw('COUNT(*) as order_count'),
                    DB::raw('COALESCE(SUM(total_amount), 0) as total_revenue'),
                    DB::raw('COALESCE(SUM(commission_amount), 0) as total_commission')
                )
                ->groupBy(DB::raw(self::monthExpr()))
                ->get();

            return $this->success($monthly);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    public function yearly(Request $request): JsonResponse
    {
        try {
            $store = Auth::user()->store;

            if (!$store) {
                return $this->forbidden('No store found for this account.');
            }

            $yearly = Order::where('store_id', $store->id)
                ->where('status', 'delivered')
                ->select(
                    DB::raw(self::yearExpr() . ' as year'),
                    DB::raw('COUNT(*) as order_count'),
                    DB::raw('COALESCE(SUM(total_amount), 0) as total_revenue'),
                    DB::raw('COALESCE(SUM(commission_amount), 0) as total_commission')
                )
                ->groupBy(DB::raw(self::yearExpr()))
                ->orderByDesc('year')
                ->get();

            return $this->success($yearly);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    private static function monthExpr(): string
    {
        return DB::getDriverName() === 'sqlite'
            ? "CAST(strftime('%m', created_at) AS INTEGER)"
            : 'MONTH(created_at)';
    }

    private static function yearExpr(): string
    {
        return DB::getDriverName() === 'sqlite'
            ? "CAST(strftime('%Y', created_at) AS INTEGER)"
            : 'YEAR(created_at)';
    }
}
