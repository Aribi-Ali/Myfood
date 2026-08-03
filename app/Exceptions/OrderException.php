<?php

namespace App\Exceptions;

use Exception;

class OrderException extends Exception
{
    public static function foodUnavailable(string $foodName): self
    {
        return new self("Le produit «{$foodName}» n'est pas disponible actuellement.", 400);
    }

    public static function foodWrongStore(string $foodName): self
    {
        return new self("Le produit «{$foodName}» n'appartient pas à ce restaurant.", 400);
    }

    public static function storeNotApproved(): self
    {
        return new self("Ce restaurant n'est pas encore approuvé.", 403);
    }

    public static function storeNotFound(): self
    {
        return new self("Restaurant introuvable.", 404);
    }

    public static function invalidStatusTransition(string $from, string $to): self
    {
        return new self("Transition de statut invalide: {$from} → {$to}.", 422);
    }

    public static function unauthorized(): self
    {
        return new self("Non autorisé.", 403);
    }
}
