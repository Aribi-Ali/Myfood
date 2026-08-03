<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Feature;
use Illuminate\Http\JsonResponse;

class FeatureController extends Controller
{
    public function __invoke(): JsonResponse
    {
        return response()->json([
            'data' => Feature::all(),
        ]);
    }
}
