<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StoreSocialLink extends Model
{
    protected $fillable = ['store_id', 'platform', 'url', 'label'];

    /**
     * All supported platforms with their icons and display labels.
     */
    public static function platforms(): array
    {
        return [
            'facebook'  => ['icon' => '📘', 'label' => 'Facebook'],
            'instagram' => ['icon' => '📸', 'label' => 'Instagram'],
            'tiktok'    => ['icon' => '🎵', 'label' => 'TikTok'],
            'youtube'   => ['icon' => '▶️',  'label' => 'YouTube'],
            'x'         => ['icon' => '🐦', 'label' => 'X (Twitter)'],
            'snapchat'  => ['icon' => '👻', 'label' => 'Snapchat'],
            'whatsapp'  => ['icon' => '💬', 'label' => 'WhatsApp'],
            'website'   => ['icon' => '🌐', 'label' => 'Site Web'],
        ];
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * Get the emoji icon for this link's platform.
     */
    public function getIconAttribute(): string
    {
        return static::platforms()[$this->platform]['icon'] ?? '🔗';
    }
}
