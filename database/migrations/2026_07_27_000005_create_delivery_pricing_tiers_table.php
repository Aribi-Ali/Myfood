<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('delivery_pricing_tiers', function (Blueprint $table) {
            $table->id();
            $table->string('model_type'); // commission,flat_fee,subscription
            $table->string('name');
            $table->integer('tier_level')->default(1);
            $table->integer('min_monthly_orders')->default(0);
            $table->integer('max_monthly_orders')->nullable();
            $table->decimal('commission_percent', 5, 2)->nullable();
            $table->decimal('flat_fee_per_delivery', 10, 2)->nullable();
            $table->decimal('monthly_price', 10, 2)->nullable();
            $table->integer('max_deliveries')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('delivery_pricing_tiers');
    }
};
