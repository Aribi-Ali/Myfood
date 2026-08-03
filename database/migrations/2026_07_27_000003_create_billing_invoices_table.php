<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('billing_invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_subscription_id')->constrained()->cascadeOnDelete();
            $table->string('invoice_number')->unique();
            $table->datetime('period_start');
            $table->datetime('period_end');
            $table->integer('total_orders')->default(0);
            $table->string('tier_applied')->nullable();
            $table->string('plan_name')->nullable();
            $table->decimal('base_amount', 10, 2)->default(0);
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->decimal('tax_amount', 10, 2)->default(0);
            $table->decimal('total_amount', 10, 2)->default(0);
            $table->string('currency', 10)->default('DZD');
            $table->string('status')->default('pending'); // pending,pending_cash,paid,failed,refunded,cancelled,void
            $table->string('payment_method_type')->nullable();
            $table->string('gateway_transaction_id')->nullable();
            $table->datetime('paid_at')->nullable();
            $table->foreignId('paid_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('billing_invoices');
    }
};
