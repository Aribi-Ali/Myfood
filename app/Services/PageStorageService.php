<?php

namespace App\Services;

use App\Models\PageVersion;
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
        $this->snapshotBeforeOverwrite($entityId, $slug, $entityType, $html, $css, $js, $grapesData);

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

    // ─── Version history (Shopify-style rollback) ───────────────────────────

    /**
     * Before overwriting a page, snapshot the current content so edits are
     * recoverable. Skips when the page doesn't exist yet or nothing changed.
     */
    private function snapshotBeforeOverwrite(int $entityId, string $slug, string $entityType, string $newHtml, ?string $newCss, ?string $newJs, ?array $newGrapes): void
    {
        $current = $this->get($entityId, $slug, $entityType);
        if (!$current) {
            return;
        }

        $currentHtml = $current['html'] ?? '';
        $currentCss = $current['css'] ?? '';
        $currentJs = $current['js'] ?? '';
        $currentGrapes = $current['grapes_data'] ? json_decode($current['grapes_data'], true) : null;

        $changed = $currentHtml !== $newHtml
            || $currentCss !== ($newCss ?? '')
            || $currentJs !== ($newJs ?? '')
            || json_encode($currentGrapes) !== json_encode($newGrapes);

        if (!$changed) {
            return;
        }

        $nextVersion = PageVersion::where('entity_type', $entityType)
            ->where('entity_id', $entityId)
            ->where('slug', $slug)
            ->max('version') + 1;

        PageVersion::create([
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'slug' => $slug,
            'version' => $nextVersion,
            'html' => $currentHtml,
            'css' => $currentCss,
            'js' => $currentJs ?: null,
            'grapes_data' => $currentGrapes,
        ]);
    }

    public function versions(int $entityId, string $slug = '', string $entityType = 'store'): \Illuminate\Support\Collection
    {
        return PageVersion::where('entity_type', $entityType)
            ->where('entity_id', $entityId)
            ->where('slug', $slug)
            ->orderByDesc('version')
            ->get(['id', 'version', 'created_at', 'created_by']);
    }

    /**
     * Roll a page back to a previous snapshot. The current state is snapshotted
     * first (so a restore itself is undoable), then the snapshot is written.
     * Works even if the page was deleted since the snapshot was taken.
     */
    public function restore(int $entityId, string $slug, int $version, string $entityType = 'store'): bool
    {
        $snapshot = PageVersion::where('entity_type', $entityType)
            ->where('entity_id', $entityId)
            ->where('slug', $slug)
            ->where('version', $version)
            ->first();

        if (!$snapshot) {
            return false;
        }

        $this->save(
            $entityId,
            $snapshot->html,
            $snapshot->css ?? '',
            $snapshot->grapes_data,
            $slug,
            $snapshot->js,
            $entityType,
        );

        return true;
    }
}
