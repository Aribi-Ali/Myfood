<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('chef_store_hires', function (Blueprint $table) {
      $table->id();
      $table->foreignId('chef_profile_id')->constrained('chef_profiles')->onDelete('cascade');
      $table->foreignId('store_id')->constrained('stores')->onDelete('cascade');
      $table->foreignId('hired_by')->constrained('users')->onDelete('cascade');
      $table->timestamp('hired_at')->nullable();
      $table->boolean('is_active')->default(true);
      $table->timestamps();
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('chef_store_hires');
  }
};
