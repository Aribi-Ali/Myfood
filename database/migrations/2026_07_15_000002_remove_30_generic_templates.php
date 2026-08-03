<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $slugs = [
            'sunrise-bistro', 'midnight-gleam', 'azure-wave', 'copper-haven',
            'pastel-palette', 'desert-sand', 'forest-hush', 'cosmic-diner',
            'vintage-charm', 'boho-chic', 'ivory-tower', 'sapphire-sky',
            'ruby-roastery', 'teal-terrace', 'lemon-zen', 'paper-rose',
            'marble-mist', 'coral-cove', 'steel-dream', 'quartz-quiet',
            'plum-piazza', 'olive-olympus', 'pine-pearl', 'dusk-draft',
            'mint-mosaic', 'lavender-lounge', 'citrus-circuit', 'ochre-orchard',
            'midnight-moon', 'cafe-nouveau',
        ];

        $ids = DB::table('templates')->whereIn('slug', $slugs)->pluck('id');

        if ($ids->isNotEmpty()) {
            DB::table('theme_presets')->whereIn('template_id', $ids)->delete();
            DB::table('template_blocks')->whereIn('template_id', $ids)->delete();
            DB::table('templates')->whereIn('id', $ids)->delete();
        }
    }

    public function down(): void
    {
        // Re-running the original migration 2026_07_15_000001_add_30_new_templates is recommended instead
    }
};
