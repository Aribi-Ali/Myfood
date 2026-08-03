<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class HealthController extends Controller
{
    public function __invoke(): JsonResponse
    {
        try {
            DB::connection()->getPdo();
            $dbOk = true;
        } catch (\Exception $e) {
            $dbOk = false;
        }

        $status = $dbOk ? 'healthy' : 'degraded';

        return response()->json([
            'status'    => $status,
            'database'  => $dbOk ? 'connected' : 'unavailable',
            'timestamp' => now()->toIso8601String(),
            'version'   => config('app.version', '1.0.0'),
        ], $dbOk ? 200 : 503);
    }
}
