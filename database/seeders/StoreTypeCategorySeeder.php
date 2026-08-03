<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class StoreTypeCategorySeeder extends Seeder
{
    public function run(): void
    {
        $now = now()->toDateTimeString();

        $types = [
            ['name' => 'Restaurant',    'icon' => '🍽️',  'slug' => 'restaurant'],
            ['name' => 'Pizzeria',      'icon' => '🍕',  'slug' => 'pizzeria'],
            ['name' => 'Fast Food',     'icon' => '🍔',  'slug' => 'fast-food'],
            ['name' => 'Café',          'icon' => '☕',  'slug' => 'cafe'],
            ['name' => 'Boulangerie',   'icon' => '🥖',  'slug' => 'boulangerie'],
            ['name' => 'Pâtisserie',    'icon' => '🍰',  'slug' => 'patisserie'],
            ['name' => 'Grill & BBQ',   'icon' => '🔥',  'slug' => 'grill-bbq'],
            ['name' => 'Sushi & Asiatique', 'icon' => '🍣', 'slug' => 'sushi-asiatique'],
            ['name' => 'Sandwicherie',  'icon' => '🥪',  'slug' => 'sandwicherie'],
            ['name' => 'Juice Bar',     'icon' => '🥤',  'slug' => 'juice-bar'],
            ['name' => 'Snack',         'icon' => '🌯',  'slug' => 'snack'],
            ['name' => 'Traiteur',      'icon' => '🍱',  'slug' => 'traiteur'],
            ['name' => 'Crêperie',      'icon' => '🥞',  'slug' => 'creperie'],
            ['name' => 'Poulet Rôti',   'icon' => '🍗',  'slug' => 'poulet-roti'],
            ['name' => 'Fruits de Mer', 'icon' => '🦞',  'slug' => 'fruits-de-mer'],
            ['name' => 'Cuisine Algérienne', 'icon' => '🫕', 'slug' => 'cuisine-algerienne'],
            ['name' => 'Épicerie',      'icon' => '🛒',  'slug' => 'epicerie'],
            ['name' => 'Glaces & Sorbets', 'icon' => '🍦', 'slug' => 'glaces-sorbets'],
            ['name' => 'Autre',         'icon' => '✨',  'slug' => 'autre'],
        ];

        foreach ($types as $type) {
            DB::table('store_type_categories')->updateOrInsert(
                ['slug' => $type['slug']],
                [
                    'name'       => $type['name'],
                    'slug'       => $type['slug'],
                    'icon'       => $type['icon'],
                    'is_active'  => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );
        }

        $this->command->info('Store type categories seeded: ' . count($types) . ' types.');
    }
}
