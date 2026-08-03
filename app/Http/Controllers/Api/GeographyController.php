<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Wilaya;
use App\Models\Daira;
use App\Models\Commune;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class GeographyController extends Controller
{
    use ApiResponse;

    /**
     * Get all Wilayas.
     */
    public function wilayas(): JsonResponse
    {
        $wilayas = Cache::remember('geo_wilayas_all', now()->addDay(), function () {
            return Wilaya::orderBy('code')->get();
        });

        return $this->success($wilayas, 200, 'Wilayas retrieved successfully')
            ->header('Cache-Control', 'public, max-age=86400');
    }

    /**
     * Get Dairas for a specific Wilaya.
     */
    public function dairas(int $wilayaId): JsonResponse
    {
        $wilayaExists = Cache::remember("geo_wilaya_exists_{$wilayaId}", now()->addDay(), function () use ($wilayaId) {
            return Wilaya::where('id', $wilayaId)->exists();
        });

        if (!$wilayaExists) {
            return $this->notFound('Wilaya not found');
        }

        $dairas = Cache::remember("geo_dairas_for_wilaya_{$wilayaId}", now()->addHour(), function () use ($wilayaId) {
            return Daira::where('wilaya_id', $wilayaId)->orderBy('name_fr')->get();
        });

        return $this->success($dairas, 200, 'Dairas retrieved successfully')
            ->header('Cache-Control', 'public, max-age=3600');
    }

    /**
     * Get Communes for a specific Daira.
     */
    public function communes(int $dairaId): JsonResponse
    {
        $dairaExists = Cache::remember("geo_daira_exists_{$dairaId}", now()->addDay(), function () use ($dairaId) {
            return Daira::where('id', $dairaId)->exists();
        });

        if (!$dairaExists) {
            return $this->notFound('Daira not found');
        }

        $communes = Cache::remember("geo_communes_for_daira_{$dairaId}", now()->addHour(), function () use ($dairaId) {
            return Commune::where('daira_id', $dairaId)->orderBy('name_fr')->get();
        });

        return $this->success($communes, 200, 'Communes retrieved successfully')
            ->header('Cache-Control', 'public, max-age=3600');
    }

    /**
     * GET /geo/cities — Paginated city search with "Commune - Daira - Wilaya" format.
     */
    public function cities(): JsonResponse
    {
        $search = request('search', '');
        $page = max(1, (int) request('page', 1));
        $perPage = 10;

        $query = Commune::with(['daira.wilaya'])
            ->select('communes.*')
            ->join('dairas', 'communes.daira_id', '=', 'dairas.id')
            ->join('wilayas', 'communes.wilaya_id', '=', 'wilayas.id')
            ->orderBy('wilayas.name_fr')
            ->orderBy('dairas.name_fr')
            ->orderBy('communes.name_fr');

        if (strlen($search) >= 2) {
            $like = '%' . $search . '%';
            $query->where(function ($q) use ($like) {
                $q->where('communes.name_fr', 'like', $like)
                  ->orWhere('communes.name_ar', 'like', $like)
                  ->orWhere('dairas.name_fr', 'like', $like)
                  ->orWhere('dairas.name_ar', 'like', $like)
                  ->orWhere('wilayas.name_fr', 'like', $like)
                  ->orWhere('wilayas.name_ar', 'like', $like);
            });
        }

        $total = $query->count();
        $items = $query->skip(($page - 1) * $perPage)->take($perPage)->get();

        $results = $items->map(fn($c) => [
            'id'        => $c->id,
            'wilaya_id' => $c->wilaya_id,
            'daira_id'  => $c->daira_id,
            'commune_id'=> $c->id,
            'label'     => "{$c->name_fr} - {$c->daira->name_fr} - {$c->daira->wilaya->name_fr}",
        ]);

        return response()->json([
            'data' => $results,
            'meta' => [
                'total'        => $total,
                'page'         => $page,
                'per_page'     => $perPage,
                'has_more'     => ($page * $perPage) < $total,
            ],
        ])->header('Cache-Control', 'public, max-age=300');
    }
}
