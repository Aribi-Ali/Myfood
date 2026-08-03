<?php

use App\Exceptions\OrderException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        channels: __DIR__ . '/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Web middleware stack (only custom middleware — defaults already include
        // EncryptCookies, StartSession, ShareErrorsFromSession, ValidateCsrfToken)
        $middleware->web(append: [
            \App\Http\Middleware\SetLocale::class,
            \App\Http\Middleware\SetSecurityHeaders::class,
        ]);

        $middleware->validateCsrfTokens(except: [
            'broadcasting/auth',
        ]);

        // API middleware stack
        $middleware->api(prepend: [
            \Illuminate\Session\Middleware\StartSession::class,
            \Illuminate\Cookie\Middleware\EncryptCookies::class,
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
        ]);

        $middleware->api(append: [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
            \App\Http\Middleware\SetSecurityHeaders::class,
        ]);

        // Named middleware aliases
        $middleware->alias([
            'admin'       => \App\Http\Middleware\AdminMiddleware::class,
            'delivery'    => \App\Http\Middleware\DeliveryMiddleware::class,
            'store.owner' => \App\Http\Middleware\StoreOwnerMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Render OrderException as a JSON response on API routes
        $exceptions->render(function (OrderException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => $e->getMessage(),
                    'code'    => $e->getCode(),
                ], $e->getCode() ?: 400);
            }
        });
    })->create();
