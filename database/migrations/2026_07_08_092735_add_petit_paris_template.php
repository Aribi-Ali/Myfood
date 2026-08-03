<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();

        $tplId = DB::table('templates')->insertGetId([
            'name' => 'Petit Paris',
            'slug' => 'petit-paris',
            'description' => 'Parisian art bistro with warm gold accents, deep navy elegance, and an artistic vibe.',
            'category' => 'french',
            'thumbnail' => null,
            'component_path' => 'petit-paris',
            'sort_order' => 34,
            'is_active' => true,
            'html_content' => null,
            'css_content' => null,
            'has_react_component' => true,
            'status' => 'active',
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        $blockTypes = ['hero', 'menu', 'reviews', 'staff', 'opening-hours', 'contact', 'footer'];
        foreach ($blockTypes as $i => $type) {
            DB::table('template_blocks')->insert([
                'template_id' => $tplId,
                'type' => $type,
                'label' => ucfirst(str_replace('-', ' ', $type)),
                'description' => null,
                'category' => 'general',
                'sort_order' => $i + 1,
                'config_schema' => null,
                'default_config' => null,
                'is_required' => false,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        // ── presets ──
        $presets = [
            // [name, description, is_default, [4 colors…]]
            ['Default', 'Deep navy and warm gold', true, ['#0F0F1A', '#F5F0EA', '#C9A84C', '#8B0000']],
            ['Alternate', 'Slate grey with amber', false, ['#1A1A2E', '#F0EBE0', '#D4AF37', '#6B2737']],
        ];

        foreach ($presets as $p) {
            $cssVars = $this->buildCssVars($p[3], 'petit-paris');
            DB::table('theme_presets')->insert([
                'template_id' => $tplId,
                'name' => $p[0],
                'description' => $p[1],
                'css_vars' => json_encode($cssVars),
                'colors' => json_encode($p[3]),
                'is_default' => $p[2],
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
    }

    public function down(): void
    {
        DB::table('templates')->where('slug', 'petit-paris')->delete();
    }

    private function buildCssVars(array $colours, string $slug): array
    {
        return [
            '--color-primary'         => $colours[0],
            '--color-primary-light'   => $this->lighten($colours[0], 30),
            '--color-secondary'       => $colours[3],
            '--color-accent'          => $colours[2],
            '--color-background'      => $colours[1],
            '--color-background-alt'  => $this->mix($colours[1], '#f0f0f0', 50),
            '--color-surface'         => '#FFFFFF',
            '--color-text'            => $this->isLight($colours[1]) ? '#1a1a1a' : '#f5f5f5',
            '--color-text-muted'      => $this->isLight($colours[1]) ? '#6b7280' : '#9ca3af',
            '--color-heading'         => $this->darken($colours[0], 20),
            '--color-border'          => $colours[3],
            '--color-success'         => $colours[2],
            '--color-error'           => $colours[0],
            '--font-heading'          => "'Cormorant Garamond', serif",
            '--font-body'             => "'Inter', system-ui, sans-serif",
        ];
    }

    private function pickFontHeading(string $slug): string
    {
        return "'Cormorant Garamond', serif";
    }

    private function lighten(string $hex, int $percent): string
    {
        return $this->blend($hex, '#ffffff', $percent);
    }

    private function darken(string $hex, int $percent): string
    {
        return $this->blend($hex, '#000000', $percent);
    }

    private function blend(string $from, string $with, int $percent): string
    {
        $from = ltrim($from, '#');
        $with = ltrim($with, '#');

        $fR = hexdec(substr($from, 0, 2));
        $fG = hexdec(substr($from, 2, 2));
        $fB = hexdec(substr($from, 4, 2));

        $wR = hexdec(substr($with, 0, 2));
        $wG = hexdec(substr($with, 2, 2));
        $wB = hexdec(substr($with, 4, 2));

        $ratio = $percent / 100;

        $r = round($fR + ($wR - $fR) * $ratio);
        $g = round($fG + ($wG - $fG) * $ratio);
        $b = round($fB + ($wB - $fB) * $ratio);

        return sprintf('#%02x%02x%02x', $r, $g, $b);
    }

    private function mix(string $a, string $b, int $percent): string
    {
        return $this->blend($a, $b, $percent);
    }

    private function isLight(string $hex): bool
    {
        $hex = ltrim($hex, '#');
        $r   = hexdec(substr($hex, 0, 2));
        $g   = hexdec(substr($hex, 2, 2));
        $b   = hexdec(substr($hex, 4, 2));

        $luminance = 0.299 * $r + 0.587 * $g + 0.114 * $b;

        return $luminance > 160;
    }
};
