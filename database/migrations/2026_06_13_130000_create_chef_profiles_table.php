<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('chef_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->onDelete('cascade');
            $table->string('bio', 1000)->nullable();
            $table->json('skills')->nullable();
            $table->json('diplomas')->nullable();
            $table->string('specialization')->nullable();
            $table->integer('years_of_experience')->default(0);
            $table->integer('experience_years')->default(0);
            $table->string('cuisines_expertise')->nullable();
            $table->boolean('is_available')->default(true);
            $table->boolean('is_public')->default(true);
            $table->json('working_hours')->nullable();
            $table->decimal('average_rating', 3, 2)->default(5.00);
            $table->integer('reviews_count')->default(0);
            $table->integer('hourly_rate')->nullable();
            $table->integer('base_menu_rate')->nullable();
            $table->boolean('is_verified')->default(false);
            $table->timestamp('verified_at')->nullable();
            $table->string('verification_document')->nullable();
            $table->timestamp('rejected_at')->nullable();
            $table->string('rejection_reason', 500)->nullable();
            $table->timestamps();

            $table->index('is_available');
            $table->index('is_verified');
            $table->index('user_id', 'chef_profiles_user_id_lookup_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chef_profiles');
    }
};
