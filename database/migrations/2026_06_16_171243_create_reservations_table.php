<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('store_reservation_number')->nullable();
            $table->foreignId('store_id')->constrained('stores')->onDelete('cascade');
            $table->foreignId('client_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('name');
            $table->string('email');
            $table->string('phone');
            $table->unsignedTinyInteger('party_size');
            $table->date('reservation_date');
            $table->time('reservation_time');
            $table->text('notes')->nullable();
            $table->text('special_requests')->nullable();
            $table->string('status')->default('pending');
            $table->string('cancellation_reason')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamps();

            $table->index(['store_id', 'store_reservation_number']);
            $table->index('client_id', 'idx_reservations_user_id');
            $table->index('store_id', 'idx_reservations_store_id');
            $table->index('reservation_date', 'idx_reservations_date');
            $table->index('status', 'idx_reservations_status');
            $table->index(['store_id', 'reservation_date', 'reservation_time'], 'idx_reservations_store_date_time');
            $table->index(['client_id', 'reservation_date'], 'idx_reservations_user_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
