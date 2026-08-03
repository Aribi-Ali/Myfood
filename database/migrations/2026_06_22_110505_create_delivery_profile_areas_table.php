<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('delivery_profile_areas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('delivery_profile_id')->constrained()->cascadeOnDelete();
            $table->foreignId('wilaya_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('daira_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('commune_id')->nullable()->constrained()->nullOnDelete();
            $table->decimal('day_price', 10, 2)->default(0);
            $table->decimal('night_price', 10, 2)->default(0);
            $table->timestamps();

            $table->unique(['delivery_profile_id', 'wilaya_id', 'daira_id', 'commune_id'], 'delivery_area_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('delivery_profile_areas');
    }
};
