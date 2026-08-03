<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
   * Run the migrations.
   */
  public function up(): void
  {
    Schema::create('chef_work_history', function (Blueprint $table) {
      $table->id();
      $table->foreignId('chef_id')->constrained('users')->onDelete('cascade');

      $table->string('restaurant_name');
      $table->string('position'); // e.g., "Head Chef", "Sous Chef", "Line Cook"
      $table->year('start_year');
      $table->year('end_year')->nullable(); // Null if currently working there
      $table->text('description')->nullable();
      $table->string('location')->nullable(); // City/Country

      $table->timestamps();
      $table->index('chef_id');
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('chef_work_history');
  }
};
