<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('store_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->unique()->constrained()->cascadeOnDelete();
            $table->foreignId('plan_tier_id')->constrained()->nullOnDelete();
            $table->foreignId('plan_duration_offer_id')->nullable()->constrained()->nullOnDelete();
            $table->string('status')->default('trialing'); // trialing,active,past_due,cancelled,expired,suspended
            $table->datetime('trial_ends_at')->nullable();
            $table->datetime('start_date');
            $table->datetime('end_date')->nullable();
            $table->datetime('cancelled_at')->nullable();
            $table->decimal('monthly_price_snapshot', 10, 2)->default(0);
            $table->integer('current_period_orders')->default(0);
            $table->boolean('auto_upgrade')->default(true);
            $table->datetime('last_tier_check_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('store_subscriptions');
    }
};
