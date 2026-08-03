<?php

declare(strict_types=1);

namespace App\Services\Payment\Gateways;

use App\Services\Payment\Contracts\PaymentGatewayInterface;
use App\Services\Payment\Contracts\PaymentResult;
use Illuminate\Support\Str;

class BankTransferGateway implements PaymentGatewayInterface
{
    public function __construct(private array $config = []) {}

    public function processPayment(float $amount, array $params = []): PaymentResult
    {
        $bankName = $this->config['bank_name'] ?? '—';
        $accountNumber = $this->config['account_number'] ?? '—';
        $accountHolder = $this->config['account_holder'] ?? '—';
        $iban = $this->config['iban'] ?? '—';

        $message = sprintf(
            'Veuillez transférer %.2f DZD sur le compte suivant : %s - %s - %s (IBAN: %s). Utilisez l\'ID de transaction comme référence.',
            $amount,
            $bankName,
            $accountHolder,
            $accountNumber,
            $iban
        );

        $txId = 'BANK-' . strtoupper(Str::random(14));

        return PaymentResult::pending($txId, $message);
    }

    public function verifyPayment(string $transactionId): PaymentResult
    {
        return PaymentResult::pending($transactionId, 'Les virements bancaires nécessitent une vérification manuelle');
    }

    public function refund(string $transactionId, ?float $amount = null): PaymentResult
    {
        return PaymentResult::failed('Les remboursements par virement bancaire doivent être traités manuellement');
    }

    public function isAvailable(): bool
    {
        return !empty($this->config['bank_name']) && !empty($this->config['account_number']);
    }
}
