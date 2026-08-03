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
                'name' => 'Sunrise Bistro',
                'slug' => 'sunrise-bistro',
                'description' => 'Warm morning light with golden tones — perfect for breakfast & brunch spots.',
                'category' => 'cafe',
                'thumbnail' => null,
                'component_path' => 'sunrise-bistro',
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
                'name' => 'Midnight Gleam',
                'slug' => 'midnight-gleam',
                'description' => 'Deep midnight blues with shimmering silver — sleek late-night dining.',
                'category' => 'premium',
                'thumbnail' => null,
                'component_path' => 'midnight-gleam',
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
                'name' => 'Azure Wave',
                'slug' => 'azure-wave',
                'description' => 'Ocean-inspired design with flowing azure gradients for seafood lovers.',
                'category' => 'seafood',
                'thumbnail' => null,
                'component_path' => 'azure-wave',
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
                'name' => 'Copper Haven',
                'slug' => 'copper-haven',
                'description' => 'Industrial copper tones with rustic warmth for modern gastropubs.',
                'category' => 'brewpub',
                'thumbnail' => null,
                'component_path' => 'copper-haven',
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
                'name' => 'Pastel Palette',
                'slug' => 'pastel-palette',
                'description' => 'Soft pastel gradients — light, airy, and perfect for patisseries.',
                'category' => 'patisserie',
                'thumbnail' => null,
                'component_path' => 'pastel-palette',
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
                'name' => 'Desert Sand',
                'slug' => 'desert-sand',
                'description' => 'Earthy desert tones with warm terracotta accents for Mediterranean cuisine.',
                'category' => 'mediterranean',
                'thumbnail' => null,
                'component_path' => 'desert-sand',
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
                'name' => 'Forest Hush',
                'slug' => 'forest-hush',
                'description' => 'Deep forest greens and earthy browns for farm-to-table restaurants.',
                'category' => 'vegan',
                'thumbnail' => null,
                'component_path' => 'forest-hush',
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
                'name' => 'Cosmic Diner',
                'slug' => 'cosmic-diner',
                'description' => 'Space-themed diner with dark cosmos backgrounds and neon accents.',
                'category' => 'american',
                'thumbnail' => null,
                'component_path' => 'cosmic-diner',
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
                'name' => 'Vintage Charm',
                'slug' => 'vintage-charm',
                'description' => 'Classic vintage style with sepia tones and retro typography.',
                'category' => 'italian',
                'thumbnail' => null,
                'component_path' => 'vintage-charm',
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
                'name' => 'Boho Chic',
                'slug' => 'boho-chic',
                'description' => 'Bohemian eclectic mix of warm patterns and earthy jewel tones.',
                'category' => 'mexican',
                'thumbnail' => null,
                'component_path' => 'boho-chic',
                'sort_order' => 44,
                'is_active' => true,
                'html_content' => null,
                'css_content' => null,
                'has_react_component' => true,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Ivory Tower',
                'slug' => 'ivory-tower',
                'description' => 'Elegant ivory and gold palette for fine dining establishments.',
                'category' => 'premium',
                'thumbnail' => null,
                'component_path' => 'ivory-tower',
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
                'name' => 'Sapphire Sky',
                'slug' => 'sapphire-sky',
                'description' => 'Luxurious sapphire blues with crisp white for upscale dining.',
                'category' => 'premium',
                'thumbnail' => null,
                'component_path' => 'sapphire-sky',
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
                'name' => 'Ruby Roastery',
                'slug' => 'ruby-roastery',
                'description' => 'Rich ruby reds paired with warm browns for coffee shops & roasteries.',
                'category' => 'cafe',
                'thumbnail' => null,
                'component_path' => 'ruby-roastery',
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
                'name' => 'Teal Terrace',
                'slug' => 'teal-terrace',
                'description' => 'Teal and coral combination with tropical vibes for rooftop venues.',
                'category' => 'seafood',
                'thumbnail' => null,
                'component_path' => 'teal-terrace',
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
                'name' => 'Lemon Zen',
                'slug' => 'lemon-zen',
                'description' => 'Bright lemon yellow with clean whites for fresh & healthy eateries.',
                'category' => 'vegan',
                'thumbnail' => null,
                'component_path' => 'lemon-zen',
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
                'name' => 'Paper Rose',
                'slug' => 'paper-rose',
                'description' => 'Soft rose pinks with cream textures for romantic dining settings.',
                'category' => 'patisserie',
                'thumbnail' => null,
                'component_path' => 'paper-rose',
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
                'name' => 'Marble Mist',
                'slug' => 'marble-mist',
                'description' => 'Elegant marble textures with cool gray tones for modern bistros.',
                'category' => 'bistro',
                'thumbnail' => null,
                'component_path' => 'marble-mist',
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
                'name' => 'Coral Cove',
                'slug' => 'coral-cove',
                'description' => 'Vibrant coral reefs and tropical blues for island-inspired menus.',
                'category' => 'seafood',
                'thumbnail' => null,
                'component_path' => 'coral-cove',
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
                'name' => 'Steel Dream',
                'slug' => 'steel-dream',
                'description' => 'Sleek metallic steel with electric blue accents for tech-forward eateries.',
                'category' => 'modern',
                'thumbnail' => null,
                'component_path' => 'steel-dream',
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
                'name' => 'Quartz Quiet',
                'slug' => 'quartz-quiet',
                'description' => 'Subtle quartz pink and gray palette for minimalist tearooms.',
                'category' => 'minimal',
                'thumbnail' => null,
                'component_path' => 'quartz-quiet',
                'sort_order' => 54,
                'is_active' => true,
                'html_content' => null,
                'css_content' => null,
                'has_react_component' => true,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Plum Piazza',
                'slug' => 'plum-piazza',
                'description' => 'Deep plum and burgundy tones for elegant wine bars & Italian restaurants.',
                'category' => 'italian',
                'thumbnail' => null,
                'component_path' => 'plum-piazza',
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
                'name' => 'Olive Olympus',
                'slug' => 'olive-olympus',
                'description' => 'Mediterranean olive greens with warm umber for Greek tavernas.',
                'category' => 'mediterranean',
                'thumbnail' => null,
                'component_path' => 'olive-olympus',
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
                'name' => 'Pine Pearl',
                'slug' => 'pine-pearl',
                'description' => 'Fresh pine greens with pearl highlights for forest-inspired eateries.',
                'category' => 'vegan',
                'thumbnail' => null,
                'component_path' => 'pine-pearl',
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
                'name' => 'Dusk Draft',
                'slug' => 'dusk-draft',
                'description' => 'Twilight purples and amber glows for craft beer & brewpub venues.',
                'category' => 'brewpub',
                'thumbnail' => null,
                'component_path' => 'dusk-draft',
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
                'name' => 'Mint Mosaic',
                'slug' => 'mint-mosaic',
                'description' => 'Mint green mosaic pattern with white accents for modern cafes.',
                'category' => 'cafe',
                'thumbnail' => null,
                'component_path' => 'mint-mosaic',
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
                'name' => 'Lavender Lounge',
                'slug' => 'lavender-lounge',
                'description' => 'Calming lavender tones with subtle gold for lounge & hookah bars.',
                'category' => 'premium',
                'thumbnail' => null,
                'component_path' => 'lavender-lounge',
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
                'name' => 'Citrus Circuit',
                'slug' => 'citrus-circuit',
                'description' => 'Zesty orange and lime combo for vibrant juice bars & smoothie spots.',
                'category' => 'fresh',
                'thumbnail' => null,
                'component_path' => 'citrus-circuit',
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
                'name' => 'Ochre Orchard',
                'slug' => 'ochre-orchard',
                'description' => 'Earthy ochre yellows with forest greens for organic farm cafes.',
                'category' => 'organic',
                'thumbnail' => null,
                'component_path' => 'ochre-orchard',
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
                'name' => 'Midnight Moon',
                'slug' => 'midnight-moon',
                'description' => 'Moonlit night sky with silver accents for fine dining experiences.',
                'category' => 'premium',
                'thumbnail' => null,
                'component_path' => 'midnight-moon',
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
                'name' => 'Cafe Nouveau',
                'slug' => 'cafe-nouveau',
                'description' => 'Art nouveau inspired design with flowing curves and pastel accents.',
                'category' => 'cafe',
                'thumbnail' => null,
                'component_path' => 'cafe-nouveau',
                'sort_order' => 64,
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
        // 2. Block types shared by all 30 templates
        // ────────────────────────────────────────────────────────
        $blockTypes = ['hero', 'menu', 'about', 'reviews', 'staff', 'opening-hours', 'contact', 'footer', 'header'];

        // ────────────────────────────────────────────────────────
        // 3. Theme-preset definitions (one default preset per template)
        //    [slug, name, description, is_default, [colours...]]
        //
        //    Colour array order as requested:
        //      colours[0] → primary
        //      colours[1] → background
        //      colours[2] → accent
        //      colours[3] → secondary
        // ────────────────────────────────────────────────────────
        $presets = [
            ['sunrise-bistro',  'Default', 'Warm morning light with golden tones', true, ['#F4A460', '#FFF8DC', '#2E8B57', '#D2691E']],
            ['midnight-gleam',  'Default', 'Deep midnight blues with shimmering silver', true, ['#191970', '#E0E0E0', '#FFD700', '#2F2F4F']],
            ['azure-wave',      'Default', 'Ocean-inspired azure gradients', true, ['#0077B6', '#F0F8FF', '#00B4D8', '#CAF0F8']],
            ['copper-haven',    'Default', 'Industrial copper with rustic warmth', true, ['#B87333', '#2F2F2F', '#F5DEB3', '#1A1A1A']],
            ['pastel-palette',  'Default', 'Soft pastel gradients', true, ['#FFB6C1', '#FFF0F5', '#98FB98', '#E6E6FA']],
            ['desert-sand',     'Default', 'Earthy desert with warm terracotta', true, ['#E2725B', '#F5DEB3', '#2F4F2F', '#DEB887']],
            ['forest-hush',     'Default', 'Deep forest greens and earthy browns', true, ['#228B22', '#F5FFFA', '#8B4513', '#2E4B2E']],
            ['cosmic-diner',    'Default', 'Dark cosmos with neon accents', true, ['#0A0A2E', '#FF00FF', '#00FFFF', '#1A1A4E']],
            ['vintage-charm',   'Default', 'Classic sepia tones and retro typography', true, ['#704214', '#FFF8DC', '#DEB887', '#F5DEB3']],
            ['boho-chic',       'Default', 'Bohemian eclectic jewel tones', true, ['#CC5500', '#008080', '#FFD700', '#F5DEB3']],
            ['ivory-tower',     'Default', 'Elegant ivory and gold palette', true, ['#FFFFF0', '#D4AF37', '#8B4513', '#F5F5DC']],
            ['sapphire-sky',    'Default', 'Luxurious sapphire blues with crisp white', true, ['#0F52BA', '#FFFFFF', '#FFD700', '#E6E6FA']],
            ['ruby-roastery',   'Default', 'Rich ruby reds with warm browns', true, ['#E0115F', '#FFF0F5', '#8B4513', '#F5DEB3']],
            ['teal-terrace',    'Default', 'Teal and coral tropical combination', true, ['#008080', '#FF7F50', '#E0FFFF', '#F0FFF0']],
            ['lemon-zen',       'Default', 'Bright lemon yellow with clean whites', true, ['#FFF700', '#FFFFFF', '#90EE90', '#F5F5DC']],
            ['paper-rose',      'Default', 'Soft rose pinks with cream textures', true, ['#FF007F', '#FFF5EE', '#FF69B4', '#FFE4E1']],
            ['marble-mist',     'Default', 'Elegant marble textures with cool gray', true, ['#C0C0C0', '#F8F8F8', '#4A4A4A', '#E8E8E8']],
            ['coral-cove',      'Default', 'Vibrant coral reefs and tropical blues', true, ['#FF6B6B', '#40E0D0', '#FFD700', '#F0FFFF']],
            ['steel-dream',     'Default', 'Sleek metallic steel with electric blue', true, ['#4682B4', '#F0F8FF', '#00BFFF', '#1E90FF']],
            ['quartz-quiet',    'Default', 'Subtle quartz pink and gray', true, ['#E8D5D5', '#F8F8F8', '#BC8F8F', '#E0E0E0']],
            ['plum-piazza',     'Default', 'Deep plum and burgundy tones', true, ['#673147', '#FFF5EE', '#800020', '#F5F5DC']],
            ['olive-olympus',   'Default', 'Mediterranean olive greens with warm umber', true, ['#808000', '#F5F5DC', '#8B4513', '#D2B48C']],
            ['pine-pearl',      'Default', 'Fresh pine greens with pearl highlights', true, ['#01796F', '#F5FFFA', '#228B22', '#F0FFF0']],
            ['dusk-draft',      'Default', 'Twilight purples and amber glows', true, ['#4B0082', '#FFBF00', '#8B008B', '#2E2E2E']],
            ['mint-mosaic',     'Default', 'Mint green mosaic with white accents', true, ['#98FF98', '#FFFFFF', '#90EE90', '#F0FFF0']],
            ['lavender-lounge', 'Default', 'Calming lavender with subtle gold', true, ['#B19CD9', '#FFF0F5', '#D4AF37', '#F8F8FF']],
            ['citrus-circuit',  'Default', 'Zesty orange and lime combo', true, ['#FF8C00', '#32CD32', '#FFFFFF', '#FFF8DC']],
            ['ochre-orchard',   'Default', 'Earthy ochre yellows with forest greens', true, ['#CC7722', '#F5F5DC', '#228B22', '#FFF8DC']],
            ['midnight-moon',   'Default', 'Moonlit night sky with silver accents', true, ['#191970', '#F0F8FF', '#C0C0C0', '#E6E6FA']],
            ['cafe-nouveau',    'Default', 'Art nouveau flowing curves and pastel accents', true, ['#4A7C59', '#FFD700', '#8B4513', '#FFF8DC']],
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
            'sunrise-bistro',
            'midnight-gleam',
            'azure-wave',
            'copper-haven',
            'pastel-palette',
            'desert-sand',
            'forest-hush',
            'cosmic-diner',
            'vintage-charm',
            'boho-chic',
            'ivory-tower',
            'sapphire-sky',
            'ruby-roastery',
            'teal-terrace',
            'lemon-zen',
            'paper-rose',
            'marble-mist',
            'coral-cove',
            'steel-dream',
            'quartz-quiet',
            'plum-piazza',
            'olive-olympus',
            'pine-pearl',
            'dusk-draft',
            'mint-mosaic',
            'lavender-lounge',
            'citrus-circuit',
            'ochre-orchard',
            'midnight-moon',
            'cafe-nouveau',
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
            'sunrise-bistro'  => "'Playfair Display', serif",
            'midnight-gleam'  => "'Playfair Display', serif",
            'azure-wave'      => "'Playfair Display', serif",
            'copper-haven'    => "'Bebas Neue', cursive",
            'pastel-palette'  => "'Playfair Display', serif",
            'desert-sand'     => "'Playfair Display', serif",
            'forest-hush'     => "'Quicksand', sans-serif",
            'cosmic-diner'    => "'Fjalla One', sans-serif",
            'vintage-charm'   => "'Playfair Display', serif",
            'boho-chic'       => "'Fjalla One', sans-serif",
            'ivory-tower'     => "'Playfair Display', serif",
            'sapphire-sky'    => "'Playfair Display', serif",
            'ruby-roastery'   => "'Quicksand', sans-serif",
            'teal-terrace'    => "'Playfair Display', serif",
            'lemon-zen'       => "'Quicksand', sans-serif",
            'paper-rose'      => "'Playfair Display', serif",
            'marble-mist'     => "'Inter', sans-serif",
            'coral-cove'      => "'Playfair Display', serif",
            'steel-dream'     => "'Inter', sans-serif",
            'quartz-quiet'    => "'Inter', sans-serif",
            'plum-piazza'     => "'Playfair Display', serif",
            'olive-olympus'   => "'Playfair Display', serif",
            'pine-pearl'      => "'Quicksand', sans-serif",
            'dusk-draft'      => "'Bebas Neue', cursive",
            'mint-mosaic'     => "'Quicksand', sans-serif",
            'lavender-lounge' => "'Playfair Display', serif",
            'citrus-circuit'  => "'Quicksand', sans-serif",
            'ochre-orchard'   => "'Quicksand', sans-serif",
            'midnight-moon'   => "'Playfair Display', serif",
            'cafe-nouveau'    => "'Playfair Display', serif",
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
