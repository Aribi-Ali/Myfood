<?php

declare(strict_types=1);

namespace App\Services\Payment\Gateways;

use App\Services\Payment\Contracts\PaymentGatewayInterface;
use App\Services\Payment\Contracts\PaymentResult;
use Illuminate\Support\Str;

class CashGateway implements PaymentGatewayInterface
{
    public function processPayment(float $amount, array $params = []): PaymentResult
    {
        $txId = 'CASH-' . strtoupper(Str::random(12));

        return PaymentResult::pending($txId, 'Paiement en espèces en attente au bureau');
    }

    public function verifyPayment(string $transactionId): PaymentResult
    {
        return PaymentResult::pending($transactionId, 'Les paiements en espèces nécessitent une vérification manuelle');
    }

    public function refund(string $transactionId, ?float $amount = null): PaymentResult
    {
        return PaymentResult::failed('Les remboursements en espèces doivent être traités manuellement');
    }

    public function isAvailable(): bool
    {
        return true;
    }
}
