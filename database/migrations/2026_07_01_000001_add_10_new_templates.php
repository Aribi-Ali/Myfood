<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();

        // ────────────────────────────────────────────────────────
        // 1. Template definitions
        // ────────────────────────────────────────────────────────
        $templates = [
            [
                'name' => 'Trattoria Roma',
                'slug' => 'trattoria-roma',
                'description' => 'Warm Italian trattoria with rustic reds and classic charm.',
                'category' => 'italian',
                'thumbnail' => null,
                'component_path' => 'trattoria-roma',
                'sort_order' => 24,
                'is_active' => true,
                'html_content' => null,
                'css_content' => null,
                'has_react_component' => true,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Sakura Zen',
                'slug' => 'sakura-zen',
                'description' => 'Minimal Japanese zen with cherry blossom elegance.',
                'category' => 'japanese',
                'thumbnail' => null,
                'component_path' => 'sakura-zen',
                'sort_order' => 25,
                'is_active' => true,
                'html_content' => null,
                'css_content' => null,
                'has_react_component' => true,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Fiesta Vibrant',
                'slug' => 'fiesta-vibrant',
                'description' => 'Bold Mexican fiesta with warm festive colors.',
                'category' => 'mexican',
                'thumbnail' => null,
                'component_path' => 'fiesta-vibrant',
                'sort_order' => 26,
                'is_active' => true,
                'html_content' => null,
                'css_content' => null,
                'has_react_component' => true,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Taj Spice',
                'slug' => 'taj-spice',
                'description' => 'Rich Indian royal with jewel tones and ornate borders.',
                'category' => 'indian',
                'thumbnail' => null,
                'component_path' => 'taj-spice',
                'sort_order' => 27,
                'is_active' => true,
                'html_content' => null,
                'css_content' => null,
                'has_react_component' => true,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Med Blue',
                'slug' => 'med-blue',
                'description' => 'Bright Greek Mediterranean with blue and white seaside charm.',
                'category' => 'mediterranean',
                'thumbnail' => null,
                'component_path' => 'med-blue',
                'sort_order' => 28,
                'is_active' => true,
                'html_content' => null,
                'css_content' => null,
                'has_react_component' => true,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Smoke Pit',
                'slug' => 'smoke-pit',
                'description' => 'Rustic American BBQ with dark wood and smoky vibes.',
                'category' => 'bbq',
                'thumbnail' => null,
                'component_path' => 'smoke-pit',
                'sort_order' => 29,
                'is_active' => true,
                'html_content' => null,
                'css_content' => null,
                'has_react_component' => true,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Green Plate',
                'slug' => 'green-plate',
                'description' => 'Fresh vegan haven with lively greens and natural tones.',
                'category' => 'vegan',
                'thumbnail' => null,
                'component_path' => 'green-plate',
                'sort_order' => 30,
                'is_active' => true,
                'html_content' => null,
                'css_content' => null,
                'has_react_component' => true,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Sweet Dreams',
                'slug' => 'sweet-dreams',
                'description' => 'Elegant French patisserie with delicate pastels.',
                'category' => 'patisserie',
                'thumbnail' => null,
                'component_path' => 'sweet-dreams',
                'sort_order' => 31,
                'is_active' => true,
                'html_content' => null,
                'css_content' => null,
                'has_react_component' => true,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Hops Barrel',
                'slug' => 'hops-barrel',
                'description' => 'Industrial brewpub with copper tones and amber warmth.',
                'category' => 'brewpub',
                'thumbnail' => null,
                'component_path' => 'hops-barrel',
                'sort_order' => 32,
                'is_active' => true,
                'html_content' => null,
                'css_content' => null,
                'has_react_component' => true,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Ocean Fresh',
                'slug' => 'ocean-fresh',
                'description' => 'Coastal seafood with nautical blues and ocean freshness.',
                'category' => 'seafood',
                'thumbnail' => null,
                'component_path' => 'ocean-fresh',
                'sort_order' => 33,
                'is_active' => true,
                'html_content' => null,
                'css_content' => null,
                'has_react_component' => true,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        // ────────────────────────────────────────────────────────
        // 2. Block types shared by all templates
        // ────────────────────────────────────────────────────────
        $blockTypes = ['hero', 'menu', 'reviews', 'staff', 'opening-hours', 'contact', 'footer'];

        // ────────────────────────────────────────────────────────
        // 3. Theme-preset definitions
        //    [slug, name, description, is_default, [colours...]]
        // ────────────────────────────────────────────────────────
        $presets = [
            // trattoria-roma
            ['trattoria-roma', 'Default', 'Warm Italian reds and cream', true, ['#8B0000', '#FFF8DC', '#2E8B57', '#D4A017']],
            ['trattoria-roma', 'Alternate', 'Darker reds with olive accents', false, ['#5C0000', '#F5E6CA', '#556B2F', '#C8922A']],

            // sakura-zen
            ['sakura-zen', 'Default', 'Cherry blossom pink elegance', true, ['#D4617A', '#FAF5F7', '#2D2D2D', '#93C572']],
            ['sakura-zen', 'Alternate', 'Dusty rose with olive tones', false, ['#B84A62', '#F0EBF0', '#1A1A1A', '#7A9E5A']],

            // fiesta-vibrant
            ['fiesta-vibrant', 'Default', 'Bold festive orange and gold', true, ['#FF6B35', '#FFF3E0', '#E63946', '#2A9D8F']],
            ['fiesta-vibrant', 'Alternate', 'Burnt orange with crimson', false, ['#E05A2A', '#FFE8CC', '#C53030', '#1E7A6F']],

            // taj-spice
            ['taj-spice', 'Default', 'Royal purple and amber', true, ['#2D1B69', '#FFFDD0', '#FFBF00', '#50C878']],
            ['taj-spice', 'Alternate', 'Deep indigo with forest green', false, ['#1F1252', '#FFF5E0', '#D4A800', '#3DA86A']],

            // med-blue
            ['med-blue', 'Default', 'Mediterranean blue and sandy white', true, ['#1E90FF', '#FDFBF7', '#003366', '#F5DEB3']],
            ['med-blue', 'Alternate', 'Steel blue with navy tones', false, ['#4682B4', '#F8F5F0', '#002244', '#E8D5A3']],

            // smoke-pit
            ['smoke-pit', 'Default', 'Dark wood and ember orange', true, ['#3E2723', '#FFF3E0', '#212121', '#FF6F00']],
            ['smoke-pit', 'Alternate', 'Espresso brown with rust', false, ['#2C1810', '#F5E6D0', '#1A1A1A', '#D65C00']],

            // green-plate
            ['green-plate', 'Default', 'Fresh sage and forest greens', true, ['#87C442', '#F5F5DC', '#2E7D32', '#2D3748']],
            ['green-plate', 'Alternate', 'Lime green with dark slate', false, ['#6DB33F', '#F0F0D8', '#236B28', '#1A2332']],

            // sweet-dreams
            ['sweet-dreams', 'Default', 'Soft pink and mint pastels', true, ['#FFB6C1', '#FFF5EE', '#98FB98', '#E6E6FA']],
            ['sweet-dreams', 'Alternate', 'Rose and periwinkle', false, ['#FF9EB5', '#FFFAF5', '#7EE87E', '#D8D8FF']],

            // hops-barrel
            ['hops-barrel', 'Default', 'Copper and amber tones', true, ['#B87333', '#F5E6CC', '#4A3728', '#FFBF00']],
            ['hops-barrel', 'Alternate', 'Dark copper with espresso', false, ['#8B5E3C', '#EDE0CC', '#2C1F14', '#E8AD00']],

            // ocean-fresh
            ['ocean-fresh', 'Default', 'Deep blue and coral', true, ['#0A4C7A', '#F4E4C1', '#063554', '#FF7F50']],
            ['ocean-fresh', 'Alternate', 'Royal blue with salmon', false, ['#1A5A8A', '#E8D4B0', '#042440', '#FF6B40']],
        ];

        // ────────────────────────────────────────────────────────
        // 4. Insert everything
        // ────────────────────────────────────────────────────────
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
            'trattoria-roma',
            'sakura-zen',
            'fiesta-vibrant',
            'taj-spice',
            'med-blue',
            'smoke-pit',
            'green-plate',
            'sweet-dreams',
            'hops-barrel',
            'ocean-fresh',
        ])->delete();
    }

    // ────────────────────────────────────────────────────────────
    // Build the full css_vars map from a 4-colour palette
    //
    //   colours[0] → primary
    //   colours[1] → background
    //   colours[2] → accent
    //   colours[3] → secondary
    // ────────────────────────────────────────────────────────────
    private function buildCssVars(array $colours, string $slug): array
    {
        $fontHeading = $this->pickFontHeading($slug);

        // Derive lighter / darker variants
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
            'trattoria-roma' => "'Playfair Display', serif",
            'sakura-zen'     => "'Noto Serif JP', serif",
            'fiesta-vibrant' => "'Fjalla One', sans-serif",
            'taj-spice'      => "'Playfair Display', serif",
            'med-blue'       => "'Playfair Display', serif",
            'smoke-pit'      => "'Bebas Neue', cursive",
            'green-plate'    => "'Quicksand', sans-serif",
            'sweet-dreams'   => "'Playfair Display', serif",
            'hops-barrel'    => "'Bebas Neue', cursive",
            'ocean-fresh'    => "'Playfair Display', serif",
        ];

        return $map[$slug] ?? "'Playfair Display', serif";
    }

    // ────────────────────────────────────────────────────────────
    // Simple colour helpers
    // ────────────────────────────────────────────────────────────

    /** Lighten a hex colour by blending it with white. $percent 0-100. */
    private function lighten(string $hex, int $percent): string
    {
        return $this->blend($hex, '#ffffff', $percent);
    }

    /** Darken a hex colour by blending it with black. */
    private function darken(string $hex, int $percent): string
    {
        return $this->blend($hex, '#000000', $percent);
    }

    /** Blend two hex colours. $percent = how much of $with to use (0-100). */
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

    /** Mix two colours (average). */
    private function mix(string $a, string $b, int $percent): string
    {
        // $percent controls the bias toward $b
        return $this->blend($a, $b, $percent);
    }

    /** Determine whether a hex colour is perceived as light. */
    private function isLight(string $hex): bool
    {
        $hex = ltrim($hex, '#');
        $r   = hexdec(substr($hex, 0, 2));
        $g   = hexdec(substr($hex, 2, 2));
        $b   = hexdec(substr($hex, 4, 2));

        // Relative luminance approximation
        $luminance = 0.299 * $r + 0.587 * $g + 0.114 * $b;

        return $luminance > 160;
    }
};
