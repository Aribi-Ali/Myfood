<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('food_offer_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_food_id')->constrained('foods')->onDelete('cascade');
            $table->foreignId('child_food_id')->constrained('foods')->onDelete('cascade');
            $table->integer('quantity')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('food_offer_items');
    }
};
