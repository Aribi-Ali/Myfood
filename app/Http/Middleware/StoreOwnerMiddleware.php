<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class StoreOwnerMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        if (!$user) {
            abort(403, 'Unauthenticated.');
        }

        if ($user->isAdmin()) {
            return $next($request);
        }

        $store = $user->store;

        if (!$store) {
            abort(403, 'No store found for this account.');
        }

        if (!$store->is_approved) {
            abort(403, 'Your store has not been approved yet.');
        }

        $request->attributes->set('store', $store);

        return $next($request);
    }
}
