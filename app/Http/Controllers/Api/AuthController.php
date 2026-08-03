<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Enums\Role;
use App\Http\Requests\Api\LoginRequest;
use App\Http\Requests\Api\RegisterRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    use ApiResponse;
    public function login(LoginRequest $request): JsonResponse
    {
        $loginField = filter_var($request->email, FILTER_VALIDATE_EMAIL) ? 'email' : 'phone';
        $user = User::where($loginField, $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants fournis sont incorrects.'],
            ]);
        }

        if ($user->isGloballyBanned()) {
            $ban = $user->activeBan;
            $reason = $ban?->reason ?? 'Your account has been suspended.';
            throw ValidationException::withMessages([
                'email' => [$reason],
            ]);
        }

        $responseData = [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ]
        ];

        // SPA (browser) — use session cookie
        if (! $request->has('device_name')) {
            Auth::guard('web')->login($user);
            $request->session()->regenerate();
        } else {
            // Mobile / API client — return Bearer token
            $deviceName = $request->device_name ?? 'mobile-app';
            $responseData['token'] = $user->createToken($deviceName)->plainTextToken;
        }

        return $this->success($responseData);
    }

    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        if ($user->role === Role::Delivery) {
            $user->deliveryProfile()->create([
                'phone' => $user->phone,
                'is_working' => false,
                'transporter_type' => 'bike',
            ]);
        }

        $responseData = [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
            ]
        ];

        // SPA (browser) — use session cookie
        if (! $request->has('device_name')) {
            Auth::guard('web')->login($user);
            $request->session()->regenerate();
        } else {
            // Mobile / API client — return Bearer token
            $responseData['token'] = $user->createToken('register-token')->plainTextToken;
        }

        return $this->success($responseData, 201);
    }

    public function logout(Request $request): JsonResponse
    {
        // Revoke token if using Bearer
        if ($request->bearerToken() && $request->user()) {
            $request->user()->currentAccessToken()->delete();
        }

        // Log out of session if using SPA
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Déconnexion réussie.'
        ]);
    }
}
