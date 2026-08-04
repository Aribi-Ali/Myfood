<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Page builder version history. One row per saved snapshot of a page
     * ('store' or 'branch'), so owners can preview and roll back edits.
     */
    public function up(): void
    {
        Schema::create('page_versions', function (Blueprint $table) {
            $table->id();
            $table->string('entity_type', 20)->default('store'); // store | branch
            $table->unsignedBigInteger('entity_id');
            $table->string('slug', 100)->default(''); // '' = main page
            $table->unsignedInteger('version');
            $table->longText('html');
            $table->longText('css')->nullable();
            $table->longText('js')->nullable();
            $table->json('grapes_data')->nullable();
            $table->json('meta')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('created_by')->references('id')->on('users')->nullOnDelete();
            $table->unique(['entity_type', 'entity_id', 'slug', 'version'], 'page_version_unique');
            $table->index(['entity_type', 'entity_id', 'slug']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('page_versions');
    }
};
