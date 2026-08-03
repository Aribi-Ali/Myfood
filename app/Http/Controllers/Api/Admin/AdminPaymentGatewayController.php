<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\ApiResponse;
use App\Models\PaymentGateway;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminPaymentGatewayController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        return $this->success(PaymentGateway::orderBy('sort_order')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'code'                => 'required|string|max:100|unique:payment_gateways,code',
            'name'                => 'required|string|max:255',
            'is_active'           => 'nullable|boolean',
            'config'              => 'nullable|json',
            'supported_currencies'=> 'nullable|json',
            'sort_order'          => 'nullable|integer|min:0',
        ]);

        if (isset($data['config']) && is_string($data['config'])) {
            $data['config'] = json_decode($data['config'], true);
        }
        if (isset($data['supported_currencies']) && is_string($data['supported_currencies'])) {
            $data['supported_currencies'] = json_decode($data['supported_currencies'], true);
        }

        $gateway = PaymentGateway::create([
            'code'                => $data['code'],
            'name'                => $data['name'],
            'is_active'           => $data['is_active'] ?? true,
            'config'              => $data['config'] ?? null,
            'supported_currencies'=> $data['supported_currencies'] ?? null,
            'sort_order'          => $data['sort_order'] ?? 0,
        ]);

        return $this->success($gateway, 201, 'Payment gateway created.');
    }

    public function show(PaymentGateway $paymentGateway): JsonResponse
    {
        return $this->success($paymentGateway);
    }

    public function update(Request $request, PaymentGateway $paymentGateway): JsonResponse
    {
        $data = $request->validate([
            'code'                => 'sometimes|required|string|max:100|unique:payment_gateways,code,' . $paymentGateway->id,
            'name'                => 'sometimes|required|string|max:255',
            'is_active'           => 'nullable|boolean',
            'config'              => 'nullable|json',
            'supported_currencies'=> 'nullable|json',
            'sort_order'          => 'nullable|integer|min:0',
        ]);

        if (isset($data['config']) && is_string($data['config'])) {
            $data['config'] = json_decode($data['config'], true);
        }
        if (isset($data['supported_currencies']) && is_string($data['supported_currencies'])) {
            $data['supported_currencies'] = json_decode($data['supported_currencies'], true);
        }

        $paymentGateway->update($data);

        return $this->success($paymentGateway->fresh(), 200, 'Payment gateway updated.');
    }

    public function destroy(PaymentGateway $paymentGateway): JsonResponse
    {
        $paymentGateway->delete();

        return $this->success(null, 200, 'Payment gateway deleted.');
    }
}
