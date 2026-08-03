<?php

namespace App\Enums;

enum OrderStatus: string
{
    case Pending    = 'pending';
    case Confirmed  = 'confirmed';
    case Preparing  = 'preparing';
    case Ready      = 'ready';
    case Delivering = 'delivering';
    case Delivered  = 'delivered';
    case Cancelled  = 'cancelled';

    /** Human-readable label (French). */
    public function label(): string
    {
        return match($this) {
            self::Pending    => 'En attente',
            self::Confirmed  => 'Confirmée',
            self::Preparing  => 'En préparation',
            self::Ready      => 'Prête',
            self::Delivering => 'En livraison',
            self::Delivered  => 'Livrée',
            self::Cancelled  => 'Annulée',
        };
    }

    /** CSS/Tailwind color class for badges. */
    public function color(): string
    {
        return match($this) {
            self::Pending    => 'yellow',
            self::Confirmed  => 'blue',
            self::Preparing  => 'orange',
            self::Ready      => 'indigo',
            self::Delivering => 'purple',
            self::Delivered  => 'green',
            self::Cancelled  => 'red',
        };
    }

    /** Returns true if this status can transition to $next. */
    public function canTransitionTo(self $next): bool
    {
        $allowed = match($this) {
            self::Pending    => [self::Confirmed, self::Cancelled],
            self::Confirmed  => [self::Preparing, self::Cancelled],
            self::Preparing  => [self::Ready, self::Cancelled],
            self::Ready      => [self::Delivering, self::Delivered, self::Cancelled],
            self::Delivering => [self::Delivered, self::Cancelled],
            self::Delivered  => [],
            self::Cancelled  => [self::Pending],
        };

        return in_array($next, $allowed, true);
    }

    /** Returns all values as a plain array (for validation rules). */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /** Terminal statuses where no more changes are allowed. */
    public static function terminal(): array
    {
        return [self::Delivered->value];
    }
}
