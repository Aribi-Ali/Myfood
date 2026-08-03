<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\ApiResponse;
use App\Models\StoreDomain;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminDomainController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = StoreDomain::with(['store:id,name,alias']);

        if ($request->has('verified')) {
            $request->boolean('verified')
                ? $query->whereNotNull('verified_at')
                : $query->whereNull('verified_at');
        }

        if ($request->filled('search')) {
            $s = '%' . $request->search . '%';
            $query->where(function ($q) use ($s) {
                $q->where('domain', 'like', $s)
                  ->orWhereHas('store', fn ($sq) => $sq->where('name', 'like', $s));
            });
        }

        $domains = $query->orderByDesc('created_at')
            ->paginate(config('business.pagination.orders', 15));

        return $this->success($domains);
    }
}
