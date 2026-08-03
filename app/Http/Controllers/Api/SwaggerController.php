<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use OpenApi\Attributes as OA;

#[OA\Info(
    version: "1.0.0",
    description: "API Documentation for the Food Delivery Application",
    title: "Pizza Delivery API"
)]
#[OA\Server(
    url: "http://localhost:8000",
    description: "Local API Server"
)]
#[OA\PathItem(path: "/api")]
class SwaggerController extends Controller
{
    #[OA\Get(
        path: "/api/health",
        summary: "Health Check",
        tags: ["System"],
        responses: [
            new OA\Response(response: 200, description: "System is healthy")
        ]
    )]
    public function health()
    {
        return response()->json(['status' => 'ok']);
    }
}
