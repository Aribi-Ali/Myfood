<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Fix slug mismatches between DB and frontend keys
        DB::table('templates')->where('slug', 'fresh-organic')->update(['slug' => 'organic']);
        DB::table('templates')->where('slug', 'tech-saas')->update(['slug' => 'tech']);
        DB::table('templates')->where('slug', 'artisan-handmade')->update(['slug' => 'artisan']);
        DB::table('templates')->where('slug', 'retro-diner')->update(['slug' => 'retro']);
        // Theme presets reference templates by FK — no update needed, IDs haven't changed
    }

    public function down(): void
    {
        DB::table('templates')->where('slug', 'organic')->update(['slug' => 'fresh-organic']);
        DB::table('templates')->where('slug', 'tech')->update(['slug' => 'tech-saas']);
        DB::table('templates')->where('slug', 'artisan')->update(['slug' => 'artisan-handmade']);
        DB::table('templates')->where('slug', 'retro')->update(['slug' => 'retro-diner']);
    }
};
