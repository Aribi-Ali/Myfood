<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $tables = [
            'theme_component_overrides',
            'theme_variables',
            'theme_versions',
            'page_versions',
            'page_version_assets',
            'published_pages',
            'pb_pages',
            'themes',
            'store_pages',
            'template_blocks',
            'templates',
        ];

        foreach ($tables as $table) {
            if (Schema::hasTable($table)) {
                Schema::drop($table);
            }
        }

        if (Schema::hasColumn('stores', 'theme_id')) {
            Schema::table('stores', function ($table) {
                $table->dropColumn('theme_id');
            });
        }

        DB::table('migrations')
            ->whereIn('migration', [
                '2026_06_07_080810_create_store_pages_table',
                '2026_06_07_080811_add_html_content_to_store_pages_table',
                '2026_06_12_170000_create_themes_table',
                '2026_06_12_170002_add_theme_id_to_stores_table',
                '2026_06_16_185432_enrich_themes_with_store_data',
                '2026_06_19_000001_create_page_builder_pages_table',
                '2026_06_19_171600_add_soft_deletes_to_themes_table',
                '2026_06_20_000001_create_theme_versions_table',
                '2026_06_20_000002_create_theme_variables_table',
                '2026_06_20_000005_create_page_versions_table',
                '2026_06_20_000006_create_published_pages_table',
                '2026_06_20_000007_create_page_assets_table',
                '2026_06_20_000009_create_theme_component_overrides_table',
                '2026_06_20_000011_add_page_builder_status_to_themes_table',
                '2026_06_20_011033_cleanup_old_template_and_page_data',
            ])->delete();
    }

    public function down(): void
    {
    }
};
