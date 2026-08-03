<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();

        $templates = [
            [
                'name' => 'Bamboo Garden',
                'slug' => 'bamboo-garden',
                'description' => 'Zen-inspired green palette with bamboo textures — perfect for Asian & sushi restaurants.',
                'category' => 'asian',
                'thumbnail' => null,
                'component_path' => 'bamboo-garden',
                'sort_order' => 45,
                'is_active' => true,
                'html_content' => null,
                'css_content' => null,
                'has_react_component' => true,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Crimson Night',
                'slug' => 'crimson-night',
                'description' => 'Dark burgundy with gold accents — romantic upscale dining atmosphere.',
                'category' => 'premium',
                'thumbnail' => null,
                'component_path' => 'crimson-night',
                'sort_order' => 46,
                'is_active' => true,
                'html_content' => null,
                'css_content' => null,
                'has_react_component' => true,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Ocean Wave',
                'slug' => 'ocean-wave',
                'description' => 'Coastal blue-teal gradient — ideal for seafood shacks & beachside cafés.',
                'category' => 'seafood',
                'thumbnail' => null,
                'component_path' => 'ocean-wave',
                'sort_order' => 47,
                'is_active' => true,
                'html_content' => null,
                'css_content' => null,
                'has_react_component' => true,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Sunset Glow',
                'slug' => 'sunset-glow',
                'description' => 'Warm orange-to-purple sunset gradient — vibrant tropical dining experience.',
                'category' => 'tropical',
                'thumbnail' => null,
                'component_path' => 'sunset-glow',
                'sort_order' => 48,
                'is_active' => true,
                'html_content' => null,
                'css_content' => null,
                'has_react_component' => true,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Mono Chic',
                'slug' => 'mono-chic',
                'description' => 'Strict black & white minimalism — high-end fashion-forward dining.',
                'category' => 'modern',
                'thumbnail' => null,
                'component_path' => 'mono-chic',
                'sort_order' => 49,
                'is_active' => true,
                'html_content' => null,
                'css_content' => null,
                'has_react_component' => true,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Forest Canopy',
                'slug' => 'forest-canopy',
                'description' => 'Deep emerald green with wooden earth tones — farm-to-table & organic eateries.',
                'category' => 'organic',
                'thumbnail' => null,
                'component_path' => 'forest-canopy',
                'sort_order' => 50,
                'is_active' => true,
                'html_content' => null,
                'css_content' => null,
                'has_react_component' => true,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Desert Rose',
                'slug' => 'desert-rose',
                'description' => 'Terracotta & rose gold with sand textures — Middle Eastern & Moroccan cuisine.',
                'category' => 'mediterranean',
                'thumbnail' => null,
                'component_path' => 'desert-rose',
                'sort_order' => 51,
                'is_active' => true,
                'html_content' => null,
                'css_content' => null,
                'has_react_component' => true,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Neon Pulse',
                'slug' => 'neon-pulse',
                'description' => 'Dark purple with cyan & magenta neon — cyberpunk-themed bars & lounges.',
                'category' => 'modern',
                'thumbnail' => null,
                'component_path' => 'neon-pulse',
                'sort_order' => 52,
                'is_active' => true,
                'html_content' => null,
                'css_content' => null,
                'has_react_component' => true,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Harvest Gold',
                'slug' => 'harvest-gold',
                'description' => 'Amber & wheat gold tones — rustic farmhouse bakeries & country kitchens.',
                'category' => 'organic',
                'thumbnail' => null,
                'component_path' => 'harvest-gold',
                'sort_order' => 53,
                'is_active' => true,
                'html_content' => null,
                'css_content' => null,
                'has_react_component' => true,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Ivory Lace',
                'slug' => 'ivory-lace',
                'description' => 'Cream & ivory with blush rose accents — vintage tea rooms & patisseries.',
                'category' => 'patisserie',
                'thumbnail' => null,
                'component_path' => 'ivory-lace',
                'sort_order' => 54,
                'is_active' => true,
                'html_content' => null,
                'css_content' => null,
                'has_react_component' => true,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        $blockTypes = ['hero', 'menu', 'reviews', 'staff', 'opening-hours', 'contact', 'footer'];

        $presets = [
            // bamboo-garden
            ['bamboo-garden', 'Default', 'Zen green bamboo', true, ['#2d6a4f', '#f0fdf4', '#fbbf24', '#1a3c34']],
            ['bamboo-garden', 'Spring Rain', 'Soft mint with teal', false, ['#40916c', '#f5faf5', '#fcd34d', '#1e4d3a']],

            // crimson-night
            ['crimson-night', 'Default', 'Deep burgundy & gold', true, ['#6b0f1a', '#1a0a0e', '#c9a84c', '#3d0c12']],
            ['crimson-night', 'Royal Velvet', 'Crimson with brass', false, ['#800020', '#12080a', '#d4af37', '#2d0810']],

            // ocean-wave
            ['ocean-wave', 'Default', 'Coastal blue wave', true, ['#0077b6', '#f0faff', '#00b4d8', '#023e8a']],
            ['ocean-wave', 'Deep Current', 'Navy with aqua', false, ['#023e8a', '#e6f7ff', '#0096c7', '#03045e']],

            // sunset-glow
            ['sunset-glow', 'Default', 'Warm sunset gradient', true, ['#ff6b35', '#1a0a2e', '#f7c59f', '#ef476f']],
            ['sunset-glow', 'Golden Hour', 'Amber with coral', false, ['#e85d04', '#0d0221', '#fca311', '#d90429']],

            // mono-chic
            ['mono-chic', 'Default', 'Pure monochrome', true, ['#1a1a1a', '#ffffff', '#f5f5f5', '#000000']],
            ['mono-chic', 'Charcoal', 'Gray scale elegance', false, ['#2d2d2d', '#fafafa', '#e0e0e0', '#0a0a0a']],

            // forest-canopy
            ['forest-canopy', 'Default', 'Deep emerald forest', true, ['#1b4332', '#f5faf5', '#95d5b2', '#2d6a4f']],
            ['forest-canopy', 'Mossy Wood', 'Forest with brown', false, ['#2d6a4f', '#f0faf0', '#74c69d', '#52b788']],

            // desert-rose
            ['desert-rose', 'Default', 'Terracotta & rose', true, ['#b76e79', '#fef6f0', '#e8a87c', '#c38d7b']],
            ['desert-rose', 'Sahara Bloom', 'Sienna with gold', false, ['#c2410c', '#fef9ef', '#fcd34d', '#9a3412']],

            // neon-pulse
            ['neon-pulse', 'Default', 'Cyberpunk neon', true, ['#0f0f23', '#050510', '#00ff9f', '#ff00ff']],
            ['neon-pulse', 'Synthwave', 'Deep violet cyan', false, ['#1a0033', '#0a0015', '#00ffff', '#ff00aa']],

            // harvest-gold
            ['harvest-gold', 'Default', 'Amber wheat gold', true, ['#c85a17', '#fefce8', '#fcd34d', '#92400e']],
            ['harvest-gold', 'Autumn Bounty', 'Pumpkin with cream', false, ['#d97706', '#fffbeb', '#fbbf24', '#78350f']],

            // ivory-lace
            ['ivory-lace', 'Default', 'Ivory cream blush', true, ['#e8b4b8', '#fdfbf7', '#d4a5a5', '#c9a4a4']],
            ['ivory-lace', 'Blush Petal', 'Rose with cream', false, ['#d991a3', '#fcf9f2', '#e8b4b8', '#c0848c']],
        ];

        foreach ($templates as $tpl) {
            $slug = $tpl['slug'];
            $tplId = DB::table('templates')->insertGetId($tpl);

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

            $templatePresets = array_filter($presets, fn ($p) => $p[0] === $slug);
            foreach ($templatePresets as $p) {
                $cssVars = $this->buildCssVars($p[4], $slug);
                DB::table('theme_presets')->insert([
                    'template_id' => $tplId,
                    'name' => $p[1],
                    'description' => $p[2],
                    'css_vars' => json_encode($cssVars),
                    'colors' => json_encode($p[4]),
                    'is_default' => $p[3],
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }
    }

    public function down(): void
    {
        DB::table('templates')->whereIn('slug', [
            'bamboo-garden', 'crimson-night', 'ocean-wave', 'sunset-glow',
            'mono-chic', 'forest-canopy', 'desert-rose', 'neon-pulse',
            'harvest-gold', 'ivory-lace',
        ])->delete();
    }

    private function buildCssVars(array $colours, string $slug): array
    {
        $fontHeading = $this->pickFontHeading($slug);

        $primaryLight = $this->lighten($colours[0], 30);
        $heading      = $this->darken($colours[0], 20);
        $error        = $colours[0];
        $success      = $colours[2];
        $bgAlt        = $this->mix($colours[1], '#f0f0f0', 50);
        $border       = $colours[3];
        $text         = $this->isLight($colours[1]) ? '#1a1a1a' : '#f5f5f5';
        $textMuted    = $this->isLight($colours[1]) ? '#6b7280' : '#9ca3af';

        return [
            '--color-primary'         => $colours[0],
            '--color-primary-light'   => $primaryLight,
            '--color-secondary'       => $colours[3],
            '--color-accent'          => $colours[2],
            '--color-background'      => $colours[1],
            '--color-background-alt'  => $bgAlt,
            '--color-surface'         => '#FFFFFF',
            '--color-text'            => $text,
            '--color-text-muted'      => $textMuted,
            '--color-heading'         => $heading,
            '--color-border'          => $border,
            '--color-success'         => $success,
            '--color-error'           => $error,
            '--font-heading'          => $fontHeading,
            '--font-body'             => "'Inter', system-ui, sans-serif",
        ];
    }

    private function pickFontHeading(string $slug): string
    {
        $map = [
            'bamboo-garden' => "'Playfair Display', serif",
            'crimson-night' => "'Playfair Display', serif",
            'ocean-wave'    => "'Quicksand', sans-serif",
            'sunset-glow'   => "'Fjalla One', sans-serif",
            'mono-chic'     => "'Inter', sans-serif",
            'forest-canopy' => "'Quicksand', sans-serif",
            'desert-rose'   => "'Playfair Display', serif",
            'neon-pulse'    => "'Fjalla One', sans-serif",
            'harvest-gold'  => "'Playfair Display', serif",
            'ivory-lace'    => "'Playfair Display', serif",
        ];

        return $map[$slug] ?? "'Playfair Display', serif";
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
