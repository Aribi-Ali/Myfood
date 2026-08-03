<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('image')->nullable();
            $table->string('short_description', 255)->nullable();
            $table->text('full_description')->nullable();
            $table->string('meta_title', 150)->nullable();
            $table->text('meta_description')->nullable();
            $table->string('meta_keywords', 255)->nullable();
            $table->timestamps();
        });

        Schema::create('stores', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('cover_image_id')->nullable();
            $table->unsignedBigInteger('main_image_id')->nullable();
            $table->foreignId('owner_id')->unique()->constrained('users')->onDelete('cascade');
            $table->string('name');
            $table->string('alias')->unique();
            $table->string('template_slug', 50)->nullable();
            $table->text('description')->nullable();
            $table->decimal('latitude', 11, 7)->nullable();
            $table->decimal('longitude', 11, 7)->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->text('opening_hours')->nullable();
            $table->string('cover_image')->nullable();
            $table->string('logo_path')->nullable();
            $table->string('document_path')->nullable();
            $table->string('wilaya')->nullable();
            $table->string('daira')->nullable();
            $table->string('commune')->nullable();
            $table->string('address')->nullable();
            $table->boolean('is_approved')->default(false);
            $table->string('onboarding_status')->default('pending');
            $table->boolean('is_active')->default(true);
            $table->integer('avg_prep_time')->default(25);
            $table->decimal('delivery_zone_radius', 8, 2)->default(5.00);
            $table->integer('base_delivery_fee')->default(200);
            $table->integer('avg_delivery_time_per_km')->default(3);
            $table->boolean('ordering_enabled')->default(true);
            $table->boolean('is_paused')->default(false);
            $table->string('pause_note')->nullable();
            $table->boolean('allows_pre_orders')->default(false);
            $table->unsignedInteger('pre_order_lead_time_hours')->default(1);
            $table->string('order_prefix', 20)->nullable();
            $table->string('order_suffix', 20)->nullable();
            $table->unsignedTinyInteger('order_padding')->default(4);
            $table->unsignedInteger('order_start_number')->default(1);
            $table->timestamp('break_start')->nullable();
            $table->timestamp('break_end')->nullable();
            $table->text('break_note')->nullable();
            $table->unsignedBigInteger('theme_preset_id')->nullable();
            $table->boolean('is_subscription_managed')->default(false);
            $table->timestamps();

            $table->foreign('cover_image_id')->references('id')->on('store_images')->onDelete('set null');
            $table->foreign('main_image_id')->references('id')->on('store_images')->onDelete('set null');
            $table->index('is_approved');
            $table->index('owner_id');
            $table->index('theme_preset_id', 'idx_stores_theme_preset_id');
            $table->index(['is_approved', 'is_active', 'wilaya'], 'idx_stores_approved_active_wilaya');
            $table->index(['name'], 'idx_stores_name');
        });

        Schema::create('badges', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('description')->nullable();
            $table->string('color_code')->default('#f97316');
            $table->string('icon')->nullable();
            $table->timestamps();
        });

        Schema::create('store_badge', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained('stores')->onDelete('cascade');
            $table->foreignId('badge_id')->constrained('badges')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('foods', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained('stores')->onDelete('cascade');
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->decimal('price', 10, 2);
            $table->decimal('price_usd', 10, 2)->nullable();
            $table->decimal('price_eur', 10, 2)->nullable();
            $table->decimal('new_price', 10, 2)->nullable();
            $table->decimal('new_price_usd', 10, 2)->nullable();
            $table->decimal('new_price_eur', 10, 2)->nullable();
            $table->boolean('is_available')->default(true);
            $table->boolean('is_offer')->default(false);
            $table->text('ingredients')->nullable();
            $table->integer('cooking_time')->default(15);
            $table->integer('bought_count')->default(0);
            $table->timestamps();

            $table->index('store_id', 'idx_foods_store_id');
            $table->index('category_id', 'idx_foods_category_id');
            $table->index('is_available', 'idx_foods_is_available');
            $table->index('is_offer');
            $table->index(['store_id', 'is_available'], 'idx_foods_store_available');
            $table->index(['store_id', 'category_id', 'is_available'], 'idx_foods_store_cat_available');
            $table->index(['name', 'description'], 'idx_foods_name_description');
        });

        Schema::create('food_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('food_id')->constrained('foods')->onDelete('cascade');
            $table->string('image_path');
            $table->timestamps();
        });

        Schema::create('store_staff', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained('stores')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('store_role')->default('cashier');
            $table->integer('years_of_experience')->nullable();
            $table->string('diplomas')->nullable();
            $table->integer('age')->nullable();
            $table->text('bio')->nullable();
            $table->boolean('display_on_profile')->default(true);
            $table->text('permissions')->nullable();
            $table->timestamps();

            $table->index(['store_id', 'user_id'], 'store_staff_store_user_lookup_idx');
            $table->index('store_id', 'idx_staff_store_id');
            $table->index('user_id', 'idx_staff_user_id');
        });

        Schema::create('delivery_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->onDelete('cascade');
            $table->string('phone');
            $table->string('image')->nullable();
            $table->string('transporter_type')->default('bike');
            $table->boolean('is_working')->default(false);
            $table->decimal('day_price', 10, 2)->default(0);
            $table->decimal('night_price', 10, 2)->default(0);
            $table->string('pricing_model')->nullable();
            $table->unsignedBigInteger('current_tier_id')->nullable();
            $table->integer('current_month_orders')->default(0);
            $table->decimal('total_earnings', 12, 2)->default(0);
            $table->decimal('total_platform_fees', 12, 2)->default(0);
            $table->timestamps();

            $table->index('is_working', 'idx_delivery_profiles_is_working');
        });

        Schema::create('favorite_deliveries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('delivery_user_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('store_order_number')->nullable();
            $table->foreignId('client_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('store_id')->constrained('stores')->onDelete('cascade');
            $table->foreignId('delivery_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('assigned_chef_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('promo_code_id')->nullable()->constrained('promo_codes')->onDelete('set null');
            $table->decimal('discount_amount', 10, 2)->default(0.00);
            $table->string('status')->default('pending');
            $table->string('delivery_type')->default('delivery');
            $table->string('pickup_time')->nullable();
            $table->dateTime('scheduled_at')->nullable();
            $table->integer('estimated_delivery_minutes')->nullable();
            $table->integer('delivery_fee')->default(200);
            $table->decimal('total_amount', 10, 2);
            $table->decimal('commission_amount', 10, 2)->default(0.00);
            $table->text('address');
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->string('phone');
            $table->text('notes')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamp('refunded_at')->nullable();
            $table->timestamps();

            $table->index(['store_id', 'store_order_number']);
            $table->index('status', 'idx_orders_status');
            $table->index('client_id', 'idx_orders_client_id');
            $table->index('store_id', 'idx_orders_store_id');
            $table->index('delivery_id', 'idx_orders_delivery_id');
            $table->index('assigned_chef_id', 'idx_orders_assigned_chef_id');
            $table->index('promo_code_id', 'idx_orders_promo_code_id');
            $table->index(['store_id', 'status'], 'idx_orders_store_status');
            $table->index(['store_id', 'created_at'], 'idx_orders_store_created');
            $table->index(['client_id', 'status'], 'idx_orders_client_status');
            $table->index(['delivery_id', 'status'], 'idx_orders_delivery_status');
            $table->index(['status', 'created_at'], 'orders_status_created_at_lookup_idx');
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->foreignId('food_id')->constrained('foods')->onDelete('cascade');
            $table->integer('quantity')->default(1);
            $table->decimal('price', 10, 2);
            $table->timestamps();

            $table->index('order_id', 'idx_order_items_order_id');
            $table->index('food_id', 'idx_order_items_food_id');
            $table->index('food_id', 'order_items_food_id_lookup_idx');
            $table->index(['order_id', 'food_id'], 'idx_order_items_order_food');
        });

        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('store_id')->constrained('stores')->onDelete('cascade');
            $table->integer('rating')->default(5);
            $table->text('comment')->nullable();
            $table->text('admin_reply')->nullable();
            $table->timestamps();

            $table->unique(['client_id', 'store_id']);
            $table->index('client_id', 'idx_reviews_client_id');
            $table->index('store_id', 'idx_reviews_store_id');
            $table->index(['store_id', 'rating'], 'idx_reviews_store_rating');
        });

        Schema::create('complaints', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('store_id')->constrained('stores')->onDelete('cascade');
            $table->foreignId('order_id')->nullable()->constrained('orders')->onDelete('cascade');
            $table->foreignId('food_id')->nullable()->constrained('foods')->onDelete('cascade');
            $table->string('subject');
            $table->text('description');
            $table->string('status')->default('pending');
            $table->string('category')->nullable();
            $table->text('admin_reply')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();

            $table->index('client_id', 'idx_complaints_client_id');
            $table->index('store_id', 'idx_complaints_store_id');
            $table->index('status', 'idx_complaints_status');
        });

        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained('stores')->onDelete('cascade');
            $table->string('title');
            $table->text('content');
            $table->string('image')->nullable();
            $table->timestamps();

            $table->index('store_id', 'idx_posts_store_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('posts');
        Schema::dropIfExists('complaints');
        Schema::dropIfExists('reviews');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('favorite_deliveries');
        Schema::dropIfExists('delivery_profiles');
        Schema::dropIfExists('store_staff');
        Schema::dropIfExists('food_images');
        Schema::dropIfExists('foods');
        Schema::dropIfExists('store_badge');
        Schema::dropIfExists('badges');
        Schema::dropIfExists('stores');
        Schema::dropIfExists('categories');
    }
};
