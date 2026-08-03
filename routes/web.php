<?php

use Illuminate\Support\Facades\Route;

// Required named route so Password::sendResetLink() can generate reset URLs.
Route::get('/reset-password/{token}', function (string $token) {
    return redirect()->away(config('app.frontend_url') . '/auth/reset-password?token=' . $token);
})->name('password.reset');
