<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StorePhone;
use App\Services\PhoneVerificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PhoneVerificationController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly PhoneVerificationService $phoneVerificationService
    ) {}

    public function sendCode(Request $request): JsonResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            'phone' => 'required|string|max:30',
        ]);

        $verifiable = null;
        $phone = $validated['phone'];

        if ($phone === $user->phone) {
            $verifiable = $user;
        } elseif ($user->store) {
            $storePhone = $user->store->phones()->where('phone', $phone)->first();
            if ($storePhone) {
                $verifiable = $storePhone;
            }
        }

        if (!$verifiable) {
            return $this->error('Phone number not found.', 404);
        }

        $code = $this->phoneVerificationService->generateCode($verifiable, $phone);

        $response = [
            'message' => 'Verification code sent.',
        ];

        if (app()->environment('local', 'testing')) {
            $response['debug_code'] = $code;
        }

        return $this->success($response);
    }

    public function verify(Request $request): JsonResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            'phone' => 'required|string|max:30',
            'code'  => 'required|string|size:6',
        ]);

        $verifiable = null;
        $phone = $validated['phone'];

        if ($phone === $user->phone) {
            $verifiable = $user;
        } elseif ($user->store) {
            $storePhone = $user->store->phones()->where('phone', $phone)->first();
            if ($storePhone) {
                $verifiable = $storePhone;
            }
        }

        if (!$verifiable) {
            return $this->error('Phone number not found.', 404);
        }

        $verified = $this->phoneVerificationService->verifyCode($verifiable, $phone, $validated['code']);

        if (!$verified) {
            return $this->error('Invalid or expired verification code.', 422);
        }

        return $this->success(['message' => 'Phone number verified successfully.']);
    }

    public function getPhones(Request $request): JsonResponse
    {
        $user = Auth::user();

        $phones = [];

        if ($user->phone) {
            $phones[] = [
                'phone'         => $user->phone,
                'is_primary'    => true,
                'verified'      => $user->isPhoneVerified(),
                'source'        => 'user',
            ];
        }

        if ($user->store) {
            foreach ($user->store->phones as $sp) {
                $phones[] = [
                    'id'            => $sp->id,
                    'phone'         => $sp->phone,
                    'is_primary'    => $sp->is_primary,
                    'verified'      => $sp->isVerified(),
                    'source'        => 'store',
                ];
            }
        }

        return $this->success($phones);
    }

    public function addPhone(Request $request): JsonResponse
    {
        $user = Auth::user();

        if (!$user->store) {
            return $this->error('No store found.', 404);
        }

        $validated = $request->validate([
            'phone' => 'required|string|max:30|unique:store_phones,phone',
        ]);

        $nextIndex = $user->store->phones()->max('order_index') + 1;

        $storePhone = $user->store->phones()->create([
            'phone'       => $validated['phone'],
            'is_primary'  => false,
            'order_index' => $nextIndex,
        ]);

        return $this->success([
            'id'            => $storePhone->id,
            'phone'         => $storePhone->phone,
            'is_primary'    => $storePhone->is_primary,
            'verified'      => false,
            'source'        => 'store',
        ], 201);
    }

    public function removePhone(Request $request, StorePhone $storePhone): JsonResponse
    {
        $user = Auth::user();

        if (!$user->store || $storePhone->store_id !== $user->store->id) {
            return $this->error('Unauthorized.', 403);
        }

        if ($storePhone->is_primary) {
            return $this->error('Cannot remove the primary phone number.', 422);
        }

        $storePhone->delete();

        return $this->success(['message' => 'Phone number removed.']);
    }

    public function setPrimary(Request $request, StorePhone $storePhone): JsonResponse
    {
        $user = Auth::user();

        if (!$user->store || $storePhone->store_id !== $user->store->id) {
            return $this->error('Unauthorized.', 403);
        }

        $user->store->phones()->update(['is_primary' => false]);
        $storePhone->update(['is_primary' => true]);

        return $this->success(['message' => 'Primary phone updated.']);
    }
}
