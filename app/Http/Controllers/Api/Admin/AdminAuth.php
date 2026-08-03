<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

trait AdminAuth
{
    private function checkAdmin(): ?JsonResponse
    {
        if (!Auth::user()?->isAdmin()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        return null;
    }
}
