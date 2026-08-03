<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    /**
     * GET /api/v1/user — authenticated user profile.
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user()->load(['deliveryProfile.deliveryAreas', 'chefProfile', 'store']);

        return response()->json([
            'id'             => $user->id,
            'name'           => $user->name,
            'email'          => $user->email,
            'phone'             => $user->phone,
            'phone_verified_at' => $user->phone_verified_at?->toIso8601String(),
            'role'              => $user->role instanceof \App\Enums\Role ? $user->role->value : $user->role,
            'profile_image'  => $user->profile_image ? asset('storage/' . $user->profile_image) : null,
            'wilaya'         => $user->wilaya,
            'address'        => $user->address,
            'delivery_profile' => $user->deliveryProfile ? [
                'transporter_type' => $user->deliveryProfile->transporter_type,
                'is_working'       => $user->deliveryProfile->is_working,
                'phone'            => $user->deliveryProfile->phone,
                'day_price'        => $user->deliveryProfile->day_price,
                'night_price'      => $user->deliveryProfile->night_price,
                'areas'            => $user->deliveryProfile->deliveryAreas->load(['wilaya', 'daira', 'commune']),
            ] : null,
            'store' => $user->store ? [
                'id'                => $user->store->id,
                'name'              => $user->store->name,
                'alias'             => $user->store->alias,
                'onboarding_status' => $user->store->onboarding_status,
                'is_approved'       => $user->store->is_approved,
            ] : null,
        ]);
    }

    /**
     * PUT /api/v1/user — update profile.
     */
    public function update(Request $request): JsonResponse
    {
        $user = $request->user();

        $request->validate([
            'name'     => 'sometimes|string|min:2|max:100',
            'phone'    => 'sometimes|string|max:20',
            'wilaya'   => 'sometimes|nullable|string|max:100',
            'daira'    => 'sometimes|nullable|string|max:100',
            'commune'  => 'sometimes|nullable|string|max:100',
            'address'  => 'sometimes|nullable|string|max:500',
        ]);

        $user->update($request->only(['name', 'phone', 'wilaya', 'daira', 'commune', 'address']));

        return response()->json(['message' => 'Profil mis à jour.', 'user' => $user->fresh()]);
    }

    /**
     * POST /api/v1/user/avatar — upload profile image.
     */
    public function updateAvatar(Request $request): JsonResponse
    {
        $request->validate([
            'avatar' => ['required', 'image', 'max:5120', 'mimes:jpeg,png,webp'],
        ]);

        $user = $request->user();

        if ($user->profile_image && Storage::disk('public')->exists($user->profile_image)) {
            Storage::disk('public')->delete($user->profile_image);
        }

        $path = $request->file('avatar')->store('profile_images', 'public');
        $user->update(['profile_image' => $path]);

        return response()->json([
            'message'       => 'Photo de profil mise à jour.',
            'profile_image' => asset('storage/' . $path),
        ]);
    }

    /**
     * POST /api/v1/user/password — change password.
     */
    public function changePassword(Request $request): JsonResponse
    {
        $request->validate([
            'current_password' => 'required|string',
            'password'         => ['required', 'confirmed', Password::min(8)->mixedCase()->numbers()],
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Mot de passe actuel incorrect.'], 422);
        }

        $user->update(['password' => Hash::make($request->password)]);

        return response()->json(['message' => 'Mot de passe modifié avec succès.']);
    }

    /**
     * GET /api/v1/user/notifications — paginated notifications.
     */
    public function notifications(Request $request): JsonResponse
    {
        $notifications = $request->user()
            ->notifications()
            ->orderByDesc('created_at')
            ->paginate(20);

        return response()->json($notifications);
    }

    /**
     * POST /api/v1/user/notifications/read — mark all as read.
     */
    public function markNotificationsRead(Request $request): JsonResponse
    {
        $request->user()->unreadNotifications->markAsRead();
        return response()->json(['message' => 'Notifications marquées comme lues.']);
    }
}
