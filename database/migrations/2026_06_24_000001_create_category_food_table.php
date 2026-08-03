<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Disable FK checks for SQLite compatibility during pivot creation
        Schema::disableForeignKeyConstraints();

        Schema::create('category_food', function (Blueprint $table) {
            $table->unsignedBigInteger('food_id');
            $table->unsignedBigInteger('category_id');
            $table->primary(['food_id', 'category_id']);

            $table->foreign('food_id')->references('id')->on('foods')->onDelete('cascade');
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
        });

        // Migrate existing single category_id values to the pivot table
        DB::table('foods')
            ->whereNotNull('category_id')
            ->orderBy('id')
            ->each(function ($food) {
                DB::table('category_food')->insert([
                    'food_id'     => $food->id,
                    'category_id' => $food->category_id,
                ]);
            });

        // Drop old FK and make category_id nullable — pivot is now the source of truth
        Schema::table('foods', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
        });
        Schema::table('foods', function (Blueprint $table) {
            $table->unsignedBigInteger('category_id')->nullable()->change();
        });

        Schema::enableForeignKeyConstraints();
    }

    public function down(): void
    {
        Schema::disableForeignKeyConstraints();

        // Restore category_id from the first pivot entry (lossy)
        DB::table('category_food')
            ->orderBy('food_id')
            ->orderBy('category_id')
            ->each(function ($pivot) {
                DB::table('foods')
                    ->where('id', $pivot->food_id)
                    ->whereNull('category_id')
                    ->update(['category_id' => $pivot->category_id]);
            });

        Schema::table('foods', function (Blueprint $table) {
            $table->unsignedBigInteger('category_id')->nullable(false)->change();
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
        });

        Schema::enableForeignKeyConstraints();

        Schema::dropIfExists('category_food');
    }
};
