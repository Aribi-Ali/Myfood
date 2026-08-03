<?php

namespace App\Console\Commands;

use App\Models\Badge;
use App\Models\Banner;
use App\Models\Category;
use App\Models\ChefDiploma;
use App\Models\ChefProfile;
use App\Models\ChefSkill;
use App\Models\ChefStoreHire;
use App\Models\ChefWorkHistory;
use App\Models\Commune;
use App\Models\Complaint;
use App\Models\Daira;
use App\Models\DeliveryProfile;
use App\Models\DeliveryProfileArea;
use App\Models\Favorite;
use App\Models\Food;
use App\Models\FoodImage;
use App\Models\Offer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Post;
use App\Models\PromoCode;
use App\Models\Reservation;
use App\Models\ReservationSchedule;
use App\Models\ReservationSetting;
use App\Models\RestaurantTable;
use App\Models\Review;
use App\Models\Setting;
use App\Models\Store;
use App\Models\StoreBranch;
use App\Models\StoreDomain;
use App\Models\StoreImage;
use App\Models\StorePayout;
use App\Models\StoreSocialLink;
use App\Models\StoreStaff;
use App\Models\StoreTypeCategory;
use App\Models\Template;
use App\Models\User;
use App\Models\Wilaya;
use App\Models\Zone;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class SeedFakeData extends Command
{
    protected $signature = 'db:seed-fake
        {--fresh : Truncate all data before seeding}
        {--owners=5 : Number of store owners}
        {--clients=10 : Number of client users}
        {--delivery=4 : Number of delivery users}
        {--chefs=3 : Number of chef users}
        {--stores=5 : Number of stores to create}
        {--foods-per-store=8 : Foods per store}
        {--orders-per-store=5 : Orders per store}
        {--reservations-per-store=3 : Reservations per store}';

    protected $description = 'Seed comprehensive fake data for development and testing';

    private array $wilayaData = [];
    private array $dairaData = [];
    private array $communeData = [];

    public function handle(): int
    {
        $this->info('🌱 Seeding fake data...');
        $this->newLine();

        if ($this->option('fresh')) {
            $this->info('  🧹 Clearing existing data...');
            $this->truncateAll();
        }

        DB::beginTransaction();
        try {
            $this->seedGeography();
            $this->seedUsers();
            $this->seedStoreTypeCategories();
            $this->seedBadges();
            $this->seedStores();
            $this->seedCategories();
            $this->seedFoods();
            $this->seedFoodImages();
            $this->seedCategoryFoodPivot();
            $this->seedStoreImages();
            $this->seedStoreSocialLinks();
            $this->seedStoreDomains();
            $this->seedStaff();
            $this->seedZones();
            $this->seedOrders();
            $this->seedReviews();
            $this->seedReservations();
            $this->seedChefProfiles();
            $this->seedChefStoreHires();
            $this->seedDeliveryProfiles();
            $this->seedOffers();
            $this->seedPromoCodes();
            $this->seedPosts();
            $this->seedBanners();
            $this->seedComplaints();
            $this->seedFavorites();
            $this->seedStorePayouts();
            $this->seedBranchData();
            $this->seedSettings();
            DB::commit();
            $this->info("\n✅ Fake data seeding completed successfully!");
            return Command::SUCCESS;
        } catch (\Throwable $e) {
            DB::rollBack();
            $this->error("\n❌ Seeding failed: " . $e->getMessage());
            $this->error($e->getTraceAsString());
            return Command::FAILURE;
        }
    }

    private function seedGeography(): void
    {
        $this->info('  🗺️  Seeding geography...');

        $seeder = new \Database\Seeders\AlgeriaGeographySeeder();
        $seeder->setCommand($this);
        $seeder->run();

        $this->wilayaData = Wilaya::pluck('id', 'code')->toArray();
        $this->dairaData = Daira::pluck('id', 'name_fr')->toArray();
        $this->communeData = Commune::pluck('id', 'name_fr')->toArray();
    }

    private function seedUsers(): void
    {
        $this->info('  👤 Seeding users...');

        $admin = User::firstOrCreate(
            ['email' => 'admin@yallahkool.dz'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'phone' => '+213555000000',
                'role' => 'admin',
                'avatar' => 'https://picsum.photos/seed/admin-avatar/200/200.jpg',
                'email_verified_at' => now(),
            ]
        );

        for ($i = 1; $i <= $this->option('owners'); $i++) {
            User::firstOrCreate(
                ['email' => "owner$i@yallahkool.dz"],
                [
                    'name' => "Owner $i",
                    'password' => Hash::make('password'),
                    'phone' => '+213555' . str_pad((string)($i + 100), 6, '0', STR_PAD_LEFT),
                    'role' => 'owner',
                    'avatar' => "https://picsum.photos/seed/owner-$i-avatar/200/200.jpg",
                    'email_verified_at' => now(),
                ]
            );
        }

        for ($i = 1; $i <= $this->option('clients'); $i++) {
            User::firstOrCreate(
                ['email' => "client$i@yallahkool.dz"],
                [
                    'name' => "Client $i",
                    'password' => Hash::make('password'),
                    'phone' => '+213555' . str_pad((string)($i + 200), 6, '0', STR_PAD_LEFT),
                    'role' => 'client',
                    'wilaya' => '16',
                    'daira' => 'Alger-Centre',
                    'commune' => 'Centre Ville',
                    'address' => "Rue $i, Alger",
                    'latitude' => 36.75 + (rand(-100, 100) / 1000),
                    'longitude' => 3.05 + (rand(-100, 100) / 1000),
                    'avatar' => "https://picsum.photos/seed/client-$i-avatar/200/200.jpg",
                    'email_verified_at' => now(),
                ]
            );
        }

        for ($i = 1; $i <= $this->option('delivery'); $i++) {
            User::firstOrCreate(
                ['email' => "delivery$i@yallahkool.dz"],
                [
                    'name' => "Delivery $i",
                    'password' => Hash::make('password'),
                    'phone' => '+213555' . str_pad((string)($i + 300), 6, '0', STR_PAD_LEFT),
                    'role' => 'delivery',
                    'wilaya' => '16',
                    'daira' => 'Alger-Centre',
                    'commune' => 'Centre Ville',
                    'avatar' => "https://picsum.photos/seed/delivery-$i-avatar/200/200.jpg",
                    'email_verified_at' => now(),
                ]
            );
        }

        for ($i = 1; $i <= $this->option('chefs'); $i++) {
            User::firstOrCreate(
                ['email' => "chef$i@yallahkool.dz"],
                [
                    'name' => "Chef $i",
                    'password' => Hash::make('password'),
                    'phone' => '+213555' . str_pad((string)($i + 400), 6, '0', STR_PAD_LEFT),
                    'role' => 'chef',
                    'avatar' => "https://picsum.photos/seed/chef-$i-avatar/200/200.jpg",
                    'email_verified_at' => now(),
                ]
            );
        }
    }

    private function seedStoreTypeCategories(): void
    {
        $existingCount = StoreTypeCategory::count();
        if ($existingCount > 0) {
            $this->info('  📂 Store type categories already exist, skipping...');
            return;
        }

        $types = [
            ['Pizzeria', 'pizzeria', '🍕'],
            ['Fast Food', 'fast_food', '🍔'],
            ['Restaurant', 'restaurant', '🍽️'],
            ['Café', 'cafe', '☕'],
            ['Bakery', 'bakery', '🥖'],
            ['Ice Cream', 'ice_cream', '🍦'],
            ['Juice Bar', 'juice_bar', '🧃'],
            ['Grill', 'grill', '🥩'],
        ];

        foreach ($types as $t) {
            StoreTypeCategory::create(['name' => $t[0], 'slug' => $t[1], 'icon' => $t[2]]);
        }
    }

    private function seedBadges(): void
    {
        $existingCount = Badge::count();
        if ($existingCount > 0) {
            $this->info('  🏅 Badges already exist, skipping...');
            return;
        }

        $badges = [
            ['Premium', 'Premium quality store', '#f97316', 'fa-crown'],
            ['Verified', 'Verified by YallahKool', '#22c55e', 'fa-check-circle'],
            ['Top Rated', 'Top rated by customers', '#3b82f6', 'fa-star'],
            ['Fast Delivery', 'Fast delivery service', '#8b5cf6', 'fa-bolt'],
            ['New', 'Newly opened store', '#ec4899', 'fa-sparkles'],
            ['Family Friendly', 'Great for families', '#14b8a6', 'fa-users'],
            ['Best Value', 'Best value for money', '#eab308', 'fa-tag'],
        ];

        foreach ($badges as $b) {
            Badge::create(['name' => $b[0], 'description' => $b[1], 'color_code' => $b[2], 'icon' => $b[3]]);
        }
    }

    private function seedStores(): void
    {
        $this->info('  🏪 Seeding stores...');

        $owners = User::where('role', 'owner')->get();
        $typeCategories = StoreTypeCategory::all();
        $badges = Badge::all();
        $activeTemplates = Template::where('is_active', true)->pluck('slug', 'id')->toArray();
        $templateIds = array_keys($activeTemplates);

        $storeNames = [
            'Pizza Napoli', 'Burger House', 'Le Jardin Restaurant', 'Café El Djazaïr',
            'Boulangerie Parisienne', 'Grill & Chill', 'Sushi Master', 'Tacos Loco',
            'Pâtisserie Fine', 'Glacier Tropical', 'Juice Factory', 'Poisson d\'Or',
            'La Casa del Pizza', 'Kebab King', 'Crêperie Bretonne',
        ];

        for ($i = 0; $i < min((int)$this->option('stores'), count($owners)); $i++) {
            $owner = $owners[$i];
            $name = $storeNames[$i % count($storeNames)] . " #" . ($i + 1);
            $alias = str($name)->slug() . '-' . ($i + 1);
            $templateId = $templateIds[array_rand($templateIds)] ?? null;

            $store = Store::firstOrCreate(
                ['owner_id' => $owner->id],
                [
                'name' => $name,
                'alias' => $alias,
                'description' => "Welcome to {$name}! We serve the best food in town with fresh ingredients and authentic recipes.",
                'opening_hours' => json_encode([
                    'monday' => ['open' => '09:00', 'close' => '22:00'],
                    'tuesday' => ['open' => '09:00', 'close' => '22:00'],
                    'wednesday' => ['open' => '09:00', 'close' => '22:00'],
                    'thursday' => ['open' => '09:00', 'close' => '22:00'],
                    'friday' => ['open' => '09:00', 'close' => '23:00'],
                    'saturday' => ['open' => '10:00', 'close' => '23:00'],
                    'sunday' => ['open' => '10:00', 'close' => '21:00'],
                ]),
                'template_slug' => $templateId ? $activeTemplates[$templateId] : null,
                'wilaya' => '16',
                'daira' => 'Alger-Centre',
                'commune' => 'Centre Ville',
                'address' => "Rue Didouche Mourad, Alger",
                'email' => "store{$i}@yallahkool.dz",
                'phone' => '+213555' . str_pad((string)($i + 500), 6, '0', STR_PAD_LEFT),
                'latitude' => 36.75 + (rand(-50, 50) / 1000),
                'longitude' => 3.05 + (rand(-50, 50) / 1000),
                'is_active' => true,
                'is_approved' => true,
                'onboarding_status' => 'completed',
                'ordering_enabled' => true,
                'avg_prep_time' => 15 + ($i * 5),
                'delivery_zone_radius' => 5 + $i,
                'base_delivery_fee' => 200 + ($i * 50),
                'avg_delivery_time_per_km' => 3,
            ]);

            $store->typeCategories()->attach($typeCategories->random(rand(1, 2))->pluck('id'));
            $store->badges()->attach($badges->random(rand(1, 3))->pluck('id'));

            // Create default branch
            StoreBranch::firstOrCreate(
                ['store_id' => $store->id, 'alias' => $alias],
                [
                    'name' => $name,
                    'description' => $store->description,
                    'template_slug' => $store->template_slug,
                    'theme_preset_id' => $store->theme_preset_id,
                    'email' => $store->email,
                    'phone' => $store->phone,
                    'address' => $store->address,
                    'wilaya' => $store->wilaya,
                    'daira' => $store->daira,
                    'commune' => $store->commune,
                    'latitude' => $store->latitude,
                    'longitude' => $store->longitude,
                    'opening_hours' => $store->opening_hours,
                    'avg_prep_time' => $store->avg_prep_time,
                    'delivery_zone_radius' => $store->delivery_zone_radius,
                    'base_delivery_fee' => $store->base_delivery_fee,
                    'avg_delivery_time_per_km' => $store->avg_delivery_time_per_km,
                    'ordering_enabled' => $store->ordering_enabled,
                    'is_active' => true,
                ]
            );
        }
    }

    private function seedCategories(): void
    {
        $existingCount = Category::count();
        if ($existingCount > 0) {
            $this->info('  📁 Categories already exist, skipping...');
            return;
        }

        $categories = [
            ['Pizzas', 'pizzas', 'Classic and specialty pizzas'],
            ['Burgers', 'burgers', 'Gourmet burgers and sandwiches'],
            ['Salads', 'salads', 'Fresh and healthy salads'],
            ['Desserts', 'desserts', 'Sweet treats and desserts'],
            ['Drinks', 'drinks', 'Refreshing beverages'],
            ['Starters', 'starters', 'Appetizers and starters'],
            ['Main Course', 'main-course', 'Hearty main dishes'],
            ['Sides', 'sides', 'Side dishes and extras'],
            ['Specials', 'specials', 'Chef specials'],
            ['Pasta', 'pasta', 'Pasta dishes'],
        ];

        foreach ($categories as $c) {
            Category::create([
                'name' => $c[0],
                'slug' => $c[1],
                'short_description' => $c[2],
                'full_description' => $c[2] . ' — carefully prepared with fresh ingredients.',
                'meta_title' => $c[0] . ' | YallahKool',
                'meta_description' => 'Browse our ' . strtolower($c[0]) . ' selection.',
                'meta_keywords' => strtolower($c[0]) . ', food, delivery, algeria',
            ]);
        }
    }

    private function seedFoods(): void
    {
        $this->info('  🍕 Seeding foods...');

        $stores = Store::all();
        $categories = Category::all();
        $foodTemplates = [
            ['Margherita Pizza', 'Classic tomato, mozzarella & basil', 650, 15],
            ['Pepperoni Pizza', 'Spicy pepperoni with melted cheese', 850, 18],
            ['Cheeseburger', 'Beef patty with cheddar & lettuce', 500, 12],
            ['Chicken Burger', 'Grilled chicken with mayo & salad', 550, 14],
            ['Caesar Salad', 'Romaine, parmesan, croutons & Caesar dressing', 450, 8],
            ['Greek Salad', 'Feta, olives, cucumber & tomato', 400, 8],
            ['Tiramisu', 'Classic Italian coffee dessert', 350, 5],
            ['Chocolate Fondant', 'Warm chocolate cake with liquid center', 400, 10],
            ['Coca-Cola', 'Refreshing soft drink', 150, 1],
            ['Orange Juice', 'Freshly squeezed orange juice', 250, 3],
            ['Mint Lemonade', 'Fresh mint with lemon', 200, 3],
            ['Bruschetta', 'Toasted bread with tomato & basil', 350, 7],
            ['Pasta Carbonara', 'Creamy pasta with bacon & parmesan', 700, 15],
            ['Grilled Chicken', 'Herb-marinated chicken with vegetables', 900, 20],
            ['French Fries', 'Crispy golden fries', 250, 5],
            ['Onion Rings', 'Crispy battered onion rings', 300, 7],
            ['Mixed Grill', 'Assorted grilled meats platter', 1500, 25],
            ['Seafood Platter', 'Fresh fish, shrimp & calamari', 1800, 30],
            ['Vegetarian Pizza', 'Mixed vegetables with mozzarella', 700, 15],
            ['Club Sandwich', 'Triple-layer with chicken & bacon', 600, 12],
        ];

        foreach ($stores as $store) {
            $storeCategories = $categories->random(min(5, count($categories)));
            $usedFoods = [];

            for ($i = 0; $i < (int)$this->option('foods-per-store'); $i++) {
                $tmpl = $foodTemplates[array_rand($foodTemplates)];
                $foodName = $tmpl[0] . ' (' . $store->name . ')';

                if (in_array($foodName, $usedFoods)) {
                    $foodName .= ' #' . ($i + 1);
                }
                $usedFoods[] = $foodName;

                $category = $storeCategories->random();
                $hasOffer = rand(0, 3) === 0;

                $food = Food::create([
                    'store_id' => $store->id,
                    'category_id' => $category->id,
                    'name' => $foodName,
                    'description' => $tmpl[1],
                    'price' => $tmpl[2] + rand(-50, 50),
                    'price_usd' => round(($tmpl[2] + rand(-50, 50)) / 140, 2),
                    'price_eur' => round(($tmpl[2] + rand(-50, 50)) / 150, 2),
                    'new_price' => $hasOffer ? $tmpl[2] - rand(50, 150) : null,
                    'is_available' => rand(0, 10) > 1,
                    'is_offer' => $hasOffer,
                    'ingredients' => $tmpl[1],
                    'cooking_time' => $tmpl[3],
                    'bought_count' => rand(0, 100),
                ]);
            }
        }
    }

    private function seedFoodImages(): void
    {
        $foods = Food::all();
        $foodImageSeeds = [
            'pizza-margherita', 'pizza-pepperoni', 'cheeseburger', 'chicken-burger',
            'caesar-salad', 'greek-salad', 'tiramisu', 'chocolate-fondant',
            'coca-cola', 'orange-juice', 'mint-lemonade', 'bruschetta',
            'pasta-carbonara', 'grilled-chicken', 'french-fries', 'onion-rings',
            'mixed-grill', 'seafood-platter', 'vegetarian-pizza', 'club-sandwich',
            'pasta-bolognese', 'fish-tacos', 'chicken-wings', 'beef-tacos',
            'margherita', 'four-cheese', 'hawaiian', 'meat-lovers',
            'veggie-burger', 'bacon-burger', 'mushroom-burger', 'double-cheese',
        ];

        foreach ($foods as $index => $food) {
            $seed = $foodImageSeeds[$index % count($foodImageSeeds)] . '-' . $food->id;
            FoodImage::create([
                'food_id' => $food->id,
                'image_path' => "https://picsum.photos/seed/$seed/400/300.jpg",
            ]);
        }
    }

    private function seedCategoryFoodPivot(): void
    {
        $foods = Food::all();
        $categories = Category::all();

        foreach ($foods as $food) {
            $assignedCategories = $categories->random(rand(1, 2));
            foreach ($assignedCategories as $cat) {
                try {
                    DB::table('category_food')->insert([
                        'food_id' => $food->id,
                        'category_id' => $cat->id,
                    ]);
                } catch (\Exception $e) {
                }
            }
        }
    }

    private function seedStoreImages(): void
    {
        $stores = Store::all();
        foreach ($stores as $store) {
            $img = StoreImage::create([
                'store_id' => $store->id,
                'path' => "https://picsum.photos/seed/store-$store->id-cover/800/600.jpg",
                'is_cover' => true,
            ]);
            if (!$store->cover_image_id) {
                $store->update(['cover_image_id' => $img->id]);
            }

            // Add a logo image
            StoreImage::create([
                'store_id' => $store->id,
                'path' => "https://picsum.photos/seed/store-$store->id-logo/200/200.jpg",
                'is_cover' => false,
            ]);
        }
    }

    private function seedStoreSocialLinks(): void
    {
        $stores = Store::all();
        $platforms = ['facebook', 'instagram', 'tiktok', 'youtube', 'x', 'snapchat', 'website'];

        foreach ($stores as $store) {
            $chosen = array_rand(array_flip($platforms), rand(1, 3));
            foreach ((array)$chosen as $platform) {
                StoreSocialLink::create([
                    'store_id' => $store->id,
                    'platform' => $platform,
                    'url' => "https://{$platform}.com/" . str($store->alias)->slug(),
                    'label' => ucfirst($platform),
                ]);
            }
        }
    }

    private function seedStoreDomains(): void
    {
        $stores = Store::all();
        foreach ($stores as $store) {
            StoreDomain::create([
                'store_id' => $store->id,
                'domain' => strtolower(str_replace(' ', '', $store->name)) . '.yallahkool.dz',
                'verification_code' => str()->random(64),
                'is_primary' => true,
                'verified_at' => now(),
            ]);
        }
    }

    private function seedStaff(): void
    {
        $stores = Store::all();
        $clients = User::where('role', 'client')->get();

        foreach ($stores as $store) {
            for ($j = 0; $j < rand(1, 3); $j++) {
                StoreStaff::create([
                    'store_id' => $store->id,
                    'user_id' => $clients->random()->id,
                    'store_role' => ['manager', 'cashier', 'chef'][rand(0, 2)],
                    'permissions' => json_encode(['view_orders', 'update_status']),
                    'years_of_experience' => rand(1, 10),
                    'diplomas' => 'Food Handling Certificate',
                    'age' => rand(22, 55),
                    'bio' => 'Experienced staff member.',
                    'display_on_profile' => (bool)rand(0, 1),
                ]);
            }
        }
    }

    private function seedZones(): void
    {
        $stores = Store::all();
        $zoneNames = ['Zone A', 'Zone B', 'Zone C', 'Zone D'];

        foreach ($stores as $store) {
            $numZones = rand(1, 3);
            for ($j = 0; $j < $numZones; $j++) {
                Zone::create([
                    'store_id' => $store->id,
                    'name' => $zoneNames[$j % count($zoneNames)],
                    'radius_km' => rand(1, 10),
                    'fee' => rand(100, 500),
                ]);
            }
        }
    }

    private function seedOrders(): void
    {
        $this->info('  📦 Seeding orders...');


        // Disable broadcasting to avoid Pusher connection errors during seeding
        config(['broadcasting.default' => 'null']);
        $stores = Store::all();
        $clients = User::where('role', 'client')->get();
        $deliveryUsers = User::where('role', 'delivery')->get();
        $statuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled'];

        foreach ($stores as $store) {
            $foods = Food::where('store_id', $store->id)->get();
            if ($foods->isEmpty()) continue;

            $numOrders = rand(2, (int)$this->option('orders-per-store'));
            for ($i = 0; $i < $numOrders; $i++) {
                $client = $clients->random();
                $status = $statuses[array_rand($statuses)];
                $itemCount = rand(1, 4);
                $totalAmount = 0;
                $selectedFoods = $foods->random(min($itemCount, $foods->count()));

                if ($selectedFoods instanceof \Illuminate\Database\Eloquent\Model) {
                    $selectedFoods = collect([$selectedFoods]);
                }

                $itemSubtotal = 0;
                foreach ($selectedFoods as $food) {
                    $qty = rand(1, 3);
                    $itemSubtotal += $food->price * $qty;
                }

                $commissionAmount = round($itemSubtotal * 0.10, 2);
                $deliveryFee = $store->base_delivery_fee ?? 200;

                $order = Order::create([
                    'client_id' => $client->id,
                    'store_id' => $store->id,
                    'delivery_id' => $status === 'delivering' || $status === 'delivered' ? $deliveryUsers->random()->id : null,
                    'status' => $status,
                    'delivery_type' => rand(0, 3) > 0 ? 'delivery' : 'pickup',
                    'pickup_time' => rand(0, 1) ? now()->addHours(2)->format('H:i') : null,
                    'total_amount' => $itemSubtotal + $deliveryFee,
                    'commission_amount' => $commissionAmount,
                    'address' => $client->address ?? "Rue Didouche Mourad, Alger",
                    'phone' => $client->phone ?? '+213555000000',
                    'notes' => rand(0, 1) ? 'Please deliver to the main entrance.' : null,
                    'latitude' => $client->latitude ?? 36.75,
                    'longitude' => $client->longitude ?? 3.05,
                    'estimated_delivery_minutes' => $store->avg_prep_time + rand(10, 20),
                    'delivery_fee' => $deliveryFee,
                ]);

                foreach ($selectedFoods as $food) {
                    $qty = rand(1, 3);
                    OrderItem::create([
                        'order_id' => $order->id,
                        'food_id' => $food->id,
                        'quantity' => $qty,
                        'price' => $food->price,
                    ]);
                }
            }
        }
    }

    private function seedReviews(): void
    {
        $this->info('  ⭐ Seeding reviews...');

        $stores = Store::all();
        $clients = User::where('role', 'client')->get();
        $comments = [
            'Excellent food! Highly recommended.',
            'Very good service and tasty dishes.',
            'Good quality for the price.',
            'Fast delivery, food was still hot!',
            'The pizza was amazing, will order again.',
            'Decent food but delivery was a bit slow.',
            'Great atmosphere and friendly staff.',
            'One of my favorite places in town.',
            'The burgers are the best in Alger!',
            'Fresh ingredients and authentic flavors.',
        ];

        foreach ($stores as $store) {
            $usedClients = collect();
            $numReviews = min(rand(1, 5), $clients->count());
            $availableClients = $clients->shuffle();
            for ($i = 0; $i < $numReviews; $i++) {
                $client = $availableClients->get($i);
                Review::firstOrCreate([
                    'client_id' => $client->id,
                    'store_id' => $store->id,
                ], [
                    'rating' => rand(3, 5),
                    'comment' => $comments[array_rand($comments)],
                    'admin_reply' => rand(0, 1) ? 'Thank you for your feedback!' : null,
                ]);
            }
        }
    }

    private function seedReservations(): void
    {
        $this->info('  📅 Seeding reservations...');

        $stores = Store::all();
        $clients = User::where('role', 'client')->get();
        $statuses = ['pending', 'confirmed', 'completed', 'cancelled'];
        $names = ['Mohamed', 'Ahmed', 'Fatima', 'Sarah', 'Ali', 'Karim', 'Amina', 'Youssef', 'Lina', 'Omar'];

        foreach ($stores as $store) {
            if (!ReservationSetting::where('store_id', $store->id)->exists()) {
                ReservationSetting::create([
                    'store_id' => $store->id,
                    'enabled' => true,
                    'auto_confirm' => false,
                    'manual_confirm' => true,
                    'duration_minutes' => 60,
                    'slot_interval_minutes' => 30,
                    'min_advance_hours' => 1,
                    'max_booking_days' => 30,
                    'min_party_size' => 1,
                    'max_party_size' => 20,
                ]);
            }

            for ($day = 0; $day < 7; $day++) {
                ReservationSchedule::firstOrCreate([
                    'store_id' => $store->id,
                    'day_of_week' => $day,
                ], [
                    'enabled' => $day < 6,
                    'open_time' => '09:00',
                    'close_time' => '22:00',
                ]);
            }

            for ($t = 1; $t <= 5; $t++) {
                RestaurantTable::firstOrCreate([
                    'store_id' => $store->id,
                    'table_number' => $t,
                ], [
                    'name' => "Table $t",
                    'capacity' => rand(2, 8),
                    'min_capacity' => 1,
                    'location' => ['Terrace', 'Main Hall', 'VIP Room', 'Garden'][rand(0, 3)],
                    'status' => 'available',
                ]);
            }

            $numReservations = rand(1, (int)$this->option('reservations-per-store'));
            for ($i = 0; $i < $numReservations; $i++) {
                $client = $clients->random();
                $date = now()->addDays(rand(1, 14));

                Reservation::create([
                    'store_id' => $store->id,
                    'client_id' => $client->id,
                    'name' => $names[array_rand($names)],
                    'email' => $client->email,
                    'phone' => $client->phone ?? '+213555000000',
                    'party_size' => rand(1, 6),
                    'reservation_date' => $date,
                    'reservation_time' => sprintf('%02d:00', rand(12, 20)),
                    'notes' => rand(0, 1) ? 'Prefer terrace seating if available.' : null,
                    'status' => $statuses[array_rand($statuses)],
                ]);
            }
        }
    }

    private function seedChefProfiles(): void
    {
        $this->info('  👨‍🍳 Seeding chef profiles...');

        $chefs = User::where('role', 'chef')->get();
        $cuisines = ['Italian', 'Algerian', 'French', 'Asian', 'Mediterranean', 'Mexican', 'Fast Food', 'Pastry'];
        $specializations = ['Head Chef', 'Sous Chef', 'Pastry Chef', 'Line Cook', 'Grill Master', 'Pizza Chef'];
        $skillNames = ['Knife Skills', 'Sauce Preparation', 'Pastry Making', 'Grill Mastery', 'Plating', 'Menu Planning'];
        $diplomaNames = ['CAP Cuisine', 'BTS Hôtellerie', 'Professional Chef Certification', 'Culinary Arts Degree'];

        foreach ($chefs as $chef) {
            $chefProfile = ChefProfile::create([
                'user_id' => $chef->id,
                'bio' => "Experienced chef with a passion for creating delicious meals using fresh ingredients.",
                'specialization' => $specializations[array_rand($specializations)],
                'years_of_experience' => rand(3, 15),
                'cuisines_expertise' => json_encode(array_rand(array_flip($cuisines), min(rand(2, 4), count($cuisines)))),
                'is_available' => (bool)rand(0, 1),
                'working_hours' => json_encode(['Mon-Fri' => '09:00-18:00', 'Sat' => '10:00-16:00']),
                'average_rating' => round(3.5 + (rand(0, 15) / 10), 1),
                'reviews_count' => rand(5, 50),
                'hourly_rate' => rand(500, 2000),
                'base_menu_rate' => rand(5000, 20000),
                'is_verified' => true,
                'verified_at' => now(),
            ]);

            $chosenSkills = array_rand(array_flip($skillNames), min(rand(2, 4), count($skillNames)));
            foreach (is_array($chosenSkills) ? $chosenSkills : [$chosenSkills] as $skill) {
                ChefSkill::create([
                    'chef_id' => $chef->id,
                    'skill_name' => $skill,
                    'proficiency_level' => rand(3, 5),
                    'description' => "Proficient in {$skill} with extensive experience.",
                    'certified_year' => now()->subYears(rand(1, 8))->year,
                ]);
            }

            $chosenDip = array_rand(array_flip($diplomaNames), min(rand(1, 2), count($diplomaNames)));
            foreach (is_array($chosenDip) ? $chosenDip : [$chosenDip] as $dip) {
                ChefDiploma::create([
                    'chef_id' => $chef->id,
                    'diploma_name' => $dip,
                    'issuing_institution' => 'Institut National de Formation',
                    'issue_date' => now()->subYears(rand(2, 10))->year,
                ]);
            }

            for ($h = 0; $h < rand(1, 3); $h++) {
                ChefWorkHistory::create([
                    'chef_id' => $chef->id,
                    'restaurant_name' => ['Le Grand Restaurant', 'Café d\'Alger', 'Hôtel El Aurassi', 'La Maison'][rand(0, 3)],
                    'position' => $specializations[array_rand($specializations)],
                    'start_year' => now()->subYears(rand(3, 10))->year,
                    'end_year' => $h > 0 ? now()->subYears(rand(1, 3))->year : null,
                    'description' => 'Worked as a key member of the kitchen team.',
                    'location' => 'Alger, Algeria',
                ]);
            }
        }
    }

    private function seedChefStoreHires(): void
    {
        $this->info('  🔗 Seeding chef-store hires...');

        $chefProfiles = ChefProfile::all();
        $stores = Store::all();
        $owners = User::where('role', 'owner')->get();

        foreach ($chefProfiles as $profile) {
            if (rand(0, 1) && $stores->isNotEmpty()) {
                $store = $stores->random();
                ChefStoreHire::firstOrCreate(
                    ['chef_profile_id' => $profile->id, 'store_id' => $store->id],
                    [
                        'hired_by' => $owners->random()->id,
                        'hired_at' => now()->subDays(rand(1, 90)),
                        'is_active' => (bool)rand(0, 1),
                    ]
                );
            }
        }
    }

    private function seedDeliveryProfiles(): void
    {
        $this->info('  🚚 Seeding delivery profiles...');

        $deliveryUsers = User::where('role', 'delivery')->get();
        $transporterTypes = ['bike', 'car', 'motor', 'scooter'];
        $wilayas = Wilaya::whereIn('code', ['16', '31', '25'])->get();

        foreach ($deliveryUsers as $user) {
            $profile = DeliveryProfile::create([
                'user_id' => $user->id,
                'phone' => $user->phone ?? '+213555300000',
                'image' => null,
                'transporter_type' => $transporterTypes[array_rand($transporterTypes)],
                'is_working' => (bool)rand(0, 1),
                'day_price' => rand(200, 500),
                'night_price' => rand(300, 700),
            ]);

            $assignedWilayas = $wilayas->random(rand(1, 2));
            foreach ($assignedWilayas as $w) {
                $daira = Daira::where('wilaya_id', $w->id)->inRandomOrder()->first();
                if ($daira) {
                    DeliveryProfileArea::create([
                        'delivery_profile_id' => $profile->id,
                        'wilaya_id' => $w->id,
                        'daira_id' => $daira->id,
                        'commune_id' => Commune::where('daira_id', $daira->id)->inRandomOrder()->first()?->id,
                        'day_price' => rand(100, 300),
                        'night_price' => rand(200, 500),
                    ]);
                }
            }
        }
    }

    private function seedOffers(): void
    {
        $this->info('  🎉 Seeding offers...');

        $stores = Store::all();
        $offerTitles = ['Summer Special', 'Family Deal', 'Weekend Offer', 'Happy Hour', 'Student Discount', 'Lunch Combo'];

        foreach ($stores as $store) {
            if (rand(0, 1)) {
                Offer::create([
                    'store_id' => $store->id,
                    'title' => $offerTitles[array_rand($offerTitles)],
                    'description' => 'Amazing offer with great savings! Order now and enjoy.',
                    'image_path' => "https://picsum.photos/seed/offer-$store->id-" . rand(1000, 9999) . "/600/400.jpg",
                    'valid_from' => now(),
                    'valid_to' => now()->addDays(rand(7, 30)),
                    'active' => true,
                ]);
            }
        }
    }

    private function seedPromoCodes(): void
    {
        $this->info('  🏷️  Seeding promo codes...');

        $stores = Store::all();

        foreach ($stores as $store) {
            if (rand(0, 1)) {
                $code = strtoupper(str()->random(6));
                PromoCode::create([
                    'store_id' => $store->id,
                    'code' => $code,
                    'type' => rand(0, 1) ? 'percentage' : 'fixed',
                    'value' => rand(0, 1) ? rand(10, 30) : rand(100, 500),
                    'expires_at' => now()->addDays(rand(15, 60)),
                    'is_active' => true,
                ]);
            }
        }

        PromoCode::create([
            'store_id' => null,
            'code' => 'YALLAH10',
            'type' => 'percentage',
            'value' => 10,
            'expires_at' => now()->addYear(),
            'is_active' => true,
        ]);
    }

    private function seedPosts(): void
    {
        $this->info('  📝 Seeding posts...');

        $stores = Store::all();
        $postTitles = [
            'New Menu Available!', 'Weekend Specials', 'Meet Our Chef',
            'Fresh Ingredients This Season', 'Holiday Hours Update',
            'Now Delivering to Your Area', 'Family Gathering Packages',
        ];

        foreach ($stores as $store) {
            if (rand(0, 1)) {
                Post::create([
                    'store_id' => $store->id,
                    'title' => $postTitles[array_rand($postTitles)],
                    'content' => "We are excited to announce our latest offerings at {$store->name}. Visit us today and enjoy the best dining experience in Alger!",
                    'image' => "https://picsum.photos/seed/post-$store->id-" . rand(1000, 9999) . "/800/450.jpg",
                ]);
            }
        }
    }

    private function seedBanners(): void
    {
        $this->info('  🖼️  Seeding banners...');

        $stores = Store::all();
        foreach ($stores as $store) {
            if (rand(0, 1)) {
                Banner::create([
                    'store_id' => $store->id,
                    'image_path' => '/images/banners/default-banner-' . rand(1, 3) . '.jpg',
                    'link_url' => rand(0, 1) ? "/stores/{$store->alias}" : null,
                    'active' => true,
                ]);
            }
        }
    }

    private function seedComplaints(): void
    {
        $this->info('  ⚠️  Seeding complaints...');

        $stores = Store::all();
        $clients = User::where('role', 'client')->get();
        $subjects = ['Wrong order', 'Late delivery', 'Poor quality', 'Missing items', 'Overcharged'];

        foreach ($stores as $store) {
            if (rand(0, 3) === 0) {
                $order = Order::where('store_id', $store->id)->inRandomOrder()->first();
                Complaint::create([
                    'client_id' => $clients->random()->id,
                    'store_id' => $store->id,
                    'order_id' => $order?->id,
                    'food_id' => null,
                    'subject' => $subjects[array_rand($subjects)],
                    'description' => 'I had an issue with my order and would like it resolved.',
                    'status' => ['pending', 'in_review', 'resolved'][rand(0, 2)],
                    'category' => rand(0, 1) ? 'quality' : 'delivery',
                    'admin_reply' => rand(0, 1) ? 'We apologize for the inconvenience. Our team is looking into it.' : null,
                ]);
            }
        }
    }

    private function seedFavorites(): void
    {
        $this->info('  ❤️  Seeding favorites...');

        $clients = User::where('role', 'client')->get();
        $stores = Store::all();
        $foods = Food::all();

        foreach ($clients as $client) {
            if (rand(0, 1)) {
                Favorite::create([
                    'user_id' => $client->id,
                    'store_id' => $stores->random()->id,
                    'food_id' => null,
                ]);
            }
            if (rand(0, 1) && $foods->isNotEmpty()) {
                Favorite::create([
                    'user_id' => $client->id,
                    'store_id' => null,
                    'food_id' => $foods->random()->id,
                ]);
            }
        }
    }

    private function seedStorePayouts(): void
    {
        $this->info('  💰 Seeding store payouts...');

        $stores = Store::all();
        $owners = User::where('role', 'owner')->get();

        foreach ($stores as $store) {
            if (rand(0, 1)) {
                StorePayout::create([
                    'store_id' => $store->id,
                    'amount' => rand(10000, 100000),
                    'currency' => 'DZD',
                    'status' => ['pending', 'approved', 'paid'][rand(0, 2)],
                    'bank_name' => 'Banque Nationale d\'Algérie',
                    'bank_account' => '007 99999 0000' . str_pad((string)$store->id, 8, '0', STR_PAD_LEFT),
                    'phone' => $store->phone,
                    'notes' => null,
                    'approved_by' => rand(0, 1) ? User::where('role', 'admin')->first()?->id : null,
                    'approved_at' => rand(0, 1) ? now()->subDays(rand(1, 10)) : null,
                    'paid_at' => rand(0, 1) ? now()->subDays(rand(1, 5)) : null,
                ]);
            }
        }
    }

    private function seedBranchData(): void
    {
        $this->info('  🏪 Seeding branch data...');

        $stores = Store::all();
        $clients = User::where('role', 'client')->get();

        // Create a second branch per store with different location
        $altLocations = [
            ['name' => 'Downtown', 'wilaya' => '16', 'daira' => 'Sidi M\'Hamed', 'commune' => 'Alger Centre', 'address' => '10 Rue Ben M\'hidi, Alger', 'phone_suffix' => '111'],
            ['name' => 'Hydra', 'wilaya' => '16', 'daira' => 'Hydra', 'commune' => 'Hydra', 'address' => '25 Rue Mohamed Khoudi, Hydra', 'phone_suffix' => '222'],
            ['name' => 'Bab Ezzouar', 'wilaya' => '16', 'daira' => 'Dar El Beïda', 'commune' => 'Bab Ezzouar', 'address' => 'Centre Commercial Bab Ezzouar', 'phone_suffix' => '333'],
            ['name' => 'El Harrach', 'wilaya' => '16', 'daira' => 'El Harrach', 'commune' => 'El Harrach', 'address' => '5 Boulevard Mohamed V, El Harrach', 'phone_suffix' => '444'],
            ['name' => 'Bir Mourad Raïs', 'wilaya' => '16', 'daira' => 'Bir Mourad Raïs', 'commune' => 'Bir Mourad Raïs', 'address' => '12 Rue Frères Oughlis', 'phone_suffix' => '555'],
        ];

        foreach ($stores as $i => $store) {
            $loc = $altLocations[$i % count($altLocations)];
            $branchAlias = str($store->alias)->slug() . '-' . str($loc['name'])->slug();

            StoreBranch::firstOrCreate(
                ['store_id' => $store->id, 'alias' => $branchAlias],
                [
                    'name' => $store->name . ' — ' . $loc['name'],
                    'description' => $store->description . ' — ' . $loc['name'] . ' location.',
                    'template_slug' => $store->template_slug,
                    'theme_preset_id' => $store->theme_preset_id,
                    'email' => $store->email,
                    'phone' => '+213555' . $loc['phone_suffix'] . str_pad((string)($i + 1), 6, '0', STR_PAD_LEFT),
                    'address' => $loc['address'],
                    'wilaya' => $loc['wilaya'],
                    'daira' => $loc['daira'],
                    'commune' => $loc['commune'],
                    'latitude' => 36.75 + (rand(-30, 30) / 1000),
                    'longitude' => 3.05 + (rand(-30, 30) / 1000),
                    'opening_hours' => $store->opening_hours,
                    'avg_prep_time' => $store->avg_prep_time,
                    'delivery_zone_radius' => $store->delivery_zone_radius,
                    'base_delivery_fee' => $store->base_delivery_fee,
                    'ordering_enabled' => $store->ordering_enabled,
                    'is_active' => true,
                ]
            );
        }

        // Assign clients as staff/managers to random branches
        $allBranches = StoreBranch::all();
        foreach ($allBranches->take(8) as $branch) {
            $numStaff = rand(1, 3);
            $availableClients = $clients->shuffle();
            for ($j = 0; $j < $numStaff && $j < $availableClients->count(); $j++) {
                $role = $j === 0 ? 'manager' : ['staff', 'cashier', 'cook', 'kds'][array_rand(['staff', 'cashier', 'cook', 'kds'])];
                try {
                    $branch->assignedUsers()->attach($availableClients[$j]->id, [
                        'role' => $role,
                        'permissions' => json_encode(['view_orders', 'update_status']),
                    ]);
                } catch (\Exception $e) {
                    // Skip duplicates
                }
            }
        }
    }

    private function seedSettings(): void
    {
        $this->info('  ⚙️  Seeding settings...');

        $settings = [
            ['app_name', 'YallahKool', 'string'],
            ['app_description', 'Food Delivery Platform', 'string'],
            ['commission_rate', '10', 'integer'],
            ['min_withdrawal', '5000', 'integer'],
            ['delivery_day_price_default', '200', 'integer'],
            ['delivery_night_price_default', '350', 'integer'],
            ['currency', 'DZD', 'string'],
            ['support_email', 'support@yallahkool.dz', 'string'],
            ['support_phone', '+213555000000', 'string'],
            ['max_delivery_radius', '15', 'integer'],
            ['default_language', 'fr', 'string'],
            ['maintenance_mode', 'false', 'boolean'],
            ['new_store_default_status', 'active', 'string'],
            ['order_confirmation_auto', 'true', 'boolean'],
            ['chef_verification_required', 'true', 'boolean'],
        ];

        foreach ($settings as $s) {
            Setting::firstOrCreate(
                ['key' => $s[0]],
                ['value' => $s[1], 'type' => $s[2]]
            );
        }
    }

    private function truncateAll(): void
    {
        DB::statement('PRAGMA foreign_keys = OFF');

        $tables = [
            'banners', 'category_food', 'chef_diplomas', 'chef_images',
            'chef_profiles', 'chef_skills', 'chef_store_hires', 'chef_work_history',
            'communes', 'complaints', 'dairas', 'delivery_profile_areas',
            'delivery_profiles', 'favorites', 'food_images', 'food_offer_items', 'foods',
            'notifications', 'offers', 'order_items', 'orders', 'page_assets', 'posts',
            'promo_codes', 'reservation_schedules', 'reservation_settings', 'reservations',
            'restaurant_tables', 'review_flags', 'reviews', 'saved_sections',
            'sessions', 'settings', 'store_badge', 'store_branches', 'branch_user',
            'store_domains', 'store_images', 'store_phones', 'store_payouts',
            'store_social_links', 'store_staff', 'store_type_category',
            'stores', 'wilayas', 'zones', 'password_reset_tokens',
        ];

        foreach ($tables as $table) {
            DB::table($table)->truncate();
        }

        DB::table('users')->where('email', 'not like', '%@example.com')->delete();
        DB::table('personal_access_tokens')->truncate();

        DB::statement('PRAGMA foreign_keys = ON');
    }
}
