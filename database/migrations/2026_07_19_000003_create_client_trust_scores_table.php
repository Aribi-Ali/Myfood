<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('client_trust_scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('store_id')->nullable()->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('score')->default(50); // 0-100
            $table->unsignedInteger('completed_orders')->default(0);
            $table->unsignedInteger('cancelled_orders')->default(0);
            $table->decimal('avg_rating_given', 3, 2)->default(0); // 0.00 - 5.00
            $table->unsignedInteger('total_complaints')->default(0);
            $table->unsignedInteger('total_reports_against')->default(0);
            $table->timestamp('last_calculated_at')->nullable();
            $table->timestamps();

            $table->unique(['client_id', 'store_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('client_trust_scores');
    }
};
