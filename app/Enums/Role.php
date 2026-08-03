<?php

namespace App\Enums;

enum Role: string
{
    case Admin = 'admin';
    case Owner = 'owner';
    case Delivery = 'delivery';
    case Client = 'client';
    case Chef = 'chef';

    public function label(): string
    {
        return match ($this) {
            self::Admin => 'Administrateur',
            self::Owner => 'Propriétaire',
            self::Delivery => 'Livreur',
            self::Client => 'Client',
            self::Chef => 'Chef Cuisinier',
        };
    }
}
