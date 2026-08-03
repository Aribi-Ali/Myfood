<?php

declare(strict_types=1);

namespace App\Providers;

use App\Models\Food;
use App\Models\Store;
use App\Models\Observers\FoodObserver;
use App\Models\Observers\StoreObserver;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;


class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // -----------------------------------------------------------------------
        // Dynamic Settings Override
        // -----------------------------------------------------------------------
        try {
            if (\Illuminate\Support\Facades\Schema::hasTable('settings')) {
                $dbSettings = \App\Models\Setting::getAll();
                foreach ($dbSettings as $key => $value) {
                    \Illuminate\Support\Facades\Config::set("business.{$key}", $value);
                }
            }
        } catch (\Throwable $e) {
            // Ignore during setup/migrations
        }

        // -----------------------------------------------------------------------
        // Model Observers — auto cache invalidation
        // -----------------------------------------------------------------------
        Food::observe(FoodObserver::class);
        Store::observe(StoreObserver::class);

        // -----------------------------------------------------------------------
        // Rate Limiters
        // -----------------------------------------------------------------------
        RateLimiter::for('auth', function (Request $request) {
            // Dev/e2e-friendly: Playwright setup logs in 5 roles back-to-back.
            return Limit::perMinute(60)->by($request->ip());
        });

        RateLimiter::for('search', function (Request $request) {
            return Limit::perMinute(30)->by($request->user()?->id ?: $request->ip());
        });

        RateLimiter::for('public-api', function (Request $request) {
            // Dev/e2e-friendly: Playwright suites hit public endpoints frequently from one IP.
            return Limit::perMinute(600)->by($request->user()?->id ?: $request->ip());
        });

        RateLimiter::for('orders', function (Request $request) {
            // Max 20 order placements per minute per user
            return Limit::perMinute(20)->by($request->user()?->id ?: $request->ip());
        });

        RateLimiter::for('otp', function (Request $request) {
            // Tight limit on code sends + verify attempts to prevent OTP brute force
            return Limit::perMinute(5)->by($request->user()?->id ?: $request->ip());
        });

    }
}