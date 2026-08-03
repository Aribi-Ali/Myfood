<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PromoCode;
use App\Services\Feature;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PromoCodeController extends Controller
{
    use ApiResponse;

    /**
     * POST /api/v1/promo/validate
     * Validates a promo code and returns the discount amount.
     */
    public function validate(Request $request): JsonResponse
    {
        if (Feature::disabled('promo_codes')) {
            return $this->error('This feature is not available.', 404);
        }

        $request->validate([
            'code'      => 'required|string|max:50',
            'store_id'  => 'required|integer|exists:stores,id',
            'subtotal'  => 'required|numeric|min:0',
        ]);

        $code = PromoCode::where('code', strtoupper(trim($request->code)))
            ->where('is_active', true)
            ->first();

        if (!$code || !$code->isValidForStore((int) $request->store_id)) {
            return $this->error('Code promo invalide ou expiré.', 404);
        }

        $discount = $code->calculateDiscount((float) $request->subtotal);

        return $this->success([
            'valid'          => true,
            'code'           => $code->code,
            'discount_type'  => $code->type,
            'discount_value' => $code->value,
            'discount_amount'=> $discount,
            'promo_code_id'  => $code->id,
        ]);
    }
}
