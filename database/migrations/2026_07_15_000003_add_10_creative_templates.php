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
                'name' => 'Ember Blaze',
                'slug' => 'ember-blaze',
                'description' => 'Dark & fiery BBQ theme with bold ember reds and smoky tones.',
                'category' => 'bbq',
                'thumbnail' => null,
                'component_path' => 'ember-blaze',
                'sort_order' => 35,
                'is_active' => true,
                'html_content' => null,
                'css_content' => null,
                'has_react_component' => true,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Aurora Dawn',
                'slug' => 'aurora-dawn',
                'description' => 'Dreamy purple-to-pink gradient design for trendy cafés.',
                'category' => 'pastel',
                'thumbnail' => null,
                'component_path' => 'aurora-dawn',
                'sort_order' => 36,
                'is_active' => true,
                'html_content' => null,
                'css_content' => null,
                'has_react_component' => true,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Golden Wok',
                'slug' => 'golden-wok',
                'description' => 'Warm Asian-inspired theme with rich golds and reds.',
                'category' => 'asian',
                'thumbnail' => null,
                'component_path' => 'golden-wok',
                'sort_order' => 37,
                'is_active' => true,
                'html_content' => null,
                'css_content' => null,
                'has_react_component' => true,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Terracotta',
                'slug' => 'terracotta',
                'description' => 'Earthy Mediterranean clay tones with amber warmth.',
                'category' => 'mediterranean',
                'thumbnail' => null,
                'component_path' => 'terracotta',
                'sort_order' => 38,
                'is_active' => true,
                'html_content' => null,
                'css_content' => null,
                'has_react_component' => true,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Midnight Sushi',
                'slug' => 'midnight-sushi',
                'description' => 'Dark modern Japanese with neon cyan and rose accents.',
                'category' => 'japanese',
                'thumbnail' => null,
                'component_path' => 'midnight-sushi',
                'sort_order' => 39,
                'is_active' => true,
                'html_content' => null,
                'css_content' => null,
                'has_react_component' => true,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Whiskey Barrel',
                'slug' => 'whiskey-barrel',
                'description' => 'Rich warm wood tones and amber gold for bars & pubs.',
                'category' => 'brewpub',
                'thumbnail' => null,
                'component_path' => 'whiskey-barrel',
                'sort_order' => 40,
                'is_active' => true,
                'html_content' => null,
                'css_content' => null,
                'has_react_component' => true,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Blossom Garden',
                'slug' => 'blossom-garden',
                'description' => 'Soft romantic pink floral theme for patisseries & cafés.',
                'category' => 'patisserie',
                'thumbnail' => null,
                'component_path' => 'blossom-garden',
                'sort_order' => 41,
                'is_active' => true,
                'html_content' => null,
                'css_content' => null,
                'has_react_component' => true,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Carbon Grill',
                'slug' => 'carbon-grill',
                'description' => 'Sleek industrial monochrome with bold red accents.',
                'category' => 'american',
                'thumbnail' => null,
                'component_path' => 'carbon-grill',
                'sort_order' => 42,
                'is_active' => true,
                'html_content' => null,
                'css_content' => null,
                'has_react_component' => true,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Saffron Dream',
                'slug' => 'saffron-dream',
                'description' => 'Rich Indian jewel tones with saffron gold and deep maroon.',
                'category' => 'indian',
                'thumbnail' => null,
                'component_path' => 'saffron-dream',
                'sort_order' => 43,
                'is_active' => true,
                'html_content' => null,
                'css_content' => null,
                'has_react_component' => true,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Arctic White',
                'slug' => 'arctic-white',
                'description' => 'Ultra-clean Scandinavian minimalism with ice blue accents.',
                'category' => 'scandinavian',
                'thumbnail' => null,
                'component_path' => 'arctic-white',
                'sort_order' => 44,
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
            // ember-blaze
            ['ember-blaze', 'Default', 'Fiery ember reds and dark smoke', true, ['#dc2626', '#450a0a', '#f97316', '#1c1917']],
            ['ember-blaze', 'Night Inferno', 'Darker reds with charcoal', false, ['#b91c1c', '#0a0a0a', '#ea580c', '#171717']],

            // aurora-dawn
            ['aurora-dawn', 'Default', 'Purple-pink gradient dream', true, ['#8b5cf6', '#faf5ff', '#06b6d4', '#ec4899']],
            ['aurora-dawn', 'Mystic Haze', 'Dusty purple with teal', false, ['#7c3aed', '#f5f0ff', '#0891b2', '#db2777']],

            // golden-wok
            ['golden-wok', 'Default', 'Rich reds and imperial gold', true, ['#dc2626', '#fefce8', '#fcd34d', '#f59e0b']],
            ['golden-wok', 'Crimson Fortune', 'Deep crimson with amber', false, ['#991b1b', '#fef9c3', '#fbbf24', '#d97706']],

            // terracotta
            ['terracotta', 'Default', 'Warm clay and amber', true, ['#c2410c', '#fef9ef', '#fcd34d', '#d97706']],
            ['terracotta', 'Desert Bloom', 'Sienna with terracotta', false, ['#9a3412', '#fff7ed', '#fbbf24', '#b45309']],

            // midnight-sushi
            ['midnight-sushi', 'Default', 'Dark navy neon glow', true, ['#0f172a', '#020617', '#f43f5e', '#06b6d4']],
            ['midnight-sushi', 'Cyber Tokyo', 'Deep indigo with rose', false, ['#1e1b4b', '#000000', '#e11d48', '#0891b2']],

            // whiskey-barrel
            ['whiskey-barrel', 'Default', 'Rich barrel wood and amber', true, ['#78350f', '#fefce8', '#fcd34d', '#a16207']],
            ['whiskey-barrel', 'Single Malt', 'Dark oak with gold', false, ['#451a03', '#fef9c3', '#fbbf24', '#854d0e']],

            // blossom-garden
            ['blossom-garden', 'Default', 'Soft pink floral romance', true, ['#ec4899', '#fdf2f8', '#fbcfe8', '#f472b6']],
            ['blossom-garden', 'Cherry Bloom', 'Rose pink with cream', false, ['#db2777', '#fdf2f8', '#fecdd3', '#e879f9']],

            // carbon-grill
            ['carbon-grill', 'Default', 'Industrial dark monochrome', true, ['#171717', '#0a0a0a', '#f97316', '#dc2626']],
            ['carbon-grill', 'Titanium', 'Steel grey with red heat', false, ['#262626', '#000000', '#ea580c', '#b91c1c']],

            // saffron-dream
            ['saffron-dream', 'Default', 'Jewel maroon and saffron gold', true, ['#7c2d12', '#fffbeb', '#f59e0b', '#c2410c']],
            ['saffron-dream', 'Maharaja', 'Deep ruby with emerald', false, ['#5c1a0a', '#fff7ed', '#d97706', '#991b1b']],

            // arctic-white
            ['arctic-white', 'Default', 'Clean arctic white with ice blue', true, ['#0f172a', '#f8fafc', '#7dd3fc', '#38bdf8']],
            ['arctic-white', 'Frost', 'Slate and frost blue', false, ['#1e293b', '#f1f5f9', '#38bdf8', '#0ea5e9']],
        ];

        foreach ($templates as $tpl) {
            $slug = $tpl['slug'];
            $tplId = DB::table('templates')->insertGetId($tpl);

            // --- blocks ---
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

            // --- presets ---
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
            'ember-blaze', 'aurora-dawn', 'golden-wok', 'terracotta',
            'midnight-sushi', 'whiskey-barrel', 'blossom-garden',
            'carbon-grill', 'saffron-dream', 'arctic-white',
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
            'ember-blaze'     => "'Bebas Neue', cursive",
            'aurora-dawn'     => "'Playfair Display', serif",
            'golden-wok'      => "'Playfair Display', serif",
            'terracotta'      => "'Playfair Display', serif",
            'midnight-sushi'  => "'Inter', sans-serif",
            'whiskey-barrel'  => "'Bebas Neue', cursive",
            'blossom-garden'  => "'Playfair Display', serif",
            'carbon-grill'    => "'Fjalla One', sans-serif",
            'saffron-dream'   => "'Playfair Display', serif",
            'arctic-white'    => "'Inter', sans-serif",
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
