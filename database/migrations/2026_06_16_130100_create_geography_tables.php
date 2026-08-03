<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('wilayas', function (Blueprint $table) {
            $table->id();
            $table->string('code', 3)->unique(); // 01 - 58
            $table->string('name_fr');
            $table->string('name_ar')->nullable();
            $table->timestamps();
        });

        Schema::create('dairas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('wilaya_id')->constrained('wilayas')->onDelete('cascade');
            $table->string('name_fr');
            $table->string('name_ar')->nullable();
            $table->timestamps();
        });

        Schema::create('communes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('daira_id')->constrained('dairas')->onDelete('cascade');
            $table->foreignId('wilaya_id')->constrained('wilayas')->onDelete('cascade');
            $table->string('name_fr');
            $table->string('name_ar')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('communes');
        Schema::dropIfExists('dairas');
        Schema::dropIfExists('wilayas');
    }
};
