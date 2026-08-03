<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Store;
use App\Models\ThemePreset;
use App\Services\PageStorageService;
use App\Support\HtmlSanitizer;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class PublicStorePageController extends Controller
{
    use HtmlSanitizer;
    public function __construct(
        protected PageStorageService $pageStorage,
    ) {}

    public function show(string $alias): JsonResponse
    {
        $store = Cache::remember(
            'public_store_' . $alias,
            900,
            fn () => Store::where('alias', $alias)
                ->where('is_approved', true)
                ->with(['foods.category', 'reviews', 'offers', 'badges', 'staff'])
                ->first()
        );

        if (!$store) {
            return response()->json(['data' => null, 'errors' => 'Store not found.'], 404);
        }

        $customPage = $this->pageStorage->get($store->id);

        $templateHtml = null;
        $templateCss = null;
        if ($store->template_slug) {
            $template = \App\Models\Template::where('slug', $store->template_slug)->first();
            if ($template && !$template->has_react_component && $template->html_content) {
                $templateHtml = $template->html_content;
                $templateCss = $template->css_content;
            }
        }

        $themeCssVars = null;
        if ($store->theme_preset_id) {
            $preset = ThemePreset::find($store->theme_preset_id);
            if ($preset && $preset->css_vars) {
                $themeCssVars = $preset->css_vars;
            }
        }

        return response()->json([
            'data' => [
                'store' => $store,
                'page'  => [
                    'template_slug' => $store->template_slug,
                    'has_customization' => $customPage !== null,
                    'html' => $customPage['html'] ?? null,
                    'css'  => $customPage['css'] ?? null,
                    'js'   => $customPage['js'] ?? null,
                ],
                'template' => $templateHtml ? [
                    'html_content' => $this->sanitizeHtml($templateHtml),
                    'css_content' => $templateCss,
                ] : null,
                'theme_css_vars' => $themeCssVars,
                'custom_pages' => $this->pageStorage->list($store->id),
            ],
        ])->header('Cache-Control', 'public, max-age=900');
    }

    public function showPage(string $alias, string $slug): JsonResponse
    {
        $cacheKey = 'public_store_page_' . $alias . '_' . $slug;

        $store = Cache::remember(
            'public_store_' . $alias,
            900,
            fn () => Store::where('alias', $alias)
                ->where('is_approved', true)
                ->with(['foods.category', 'reviews', 'offers', 'badges', 'staff'])
                ->first()
        );

        if (!$store) {
            return response()->json(['data' => null, 'errors' => 'Store not found.'], 404);
        }

        $customPage = $this->pageStorage->get($store->id, $slug);

        if (!$customPage) {
            return response()->json(['data' => null, 'errors' => 'Page not found.'], 404);
        }

        return response()->json([
            'data' => [
                'store' => $store,
                'page' => $customPage,
            ],
        ])->header('Cache-Control', 'public, max-age=900');
    }

    public function blockData(string $alias, string $blockType): JsonResponse
    {
        $store = Store::where('alias', $alias)->where('is_approved', true)->first();

        if (!$store) {
            return response()->json(['data' => null, 'errors' => 'Store not found.'], 404);
        }

        $cacheKey = 'store_block_' . $store->id . '_' . $blockType;
        $data = Cache::remember($cacheKey, 600, function () use ($store, $blockType) {
            return match ($blockType) {
                'foods'       => $store->foods()->with('categories')->get(),
                'categories'  => Category::whereHas('foods', fn ($q) => $q->where('store_id', $store->id))->get(),
                'offers'      => $store->offers()->where('active', true)->get(),
                'reviews'     => $store->reviews()->latest()->limit(10)->get(),
                'hours'       => $store->opening_hours,
                default       => [],
            };
        });

        return response()->json(['data' => $data])
            ->header('Cache-Control', 'public, max-age=600');
    }
}
