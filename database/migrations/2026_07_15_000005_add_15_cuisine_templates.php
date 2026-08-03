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
                'name' => 'Tokyo Ramen',
                'slug' => 'tokyo-ramen',
                'description' => 'Warm broth-toned Japanese ramen shop with dark wood accents.',
                'category' => 'japanese',
                'thumbnail' => null,
                'component_path' => 'tokyo-ramen',
                'sort_order' => 55,
                'is_active' => true,
                'html_content' => null,
                'css_content' => null,
                'has_react_component' => true,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Margherita Bliss',
                'slug' => 'margherita-bliss',
                'description' => 'Classic Italian pizzeria with red, white & green tricolore palette.',
                'category' => 'italian',
                'thumbnail' => null,
                'component_path' => 'margherita-bliss',
                'sort_order' => 56,
                'is_active' => true,
                'html_content' => null,
                'css_content' => null,
                'has_react_component' => true,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Taco Fiesta',
                'slug' => 'taco-fiesta',
                'description' => 'Vibrant Mexican fiesta with bright oranges and warm greens.',
                'category' => 'mexican',
                'thumbnail' => null,
                'component_path' => 'taco-fiesta',
                'sort_order' => 57,
                'is_active' => true,
                'html_content' => null,
                'css_content' => null,
                'has_react_component' => true,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Sushi Master',
                'slug' => 'sushi-master',
                'description' => 'Clean Japanese precision with light woods and minimalist elegance.',
                'category' => 'japanese',
                'thumbnail' => null,
                'component_path' => 'sushi-master',
                'sort_order' => 58,
                'is_active' => true,
                'html_content' => null,
                'css_content' => null,
                'has_react_component' => true,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Tapas Social',
                'slug' => 'tapas-social',
                'description' => 'Warm Spanish terracotta design for social small-plate dining.',
                'category' => 'spanish',
                'thumbnail' => null,
                'component_path' => 'tapas-social',
                'sort_order' => 59,
                'is_active' => true,
                'html_content' => null,
                'css_content' => null,
                'has_react_component' => true,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Burger Joint',
                'slug' => 'burger-joint',
                'description' => 'Bold American diner with retro red & yellow color scheme.',
                'category' => 'american',
                'thumbnail' => null,
                'component_path' => 'burger-joint',
                'sort_order' => 60,
                'is_active' => true,
                'html_content' => null,
                'css_content' => null,
                'has_react_component' => true,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Phở Street',
                'slug' => 'pho-street',
                'description' => 'Vietnamese street food theme with fresh greens and vibrant reds.',
                'category' => 'vietnamese',
                'thumbnail' => null,
                'component_path' => 'pho-street',
                'sort_order' => 61,
                'is_active' => true,
                'html_content' => null,
                'css_content' => null,
                'has_react_component' => true,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Kebab Palace',
                'slug' => 'kebab-palace',
                'description' => 'Rich Middle Eastern jewel tones with gold and deep burgundy.',
                'category' => 'middle-eastern',
                'thumbnail' => null,
                'component_path' => 'kebab-palace',
                'sort_order' => 62,
                'is_active' => true,
                'html_content' => null,
                'css_content' => null,
                'has_react_component' => true,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Dim Sum House',
                'slug' => 'dim-sum-house',
                'description' => 'Elegant Chinese tea house with imperial gold and deep red.',
                'category' => 'chinese',
                'thumbnail' => null,
                'component_path' => 'dim-sum-house',
                'sort_order' => 63,
                'is_active' => true,
                'html_content' => null,
                'css_content' => null,
                'has_react_component' => true,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Croissant Corner',
                'slug' => 'croissant-corner',
                'description' => 'Buttery French bakery palette with cream and beige elegance.',
                'category' => 'french',
                'thumbnail' => null,
                'component_path' => 'croissant-corner',
                'sort_order' => 64,
                'is_active' => true,
                'html_content' => null,
                'css_content' => null,
                'has_react_component' => true,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Curry King',
                'slug' => 'curry-king',
                'description' => 'Vibrant Indian-inspired theme with deep orange and gold spices.',
                'category' => 'indian',
                'thumbnail' => null,
                'component_path' => 'curry-king',
                'sort_order' => 65,
                'is_active' => true,
                'html_content' => null,
                'css_content' => null,
                'has_react_component' => true,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Poke Bowl',
                'slug' => 'poke-bowl',
                'description' => 'Tropical Hawaiian fresh with bright blue and pink accents.',
                'category' => 'hawaiian',
                'thumbnail' => null,
                'component_path' => 'poke-bowl',
                'sort_order' => 66,
                'is_active' => true,
                'html_content' => null,
                'css_content' => null,
                'has_react_component' => true,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Brew & Bean',
                'slug' => 'brew-bean',
                'description' => 'Warm coffee shop tones with rich browns and creamy beige.',
                'category' => 'cafe',
                'thumbnail' => null,
                'component_path' => 'brew-bean',
                'sort_order' => 67,
                'is_active' => true,
                'html_content' => null,
                'css_content' => null,
                'has_react_component' => true,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Steakhouse Premium',
                'slug' => 'steakhouse-premium',
                'description' => 'Dark leather-toned premium steakhouse with gold accents.',
                'category' => 'american',
                'thumbnail' => null,
                'component_path' => 'steakhouse-premium',
                'sort_order' => 68,
                'is_active' => true,
                'html_content' => null,
                'css_content' => null,
                'has_react_component' => true,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Garden Salad',
                'slug' => 'garden-salad',
                'description' => 'Fresh green vegan-friendly design with crisp white accents.',
                'category' => 'vegan',
                'thumbnail' => null,
                'component_path' => 'garden-salad',
                'sort_order' => 69,
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
            // tokyo-ramen
            ['tokyo-ramen', 'Default', 'Warm broth and dark wood', true, ['#c17f3a', '#2c1810', '#d4a574', '#1a0e08']],
            ['tokyo-ramen', 'Miso Glow', 'Lighter amber tones', false, ['#d4a373', '#3a2010', '#e8c39e', '#1a0e08']],

            // margherita-bliss
            ['margherita-bliss', 'Default', 'Italian tricolore', true, ['#d32f2f', '#fff8f0', '#2e7d32', '#b8860b']],
            ['margherita-bliss', 'Rustica', 'Darker red with olive', false, ['#b71c1c', '#faf5eb', '#1b5e20', '#8d6e00']],

            // taco-fiesta
            ['taco-fiesta', 'Default', 'Fiesta bright', true, ['#e85d04', '#fff3e0', '#f4a261', '#2d6a4f']],
            ['taco-fiesta', 'Cantina', 'Warm salsa tones', false, ['#d00000', '#fef9ef', '#e85d04', '#1b4332']],

            // sushi-master
            ['sushi-master', 'Default', 'Light wood minimal', true, ['#e8d5b7', '#faf7f0', '#c4956a', '#5a3e28']],
            ['sushi-master', 'Wasabi', 'Green accent variant', false, ['#c8b896', '#f5f0e8', '#a8c090', '#4a3020']],

            // tapas-social
            ['tapas-social', 'Default', 'Warm Spanish clay', true, ['#c2410c', '#fef9ef', '#fcd34d', '#9a3412']],
            ['tapas-social', 'Sangria', 'Richer red tones', false, ['#9a3412', '#fef3c7', '#f59e0b', '#78350f']],

            // burger-joint
            ['burger-joint', 'Default', 'Retro diner red', true, ['#d32f2f', '#fff8e1', '#fdd835', '#1a1a1a']],
            ['burger-joint', 'Classic', 'Mustard yellow', false, ['#c62828', '#fffde7', '#fbc02d', '#000000']],

            // pho-street
            ['pho-street', 'Default', 'Fresh Vietnamese', true, ['#2b9348', '#fefae0', '#e63946', '#1a3c34']],
            ['pho-street', 'Saigon', 'Warmer tones', false, ['#1b6b30', '#fef9c3', '#dc2626', '#0d2818']],

            // kebab-palace
            ['kebab-palace', 'Default', 'Royal jewel tones', true, ['#800020', '#fef9e7', '#d4af37', '#2d1b00']],
            ['kebab-palace', 'Sultan', 'Deeper burgundy', false, ['#5c0015', '#fdf5e6', '#c9a84c', '#1a0f00']],

            // dim-sum-house
            ['dim-sum-house', 'Default', 'Imperial gold & red', true, ['#8b0000', '#fff8e7', '#d4af37', '#1a0a00']],
            ['dim-sum-house', 'Jade', 'Green accent', false, ['#6b0000', '#fdf5e6', '#a8c090', '#1a0a00']],

            // croissant-corner
            ['croissant-corner', 'Default', 'Buttery cream & beige', true, ['#d4a373', '#fefcf3', '#fae1b4', '#8d6e52']],
            ['croissant-corner', 'Paris', 'Richer pastry', false, ['#c68c5c', '#fdf8f0', '#f5d6a8', '#7a5c3a']],

            // curry-king
            ['curry-king', 'Default', 'Spiced orange & gold', true, ['#e65100', '#fff8e1', '#ff6f00', '#3e2723']],
            ['curry-king', 'Tandoor', 'Deep red tones', false, ['#bf360c', '#fef3e0', '#e65100', '#27140c']],

            // poke-bowl
            ['poke-bowl', 'Default', 'Tropical ocean', true, ['#00b4d8', '#f0faff', '#f72585', '#023e8a']],
            ['poke-bowl', 'Island', 'Warmer tropical', false, ['#0096c7', '#e6f7ff', '#d81b60', '#004e7c']],

            // brew-bean
            ['brew-bean', 'Default', 'Coffee shop warm', true, ['#5d4037', '#fef9ef', '#d4a373', '#3e2723']],
            ['brew-bean', 'Espresso', 'Dark roast', false, ['#3e2723', '#f5f0e8', '#bcaaa4', '#1a0e08']],

            // steakhouse-premium
            ['steakhouse-premium', 'Default', 'Dark leather premium', true, ['#1a0a00', '#2c1810', '#c8a96e', '#0d0500']],
            ['steakhouse-premium', 'Charcoal', 'Smokier tones', false, ['#0d0500', '#1a0a00', '#b8964a', '#000000']],

            // garden-salad
            ['garden-salad', 'Default', 'Fresh green & white', true, ['#2e7d32', '#f1f8e9', '#81c784', '#1b5e20']],
            ['garden-salad', 'Spring', 'Lighter greens', false, ['#388e3c', '#f7fbf3', '#a5d6a7', '#1b5e20']],
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
            'tokyo-ramen', 'margherita-bliss', 'taco-fiesta', 'sushi-master',
            'tapas-social', 'burger-joint', 'pho-street', 'kebab-palace',
            'dim-sum-house', 'croissant-corner', 'curry-king', 'poke-bowl',
            'brew-bean', 'steakhouse-premium', 'garden-salad',
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
            'tokyo-ramen'       => "'Playfair Display', serif",
            'margherita-bliss'  => "'Playfair Display', serif",
            'taco-fiesta'       => "'Fjalla One', sans-serif",
            'sushi-master'      => "'Inter', sans-serif",
            'tapas-social'      => "'Playfair Display', serif",
            'burger-joint'      => "'Fjalla One', sans-serif",
            'pho-street'        => "'Quicksand', sans-serif",
            'kebab-palace'      => "'Playfair Display', serif",
            'dim-sum-house'     => "'Playfair Display', serif",
            'croissant-corner'  => "'Playfair Display', serif",
            'curry-king'        => "'Fjalla One', sans-serif",
            'poke-bowl'         => "'Quicksand', sans-serif",
            'brew-bean'         => "'Quicksand', sans-serif",
            'steakhouse-premium'=> "'Fjalla One', sans-serif",
            'garden-salad'      => "'Quicksand', sans-serif",
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
