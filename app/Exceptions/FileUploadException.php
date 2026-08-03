<?php

namespace App\Exceptions;

use Exception;

class FileUploadException extends Exception
{
    public static function tooLarge(int $maxKb): self
    {
        $maxMb = round($maxKb / 1024, 1);
        return new self("Le fichier dépasse la taille maximale autorisée ({$maxMb} Mo).", 422);
    }

    public static function invalidType(array $allowed): self
    {
        $types = implode(', ', $allowed);
        return new self("Type de fichier non autorisé. Types acceptés: {$types}.", 422);
    }

    public static function storageFailed(): self
    {
        return new self("Impossible de sauvegarder le fichier. Veuillez réessayer.", 500);
    }

    public static function deleteFailed(): self
    {
        return new self("Impossible de supprimer l'ancien fichier.", 500);
    }
}
