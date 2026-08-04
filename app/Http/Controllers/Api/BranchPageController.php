<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\StoreResource;
use App\Models\StoreBranch;
use App\Models\Template;
use App\Services\PageStorageService;
use App\Support\HtmlSanitizer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;

class BranchPageController extends Controller
{
    use HtmlSanitizer, ApiResponse;

    const ENTITY_TYPE = 'branch';

    public function __construct(
        protected PageStorageService $pageStorage,
    ) {}

    private function getBranch(int $branchId): ?StoreBranch
    {
        $branch = StoreBranch::with('store')->find($branchId);
        if (!$branch || $branch->store->owner_id !== Auth::id()) {
            return null;
        }
        return $branch;
    }

    private function templateData(?StoreBranch $branch): ?array
    {
        if (!$branch) return null;
        $templateSlug = $branch->template_slug ?? $branch->store->template_slug;
        if (!$templateSlug) return null;
        $template = Template::where('slug', $templateSlug)->first();
        if ($template && !$template->has_react_component && $template->html_content) {
            return [
                'html_content' => $template->html_content,
                'css_content' => $template->css_content,
            ];
        }
        return null;
    }

    // ── Main Page ──

    public function show(int $branchId): JsonResponse
    {
        $branch = $this->getBranch($branchId);
        if (!$branch) {
            return $this->notFound('Branch not found.');
        }
        $page = $this->pageStorage->get($branch->id, '', self::ENTITY_TYPE);

        return response()->json([
            'page' => $page,
            'branch' => $branch,
            'store' => new StoreResource($branch->store),
            'template_slug' => $branch->template_slug ?? $branch->store->template_slug,
            'template' => $this->templateData($branch),
        ]);
    }

    public function save(Request $request, int $branchId): JsonResponse
    {
        $branch = $this->getBranch($branchId);
        if (!$branch) {
            return $this->notFound('Branch not found.');
        }
        $data = $request->validate([
            'html' => 'required|string',
            'css' => 'nullable|string',
            'js' => 'nullable|string',
            'grapes_data' => 'nullable',
        ]);

        $data['html'] = $this->sanitizeHtml($data['html']);

        $this->pageStorage->save(
            $branch->id,
            $data['html'],
            $data['css'] ?? '',
            $data['grapes_data'] ?? null,
            '',
            $data['js'] ?? null,
            self::ENTITY_TYPE,
        );
        Cache::forget('public_branch_' . $branch->alias);

        return response()->json(['message' => 'Branch main page saved.']);
    }

    public function delete(int $branchId): JsonResponse
    {
        $branch = $this->getBranch($branchId);
        if (!$branch) {
            return $this->notFound('Branch not found.');
        }
        $this->pageStorage->delete($branch->id, '', self::ENTITY_TYPE);
        Cache::forget('public_branch_' . $branch->alias);

        return response()->json(['message' => 'Branch main page deleted.']);
    }

    // ── Custom Pages ──

    public function list(int $branchId): JsonResponse
    {
        $branch = $this->getBranch($branchId);
        if (!$branch) {
            return $this->notFound('Branch not found.');
        }
        $pages = $this->pageStorage->list($branch->id, self::ENTITY_TYPE);

        return response()->json(['pages' => $pages]);
    }

    public function create(Request $request, int $branchId): JsonResponse
    {
        $branch = $this->getBranch($branchId);
        if (!$branch) {
            return $this->notFound('Branch not found.');
        }
        $data = $request->validate([
            'slug' => [
                'required',
                'string',
                'max:100',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
            ],
            'title' => 'nullable|string|max:255',
            'html' => 'nullable|string',
            'css' => 'nullable|string',
            'js' => 'nullable|string',
            'grapes_data' => 'nullable',
        ]);

        $slug = $data['slug'];

        if ($this->pageStorage->exists($branch->id, $slug, self::ENTITY_TYPE)) {
            return response()->json(['errors' => ['slug' => 'A page with this slug already exists.']], 422);
        }

        $this->pageStorage->save(
            $branch->id,
            $data['html'] ?? '<div style="padding:80px 40px;text-align:center;"><h1>' . e($data['title'] ?? ucfirst(str_replace('-', ' ', $slug))) . '</h1><p>Start editing this page.</p></div>',
            $data['css'] ?? '',
            $data['grapes_data'] ?? null,
            $slug,
            $data['js'] ?? null,
            self::ENTITY_TYPE,
        );

        if (isset($data['title'])) {
            $this->pageStorage->saveMeta($branch->id, $slug, ['title' => $data['title']], self::ENTITY_TYPE);
        }

        return response()->json(['message' => 'Branch page created.', 'slug' => $slug]);
    }

    public function showSlug(int $branchId, string $slug): JsonResponse
    {
        $branch = $this->getBranch($branchId);
        if (!$branch) {
            return $this->notFound('Branch not found.');
        }
        $page = $this->pageStorage->get($branch->id, $slug, self::ENTITY_TYPE);
        if (!$page) {
            return $this->notFound('Page not found.');
        }

        return response()->json([
            'page' => $page,
            'branch' => $branch,
            'store' => new StoreResource($branch->store),
            'template_slug' => $branch->template_slug ?? $branch->store->template_slug,
            'template' => $this->templateData($branch),
        ]);
    }

    public function saveSlug(Request $request, int $branchId, string $slug): JsonResponse
    {
        $branch = $this->getBranch($branchId);
        if (!$branch) {
            return $this->notFound('Branch not found.');
        }
        $data = $request->validate([
            'html' => 'required|string',
            'css' => 'nullable|string',
            'js' => 'nullable|string',
            'grapes_data' => 'nullable',
        ]);

        if (!$this->pageStorage->exists($branch->id, $slug, self::ENTITY_TYPE)) {
            return $this->notFound('Page not found.');
        }

        $data['html'] = $this->sanitizeHtml($data['html']);

        $this->pageStorage->save(
            $branch->id,
            $data['html'],
            $data['css'] ?? '',
            $data['grapes_data'] ?? null,
            $slug,
            $data['js'] ?? null,
            self::ENTITY_TYPE,
        );

        if ($request->has('title')) {
            $this->pageStorage->saveMeta($branch->id, $slug, ['title' => $request->input('title')], self::ENTITY_TYPE);
        }

        Cache::forget('public_branch_' . $branch->alias);

        return response()->json(['message' => 'Branch page saved.']);
    }

    public function deleteSlug(int $branchId, string $slug): JsonResponse
    {
        $branch = $this->getBranch($branchId);
        if (!$branch) {
            return $this->notFound('Branch not found.');
        }
        $this->pageStorage->delete($branch->id, $slug, self::ENTITY_TYPE);
        Cache::forget('public_branch_' . $branch->alias);

        return response()->json(['message' => 'Branch page deleted.']);
    }

    // ── Version history (Shopify-style rollback) ──

    /**
     * List saved versions of a branch page. Slug '' = main page.
     */
    public function versions(int $branchId, string $slug = ''): JsonResponse
    {
        $branch = $this->getBranch($branchId);
        if (!$branch) {
            return $this->notFound('Branch not found.');
        }
        return response()->json(['versions' => $this->pageStorage->versions($branch->id, $slug, self::ENTITY_TYPE)]);
    }

    /**
     * Roll a branch page back to a previous version. Slug '' = main page.
     */
    public function restore(Request $request, int $branchId, string $slug = ''): JsonResponse
    {
        $branch = $this->getBranch($branchId);
        if (!$branch) {
            return $this->notFound('Branch not found.');
        }
        $version = $request->validate(['version' => 'required|integer|min:1'])['version'];

        if (!$this->pageStorage->restore($branch->id, $slug, $version, self::ENTITY_TYPE)) {
            return $this->notFound('Version not found.');
        }
        Cache::forget('public_branch_' . $branch->alias);

        return response()->json(['message' => 'Branch page restored to version ' . $version . '.']);
    }

    /**
     * Copy all pages from one branch to another (same store).
     * POST /branches/{branch}/pages/copy-from/{sourceBranch}
     */
    public function copyPages(int $branchId, int $sourceBranchId): JsonResponse
    {
        $branch = $this->getBranch($branchId);
        if (!$branch) {
            return $this->notFound('Target branch not found.');
        }

        $sourceBranch = StoreBranch::with('store')->find($sourceBranchId);
        if (!$sourceBranch || $sourceBranch->store_id !== $branch->store_id) {
            return $this->error('Source branch not found or not in the same store.', 422);
        }

        if ($sourceBranch->store->owner_id !== Auth::id()) {
            return $this->forbidden('You do not own the source branch store.');
        }

        $sourceBase = storage_path("app/pages/branches/{$sourceBranch->id}");
        $targetBase = storage_path("app/pages/branches/{$branch->id}");

        if (!File::isDirectory($sourceBase)) {
            return $this->error('Source branch has no pages to copy.', 404);
        }

        // Remove existing target pages
        if (File::isDirectory($targetBase)) {
            File::deleteDirectory($targetBase);
        }

        // Copy all files recursively
        File::copyDirectory($sourceBase, $targetBase);

        Cache::forget('public_branch_' . $branch->alias);

        return response()->json(['message' => 'Pages copied successfully.']);
    }
}
