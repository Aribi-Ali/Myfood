<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('chef_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('chef_profile_id')->nullable()->constrained('chef_profiles')->nullOnDelete();
            $table->foreignId('chef_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('path');
            $table->string('image_path');
            $table->string('caption')->nullable();
            $table->string('image_type')->default('portfolio');
            $table->text('description')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->index(['chef_id', 'is_featured']);
            $table->index('chef_profile_id', 'idx_chef_images_profile_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chef_images');
    }
};
