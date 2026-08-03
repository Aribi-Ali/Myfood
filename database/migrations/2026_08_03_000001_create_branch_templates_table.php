<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('branch_templates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('branch_id')->constrained('branches')->onDelete('cascade');
            $table->foreignId('template_id')->constrained('templates')->onDelete('cascade');
            $table->boolean('is_synced')->default(false);
            $table->unsignedBigInteger('source_branch_id')->nullable();
            $table->foreign('source_branch_id')->references('id')->on('branches')->onDelete('set null');
            $table->unsignedBigInteger('source_template_id')->nullable();
            $table->foreign('source_template_id')->references('id')->on('templates')->onDelete('set null');
            $table->timestamps();

            $table->index(['branch_id', 'template_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('branch_templates');
    }
};
?>
