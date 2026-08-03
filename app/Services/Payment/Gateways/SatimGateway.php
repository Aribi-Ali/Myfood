<?php

declare(strict_types=1);

namespace App\Services\Payment\Gateways;

use App\Services\Payment\Contracts\PaymentGatewayInterface;
use App\Services\Payment\Contracts\PaymentResult;
use Illuminate\Support\Str;

class SatimGateway implements PaymentGatewayInterface
{
    public function __construct(private array $config = []) {}

    public function processPayment(float $amount, array $params = []): PaymentResult
    {
        $merchantId = $this->config['merchant_id'] ?? '';
        $returnUrl = $params['return_url'] ?? $this->config['return_url'] ?? '/payment/callback';
        $txId = 'SATIM-' . strtoupper(Str::random(16));

        $redirectUrl = $this->buildRedirectUrl($merchantId, $txId, $amount, $returnUrl);

        return PaymentResult::redirect($txId, $redirectUrl, 'Redirection vers SATIM pour le paiement');
    }

    public function verifyPayment(string $transactionId): PaymentResult
    {
        if (!str_starts_with($transactionId, 'SATIM-')) {
            return PaymentResult::failed('Identifiant de transaction SATIM invalide.');
        }

        $testMode = $this->config['test_mode'] ?? true;

        if ($testMode) {
            $succeeded = rand(1, 100) <= 80;

            if ($succeeded) {
                return PaymentResult::success($transactionId, 'Paiement SATIM vérifié avec succès.');
            }

            return PaymentResult::failed('Échec de la vérification du paiement SATIM.');
        }

        return PaymentResult::pending($transactionId, 'Vérification SATIM en cours...');
    }

    public function refund(string $transactionId, ?float $amount = null): PaymentResult
    {
        $testMode = $this->config['test_mode'] ?? true;

        if ($testMode) {
            $refundTxId = 'REF-' . $transactionId;

            return PaymentResult::success($refundTxId, 'Remboursement SATIM effectué avec succès.');
        }

        return PaymentResult::pending('REF-' . Str::random(16), 'Remboursement SATIM en cours de traitement...');
    }

    public function isAvailable(): bool
    {
        return !empty($this->config['merchant_id']);
    }

    private function buildRedirectUrl(string $merchantId, string $txId, float $amount, string $returnUrl): string
    {
        $testMode = $this->config['test_mode'] ?? true;

        if ($testMode) {
            $params = http_build_query([
                'merchant_id' => $merchantId,
                'transaction_id' => $txId,
                'amount' => $amount,
                'return_url' => $returnUrl,
                'test_mode' => '1',
            ]);

            return url('/payment/satim/mock?' . $params);
        }

        $baseUrl = $this->config['gateway_url'] ?? 'https://satim.gateway.dz/payment';

        $params = http_build_query([
            'merchant_id' => $merchantId,
            'transaction_id' => $txId,
            'amount' => (int) ($amount * 100),
            'currency' => 'DZD',
            'return_url' => $returnUrl,
        ]);

        return $baseUrl . '?' . $params;
    }
}
