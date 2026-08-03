<?php

declare(strict_types=1);

namespace App\Services\Payment\Contracts;

interface PaymentGatewayInterface
{
    public function processPayment(float $amount, array $params = []): PaymentResult;
    public function verifyPayment(string $transactionId): PaymentResult;
    public function refund(string $transactionId, ?float $amount = null): PaymentResult;
    public function isAvailable(): bool;
}
