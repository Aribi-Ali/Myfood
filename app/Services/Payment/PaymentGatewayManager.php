<?php

declare(strict_types=1);

namespace App\Services\Payment;

use App\Models\PaymentGateway;
use App\Services\Payment\Contracts\PaymentGatewayInterface;
use App\Services\Payment\Contracts\PaymentResult;
use App\Services\Payment\Gateways\BankTransferGateway;
use App\Services\Payment\Gateways\CashGateway;
use App\Services\Payment\Gateways\SatimGateway;
use InvalidArgumentException;

class PaymentGatewayManager
{
    private array $gateways = [];

    public function __construct()
    {
        $this->boot();
    }

    private function boot(): void
    {
        $gateways = PaymentGateway::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        foreach ($gateways as $gateway) {
            $this->gateways[$gateway->code] = $this->resolve($gateway);
        }
    }

    private function resolve(PaymentGateway $gateway): PaymentGatewayInterface
    {
        $config = $gateway->config ?? [];
        $config['test_mode'] = $config['test_mode'] ?? true;

        return match ($gateway->code) {
            'satim' => new SatimGateway($config),
            'cash' => new CashGateway(),
            'bank_transfer' => new BankTransferGateway($config),
            default => throw new InvalidArgumentException("Unsupported payment gateway: {$gateway->code}"),
        };
    }

    public function gateway(string $code): PaymentGatewayInterface
    {
        if (!isset($this->gateways[$code])) {
            throw new InvalidArgumentException("Payment gateway '{$code}' is not registered or inactive.");
        }

        return $this->gateways[$code];
    }

    public function availableGateways(): array
    {
        $available = [];

        foreach ($this->gateways as $code => $instance) {
            if ($instance->isAvailable()) {
                $gateway = PaymentGateway::where('code', $code)->first();
                $available[] = [
                    'code' => $code,
                    'name' => $gateway?->name ?? $code,
                    'instance' => $instance,
                ];
            }
        }

        return $available;
    }

    public function process(string $code, float $amount, array $params = []): PaymentResult
    {
        return $this->gateway($code)->processPayment($amount, $params);
    }
}
