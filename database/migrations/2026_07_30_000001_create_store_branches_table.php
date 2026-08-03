<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('store_branches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
            $table->string('name');
            $table->string('alias')->unique();
            $table->text('description')->nullable();
            $table->string('template_slug', 50)->nullable();
            $table->unsignedBigInteger('theme_preset_id')->nullable();
            $table->string('cover_image')->nullable();
            $table->string('logo_path')->nullable();
            $table->string('document_path')->nullable();
            $table->text('opening_hours')->nullable();
            $table->string('wilaya')->nullable();
            $table->string('daira')->nullable();
            $table->string('commune')->nullable();
            $table->string('address')->nullable();
            $table->decimal('latitude', 11, 7)->nullable();
            $table->decimal('longitude', 11, 7)->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamp('break_start')->nullable();
            $table->timestamp('break_end')->nullable();
            $table->text('break_note')->nullable();
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
            $table->unsignedBigInteger('cover_image_id')->nullable();
            $table->unsignedBigInteger('main_image_id')->nullable();
            $table->boolean('is_subscription_managed')->default(false);
            $table->timestamps();

            $table->index('store_id');
            $table->index('alias');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('store_branches');
    }
};
