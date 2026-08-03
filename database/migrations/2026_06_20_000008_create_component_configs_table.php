<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('component_configs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained()->cascadeOnDelete();
            $table->foreignId('theme_id')->nullable()->constrained()->cascadeOnDelete();
            $table->string('block_type'); // StoreHero, FoodList, etc.
            $table->string('component_id'); // the GrapesJS component id
            $table->json('config')->nullable();
            $table->json('defaults')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['store_id', 'component_id']);
            $table->index(['store_id', 'block_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('component_configs');
    }
};
