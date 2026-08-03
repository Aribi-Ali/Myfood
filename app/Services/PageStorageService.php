<?php

namespace App\Services;

use Illuminate\Support\Facades\File;

class PageStorageService
{
    private function basePath(int $entityId, string $entityType = 'store'): string
    {
        if ($entityType === 'branch') {
            return storage_path("app/pages/branches/{$entityId}");
        }
        return storage_path("app/pages/{$entityId}");
    }

    private function pagePath(int $entityId, string $slug = '', string $entityType = 'store'): string
    {
        $base = $this->basePath($entityId, $entityType);
        return $slug ? "{$base}/{$slug}" : $base;
    }

    public function save(int $entityId, string $html, string $css, ?array $grapesData = null, string $slug = '', ?string $js = null, string $entityType = 'store'): void
    {
        $path = $this->pagePath($entityId, $slug, $entityType);
        File::ensureDirectoryExists($path);
        File::put("{$path}/index.html", $html);
        File::put("{$path}/styles.css", $css);
        File::put("{$path}/scripts.js", $js ?? '');
        if ($grapesData !== null) {
            File::put("{$path}/grapes.json", json_encode($grapesData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        }
    }

    public function get(int $entityId, string $slug = '', string $entityType = 'store'): ?array
    {
        $path = $this->pagePath($entityId, $slug, $entityType);
        if (!File::exists("{$path}/index.html")) {
            return null;
        }
        return [
            'has_customization' => true,
            'slug' => $slug ?: null,
            'html' => File::get("{$path}/index.html"),
            'css' => File::exists("{$path}/styles.css") ? File::get("{$path}/styles.css") : '',
            'js' => File::exists("{$path}/scripts.js") ? File::get("{$path}/scripts.js") : null,
            'grapes_data' => File::exists("{$path}/grapes.json") ? File::get("{$path}/grapes.json") : null,
        ];
    }

    public function exists(int $entityId, string $slug = '', string $entityType = 'store'): bool
    {
        return File::exists($this->pagePath($entityId, $slug, $entityType) . '/index.html');
    }

    public function delete(int $entityId, string $slug = '', string $entityType = 'store'): void
    {
        $path = $this->pagePath($entityId, $slug, $entityType);
        if ($slug) {
            if (File::isDirectory($path)) {
                File::deleteDirectory($path);
            }
        } else {
            // Delete all files in the base path (main page)
            if (File::isDirectory($path)) {
                File::cleanDirectory($path);
            }
        }
    }

    public function list(int $entityId, string $entityType = 'store'): array
    {
        $base = $this->basePath($entityId, $entityType);
        if (!File::isDirectory($base)) {
            return [];
        }

        $pages = [];
        // Check main page (slug = '')
        if (File::exists("{$base}/index.html")) {
            $pages[] = [
                'slug' => null,
                'has_customization' => true,
                'title' => 'Home',
                'is_main' => true,
            ];
        }

        // Check subdirectories for custom pages
        $subdirs = File::directories($base);
        foreach ($subdirs as $dir) {
            if (File::exists("{$dir}/index.html")) {
                $slug = basename($dir);
                // Read page metadata if exists
                $metaPath = "{$dir}/meta.json";
                $meta = File::exists($metaPath) ? json_decode(File::get($metaPath), true) : [];
                $pages[] = [
                    'slug' => $slug,
                    'has_customization' => true,
                    'title' => $meta['title'] ?? ucfirst(str_replace('-', ' ', $slug)),
                    'is_main' => false,
                ];
            }
        }

        return $pages;
    }

    public function saveMeta(int $entityId, string $slug, array $meta, string $entityType = 'store'): void
    {
        $path = $this->pagePath($entityId, $slug, $entityType);
        File::ensureDirectoryExists($path);
        File::put("{$path}/meta.json", json_encode($meta, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }
}
