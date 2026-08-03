<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('restaurant_tables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained('stores')->onDelete('cascade');
            $table->string('name');
            $table->unsignedInteger('table_number');
            $table->unsignedInteger('capacity');
            $table->unsignedInteger('min_capacity')->default(1);
            $table->string('location')->nullable();
            $table->text('description')->nullable();
            $table->enum('status', ['available', 'maintenance', 'hidden', 'inactive'])->default('available');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('restaurant_tables');
    }
};
