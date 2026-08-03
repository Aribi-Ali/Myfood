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
    Schema::create('chef_skills', function (Blueprint $table) {
      $table->id();
      $table->foreignId('chef_id')->constrained('users')->onDelete('cascade'); // user_id of chef

      $table->string('skill_name'); // e.g., "Pastry Making", "Grill Mastery"
      $table->integer('proficiency_level')->default(3); // 1-5 scale
      $table->text('description')->nullable();
      $table->year('certified_year')->nullable();

      $table->timestamps();
      $table->unique(['chef_id', 'skill_name']);
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('chef_skills');
  }
};
