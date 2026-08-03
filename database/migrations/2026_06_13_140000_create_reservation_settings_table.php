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
        Schema::create('reservation_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained('stores')->onDelete('cascade');
            $table->boolean('enabled')->default(false);
            $table->boolean('auto_confirm')->default(false);
            $table->boolean('manual_confirm')->default(true);
            $table->unsignedInteger('duration_minutes')->default(60);
            $table->unsignedInteger('slot_interval_minutes')->default(30);
            $table->unsignedInteger('min_advance_hours')->default(1);
            $table->unsignedInteger('max_booking_days')->default(30);
            $table->unsignedInteger('min_party_size')->default(1);
            $table->unsignedInteger('max_party_size')->default(20);
            $table->boolean('allow_notes')->default(true);
            $table->boolean('allow_special_requests')->default(true);
            $table->boolean('allow_cancellation')->default(true);
            $table->unsignedInteger('cancellation_deadline_hours')->default(2);
            $table->boolean('reminder_24h')->default(true);
            $table->boolean('reminder_2h')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservation_settings');
    }
};
