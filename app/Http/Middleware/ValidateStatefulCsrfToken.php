<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Symfony\Component\HttpFoundation\Response;

class ValidateStatefulCsrfToken
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! in_array($request->method(), ['POST', 'PUT', 'PATCH', 'DELETE'], true)) {
            return $next($request);
        }

        if (! $request->hasSession()) {
            return $next($request);
        }

        if ($request->bearerToken()) {
            return $next($request);
        }

        $headerToken = $request->header('X-XSRF-TOKEN');
        if (! $headerToken) {
            return response()->json(['message' => 'Missing CSRF token.'], 419);
        }

        // Match against the session token (standard Laravel CSRF approach)
        if (! hash_equals($request->session()->token(), $headerToken)) {
            return response()->json(['message' => 'Invalid CSRF token.'], 419);
        }

        return $next($request);
    }
}
