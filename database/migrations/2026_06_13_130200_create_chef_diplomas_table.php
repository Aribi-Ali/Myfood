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
    Schema::create('chef_diplomas', function (Blueprint $table) {
      $table->id();
      $table->foreignId('chef_id')->constrained('users')->onDelete('cascade');

      $table->string('diploma_name'); // e.g., "CAP Cuisine", "Professional Chef Certification"
      $table->string('issuing_institution'); // e.g., "Algerian Ministry of Education"
      $table->year('issue_date');
      $table->string('diploma_file')->nullable(); // Path to uploaded diploma image/PDF
      $table->boolean('verified')->default(false);

      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('chef_diplomas');
  }
};
