<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Store;
use App\Models\StoreBranch;
use App\Models\Template;
use App\Models\ThemePreset;
use App\Services\PageStorageService;
use App\Support\HtmlSanitizer;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class PublicBranchController extends Controller
{
    use HtmlSanitizer;

    public function __construct(
        protected PageStorageService $pageStorage,
    ) {}

    /**
     * Show branch by alias with store data, foods, reviews, template info, and custom page.
     */
    public function show(string $alias): JsonResponse
    {
        $cacheKey = 'public_branch_' . $alias;

        $branch = Cache::remember(
            $cacheKey,
            900,
            fn () => StoreBranch::where('alias', $alias)
                ->where('is_active', true)
                ->with(['store.foods.category', 'store.reviews', 'store.offers', 'store.badges', 'store.staff'])
                ->first()
        );

        if (!$branch) {
            return response()->json(['data' => null, 'errors' => 'Branch not found.'], 404);
        }

        $store = $branch->store;

        if (!$store || !$store->is_approved) {
            return response()->json(['data' => null, 'errors' => 'Store not found or not approved.'], 404);
        }

        $templateHtml = null;
        $templateCss = null;
        $templateSlug = $branch->template_slug ?? $store->template_slug;

        if ($templateSlug) {
            $template = Template::where('slug', $templateSlug)->first();
            if ($template && !$template->has_react_component && $template->html_content) {
                $templateHtml = $template->html_content;
                $templateCss = $template->css_content;
            }
        }

        $themeCssVars = null;
        $themePresetId = $branch->theme_preset_id ?? $store->theme_preset_id;

        if ($themePresetId) {
            $preset = ThemePreset::find($themePresetId);
            if ($preset && $preset->css_vars) {
                $themeCssVars = $preset->css_vars;
            }
        }

        $customPage = $this->pageStorage->get($branch->id, '', 'branch');

        return response()->json([
            'data' => [
                'branch' => $branch,
                'store'  => $store,
                'foods'  => $store->foods,
                'reviews' => $store->reviews,
                'page'  => [
                    'template_slug' => $templateSlug,
                    'has_customization' => $customPage !== null,
                    'html' => $customPage['html'] ?? null,
                    'css'  => $customPage['css'] ?? null,
                    'js'   => $customPage['js'] ?? null,
                ],
                'template' => $templateHtml ? [
                    'html_content' => $this->sanitizeHtml($templateHtml),
                    'css_content'  => $templateCss,
                ] : null,
                'theme_css_vars' => $themeCssVars,
                'custom_pages' => $this->pageStorage->list($branch->id, 'branch'),
            ],
        ])->header('Cache-Control', 'public, max-age=900');
    }

    /**
     * Return a specific custom page for a branch.
     */
    public function showPage(string $alias, string $slug): JsonResponse
    {
        $branch = StoreBranch::where('alias', $alias)
            ->where('is_active', true)
            ->first();

        if (!$branch) {
            return response()->json(['data' => null, 'errors' => 'Branch not found.'], 404);
        }

        $store = $branch->store;

        if (!$store || !$store->is_approved) {
            return response()->json(['data' => null, 'errors' => 'Store not found or not approved.'], 404);
        }

        $customPage = $this->pageStorage->get($branch->id, $slug, 'branch');

        if (!$customPage) {
            return response()->json(['data' => null, 'errors' => 'Page not found.'], 404);
        }

        return response()->json([
            'data' => [
                'branch' => $branch,
                'store'  => $store,
                'page'   => $customPage,
            ],
        ])->header('Cache-Control', 'public, max-age=900');
    }

    /**
     * Return block data for dynamic blocks scoped to a branch's store.
     */
    public function blockData(string $alias, string $blockType): JsonResponse
    {
        $branch = StoreBranch::where('alias', $alias)
            ->where('is_active', true)
            ->first();

        if (!$branch) {
            return response()->json(['data' => null, 'errors' => 'Branch not found.'], 404);
        }

        $store = $branch->store;

        if (!$store || !$store->is_approved) {
            return response()->json(['data' => null, 'errors' => 'Store not found or not approved.'], 404);
        }

        $cacheKey = 'branch_block_' . $branch->id . '_' . $blockType;

        $data = Cache::remember($cacheKey, 600, function () use ($store, $blockType) {
            return match ($blockType) {
                'foods'       => $store->foods()->with('categories')->get(),
                'categories'  => Category::whereHas('foods', fn ($q) => $q->where('store_id', $store->id))->get(),
                'offers'      => $store->offers()->where('active', true)->get(),
                'reviews'     => $store->reviews()->latest()->limit(10)->get(),
                'hours'       => $store->opening_hours,
                'branch_info' => $store->branches()->where('is_active', true)->get(),
                default       => [],
            };
        });

        return response()->json(['data' => $data])
            ->header('Cache-Control', 'public, max-age=600');
    }

    /**
     * Returns all active branches for a store (by store alias).
     */
    public function branchesByStore(string $storeAlias): JsonResponse
    {
        $cacheKey = 'store_branches_' . $storeAlias;

        $branches = Cache::remember(
            $cacheKey,
            900,
            fn () => StoreBranch::whereHas('store', fn ($q) => $q->where('alias', $storeAlias)->where('is_approved', true))
                ->where('is_active', true)
                ->with(['assignedUsers'])
                ->orderBy('id')
                ->get()
        );

        if ($branches->isEmpty()) {
            return response()->json(['data' => [], 'message' => 'No active branches found for this store.'], 200);
        }

        return response()->json(['data' => $branches])
            ->header('Cache-Control', 'public, max-age=900');
    }
}
