<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\StoreResource;
use App\Models\Template;
use App\Services\PageStorageService;
use App\Support\HtmlSanitizer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\Rule;

class PageController extends Controller
{
    use HtmlSanitizer;
    public function __construct(
        protected PageStorageService $pageStorage,
    ) {}

    // ── Main Page (backward compatible) ──

    public function show(Request $request): JsonResponse
    {
        $store = $request->user()->store ?? null;
        if (!$store) {
            return response()->json(['errors' => 'Store not found.'], 404);
        }
        $page = $this->pageStorage->get($store->id);

        $templateData = null;
        if ($store->template_slug) {
            $template = Template::where('slug', $store->template_slug)->first();
            if ($template && !$template->has_react_component && $template->html_content) {
                $templateData = [
                    'html_content' => $template->html_content,
                    'css_content' => $template->css_content,
                ];
            }
        }

        return response()->json([
            'page' => $page,
            'store' => new StoreResource($store),
            'template_slug' => $store->template_slug,
            'template' => $templateData,
        ]);
    }

    public function showSlug(Request $request, string $slug): JsonResponse
    {
        $store = $request->user()->store ?? null;
        if (!$store) {
            return response()->json(['errors' => 'Store not found.'], 404);
        }
        $page = $this->pageStorage->get($store->id, $slug);
        if (!$page) {
            return response()->json(['errors' => 'Page not found.'], 404);
        }

        $templateData = null;
        if ($store->template_slug) {
            $template = Template::where('slug', $store->template_slug)->first();
            if ($template && !$template->has_react_component && $template->html_content) {
                $templateData = [
                    'html_content' => $template->html_content,
                    'css_content' => $template->css_content,
                ];
            }
        }

        return response()->json([
            'page' => $page,
            'store' => new StoreResource($store),
            'template_slug' => $store->template_slug,
            'template' => $templateData,
        ]);
    }

    public function save(Request $request): JsonResponse
    {
        $store = $request->user()->store;
        $data = $request->validate([
            'html' => 'required|string',
            'css' => 'nullable|string',
            'js' => 'nullable|string',
            'grapes_data' => 'nullable',
        ]);

        // Sanitize HTML content
        $data['html'] = $this->sanitizeHtml($data['html']);

        $this->pageStorage->save(
            $store->id,
            $data['html'],
            $data['css'] ?? '',
            $data['grapes_data'] ?? null,
            '',
            $data['js'] ?? null,
        );
        Cache::forget('public_store_' . $store->alias);
        Cache::forget('store:alias_' . $store->alias);
        return response()->json(['message' => 'Main page saved.']);
    }

    public function delete(Request $request): JsonResponse
    {
        $store = $request->user()->store ?? null;
        if (!$store) {
            return response()->json(['errors' => 'Store not found.'], 404);
        }
        $this->pageStorage->delete($store->id);
        Cache::forget('public_store_' . $store->alias);
        Cache::forget('store:alias_' . $store->alias);
        return response()->json(['message' => 'Main page deleted.']);
    }

    // ── Custom Pages (multi-page) ──

    public function list(Request $request): JsonResponse
    {
        $store = $request->user()->store ?? null;
        if (!$store) {
            return response()->json(['errors' => 'Store not found.'], 404);
        }
        $pages = $this->pageStorage->list($store->id);
        return response()->json(['pages' => $pages]);
    }

    public function create(Request $request): JsonResponse
    {
        $store = $request->user()->store;
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

        if ($this->pageStorage->exists($store->id, $slug)) {
            return response()->json(['errors' => ['slug' => 'A page with this slug already exists.']], 422);
        }

        $this->pageStorage->save(
            $store->id,
            $data['html'] ?? '<div style="padding:80px 40px;text-align:center;"><h1>' . e($data['title'] ?? ucfirst(str_replace('-', ' ', $slug))) . '</h1><p>Start editing this page.</p></div>',
            $data['css'] ?? '',
            $data['grapes_data'] ?? null,
            $slug,
            $data['js'] ?? null,
        );

        if (isset($data['title'])) {
            $this->pageStorage->saveMeta($store->id, $slug, ['title' => $data['title']]);
        }

        return response()->json(['message' => 'Page created.', 'slug' => $slug]);
    }

    public function saveSlug(Request $request, string $slug): JsonResponse
    {
        $store = $request->user()->store;
        $data = $request->validate([
            'html' => 'required|string',
            'css' => 'nullable|string',
            'js' => 'nullable|string',
            'grapes_data' => 'nullable',
        ]);

        if (!$this->pageStorage->exists($store->id, $slug)) {
            return response()->json(['errors' => 'Page not found.'], 404);
        }

        // Sanitize HTML content
        $data['html'] = $this->sanitizeHtml($data['html']);

        $this->pageStorage->save(
            $store->id,
            $data['html'],
            $data['css'] ?? '',
            $data['grapes_data'] ?? null,
            $slug,
            $data['js'] ?? null,
        );

        if ($request->has('title')) {
            $this->pageStorage->saveMeta($store->id, $slug, ['title' => $request->input('title')]);
        }

        Cache::forget('public_store_' . $store->alias);
        Cache::forget('store:alias_' . $store->alias);

        return response()->json(['message' => 'Page saved.']);
    }

    public function deleteSlug(Request $request, string $slug): JsonResponse
    {
        $store = $request->user()->store;
        $this->pageStorage->delete($store->id, $slug);
        Cache::forget('public_store_' . $store->alias);
        Cache::forget('store:alias_' . $store->alias);
        return response()->json(['message' => 'Page deleted.']);
    }

    // ── Version history (Shopify-style rollback) ──

    /**
     * List saved versions of a page. Slug '' = main page.
     */
    public function versions(Request $request, string $slug = ''): JsonResponse
    {
        $store = $request->user()->store ?? null;
        if (!$store) {
            return response()->json(['errors' => 'Store not found.'], 404);
        }
        return response()->json(['versions' => $this->pageStorage->versions($store->id, $slug)]);
    }

    /**
     * Roll a page back to a previous version. Slug '' = main page.
     */
    public function restore(Request $request, string $slug = ''): JsonResponse
    {
        $store = $request->user()->store ?? null;
        if (!$store) {
            return response()->json(['errors' => 'Store not found.'], 404);
        }
        $version = $request->validate(['version' => 'required|integer|min:1'])['version'];

        if (!$this->pageStorage->restore($store->id, $slug, $version)) {
            return response()->json(['errors' => 'Version not found.'], 404);
        }
        Cache::forget('public_store_' . $store->alias);
        Cache::forget('store:alias_' . $store->alias);
        return response()->json(['message' => 'Page restored to version ' . $version . '.']);
    }
}
