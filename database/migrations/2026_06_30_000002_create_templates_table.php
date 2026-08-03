<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('category')->nullable();
            $table->string('thumbnail')->nullable();
            $table->string('component_path')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->string('status', 20)->default('active')->after('is_active');
            $table->longText('html_content')->nullable();
            $table->longText('css_content')->nullable();
            $table->boolean('has_react_component')->default(true);
            $table->timestamps();

            $table->index(['is_active', 'status', 'category'], 'idx_templates_active_category');
        });

        Schema::create('template_blocks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('template_id')->constrained()->cascadeOnDelete();
            $table->string('type');
            $table->string('label');
            $table->text('description')->nullable();
            $table->string('category')->default('general');
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->json('config_schema')->nullable();
            $table->json('default_config')->nullable();
            $table->boolean('is_required')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['template_id', 'sort_order']);
        });

        Schema::create('theme_presets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('template_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->json('css_vars');
            $table->json('colors')->nullable();
            $table->boolean('is_default')->default(false);
            $table->timestamps();

            $table->index(['template_id', 'is_default']);
        });

        $now = now();
        $templates = [
            [
                'name' => 'Dark Luxury',
                'slug' => 'dark-luxury',
                'description' => 'Premium dark theme with elegant gold accents — perfect for high-end dining.',
                'category' => 'Premium',
                'component_path' => 'template-1-dark-luxury',
                'sort_order' => 1,
                'created_at' => $now, 'updated_at' => $now,
            ],
            [
                'name' => 'Fresh Organic',
                'slug' => 'organic',
                'description' => 'Clean green aesthetic for health food, juice bars, and organic markets.',
                'category' => 'Natural',
                'component_path' => 'template-2-organic',
                'sort_order' => 2,
                'created_at' => $now, 'updated_at' => $now,
            ],
            [
                'name' => 'Tech SaaS',
                'slug' => 'tech',
                'description' => 'Modern tech-inspired layout — clean lines, bold gradients.',
                'category' => 'Modern',
                'component_path' => 'template-3-tech-saas',
                'sort_order' => 3,
                'created_at' => $now, 'updated_at' => $now,
            ],
            [
                'name' => 'Streetwear',
                'slug' => 'streetwear',
                'description' => 'Bold urban aesthetic with grainy textures and edgy typography.',
                'category' => 'Urban',
                'component_path' => 'template-4-streetwear',
                'sort_order' => 4,
                'created_at' => $now, 'updated_at' => $now,
            ],
            [
                'name' => 'Artisan Handmade',
                'slug' => 'artisan',
                'description' => 'Warm handcrafted feel with natural textures — great for bakeries and cafés.',
                'category' => 'Natural',
                'component_path' => 'template-5-artisan-handmade',
                'sort_order' => 5,
                'created_at' => $now, 'updated_at' => $now,
            ],
            [
                'name' => 'Bistro',
                'slug' => 'bistro',
                'description' => 'Cozy French bistro atmosphere with warm tones and elegant details.',
                'category' => 'Premium',
                'component_path' => 'template-6-bistro',
                'sort_order' => 6,
                'created_at' => $now, 'updated_at' => $now,
            ],
            [
                'name' => 'Neon',
                'slug' => 'neon',
                'description' => 'Electric neon glow — perfect for nightlife, bars, and trendy spots.',
                'category' => 'Urban',
                'component_path' => 'template-7-neon',
                'sort_order' => 7,
                'created_at' => $now, 'updated_at' => $now,
            ],
            [
                'name' => 'Coastal',
                'slug' => 'coastal',
                'description' => 'Beachside blue serenity — seafood, tropical, and seaside restaurants.',
                'category' => 'Natural',
                'component_path' => 'template-8-coastal',
                'sort_order' => 8,
                'created_at' => $now, 'updated_at' => $now,
            ],
            [
                'name' => 'Rustic',
                'slug' => 'rustic',
                'description' => 'Farm-to-table warmth with earthy tones and vintage typography.',
                'category' => 'Natural',
                'component_path' => 'template-9-rustic',
                'sort_order' => 9,
                'created_at' => $now, 'updated_at' => $now,
            ],
            [
                'name' => 'Minimal',
                'slug' => 'minimal',
                'description' => 'Clean, minimalist design with maximum whitespace.',
                'category' => 'Modern',
                'component_path' => 'template-10-minimal',
                'sort_order' => 10,
                'created_at' => $now, 'updated_at' => $now,
            ],
            [
                'name' => 'Tropical',
                'slug' => 'tropical',
                'description' => 'Vibrant tropical paradise — bold greens, pinks, and island vibes.',
                'category' => 'Natural',
                'component_path' => 'template-11-tropical',
                'sort_order' => 11,
                'created_at' => $now, 'updated_at' => $now,
            ],
            [
                'name' => 'Retro Diner',
                'slug' => 'retro',
                'description' => 'Classic 50s diner feel — reds, teals, checkered patterns.',
                'category' => 'Premium',
                'component_path' => 'template-12-retro',
                'sort_order' => 12,
                'created_at' => $now, 'updated_at' => $now,
            ],
            [
                'name' => 'Urban',
                'slug' => 'urban',
                'description' => 'Metropolitan concrete jungle — dark, gritty, authentic.',
                'category' => 'Urban',
                'component_path' => 'template-13-urban',
                'sort_order' => 13,
                'created_at' => $now, 'updated_at' => $now,
            ],
            [
                'name' => 'Velvet Noir',
                'slug' => 'velvet-noir',
                'description' => 'Luxurious black velvet — deep purples, gold trim, cinematic.',
                'category' => 'Premium',
                'component_path' => 'template-velvet-noir',
                'sort_order' => 14,
                'created_at' => $now, 'updated_at' => $now,
            ],
            [
                'name' => 'Jade Garden',
                'slug' => 'jade-garden',
                'description' => 'Serene green sanctuary — fresh, calm, botanical.',
                'category' => 'Natural',
                'component_path' => 'template-jade-garden',
                'sort_order' => 15,
                'created_at' => $now, 'updated_at' => $now,
            ],
            [
                'name' => 'Amber Glow',
                'slug' => 'amber-glow',
                'description' => 'Warm amber sunset tones — cozy, inviting, honey-lit.',
                'category' => 'Premium',
                'component_path' => 'template-amber-glow',
                'sort_order' => 16,
                'created_at' => $now, 'updated_at' => $now,
            ],
            [
                'name' => 'Slate Steel',
                'slug' => 'slate-steel',
                'description' => 'Industrial gray tones — modern, sturdy, professional.',
                'category' => 'Modern',
                'component_path' => 'template-slate-steel',
                'sort_order' => 17,
                'created_at' => $now, 'updated_at' => $now,
            ],
            [
                'name' => 'Lavender Haze',
                'slug' => 'lavender-haze',
                'description' => 'Soft purple haze — dreamy, artistic, whimsical.',
                'category' => 'Modern',
                'component_path' => 'template-lavender-haze',
                'sort_order' => 18,
                'created_at' => $now, 'updated_at' => $now,
            ],
            [
                'name' => 'Crimson Royale',
                'slug' => 'crimson-royale',
                'description' => 'Deep red velvet — regal, dramatic, unforgettable.',
                'category' => 'Premium',
                'component_path' => 'template-crimson-royale',
                'sort_order' => 19,
                'created_at' => $now, 'updated_at' => $now,
            ],
            [
                'name' => 'Frost White',
                'slug' => 'frost-white',
                'description' => 'Crisp winter white — clean, pure, elegant.',
                'category' => 'Modern',
                'component_path' => 'template-frost-white',
                'sort_order' => 20,
                'created_at' => $now, 'updated_at' => $now,
            ],
            [
                'name' => 'Saffron Spice',
                'slug' => 'saffron-spice',
                'description' => 'Warm Indian-inspired golds and oranges — rich, aromatic, vibrant.',
                'category' => 'Premium',
                'component_path' => 'template-saffron-spice',
                'sort_order' => 21,
                'created_at' => $now, 'updated_at' => $now,
            ],
            [
                'name' => 'Denim Blue',
                'slug' => 'denim-blue',
                'description' => 'Classic American denim — blue tones, casual, timeless.',
                'category' => 'Urban',
                'component_path' => 'template-denim-blue',
                'sort_order' => 22,
                'created_at' => $now, 'updated_at' => $now,
            ],
            [
                'name' => 'Mint Berry',
                'slug' => 'mint-berry',
                'description' => 'Fresh mint and berry fusion — playful, colorful, youthful.',
                'category' => 'Natural',
                'component_path' => 'template-mint-berry',
                'sort_order' => 23,
                'created_at' => $now, 'updated_at' => $now,
            ],
        ];

        $presets = [
            ['dark-luxury', 'Gold & Black', 'Classic luxury gold on black', ['#d4a853', '#1a1a2e', '#ffffff', '#e8d5a3'], true],
            ['dark-luxury', 'Platinum & Charcoal', 'Cool platinum on dark charcoal', ['#e8e8e8', '#2d2d2d', '#ffffff', '#b0b0b0'], false],
            ['organic', 'Forest Green', 'Natural forest tones', ['#2d5a27', '#f5f5dc', '#8fbc8f', '#4a7c59'], true],
            ['organic', 'Mint & Cream', 'Soft mint with warm cream', ['#98d8c8', '#f7f3ee', '#2d5a27', '#d4e9d6'], false],
            ['tech', 'Electric Blue', 'Bold blue with dark contrast', ['#2563eb', '#0f172a', '#ffffff', '#3b82f6'], true],
            ['tech', 'Purple Haze', 'Vibrant purple gradient', ['#7c3aed', '#0f172a', '#ffffff', '#a78bfa'], false],
            ['streetwear', 'Midnight Orange', 'Dark urban with orange pop', ['#1a1a2e', '#ff6b35', '#ffffff', '#16213e'], true],
            ['streetwear', 'Toxic Green', 'Neon green on black', ['#39ff14', '#000000', '#ffffff', '#1a1a1a'], false],
            ['artisan', 'Wheat & Honey', 'Warm golden tones', ['#d4a853', '#f5e6d3', '#8b6914', '#fff8f0'], true],
            ['artisan', 'Clay & Sage', 'Earthy terracotta blend', ['#c67b5c', '#a3b18a', '#f0e6d3', '#588157'], false],
            ['bistro', 'Parisian Red', 'Classic French bistro', ['#8b0000', '#f5e6d3', '#2c1810', '#d4a853'], true],
            ['bistro', 'Cream & Chocolate', 'Warm café tones', ['#6b3a2a', '#faf0e6', '#d4a853', '#3e2723'], false],
            ['neon', 'Cyber Pink', 'Electric pink on dark', ['#ff0080', '#0d0221', '#00ffff', '#1a0033'], true],
            ['neon', 'Laser Lime', 'Neon green voltage', ['#00ff41', '#0a0a0a', '#ff00ff', '#1a1a2e'], false],
            ['coastal', 'Ocean Blue', 'Deep sea blues', ['#006994', '#e0f7fa', '#004d73', '#b2ebf2'], true],
            ['coastal', 'Seafoam & Coral', 'Tropical coastal', ['#2ecc71', '#ff7f50', '#ffffff', '#87ceeb'], false],
            ['rustic', 'Farmhouse Brown', 'Earthy farm tones', ['#8b6914', '#f5deb3', '#2c1810', '#d2b48c'], true],
            ['rustic', 'Herb Garden', 'Sage and rosemary', ['#6b8e23', '#f0ead6', '#556b2f', '#deb887'], false],
            ['minimal', 'Pure White', 'Clean white minimal', ['#1a1a2e', '#ffffff', '#f5f5f5', '#333333'], true],
            ['minimal', 'Soft Gray', 'Gentle gray minimal', ['#2d2d2d', '#f8f8f8', '#e0e0e0', '#666666'], false],
            ['tropical', 'Island Sunset', 'Vibrant tropical sunset', ['#ff6b35', '#2ecc71', '#ffd700', '#1a5276'], true],
            ['tropical', 'Tiki Bar', 'Polynesian brights', ['#e74c3c', '#f1c40f', '#2ecc71', '#1a1a2e'], false],
            ['retro', 'Cherry Red', 'Classic diner red', ['#cc0000', '#00bfff', '#ffffff', '#ffff00'], true],
            ['retro', 'Mint Shake', 'Pastel retro mint', ['#98ff98', '#ff69b4', '#ffffff', '#00bfff'], false],
            ['urban', 'Concrete Gray', 'Raw urban concrete', ['#2c2c2c', '#d4d4d4', '#ff6b35', '#1a1a1a'], true],
            ['urban', 'Steel & Rust', 'Industrial orange rust', ['#8b4513', '#708090', '#ff4500', '#2f4f4f'], false],
            ['velvet-noir', 'Midnight Purple', 'Rich purple noir', ['#2d1b4e', '#d4a853', '#1a0a2e', '#e8d5a3'], true],
            ['velvet-noir', 'Crimson Noir', 'Dark red noir', ['#4a0e2e', '#c0c0c0', '#8b0000', '#1a0a0a'], false],
            ['jade-garden', 'Jade Green', 'Serene jade tones', ['#00a86b', '#f0fff0', '#006d4e', '#d4edda'], true],
            ['jade-garden', 'Bamboo Forest', 'Natural bamboo', ['#4a7c59', '#f5f5dc', '#2d5a27', '#8fbc8f'], false],
            ['amber-glow', 'Golden Hour', 'Warm amber sunset', ['#ff8c00', '#fff8dc', '#8b4500', '#ffd700'], true],
            ['amber-glow', 'Honeycomb', 'Sweet honey tones', ['#d4a017', '#faf0e6', '#8b6914', '#fff3cd'], false],
            ['slate-steel', 'Graphite', 'Dark graphite modern', ['#36454f', '#e8e8e8', '#7f8c8d', '#ffffff'], true],
            ['slate-steel', 'Blue Steel', 'Cool blue steel', ['#4682b4', '#f0f8ff', '#2c3e50', '#b0c4de'], false],
            ['lavender-haze', 'Dreamy Purple', 'Soft lavender dream', ['#9b59b6', '#f8f0ff', '#6c3483', '#e8daef'], true],
            ['lavender-haze', 'Mist & Roses', 'Soft pink-lavender', ['#d2b4de', '#ffe4e1', '#8e44ad', '#f5eef8'], false],
            ['crimson-royale', 'Royal Red', 'Deep regal crimson', ['#800020', '#f5e6d3', '#d4a853', '#2c1810'], true],
            ['crimson-royale', 'Burgundy & Gold', 'Rich burgundy accents', ['#722f37', '#d4a853', '#f5e6d3', '#4a0e2e'], false],
            ['frost-white', 'Arctic Frost', 'Crisp clean white', ['#e8f4f8', '#ffffff', '#b0d4e8', '#2c3e50'], true],
            ['frost-white', 'Ice & Silver', 'Cool silver tones', ['#dcdcdc', '#ffffff', '#87ceeb', '#708090'], false],
            ['saffron-spice', 'Tandoori Gold', 'Warm Indian golds', ['#ff9933', '#8b0000', '#138808', '#fff8dc'], true],
            ['saffron-spice', 'Curry House', 'Rich spice market', ['#c0392b', '#f39c12', '#2d5016', '#f5deb3'], false],
            ['denim-blue', 'Classic Denim', 'True blue denim', ['#1565c0', '#ffffff', '#ff6b35', '#f5f5f5'], true],
            ['denim-blue', 'Faded Indigo', 'Vintage faded look', ['#5c6bc0', '#e8eaf6', '#c0ca33', '#ffffff'], false],
            ['mint-berry', 'Fresh Mint', 'Cool minty green', ['#00c853', '#ff4081', '#ffffff', '#b9f6ca'], true],
            ['mint-berry', 'Berry Blast', 'Bold berry pink', ['#e040fb', '#00e676', '#ffffff', '#f8bbd0'], false],
        ];

        foreach ($templates as $tpl) {
            $slug = $tpl['slug'];
            $tplId = DB::table('templates')->insertGetId($tpl);

            $templatePresets = array_filter($presets, fn($p) => $p[0] === $slug);
            foreach ($templatePresets as $idx => $p) {
                $cssVars = $this->buildCssVars($p[3], $slug);
                DB::table('theme_presets')->insert([
                    'template_id' => $tplId,
                    'name' => $p[1],
                    'description' => $p[2],
                    'css_vars' => json_encode($cssVars),
                    'colors' => json_encode($p[3]),
                    'is_default' => $p[4],
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('theme_presets');
        Schema::dropIfExists('template_blocks');
        Schema::dropIfExists('templates');
    }

    private function buildCssVars(array $colors, string $slug): array
    {
        $base = [
            '--color-primary' => $colors[0] ?? '#2563eb',
            '--color-secondary' => $colors[1] ?? '#f5f5f5',
            '--color-accent' => $colors[2] ?? '#ffffff',
            '--color-background' => $colors[3] ?? '#ffffff',
            '--font-display' => 'Inter, sans-serif',
            '--font-body' => 'Inter, sans-serif',
            '--radius-sm' => '6px',
            '--radius-md' => '12px',
            '--radius-lg' => '20px',
            '--shadow-sm' => '0 1px 2px rgba(0,0,0,0.05)',
            '--shadow-md' => '0 4px 6px rgba(0,0,0,0.07)',
            '--shadow-lg' => '0 10px 25px rgba(0,0,0,0.1)',
        ];

        $templateSpec = [
            'dark-luxury' => ['--color-primary', '--color-secondary', '--color-accent', '--color-background'],
            'organic' => ['--color-primary', '--color-secondary', '--color-accent', '--color-background'],
            'tech' => ['--color-primary', '--color-secondary', '--color-accent', '--color-background'],
            'streetwear' => ['--color-primary', '--color-secondary', '--color-accent', '--color-background'],
            'artisan' => ['--color-primary', '--color-secondary', '--color-accent', '--color-background'],
            'bistro' => ['--color-primary', '--color-secondary', '--color-accent', '--color-background'],
            'neon' => ['--color-primary', '--color-secondary', '--color-accent', '--color-background'],
            'coastal' => ['--color-primary', '--color-secondary', '--color-accent', '--color-background'],
            'rustic' => ['--color-primary', '--color-secondary', '--color-accent', '--color-background'],
            'minimal' => ['--color-primary', '--color-secondary', '--color-accent', '--color-background'],
            'tropical' => ['--color-primary', '--color-secondary', '--color-accent', '--color-background'],
            'retro' => ['--color-primary', '--color-secondary', '--color-accent', '--color-background'],
            'urban' => ['--color-primary', '--color-secondary', '--color-accent', '--color-background'],
            'velvet-noir' => ['--color-primary', '--color-secondary', '--color-accent', '--color-background'],
            'jade-garden' => ['--color-primary', '--color-secondary', '--color-accent', '--color-background'],
            'amber-glow' => ['--color-primary', '--color-secondary', '--color-accent', '--color-background'],
            'slate-steel' => ['--color-primary', '--color-secondary', '--color-accent', '--color-background'],
            'lavender-haze' => ['--color-primary', '--color-secondary', '--color-accent', '--color-background'],
            'crimson-royale' => ['--color-primary', '--color-secondary', '--color-accent', '--color-background'],
            'frost-white' => ['--color-primary', '--color-secondary', '--color-accent', '--color-background'],
            'saffron-spice' => ['--color-primary', '--color-secondary', '--color-accent', '--color-background'],
            'denim-blue' => ['--color-primary', '--color-secondary', '--color-accent', '--color-background'],
            'mint-berry' => ['--color-primary', '--color-secondary', '--color-accent', '--color-background'],
        ];

        $keys = $templateSpec[$slug] ?? ['--color-primary', '--color-secondary', '--color-accent', '--color-background'];
        foreach ($colors as $i => $color) {
            if (isset($keys[$i])) {
                $base[$keys[$i]] = $color;
            }
        }

        return $base;
    }
};