<?php

declare(strict_types=1);

namespace App\Services;

final class Feature
{
    /**
     * Check if a feature is enabled.
     */
    public static function enabled(string $feature): bool
    {
        return (bool) config("features.{$feature}", false);
    }

    /**
     * Check if a feature is disabled.
     */
    public static function disabled(string $feature): bool
    {
        return ! static::enabled($feature);
    }

    /**
     * Return all feature flags (for the public API).
     *
     * @return array<string, bool>
     */
    public static function all(): array
    {
        $flags = config('features', []);

        return array_map(fn ($v) => (bool) $v, $flags);
    }
}
