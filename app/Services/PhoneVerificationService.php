<?php

namespace App\Services;

use App\Models\PhoneVerificationCode;
use App\Models\StorePhone;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class PhoneVerificationService
{
    public function generateCode(Model $verifiable, string $phone): string
    {
        PhoneVerificationCode::where('verifiable_id', $verifiable->id)
            ->where('verifiable_type', get_class($verifiable))
            ->where('phone', $phone)
            ->pending()
            ->update(['verified_at' => now()]);

        $code = (string) random_int(100000, 999999);

        PhoneVerificationCode::create([
            'verifiable_id'   => $verifiable->id,
            'verifiable_type' => get_class($verifiable),
            'phone'           => $phone,
            'code'            => $code,
            'expires_at'      => now()->addMinutes(10),
        ]);

        return $code;
    }

    public function verifyCode(Model $verifiable, string $phone, string $code): bool
    {
        $record = PhoneVerificationCode::where('verifiable_id', $verifiable->id)
            ->where('verifiable_type', get_class($verifiable))
            ->where('phone', $phone)
            ->where('code', $code)
            ->pending()
            ->latest()
            ->first();

        if (!$record) {
            return false;
        }

        $record->update(['verified_at' => now()]);

        if ($verifiable instanceof User) {
            $verifiable->update(['phone_verified_at' => now()]);
        } elseif ($verifiable instanceof StorePhone) {
            $verifiable->update(['verified_at' => now()]);
        }

        return true;
    }

    public function isVerified(Model $verifiable, string $phone): bool
    {
        if ($verifiable instanceof User) {
            return $verifiable->phone === $phone && $verifiable->isPhoneVerified();
        }

        if ($verifiable instanceof StorePhone) {
            return $verifiable->phone === $phone && $verifiable->isVerified();
        }

        return false;
    }
}
