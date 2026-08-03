<?php

namespace Database\Seeders;

use App\Enums\OrderStatus;
use App\Models\Badge;
use App\Models\Banner;
use App\Models\Category;
use App\Models\ChefDiploma;
use App\Models\ChefProfile;
use App\Models\ChefSkill;
use App\Models\ChefStoreHire;
use App\Models\ChefWorkHistory;
use App\Models\Complaint;
use App\Models\DeliveryProfile;
use App\Models\Favorite;
use App\Models\Food;
use App\Models\FoodImage;
use App\Models\Offer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Post;
use App\Models\PromoCode;
use App\Models\Review;
use App\Models\Store;
use App\Models\StorePhone;
use App\Models\StoreSocialLink;
use App\Models\StoreStaff;
use App\Models\Zone;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(AlgeriaGeographySeeder::class);
        $this->call(StoreTypeCategorySeeder::class);
        $this->call(UserSeeder::class);

        $admin     = User::where('email', 'admin@yallahkool.dz')->first();
        $owners    = User::where('role', 'owner')->get()->keyBy(fn($u) => explode('@', $u->email)[0]);
        $clients   = User::where('role', 'client')->get()->keyBy(fn($u) => explode('@', $u->email)[0]);
        $deliveries = User::where('role', 'delivery')->get()->keyBy(fn($u) => explode('@', $u->email)[0]);
        $chefs      = User::where('role', 'chef')->get()->keyBy(fn($u) => explode('@', $u->email)[0]);

        // ─── Food Categories ───────────────────────────────────────
        $cats = [];
        foreach ([
            ['name' => 'Pizzas',              'slug' => 'pizzas'],
            ['name' => 'Burgers',             'slug' => 'burgers'],
            ['name' => 'Sushi & Rolls',       'slug' => 'sushi'],
            ['name' => 'Tacos & Burritos',    'slug' => 'tacos'],
            ['name' => 'Salades',             'slug' => 'salades'],
            ['name' => 'Desserts',            'slug' => 'desserts'],
            ['name' => 'Boissons',            'slug' => 'boissons'],
            ['name' => 'Grills & BBQ',        'slug' => 'grills'],
            ['name' => 'Ice Cream',           'slug' => 'ice-cream'],
            ['name' => 'Libanais',            'slug' => 'libanais'],
            ['name' => 'Soupes',              'slug' => 'soupes'],
            ['name' => 'Pâtes',               'slug' => 'pates'],
            ['name' => 'Café & Thé',          'slug' => 'cafe-the'],
            ['name' => 'Plats Principaux',    'slug' => 'plats-principaux'],
            ['name' => 'Accompagnements',     'slug' => 'accompagnements'],
        ] as $c) {
            $cats[$c['slug']] = Category::firstOrCreate(['slug' => $c['slug']], ['name' => $c['name']]);
        }

        // ─── Badges ────────────────────────────────────────────────
        $badges = [];
        foreach ([
            ['name' => 'Top Rated',          'description' => 'Excellent customer feedback',          'color_code' => '#10b981', 'icon' => 'star'],
            ['name' => 'Fast Prep',          'description' => 'Averages under 15 min preparation',    'color_code' => '#3b82f6', 'icon' => 'bolt'],
            ['name' => 'Eco Friendly',       'description' => 'Uses biodegradable packaging',         'color_code' => '#059669', 'icon' => 'leaf'],
            ['name' => 'Value Promo',        'description' => 'Offers frequent discounts & deals',    'color_code' => '#ef4444', 'icon' => 'tag'],
            ['name' => 'Best Seller',        'description' => 'One of the most popular stores',       'color_code' => '#f59e0b', 'icon' => 'crown'],
            ['name' => 'New',                'description' => 'Recently joined the platform',          'color_code' => '#8b5cf6', 'icon' => 'sparkles'],
        ] as $b) {
            $badges[$b['name']] = Badge::firstOrCreate(['name' => $b['name']], $b);
        }

        // ─── Stores ────────────────────────────────────────────────
        $storeData = [
            'mario' => [
                'owner_key' => 'mario',
                'name' => "Mario's Pizzeria",
                'alias' => 'pizza-napoli',
                'description' => 'Authentic Italian wood-fired pizzas made with fresh local ingredients since 2010. Our dough rises for 48 hours for the perfect crust.',
                'address' => '42 Rue Didouche Mourad',
                'latitude' => 36.7538, 'longitude' => 3.0589,
                'email' => 'mario@pizza.dz',
                'phone' => '0551000001',
                'type_cats' => ['pizzeria', 'restaurant'],
                'badges' => ['Top Rated', 'Fast Prep'],
                'opening_hours' => [
                    'monday' => '11:00-23:00', 'tuesday' => '11:00-23:00',
                    'wednesday' => '11:00-23:00', 'thursday' => '11:00-23:00',
                    'friday' => '15:00-23:30', 'saturday' => '11:00-23:30',
                    'sunday' => '12:00-22:00',
                ],
                'zones' => [
                    ['name' => 'Centre-ville', 'radius_km' => 3, 'fee' => 0],
                    ['name' => 'Proche banlieue', 'radius_km' => 6, 'fee' => 200],
                    ['name' => 'Banlieue éloignée', 'radius_km' => 10, 'fee' => 400],
                ],
                'social' => [
                    ['platform' => 'facebook',  'url' => 'https://facebook.com/mariospizzeria'],
                    ['platform' => 'instagram', 'url' => 'https://instagram.com/mariospizzeria'],
                    ['platform' => 'whatsapp',  'url' => 'https://wa.me/213551000001'],
                ],
                'foods' => [
                    ['name' => 'Margherita',           'price' => 700,  'cat' => 'pizzas', 'desc' => 'San Marzano tomatoes, mozzarella, basil, olive oil', 'ingredients' => 'Tomato sauce, Mozzarella, Basil, Olive oil', 'cooking_time' => 12, 'bought' => 120],
                    ['name' => 'Pepperoni',            'price' => 850,  'cat' => 'pizzas', 'desc' => 'Spicy pepperoni, mozzarella, tomato sauce', 'ingredients' => 'Pepperoni, Mozzarella, Tomato sauce', 'cooking_time' => 14, 'bought' => 200, 'new_price' => 680],
                    ['name' => 'Vegetarian',           'price' => 800,  'cat' => 'pizzas', 'desc' => 'Bell peppers, onions, mushrooms, olives, corn', 'ingredients' => 'Mushrooms, Peppers, Onions, Corn, Olives, Mozzarella', 'cooking_time' => 13, 'bought' => 85],
                    ['name' => 'Quattro Formaggi',     'price' => 950,  'cat' => 'pizzas', 'desc' => 'Mozzarella, gorgonzola, parmesan, fontina', 'ingredients' => 'Mozzarella, Gorgonzola, Parmesan, Fontina', 'cooking_time' => 12, 'bought' => 65],
                    ['name' => 'Tiramisu',             'price' => 450,  'cat' => 'desserts', 'desc' => 'Homemade Italian tiramisu with mascarpone', 'ingredients' => 'Mascarpone, Coffee, Cocoa, Ladyfingers', 'cooking_time' => 5, 'bought' => 40],
                    ['name' => 'Coca-Cola',            'price' => 120,  'cat' => 'boissons', 'desc' => 'Ice cold 330ml can', 'ingredients' => 'Carbonated water, Sugar', 'cooking_time' => 1, 'bought' => 300],
                    ['name' => 'Fresh Orange Juice',   'price' => 250,  'cat' => 'boissons', 'desc' => '100% freshly squeezed', 'ingredients' => 'Oranges', 'cooking_time' => 3, 'bought' => 55],
                ],
            ],
            'sarah' => [
                'owner_key' => 'sarah',
                'name' => 'Burger House',
                'alias' => 'burger-house',
                'description' => 'Flame-grilled burgers with premium Angus beef, fresh toppings, and homemade sauces.',
                'address' => '15 Rue Ben Mhidi',
                'latitude' => 36.7555, 'longitude' => 3.0423,
                'email' => 'sarah@burger.dz',
                'phone' => '0551000002',
                'type_cats' => ['fast-food', 'restaurant'],
                'badges' => ['Value Promo', 'Best Seller'],
                'opening_hours' => [
                    'monday' => '10:00-22:00', 'tuesday' => '10:00-22:00',
                    'wednesday' => '10:00-22:00', 'thursday' => '10:00-22:00',
                    'friday' => '14:00-23:00', 'saturday' => '10:00-23:00',
                    'sunday' => '10:00-22:00',
                ],
                'zones' => [
                    ['name' => 'Zone 1', 'radius_km' => 2, 'fee' => 0],
                    ['name' => 'Zone 2', 'radius_km' => 5, 'fee' => 250],
                ],
                'social' => [
                    ['platform' => 'facebook',  'url' => 'https://facebook.com/burgerhouse'],
                    ['platform' => 'instagram', 'url' => 'https://instagram.com/burgerhouse_dz'],
                    ['platform' => 'snapchat',  'url' => 'https://snapchat.com/add/burgerhouse'],
                ],
                'foods' => [
                    ['name' => 'Classic Cheese',       'price' => 450,  'cat' => 'burgers', 'desc' => 'Beef patty, cheddar, pickles, mustard, ketchup', 'ingredients' => 'Angus beef, Cheddar, Pickles, Mustard, Ketchup', 'cooking_time' => 8, 'bought' => 180],
                    ['name' => 'Double Bacon',         'price' => 650,  'cat' => 'burgers', 'desc' => 'Two patties, smoked bacon, American cheese, BBQ sauce', 'ingredients' => 'Two patties, Bacon, American cheese, BBQ', 'cooking_time' => 10, 'bought' => 250, 'new_price' => 520],
                    ['name' => 'Chicken Supreme',      'price' => 500,  'cat' => 'burgers', 'desc' => 'Crispy chicken breast, lettuce, tomato, mayo', 'ingredients' => 'Chicken breast, Lettuce, Tomato, Mayo', 'cooking_time' => 9, 'bought' => 130],
                    ['name' => 'French Fries',         'price' => 200,  'cat' => 'accompagnements', 'desc' => 'Crispy golden fries with sea salt', 'ingredients' => 'Potatoes, Sea salt, Oil', 'cooking_time' => 5, 'bought' => 400],
                    ['name' => 'Milkshake Vanille',    'price' => 350,  'cat' => 'boissons', 'desc' => 'Thick and creamy vanilla milkshake', 'ingredients' => 'Vanilla ice cream, Milk, Whipped cream', 'cooking_time' => 3, 'bought' => 75],
                ],
            ],
            'tanaka' => [
                'owner_key' => 'tanaka',
                'name' => 'Sushi Zen',
                'alias' => 'sushi-zen',
                'description' => 'Artisanal Japanese cuisine prepared by expert chefs. Fresh fish imported daily.',
                'address' => '3 Rue des Frères Bouakkaz',
                'latitude' => 36.7570, 'longitude' => 3.0555,
                'email' => 'tanaka@sushi.dz',
                'phone' => '0551000003',
                'type_cats' => ['sushi-asiatique', 'restaurant'],
                'badges' => ['Top Rated', 'Eco Friendly'],
                'opening_hours' => [
                    'monday' => '12:00-22:00', 'tuesday' => '12:00-22:00',
                    'wednesday' => '12:00-22:00', 'thursday' => '12:00-22:00',
                    'friday' => '16:00-23:00', 'saturday' => '12:00-23:00',
                    'sunday' => '12:00-21:00',
                ],
                'zones' => [
                    ['name' => 'Proche', 'radius_km' => 3, 'fee' => 100],
                    ['name' => 'Moyen', 'radius_km' => 7, 'fee' => 300],
                ],
                'social' => [
                    ['platform' => 'instagram', 'url' => 'https://instagram.com/sushizen_dz'],
                    ['platform' => 'facebook',  'url' => 'https://facebook.com/sushizen'],
                ],
                'foods' => [
                    ['name' => 'California Roll (8pcs)', 'price' => 900,  'cat' => 'sushi', 'desc' => 'Crab stick, avocado, cucumber, sesame', 'ingredients' => 'Crab stick, Avocado, Cucumber, Sesame, Rice', 'cooking_time' => 15, 'bought' => 95],
                    ['name' => 'Salmon Nigiri (6pcs)',  'price' => 1100, 'cat' => 'sushi', 'desc' => 'Fresh Norwegian salmon over seasoned rice', 'ingredients' => 'Salmon, Rice, Wasabi, Nori', 'cooking_time' => 10, 'bought' => 70],
                    ['name' => 'Dragon Roll (8pcs)',    'price' => 1300, 'cat' => 'sushi', 'desc' => 'Shrimp tempura, avocado, eel sauce', 'ingredients' => 'Shrimp tempura, Avocado, Eel sauce, Rice', 'cooking_time' => 18, 'bought' => 60],
                    ['name' => 'Miso Soup',             'price' => 350,  'cat' => 'soupes', 'desc' => 'Traditional miso with tofu, wakame, green onions', 'ingredients' => 'Miso paste, Tofu, Wakame, Green onions', 'cooking_time' => 5, 'bought' => 45],
                    ['name' => 'Edamame',               'price' => 300,  'cat' => 'accompagnements', 'desc' => 'Steamed soy beans with sea salt', 'ingredients' => 'Edamame, Sea salt', 'cooking_time' => 4, 'bought' => 35],
                ],
            ],
            'pierre' => [
                'owner_key' => 'pierre',
                'name' => 'Café de Paris',
                'alias' => 'cafe-de-paris',
                'description' => 'French-inspired café with artisanal coffee, fresh pastries, and light meals in a cozy atmosphere.',
                'address' => '8 Rue d\'Isly',
                'latitude' => 36.7542, 'longitude' => 3.0500,
                'email' => 'pierre@cafe.dz',
                'phone' => '0551000004',
                'type_cats' => ['cafe', 'patisserie'],
                'badges' => ['New', 'Eco Friendly'],
                'opening_hours' => [
                    'monday' => '07:00-21:00', 'tuesday' => '07:00-21:00',
                    'wednesday' => '07:00-21:00', 'thursday' => '07:00-21:00',
                    'friday' => '07:00-21:00', 'saturday' => '08:00-22:00',
                    'sunday' => '08:00-20:00',
                ],
                'zones' => [
                    ['name' => 'Piéton', 'radius_km' => 1.5, 'fee' => 0],
                ],
                'social' => [
                    ['platform' => 'instagram', 'url' => 'https://instagram.com/cafedeparis_dz'],
                    ['platform' => 'facebook',  'url' => 'https://facebook.com/cafedeparis'],
                    ['platform' => 'website',   'url' => 'https://cafedeparis.dz'],
                ],
                'foods' => [
                    ['name' => 'Croissant aux Amandes',  'price' => 280,  'cat' => 'desserts', 'desc' => 'Buttery croissant with almond filling', 'ingredients' => 'Puff pastry, Almond cream, Sliced almonds', 'cooking_time' => 3, 'bought' => 60],
                    ['name' => 'Tarte aux Fraises',      'price' => 450,  'cat' => 'desserts', 'desc' => 'Fresh strawberry tart with vanilla cream', 'ingredients' => 'Shortcrust, Vanilla cream, Strawberries', 'cooking_time' => 4, 'bought' => 30],
                    ['name' => 'Café Crème',              'price' => 200,  'cat' => 'cafe-the', 'desc' => 'Freshly brewed espresso with steamed milk', 'ingredients' => 'Arabica coffee, Whole milk', 'cooking_time' => 2, 'bought' => 500],
                    ['name' => 'Thé à la Menthe',         'price' => 150,  'cat' => 'cafe-the', 'desc' => 'Traditional mint tea', 'ingredients' => 'Green tea, Fresh mint, Sugar', 'cooking_time' => 3, 'bought' => 350],
                    ['name' => 'Quiche Lorraine',         'price' => 500,  'cat' => 'plats-principaux', 'desc' => 'Eggs, bacon, cheese in flaky pastry', 'ingredients' => 'Eggs, Bacon, Gruyère, Pastry, Cream', 'cooking_time' => 10, 'bought' => 25],
                ],
            ],
            'carlos' => [
                'owner_key' => 'carlos',
                'name' => 'Tacos El Paso',
                'alias' => 'tacos-el-paso',
                'description' => 'Authentic Mexican street food: tacos, burritos, nachos, and fresh guacamole.',
                'address' => '25 Rue Larbi Ben Mhidi',
                'latitude' => 36.7560, 'longitude' => 3.0444,
                'email' => 'carlos@tacos.dz',
                'phone' => '0551000005',
                'type_cats' => ['fast-food', 'snack'],
                'badges' => ['Fast Prep', 'Value Promo'],
                'opening_hours' => [
                    'monday' => '11:00-23:00', 'tuesday' => '11:00-23:00',
                    'wednesday' => '11:00-23:00', 'thursday' => '11:00-23:00',
                    'friday' => '15:00-23:00', 'saturday' => '12:00-00:00',
                    'sunday' => '12:00-22:00',
                ],
                'zones' => [
                    ['name' => 'Centre', 'radius_km' => 3, 'fee' => 0],
                    ['name' => 'Périphérie', 'radius_km' => 8, 'fee' => 350],
                ],
                'social' => [
                    ['platform' => 'instagram', 'url' => 'https://instagram.com/tacoselpaso'],
                    ['platform' => 'tiktok',    'url' => 'https://tiktok.com/@tacoselpaso'],
                ],
                'foods' => [
                    ['name' => 'Tacos Pastor (3pcs)',   'price' => 500,  'cat' => 'tacos', 'desc' => 'Marinated pork, pineapple, onion, cilantro', 'ingredients' => 'Pork, Pineapple, Onion, Cilantro, Lime', 'cooking_time' => 10, 'bought' => 110],
                    ['name' => 'Burrito Supreme',       'price' => 750,  'cat' => 'tacos', 'desc' => 'Beef, rice, beans, cheese, sour cream in flour tortilla', 'ingredients' => 'Beef, Rice, Beans, Cheese, Sour cream, Tortilla', 'cooking_time' => 12, 'bought' => 85],
                    ['name' => 'Nachos Grandes',         'price' => 600,  'cat' => 'tacos', 'desc' => 'Crispy tortilla chips with cheese, guacamole, salsa', 'ingredients' => 'Tortilla chips, Cheese, Guacamole, Salsa, Jalapeños', 'cooking_time' => 7, 'bought' => 140],
                    ['name' => 'Guacamole & Chips',      'price' => 350,  'cat' => 'accompagnements', 'desc' => 'Fresh avocado dip with homemade chips', 'ingredients' => 'Avocado, Tomato, Onion, Lime, Cilantro, Chips', 'cooking_time' => 5, 'bought' => 55],
                ],
            ],
            'jc' => [
                'owner_key' => 'jc',
                'name' => 'Le Petit Creuset',
                'alias' => 'le-petit-creuset',
                'description' => 'Refined French cuisine in an intimate setting. Seasonal menus prepared with passion.',
                'address' => '12 Boulevard Victor Hugo',
                'latitude' => 36.7588, 'longitude' => 3.0488,
                'email' => 'jc@creuset.dz',
                'phone' => '0551000006',
                'type_cats' => ['restaurant', 'cuisine-algerienne'],
                'badges' => ['Top Rated', 'Best Seller'],
                'opening_hours' => [
                    'monday' => '12:00-14:30, 19:00-22:30',
                    'tuesday' => '12:00-14:30, 19:00-22:30',
                    'wednesday' => '12:00-14:30, 19:00-22:30',
                    'thursday' => '12:00-14:30, 19:00-22:30',
                    'friday' => '19:00-23:00',
                    'saturday' => '12:00-14:30, 19:00-23:00',
                    'sunday' => '12:00-15:00',
                ],
                'zones' => [
                    ['name' => 'Urbain', 'radius_km' => 4, 'fee' => 200],
                ],
                'social' => [
                    ['platform' => 'facebook',  'url' => 'https://facebook.com/lepetitcreuset'],
                    ['platform' => 'instagram', 'url' => 'https://instagram.com/lepetitcreuset'],
                    ['platform' => 'website',   'url' => 'https://lepetitcreuset.dz'],
                ],
                'foods' => [
                    ['name' => 'Soupe à l\'Oignon',     'price' => 550,  'cat' => 'soupes', 'desc' => 'Classic onion soup with Gruyère croutons', 'ingredients' => 'Onions, Beef broth, Gruyère, Bread, Thyme', 'cooking_time' => 15, 'bought' => 40],
                    ['name' => 'Steak Frites',           'price' => 1400, 'cat' => 'plats-principaux', 'desc' => 'Grilled ribeye steak with hand-cut fries and salad', 'ingredients' => 'Ribeye, Potatoes, Mixed greens, Herb butter', 'cooking_time' => 18, 'bought' => 75],
                    ['name' => 'Confit de Canard',       'price' => 1200, 'cat' => 'plats-principaux', 'desc' => 'Duck leg confit with Sarladaise potatoes', 'ingredients' => 'Duck leg, Potatoes, Garlic, Duck fat, Parsley', 'cooking_time' => 20, 'bought' => 50],
                    ['name' => 'Crème Brûlée',           'price' => 450,  'cat' => 'desserts', 'desc' => 'Classic vanilla custard with caramelized sugar', 'ingredients' => 'Cream, Eggs, Vanilla, Sugar', 'cooking_time' => 5, 'bought' => 60],
                    ['name' => 'Plateau de Fromages',    'price' => 800,  'cat' => 'accompagnements', 'desc' => 'Selection of 3 French cheeses with bread', 'ingredients' => 'Brie, Comté, Roquefort, Bread, Grapes', 'cooking_time' => 3, 'bought' => 20],
                ],
            ],
            'liwei' => [
                'owner_key' => 'liwei',
                'name' => 'Wok This Way',
                'alias' => 'wok-this-way',
                'description' => 'Chinese and Pan-Asian street food: stir-fries, dim sums, noodle soups, and more.',
                'address' => '7 Rue de la Liberté',
                'latitude' => 36.7520, 'longitude' => 3.0666,
                'email' => 'liwei@wok.dz',
                'phone' => '0551000007',
                'type_cats' => ['sushi-asiatique', 'snack'],
                'badges' => ['Fast Prep', 'Value Promo'],
                'opening_hours' => [
                    'monday' => '11:00-22:00', 'tuesday' => '11:00-22:00',
                    'wednesday' => '11:00-22:00', 'thursday' => '11:00-22:00',
                    'friday' => '15:00-22:00', 'saturday' => '11:00-23:00',
                    'sunday' => '12:00-21:00',
                ],
                'zones' => [
                    ['name' => 'Centre', 'radius_km' => 3, 'fee' => 0],
                    ['name' => 'Étendu', 'radius_km' => 8, 'fee' => 250],
                ],
                'social' => [
                    ['platform' => 'instagram', 'url' => 'https://instagram.com/wokthisway'],
                    ['platform' => 'facebook',  'url' => 'https://facebook.com/wokthisway'],
                    ['platform' => 'tiktok',    'url' => 'https://tiktok.com/@wokthisway'],
                ],
                'foods' => [
                    ['name' => 'Poulet aux Noix de Cajou',  'price' => 750,  'cat' => 'plats-principaux', 'desc' => 'Stir-fried chicken with cashews, veggies, oyster sauce', 'ingredients' => 'Chicken, Cashews, Bell peppers, Oyster sauce, Rice', 'cooking_time' => 10, 'bought' => 90],
                    ['name' => 'Bœuf aux Légumes',          'price' => 850,  'cat' => 'plats-principaux', 'desc' => 'Tender beef strips with broccoli, carrots in soy glaze', 'ingredients' => 'Beef, Broccoli, Carrots, Soy sauce, Ginger', 'cooking_time' => 10, 'bought' => 70],
                    ['name' => 'Nouilles Sautées',          'price' => 600,  'cat' => 'plats-principaux', 'desc' => 'Egg noodles stir-fried with vegetables and soy', 'ingredients' => 'Egg noodles, Vegetables, Soy sauce, Sesame oil', 'cooking_time' => 7, 'bought' => 110],
                    ['name' => 'Raviolis Vapeur (6pcs)',    'price' => 500,  'cat' => 'accompagnements', 'desc' => 'Pork and shrimp dumplings served with dipping sauce', 'ingredients' => 'Pork, Shrimp, Wrapper, Soy sauce, Vinegar', 'cooking_time' => 12, 'bought' => 55],
                    ['name' => 'Soupe Wanton',               'price' => 400,  'cat' => 'soupes', 'desc' => 'Clear broth with pork wantons and green onions', 'ingredients' => 'Pork wantons, Broth, Bok choy, Green onions', 'cooking_time' => 8, 'bought' => 35],
                ],
            ],
            'karim' => [
                'owner_key' => 'karim',
                'name' => 'Grillades du Sud',
                'alias' => 'grillades-du-sud',
                'description' => 'Algerian-style grilled meats, merguez, brochettes, and traditional sides.',
                'address' => '18 Rue Hassiba Ben Bouali',
                'latitude' => 36.7500, 'longitude' => 3.0622,
                'email' => 'karim@grill.dz',
                'phone' => '0551000008',
                'type_cats' => ['grill-bbq', 'cuisine-algerienne'],
                'badges' => ['Best Seller', 'Fast Prep'],
                'opening_hours' => [
                    'monday' => '11:00-23:00', 'tuesday' => '11:00-23:00',
                    'wednesday' => '11:00-23:00', 'thursday' => '11:00-23:00',
                    'friday' => '11:00-23:30', 'saturday' => '11:00-23:30',
                    'sunday' => '12:00-22:00',
                ],
                'zones' => [
                    ['name' => 'Proche', 'radius_km' => 3, 'fee' => 0],
                    ['name' => 'Moyen', 'radius_km' => 6, 'fee' => 200],
                    ['name' => 'Loin', 'radius_km' => 12, 'fee' => 500],
                ],
                'social' => [
                    ['platform' => 'facebook',  'url' => 'https://facebook.com/grilladesdusud'],
                    ['platform' => 'instagram', 'url' => 'https://instagram.com/grilladesdusud'],
                    ['platform' => 'whatsapp',  'url' => 'https://wa.me/213551000008'],
                ],
                'foods' => [
                    ['name' => 'Merguez (6pcs)',           'price' => 500,  'cat' => 'grills', 'desc' => 'Spicy Algerian lamb sausages grilled to perfection', 'ingredients' => 'Lamb merguez, Spices', 'cooking_time' => 8, 'bought' => 200],
                    ['name' => 'Brochette de Bœuf (4pcs)', 'price' => 700,  'cat' => 'grills', 'desc' => 'Marinated beef skewers with peppers and onions', 'ingredients' => 'Beef, Peppers, Onions, Spices', 'cooking_time' => 10, 'bought' => 150],
                    ['name' => 'Côtelettes d\'Agneau',     'price' => 1200, 'cat' => 'grills', 'desc' => 'Grilled lamb chops with herb marinade', 'ingredients' => 'Lamb chops, Rosemary, Garlic, Olive oil', 'cooking_time' => 14, 'bought' => 60],
                    ['name' => 'Frites Maison',            'price' => 250,  'cat' => 'accompagnements', 'desc' => 'Thick-cut homemade fries', 'ingredients' => 'Potatoes, Oil, Salt', 'cooking_time' => 7, 'bought' => 350],
                    ['name' => 'Salade Mechouia',          'price' => 300,  'cat' => 'salades', 'desc' => 'Grilled peppers, tomatoes, onions with olive oil', 'ingredients' => 'Peppers, Tomatoes, Onions, Olive oil, Tuna', 'cooking_time' => 5, 'bought' => 40],
                    ['name' => 'Coca-Cola 330ml',          'price' => 120,  'cat' => 'boissons', 'desc' => 'Ice cold', 'ingredients' => 'Soda', 'cooking_time' => 1, 'bought' => 400],
                ],
            ],
            'sophie' => [
                'owner_key' => 'sophie',
                'name' => 'Ice Cream Paradise',
                'alias' => 'ice-cream-paradise',
                'description' => 'Premium artisanal ice cream, sorbets, and frozen yoghurt made on-site daily.',
                'address' => '9 Rue de la Gare',
                'latitude' => 36.7511, 'longitude' => 3.0700,
                'email' => 'sophie@icecream.dz',
                'phone' => '0551000009',
                'type_cats' => ['glaces-sorbets', 'patisserie'],
                'badges' => ['New', 'Eco Friendly'],
                'opening_hours' => [
                    'monday' => '10:00-22:00', 'tuesday' => '10:00-22:00',
                    'wednesday' => '10:00-22:00', 'thursday' => '10:00-22:00',
                    'friday' => '14:00-23:00', 'saturday' => '10:00-23:00',
                    'sunday' => '10:00-22:00',
                ],
                'zones' => [
                    ['name' => 'Local', 'radius_km' => 2, 'fee' => 0],
                ],
                'social' => [
                    ['platform' => 'instagram', 'url' => 'https://instagram.com/icecreamparadise'],
                    ['platform' => 'facebook',  'url' => 'https://facebook.com/icecreamparadise'],
                    ['platform' => 'tiktok',    'url' => 'https://tiktok.com/@icecreamparadise'],
                ],
                'foods' => [
                    ['name' => 'Vanilla Bean (scoop)',      'price' => 200,  'cat' => 'ice-cream', 'desc' => 'Madagascar vanilla ice cream', 'ingredients' => 'Cream, Milk, Sugar, Vanilla beans', 'cooking_time' => 2, 'bought' => 300],
                    ['name' => 'Chocolate Fondant (scoop)', 'price' => 220,  'cat' => 'ice-cream', 'desc' => 'Rich Belgian chocolate ice cream', 'ingredients' => 'Cream, Belgian chocolate, Cocoa', 'cooking_time' => 2, 'bought' => 280],
                    ['name' => 'Sorbet Framboise (scoop)',  'price' => 250,  'cat' => 'ice-cream', 'desc' => 'Raspberry sorbet, dairy-free', 'ingredients' => 'Raspberry purée, Sugar, Water', 'cooking_time' => 2, 'bought' => 120],
                    ['name' => 'Coupe Glacée Spéciale',     'price' => 600,  'cat' => 'ice-cream', 'desc' => '3 scoops of your choice with whipped cream, sauce, and sprinkles', 'ingredients' => 'Ice cream, Whipped cream, Chocolate sauce, Sprinkles', 'cooking_time' => 5, 'bought' => 90],
                    ['name' => 'Milk Shake Fraise',         'price' => 400,  'cat' => 'boissons', 'desc' => 'Fresh strawberry milkshake', 'ingredients' => 'Strawberries, Milk, Ice cream', 'cooking_time' => 4, 'bought' => 65],
                ],
            ],
            'samir' => [
                'owner_key' => 'samir',
                'name' => 'Libanais Chez Samir',
                'alias' => 'libanais-chez-samir',
                'description' => 'Authentic Lebanese cuisine: mezzes, grilled meats, and traditional sweets.',
                'address' => '5 Rue de l\'Indépendance',
                'latitude' => 36.7599, 'longitude' => 3.0388,
                'email' => 'samir@libanais.dz',
                'phone' => '0551000010',
                'type_cats' => ['restaurant', 'sandwicherie'],
                'badges' => ['Top Rated', 'Best Seller', 'Eco Friendly'],
                'opening_hours' => [
                    'monday' => '11:00-22:30', 'tuesday' => '11:00-22:30',
                    'wednesday' => '11:00-22:30', 'thursday' => '11:00-22:30',
                    'friday' => '11:00-23:00', 'saturday' => '11:00-23:00',
                    'sunday' => '11:00-22:00',
                ],
                'zones' => [
                    ['name' => 'Zone A', 'radius_km' => 3, 'fee' => 0],
                    ['name' => 'Zone B', 'radius_km' => 6, 'fee' => 250],
                    ['name' => 'Zone C', 'radius_km' => 10, 'fee' => 400],
                ],
                'social' => [
                    ['platform' => 'facebook',  'url' => 'https://facebook.com/chezsamir'],
                    ['platform' => 'instagram', 'url' => 'https://instagram.com/chezsamir_dz'],
                    ['platform' => 'whatsapp',  'url' => 'https://wa.me/213551000010'],
                    ['platform' => 'snapchat',  'url' => 'https://snapchat.com/add/chezsamir'],
                ],
                'foods' => [
                    ['name' => 'Assiette de Mezzes',      'price' => 900,  'cat' => 'libanais', 'desc' => 'Hummus, baba ganoush, tabbouleh, falafel, pita bread', 'ingredients' => 'Chickpeas, Eggplant, Parsley, Falafel, Pita', 'cooking_time' => 10, 'bought' => 85],
                    ['name' => 'Chawarma Poulet',         'price' => 500,  'cat' => 'libanais', 'desc' => 'Marinated chicken shawarma in pita with garlic sauce', 'ingredients' => 'Chicken, Pita, Garlic sauce, Pickles', 'cooking_time' => 8, 'bought' => 220],
                    ['name' => 'Kebbeh (6pcs)',           'price' => 600,  'cat' => 'libanais', 'desc' => 'Cracked wheat shells stuffed with minced lamb and pine nuts', 'ingredients' => 'Bulgar, Lamb, Pine nuts, Spices, Onion', 'cooking_time' => 15, 'bought' => 55],
                    ['name' => 'Fattouche',               'price' => 400,  'cat' => 'salades', 'desc' => 'Mixed greens with crispy pita, sumac, lemon vinaigrette', 'ingredients' => 'Lettuce, Tomato, Cucumber, Pita, Sumac, Lemon', 'cooking_time' => 5, 'bought' => 40],
                    ['name' => 'Baklava (4pcs)',          'price' => 350,  'cat' => 'desserts', 'desc' => 'Layered filo pastry with pistachios and honey syrup', 'ingredients' => 'Filo, Pistachios, Butter, Honey', 'cooking_time' => 3, 'bought' => 100],
                ],
            ],
        ];

        $typeCatIds = \DB::table('store_type_categories')->pluck('id', 'slug');
        $stores = [];

        foreach ($storeData as $key => $sd) {
            $owner = $owners[$sd['owner_key']];

            $store = Store::firstOrCreate(
                ['alias' => $sd['alias']],
                [
                    'owner_id'          => $owner->id,
                    'name'              => $sd['name'],
                    'alias'             => $sd['alias'],
                    'description'       => $sd['description'],
                    'address'           => $sd['address'],
                    'latitude'          => $sd['latitude'],
                    'longitude'         => $sd['longitude'],
                    'email'             => $sd['email'],
                    'phone'             => $sd['phone'],
                    'opening_hours'     => $sd['opening_hours'],
                    'is_approved'       => true,
                    'is_active'         => true,
                    'ordering_enabled'  => true,
                    'onboarding_status' => 'approved',
                    'delivery_zone_radius' => 10,
                    'base_delivery_fee' => 200,
                    'avg_delivery_time_per_km' => 7,
                    'template_slug'     => 'template-1-classic',
                ]
            );

            $stores[$key] = $store;

            // Type categories (pivot)
            foreach ($sd['type_cats'] as $tcSlug) {
                if ($tid = $typeCatIds[$tcSlug] ?? null) {
                    \DB::table('store_type_category')->updateOrInsert(
                        ['store_id' => $store->id, 'store_type_category_id' => $tid],
                        ['store_id' => $store->id, 'store_type_category_id' => $tid]
                    );
                }
            }

            // Badges (pivot)
            foreach ($sd['badges'] as $bName) {
                if ($badge = $badges[$bName] ?? null) {
                    \DB::table('store_badge')->updateOrInsert(
                        ['store_id' => $store->id, 'badge_id' => $badge->id],
                        ['store_id' => $store->id, 'badge_id' => $badge->id]
                    );
                }
            }

            // Phones
            StorePhone::firstOrCreate(
                ['store_id' => $store->id, 'phone' => $sd['phone']],
                ['store_id' => $store->id, 'phone' => $sd['phone'], 'is_primary' => true, 'order_index' => 0, 'verified_at' => now()]
            );

            // Delivery zones
            foreach ($sd['zones'] as $i => $z) {
                Zone::firstOrCreate(
                    ['store_id' => $store->id, 'name' => $z['name']],
                    ['store_id' => $store->id, 'name' => $z['name'], 'radius_km' => $z['radius_km'], 'fee' => $z['fee']]
                );
            }

            // Social links
            foreach ($sd['social'] as $s) {
                StoreSocialLink::firstOrCreate(
                    ['store_id' => $store->id, 'platform' => $s['platform']],
                    ['store_id' => $store->id, 'platform' => $s['platform'], 'url' => $s['url']]
                );
            }

            // Foods
            foreach ($sd['foods'] as $fd) {
                $food = Food::firstOrCreate(
                    ['store_id' => $store->id, 'name' => $fd['name']],
                    [
                        'store_id'     => $store->id,
                        'name'         => $fd['name'],
                        'description'  => $fd['desc'],
                        'price'        => $fd['price'],
                        'new_price'    => $fd['new_price'] ?? null,
                        'is_available' => true,
                        'ingredients'  => $fd['ingredients'],
                        'cooking_time' => $fd['cooking_time'],
                        'bought_count' => $fd['bought'],
                    ]
                );

                // Attach food category (pivot)
                if ($cat = $cats[$fd['cat']] ?? null) {
                    \DB::table('category_food')->updateOrInsert(
                        ['food_id' => $food->id, 'category_id' => $cat->id],
                        ['food_id' => $food->id, 'category_id' => $cat->id]
                    );
                }
            }

            // Offer
            Offer::firstOrCreate(
                ['store_id' => $store->id, 'title' => 'Offre de Bienvenue'],
                [
                    'store_id'   => $store->id,
                    'title'      => 'Offre de Bienvenue',
                    'description' => '-20% sur votre première commande !',
                    'active'     => true,
                    'valid_from' => now(),
                    'valid_to'   => now()->addMonths(3),
                ]
            );

            // Promo code
            PromoCode::firstOrCreate(
                ['code' => strtoupper(substr($sd['alias'], 0, 4)) . '20'],
                [
                    'store_id'  => $store->id,
                    'code'      => strtoupper(substr($sd['alias'], 0, 4)) . '20',
                    'type'      => 'percentage',
                    'value'     => 20,
                    'is_active' => true,
                    'expires_at' => now()->addMonths(6),
                ]
            );

            // Post
            Post::firstOrCreate(
                ['store_id' => $store->id, 'title' => 'Bienvenue chez ' . $sd['name']],
                [
                    'store_id' => $store->id,
                    'title'    => 'Bienvenue chez ' . $sd['name'],
                    'content'  => 'Nous sommes ravis de vous accueillir sur YallahKool ! Découvrez notre menu et profitez de nos offres spéciales. Commandez en ligne et livraison rapide garantie.',
                ]
            );

            // Banner
            Banner::firstOrCreate(
                ['store_id' => $store->id, 'image_path' => 'banners/' . $sd['alias'] . '.jpg'],
                [
                    'store_id'  => $store->id,
                    'image_path' => 'banners/' . $sd['alias'] . '.jpg',
                    'link_url'  => '/stores/' . $sd['alias'],
                    'active'    => true,
                ]
            );
        }

        // ─── Delivery Profiles ────────────────────────────────────
        $deliveryProfiles = [];
        foreach ([
            ['user' => $deliveries['ahmed'], 'phone' => '0771000001', 'type' => 'motorcycle'],
            ['user' => $deliveries['yacine'], 'phone' => '0771000002', 'type' => 'bike'],
        ] as $dd) {
            $dp = DeliveryProfile::firstOrCreate(
                ['user_id' => $dd['user']->id],
                [
                    'user_id'         => $dd['user']->id,
                    'phone'           => $dd['phone'],
                    'transporter_type' => $dd['type'],
                    'is_working'      => true,
                    'day_price'       => 0,
                    'night_price'     => 0,
                ]
            );
            $deliveryProfiles[$dd['user']->email] = $dp;
        }

        // ─── Chef Profiles ─────────────────────────────────────────
        $chefProfiles = [];
        $chefData = [
            'hakim' => [
                'user' => $chefs['hakim'],
                'bio' => 'Chef cuisinier avec 12 ans d\'expérience dans la cuisine algérienne, marocaine et française.',
                'spec' => 'Cuisine algérienne & française',
                'years' => 12,
                'cuisines' => ['Algérienne', 'Française', 'Marocaine'],
                'hourly' => 2500,
                'menu_rate' => 15000,
                'skills' => [
                    ['name' => 'Pâtisserie', 'level' => 'Expert', 'certified' => 2015],
                    ['name' => 'Grillade', 'level' => 'Expert', 'certified' => 2016],
                    ['name' => 'Cuisine traditionnelle', 'level' => 'Avancé', 'certified' => 2014],
                ],
                'diplomas' => [
                    ['name' => 'CAP Cuisine', 'inst' => 'Institut National de l\'Hôtellerie', 'year' => 2012, 'verified' => true],
                    ['name' => 'BTS Hôtellerie Restauration', 'inst' => 'École Hôtelière d\'Alger', 'year' => 2014, 'verified' => true],
                ],
                'work' => [
                    ['resto' => 'Restaurant El Djenina', 'pos' => 'Chef de Partie', 'start' => 2014, 'end' => 2017],
                    ['resto' => 'Hôtel Sheraton Alger', 'pos' => 'Sous-Chef', 'start' => 2018, 'end' => 2021],
                    ['resto' => 'Le Serail', 'pos' => 'Chef Exécutif', 'start' => 2022, 'end' => 2024],
                ],
            ],
            'fatima' => [
                'user' => $chefs['fatima'],
                'bio' => 'Chef pâtissière spécialisée dans les desserts algériens et la pâtisserie française.',
                'spec' => 'Pâtisserie & Desserts',
                'years' => 8,
                'cuisines' => ['Algérienne', 'Française', 'Italienne'],
                'hourly' => 2000,
                'menu_rate' => 12000,
                'skills' => [
                    ['name' => 'Pâtisserie fine', 'level' => 'Expert', 'certified' => 2018],
                    ['name' => 'Chocolaterie', 'level' => 'Avancé', 'certified' => 2019],
                    ['name' => 'Boulangerie', 'level' => 'Intermédiaire', 'certified' => 2017],
                ],
                'diplomas' => [
                    ['name' => 'CAP Pâtisserie', 'inst' => 'École Belloua', 'year' => 2016, 'verified' => true],
                    ['name' => 'Mention Complémentaire Desserts de Restaurant', 'inst' => 'Ferrandi Paris', 'year' => 2018, 'verified' => true],
                ],
                'work' => [
                    ['resto' => 'Pâtisserie Parisienne Alger', 'pos' => 'Pâtissière', 'start' => 2016, 'end' => 2019],
                    ['resto' => 'Café de Paris', 'pos' => 'Chef Pâtissière', 'start' => 2020, 'end' => 2023],
                ],
            ],
        ];

        foreach ($chefData as $cd) {
            $cp = ChefProfile::firstOrCreate(
                ['user_id' => $cd['user']->id],
                [
                    'user_id'            => $cd['user']->id,
                    'bio'                => $cd['bio'],
                    'specialization'     => $cd['spec'],
                    'years_of_experience' => $cd['years'],
                    'cuisines_expertise' => $cd['cuisines'],
                    'is_available'       => true,
                    'hourly_rate'        => $cd['hourly'],
                    'base_menu_rate'     => $cd['menu_rate'],
                    'is_verified'        => true,
                    'verified_at'        => now(),
                    'average_rating'     => 4.5,
                    'reviews_count'      => 12,
                ]
            );
            $chefProfiles[$cd['user']->email] = $cp;

            foreach ($cd['skills'] as $sk) {
                ChefSkill::firstOrCreate(
                    ['chef_id' => $cd['user']->id, 'skill_name' => $sk['name']],
                    [
                        'chef_id'          => $cd['user']->id,
                        'skill_name'       => $sk['name'],
                        'proficiency_level' => $sk['level'],
                        'certified_year'   => $sk['certified'],
                    ]
                );
            }

            foreach ($cd['diplomas'] as $dip) {
                ChefDiploma::firstOrCreate(
                    ['chef_id' => $cd['user']->id, 'diploma_name' => $dip['name']],
                    [
                        'chef_id'            => $cd['user']->id,
                        'diploma_name'       => $dip['name'],
                        'issuing_institution' => $dip['inst'],
                        'issue_date'         => $dip['year'],
                        'verified'           => $dip['verified'],
                    ]
                );
            }

            foreach ($cd['work'] as $wh) {
                ChefWorkHistory::firstOrCreate(
                    ['chef_id' => $cd['user']->id, 'restaurant_name' => $wh['resto']],
                    [
                        'chef_id'         => $cd['user']->id,
                        'restaurant_name' => $wh['resto'],
                        'position'        => $wh['pos'],
                        'start_year'      => $wh['start'],
                        'end_year'        => $wh['end'],
                    ]
                );
            }
        }

        // ─── Chef Store Hires ─────────────────────────────────────
        if (isset($chefProfiles['hakim@chef.dz']) && isset($stores['karim'])) {
            ChefStoreHire::firstOrCreate(
                ['chef_profile_id' => $chefProfiles['hakim@chef.dz']->id, 'store_id' => $stores['karim']->id],
                [
                    'chef_profile_id' => $chefProfiles['hakim@chef.dz']->id,
                    'store_id'        => $stores['karim']->id,
                    'hired_by'        => $owners['karim']->id,
                    'hired_at'        => now(),
                    'is_active'       => true,
                ]
            );
        }

        if (isset($chefProfiles['fatima@chef.dz']) && isset($stores['pierre'])) {
            ChefStoreHire::firstOrCreate(
                ['chef_profile_id' => $chefProfiles['fatima@chef.dz']->id, 'store_id' => $stores['pierre']->id],
                [
                    'chef_profile_id' => $chefProfiles['fatima@chef.dz']->id,
                    'store_id'        => $stores['pierre']->id,
                    'hired_by'        => $owners['pierre']->id,
                    'hired_at'        => now(),
                    'is_active'       => true,
                ]
            );
        }

        // ─── Store Staff ───────────────────────────────────────────
        StoreStaff::firstOrCreate(
            ['store_id' => $stores['mario']->id, 'user_id' => $clients['rachid']->id],
            [
                'store_id'    => $stores['mario']->id,
                'user_id'     => $clients['rachid']->id,
                'store_role'  => 'chef',
                'permissions' => ['manage_orders'],
            ]
        );

        // ─── Orders ────────────────────────────────────────────────
        $ali  = $clients['ali'];
        $yas  = $clients['yasmine'];
        $rach = $clients['rachid'];
        $ahmedD = $deliveries['ahmed'];
        $yacineD = $deliveries['yacine'];

        // Helper to get first food by store alias and name prefix
        $food = function ($storeAlias, $namePrefix) use ($stores) {
            return Food::where('store_id', $stores[$storeAlias]->id)
                ->where('name', 'like', "$namePrefix%")->first();
        };

        // Order 1: Delivered — Ali at Mario's
        $order1 = $this->makeOrder([
            'client_id' => $ali->id,
            'store_id' => $stores['mario']->id,
            'delivery_id' => $ahmedD->id,
            'status' => OrderStatus::Delivered,
            'total_amount' => 820,
            'address' => '12 Rue des Oliviers, Alger',
            'phone' => '0661000001',
            'notes' => 'Code 1234. Sonner au 2ème.',
            'items' => [
                ['food' => $food('mario', 'Margherita'), 'qty' => 1, 'price' => 700],
                ['food' => $food('mario', 'Coca-Cola'), 'qty' => 1, 'price' => 120],
            ],
        ]);

        // Order 2: Pending — Ali at Mario's (Pepperoni on discount)
        $order2 = $this->makeOrder([
            'client_id' => $ali->id,
            'store_id' => $stores['mario']->id,
            'status' => OrderStatus::Pending,
            'total_amount' => 680,
            'address' => '5 Blvd Didouche Mourad, Alger',
            'phone' => '0661000001',
            'items' => [
                ['food' => $food('mario', 'Pepperoni'), 'qty' => 1, 'price' => 680],
            ],
        ]);

        // Order 3: Delivered — Yasmine at Burger House
        $order3 = $this->makeOrder([
            'client_id' => $yas->id,
            'store_id' => $stores['sarah']->id,
            'delivery_id' => $yacineD->id,
            'status' => OrderStatus::Delivered,
            'total_amount' => 1100,
            'address' => '8 Rue Ben Mhidi, Alger',
            'phone' => '0661000002',
            'items' => [
                ['food' => $food('sarah', 'Double Bacon'), 'qty' => 1, 'price' => 650],
                ['food' => $food('sarah', 'French Fries'), 'qty' => 1, 'price' => 200],
                ['food' => $food('sarah', 'Milkshake'), 'qty' => 1, 'price' => 350],
            ],
        ]);

        // Order 4: Preparing — Rachid at Grillades du Sud
        $order4 = $this->makeOrder([
            'client_id' => $rach->id,
            'store_id' => $stores['karim']->id,
            'status' => OrderStatus::Preparing,
            'total_amount' => 1200,
            'address' => '3 Rue de la Paix, Alger',
            'phone' => '0661000003',
            'items' => [
                ['food' => $food('karim', 'Merguez'), 'qty' => 1, 'price' => 500],
                ['food' => $food('karim', 'Brochette'), 'qty' => 1, 'price' => 700],
            ],
        ]);

        // Order 5: Delivered — Ali at Sushi Zen
        $order5 = $this->makeOrder([
            'client_id' => $ali->id,
            'store_id' => $stores['tanaka']->id,
            'delivery_id' => $yacineD->id,
            'status' => OrderStatus::Delivered,
            'total_amount' => 1250,
            'address' => '12 Rue des Oliviers, Alger',
            'phone' => '0661000001',
            'items' => [
                ['food' => $food('tanaka', 'California Roll'), 'qty' => 1, 'price' => 900],
                ['food' => $food('tanaka', 'Miso Soup'), 'qty' => 1, 'price' => 350],
            ],
        ]);

        // Order 6: In delivery — Yasmine at Wok This Way
        $order6 = $this->makeOrder([
            'client_id' => $yas->id,
            'store_id' => $stores['liwei']->id,
            'delivery_id' => $ahmedD->id,
            'status' => OrderStatus::Delivering,
            'total_amount' => 1350,
            'address' => '8 Rue Ben Mhidi, Alger',
            'phone' => '0661000002',
            'items' => [
                ['food' => $food('liwei', 'Bœuf'), 'qty' => 1, 'price' => 850],
                ['food' => $food('liwei', 'Raviolis'), 'qty' => 1, 'price' => 500],
            ],
        ]);

        // Order 7: Ready for delivery — Rachid at Libanais Chez Samir
        $order7 = $this->makeOrder([
            'client_id' => $rach->id,
            'store_id' => $stores['samir']->id,
            'status' => OrderStatus::Ready,
            'total_amount' => 1400,
            'address' => '3 Rue de la Paix, Alger',
            'phone' => '0661000003',
            'items' => [
                ['food' => $food('samir', 'Assiette de Mezzes'), 'qty' => 1, 'price' => 900],
                ['food' => $food('samir', 'Baklava'), 'qty' => 1, 'price' => 350],
                ['food' => $food('samir', 'Fattouche'), 'qty' => 1, 'price' => 400],
            ],
        ]);

        // ─── Reviews ──────────────────────────────────────────────
        Review::firstOrCreate(
            ['client_id' => $ali->id, 'store_id' => $stores['mario']->id],
            ['rating' => 5, 'comment' => 'Meilleure pizzeria d\'Alger ! La pâte est parfaite et les ingrédients sont frais.']
        );
        Review::firstOrCreate(
            ['client_id' => $yas->id, 'store_id' => $stores['sarah']->id],
            ['rating' => 4, 'comment' => 'Les burgers sont excellents, surtout le Double Bacon. Les frites pourraient être plus croustillantes.']
        );
        Review::firstOrCreate(
            ['client_id' => $rach->id, 'store_id' => $stores['karim']->id],
            ['rating' => 5, 'comment' => 'Les grillades sont incroyables ! La merguez est authentique et les brochettes bien marinées.']
        );
        Review::firstOrCreate(
            ['client_id' => $ali->id, 'store_id' => $stores['tanaka']->id],
            ['rating' => 5, 'comment' => 'Sushi frais et délicieux. Le service est rapide et la présentation est magnifique.']
        );
        Review::firstOrCreate(
            ['client_id' => $yas->id, 'store_id' => $stores['liwei']->id],
            ['rating' => 4, 'comment' => 'Bon wok avec des légumes frais. Les portions sont généreuses.']
        );
        Review::firstOrCreate(
            ['client_id' => $rach->id, 'store_id' => $stores['samir']->id],
            ['rating' => 5, 'comment' => 'Les mezzes sont comme à Beyrouth ! Le houmous est crémeux et le chawarma parfait.']
        );
        Review::firstOrCreate(
            ['client_id' => $ali->id, 'store_id' => $stores['pierre']->id],
            ['rating' => 4, 'comment' => 'Cadre agréable, bons pâtisseries. Le café crème est excellent.']
        );
        Review::firstOrCreate(
            ['client_id' => $yas->id, 'store_id' => $stores['carlos']->id],
            ['rating' => 5, 'comment' => 'Les tacos pastor sont les meilleurs que j\'ai goûtés en dehors du Mexique !']
        );
        Review::firstOrCreate(
            ['client_id' => $rach->id, 'store_id' => $stores['jc']->id],
            ['rating' => 5, 'comment' => 'Une expérience gastronomique française exceptionnelle. Le confit de canard est à tomber.']
        );
        Review::firstOrCreate(
            ['client_id' => $ali->id, 'store_id' => $stores['sophie']->id],
            ['rating' => 4, 'comment' => 'Glaces artisanales délicieuses. La vanille est riche et crémeuse.']
        );
        Review::firstOrCreate(
            ['client_id' => $yas->id, 'store_id' => $stores['mario']->id],
            ['rating' => 5, 'comment' => 'La Quattro Formaggi est divine ! Livraison rapide.']
        );
        Review::firstOrCreate(
            ['client_id' => $rach->id, 'store_id' => $stores['sarah']->id],
            ['rating' => 4, 'comment' => 'Bon rapport qualité-prix. Le Chicken Supreme est mon préféré.']
        );

        // ─── Complaints ─────────────────────────────────────────
        Complaint::firstOrCreate(
            ['client_id' => $ali->id, 'store_id' => $stores['mario']->id, 'subject' => 'Retard de livraison'],
            [
                'client_id'   => $ali->id,
                'store_id'    => $stores['mario']->id,
                'order_id'    => $order1->id ?? null,
                'subject'     => 'Retard de livraison',
                'description' => 'La commande a pris 50 minutes au lieu des 30 annoncées. La pizza était tiède à l\'arrivée.',
                'status'      => 'resolved',
            ]
        );

        // ─── Favorites ───────────────────────────────────────────
        $favStores = [$stores['mario']->id, $stores['sarah']->id, $stores['samir']->id, $stores['tanaka']->id];
        foreach ($favStores as $sid) {
            Favorite::firstOrCreate(
                ['user_id' => $ali->id, 'store_id' => $sid],
                ['user_id' => $ali->id, 'store_id' => $sid]
            );
        }

        $favStores2 = [$stores['karim']->id, $stores['liwei']->id, $stores['carlos']->id];
        foreach ($favStores2 as $sid) {
            Favorite::firstOrCreate(
                ['user_id' => $yas->id, 'store_id' => $sid],
                ['user_id' => $yas->id, 'store_id' => $sid]
            );
        }

        $favStores3 = [$stores['samir']->id, $stores['jc']->id, $stores['sophie']->id];
        foreach ($favStores3 as $sid) {
            Favorite::firstOrCreate(
                ['user_id' => $rach->id, 'store_id' => $sid],
                ['user_id' => $rach->id, 'store_id' => $sid]
            );
        }

        // ─── Favorite Riders ────────────────────────────────────
        $marioOwner = $owners['mario'];
        $marioOwner->favoriteRiders()->syncWithoutDetaching([$yacineD->id]);
    }

    private function makeOrder(array $data): ?Order
    {
        $items = $data['items'] ?? [];
        unset($data['items']);

        $data['commission_amount'] = round($data['total_amount'] * 0.10, 2);

        return Order::withoutEvents(function () use ($data, $items) {
            $order = Order::create($data);

            foreach ($items as $item) {
                if ($item['food']) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'food_id'  => $item['food']->id,
                        'quantity' => $item['qty'],
                        'price'    => $item['price'],
                    ]);
                }
            }

            return $order;
        });
    }
}
