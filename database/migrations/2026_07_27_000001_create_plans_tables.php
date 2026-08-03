<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ── Plans ──
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // ── Plan Features (master list) ──
        Schema::create('plan_features', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('icon')->nullable();
            $table->timestamps();
        });

        // ── Plan ↔ Feature assignments ──
        Schema::create('plan_feature_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('plan_id')->constrained()->cascadeOnDelete();
            $table->foreignId('plan_feature_id')->constrained()->cascadeOnDelete();
            $table->unique(['plan_id', 'plan_feature_id']);
            $table->timestamps();
        });

        // ── Plan Tiers ──
        Schema::create('plan_tiers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('plan_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->integer('min_orders')->default(0);
            $table->integer('max_orders')->nullable();
            $table->decimal('monthly_price', 10, 2)->default(0);
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // ── Plan Duration Offers ──
        Schema::create('plan_duration_offers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('plan_tier_id')->constrained()->cascadeOnDelete();
            $table->integer('months');
            $table->decimal('discount_percent', 5, 2)->default(0);
            $table->string('discount_label')->nullable();
            $table->boolean('is_popular')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plan_duration_offers');
        Schema::dropIfExists('plan_tiers');
        Schema::dropIfExists('plan_feature_assignments');
        Schema::dropIfExists('plan_features');
        Schema::dropIfExists('plans');
    }
};
