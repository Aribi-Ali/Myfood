<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class AuthPasswordController extends Controller
{
    use ApiResponse;

    public function forgotPassword(Request $request): JsonResponse
    {
        try {
            $data = $request->validate([
                'email' => 'required|email',
            ]);

            $status = Password::sendResetLink(
                $request->only('email')
            );

            if ($status === Password::RESET_LINK_SENT) {
                return $this->success(null, 200, 'Lien de réinitialisation envoyé par email.');
            }

            return $this->error(__($status), 400);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    public function resetPassword(Request $request): JsonResponse
    {
        try {
            $data = $request->validate([
                'token'    => 'required|string',
                'email'    => 'required|email|exists:users,email',
                'password' => ['required', 'confirmed', Rules\Password::min(8)->mixedCase()->numbers()],
            ]);

            $status = Password::reset(
                $request->only('email', 'password', 'password_confirmation', 'token'),
                function ($user, $password) {
                    $user->forceFill([
                        'password' => Hash::make($password),
                    ])->save();
                }
            );

            if ($status === Password::PASSWORD_RESET) {
                return $this->success(null, 200, 'Mot de passe réinitialisé avec succès.');
            }

            return $this->error(__($status), 400);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    public function user(): JsonResponse
    {
        try {
            $user = Auth::user()->load(['deliveryProfile', 'chefProfile', 'store']);

            if (!$user) {
                return $this->error('Non authentifié.', 401);
            }

            return $this->success([
                'id'             => $user->id,
                'name'           => $user->name,
                'email'          => $user->email,
                'phone'          => $user->phone,
                'role'           => $user->role instanceof \App\Enums\Role ? $user->role->value : $user->role,
                'profile_image'  => $user->profile_image ? asset('storage/' . $user->profile_image) : null,
                'wilaya'         => $user->wilaya,
                'address'        => $user->address,
                'delivery_profile' => $user->deliveryProfile ? [
                    'transporter_type' => $user->deliveryProfile->transporter_type,
                    'is_working'       => $user->deliveryProfile->is_working,
                    'phone'            => $user->deliveryProfile->phone,
                ] : null,
                'store'          => $user->store ? [
                    'id'    => $user->store->id,
                    'name'  => $user->store->name,
                    'alias' => $user->store->alias,
                ] : null,
            ]);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 500);
        }
    }
}
