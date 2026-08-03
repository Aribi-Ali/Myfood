<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('store_type_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('icon', 10)->default('🏪'); // emoji
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Many-to-many pivot between stores and store_type_categories
        Schema::create('store_type_category', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained('stores')->onDelete('cascade');
            $table->foreignId('store_type_category_id')->constrained('store_type_categories')->onDelete('cascade');
            $table->unique(['store_id', 'store_type_category_id'], 'unique_store_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('store_type_category');
        Schema::dropIfExists('store_type_categories');
    }
};
