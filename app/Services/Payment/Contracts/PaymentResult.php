<?php

declare(strict_types=1);

namespace App\Services\Payment\Contracts;

class PaymentResult
{
    public function __construct(
        public readonly bool $success,
        public readonly string $transactionId,
        public readonly string $status,
        public readonly ?string $message = null,
        public readonly ?string $redirectUrl = null,
        public readonly ?array $metadata = null,
    ) {}

    public static function success(string $txId, ?string $message = null, ?array $metadata = null): self
    {
        return new self(
            success: true,
            transactionId: $txId,
            status: 'completed',
            message: $message,
            metadata: $metadata,
        );
    }

    public static function pending(string $txId, ?string $message = null, ?string $redirectUrl = null): self
    {
        return new self(
            success: true,
            transactionId: $txId,
            status: 'pending',
            message: $message,
            redirectUrl: $redirectUrl,
        );
    }

    public static function failed(string $message): self
    {
        return new self(
            success: false,
            transactionId: '',
            status: 'failed',
            message: $message,
        );
    }

    public static function redirect(string $txId, string $url, ?string $message = null): self
    {
        return new self(
            success: true,
            transactionId: $txId,
            status: 'redirect',
            message: $message,
            redirectUrl: $url,
        );
    }
}
