<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('delivery_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('delivery_profile_id')->constrained()->cascadeOnDelete();
            $table->foreignId('tier_id')->nullable()->constrained('delivery_pricing_tiers')->nullOnDelete();
            $table->foreignId('duration_offer_id')->nullable()->constrained('plan_duration_offers')->nullOnDelete();
            $table->datetime('start_date');
            $table->datetime('end_date')->nullable();
            $table->string('status')->default('active'); // active,expired,cancelled
            $table->boolean('auto_renew')->default(true);
            $table->decimal('monthly_price_snapshot', 10, 2)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('delivery_subscriptions');
    }
};
