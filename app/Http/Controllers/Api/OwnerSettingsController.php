<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Commune;
use App\Models\Daira;
use App\Models\StoreSocialLink;
use App\Models\Wilaya;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class OwnerSettingsController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $store = Auth::user()->store;

        if (!$store) {
            return $this->forbidden('No store found for this account.');
        }

        $store->load(['socialLinks', 'phones']);

        $data = [
            'name' => $store->name,
            'alias' => $store->alias,
            'description' => $store->description,
            'phone' => $store->phone,
            'email' => $store->email,
            'address' => $store->address,
            'latitude' => $store->latitude,
            'longitude' => $store->longitude,
            'opening_hours' => $store->opening_hours,
            'wilaya' => $store->wilaya,
            'daira' => $store->daira,
            'commune' => $store->commune,
            'logo_path' => $store->logo_path,
            'cover_image' => $store->cover_image,
            'is_active' => $store->is_active,
            'ordering_enabled' => $store->ordering_enabled,
            'avg_prep_time' => $store->avg_prep_time,
            'delivery_zone_radius' => $store->delivery_zone_radius,
            'base_delivery_fee' => $store->base_delivery_fee,
            'avg_delivery_time_per_km' => $store->avg_delivery_time_per_km,
            'break_start' => $store->break_start?->format('H:i'),
            'break_end' => $store->break_end?->format('H:i'),
            'break_note' => $store->break_note,
            'is_paused' => $store->is_paused,
            'pause_note' => $store->pause_note,
            'order_prefix' => $store->order_prefix,
            'order_suffix' => $store->order_suffix,
            'order_padding' => $store->order_padding,
            'order_start_number' => $store->order_start_number,
            'social_links' => $store->socialLinks,
            'phones' => $store->phones->map(fn ($p) => [
                'id' => $p->id,
                'phone' => $p->phone,
                'is_primary' => $p->is_primary,
            ]),
        ];

        return $this->success($data);
    }

    public function update(Request $request): JsonResponse
    {
        $store = Auth::user()->store;

        if (!$store) {
            return $this->forbidden('No store found for this account.');
        }

        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'alias' => 'nullable|string|max:255|unique:stores,alias,' . $store->id,
            'description' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:500',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'opening_hours' => 'nullable|array',
            'wilaya' => 'nullable|string|max:255',
            'daira' => 'nullable|string|max:255',
            'commune' => 'nullable|string|max:255',
            'ordering_enabled' => 'boolean',
            'avg_prep_time' => 'nullable|integer|min:1',
            'delivery_zone_radius' => 'nullable|numeric|min:0',
            'base_delivery_fee' => 'nullable|numeric|min:0',
            'avg_delivery_time_per_km' => 'nullable|integer|min:1',
            'break_start' => 'nullable|string',
            'break_end' => 'nullable|string',
            'break_note' => 'nullable|string|max:500',
            'is_paused' => 'boolean',
            'pause_note' => 'nullable|string|max:500',
            'order_prefix' => 'nullable|string|max:20',
            'order_suffix' => 'nullable|string|max:20',
            'order_padding' => 'nullable|integer|min:0|max:10',
            'order_start_number' => 'nullable|integer|min:0',
            'social_links' => 'nullable|array',
            'social_links.*.platform' => 'required_with:social_links|string|max:50',
            'social_links.*.url' => 'required_with:social_links|url|max:500',
            'social_links.*.label' => 'nullable|string|max:255',
            'phones' => 'nullable|array',
            'phones.*' => 'required|string|max:30',
        ]);

        $updateData = collect($data)->except('social_links')->toArray();

        if (isset($updateData['break_start'])) {
            $updateData['break_start'] = now()->parse($updateData['break_start'])->format('H:i:s');
        }

        if (isset($updateData['break_end'])) {
            $updateData['break_end'] = now()->parse($updateData['break_end'])->format('H:i:s');
        }

        $store->update($updateData);

        if ($request->has('social_links')) {
            $store->socialLinks()->delete();
            foreach ($request->social_links as $link) {
                $store->socialLinks()->create([
                    'platform' => $link['platform'],
                    'url' => $link['url'],
                    'label' => $link['label'] ?? null,
                ]);
            }
        }

        if ($request->has('phones')) {
            $store->phones()->delete();
            foreach ((array)$request->phones as $i => $phone) {
                if (empty($phone)) continue;
                $store->phones()->create([
                    'phone'       => $phone,
                    'is_primary'  => $i === 0,
                    'order_index' => $i,
                ]);
            }
        }

        $store->load(['socialLinks', 'phones']);

        return $this->success($store, 200, 'Settings updated successfully.');
    }

    /**
     * Toggle store pause on/off.
     */
    public function togglePause(Request $request): JsonResponse
    {
        $store = Auth::user()->store;

        if (!$store) {
            return $this->forbidden('No store found for this account.');
        }

        $data = $request->validate([
            'is_paused' => 'required|boolean',
            'pause_note' => 'nullable|string|max:500',
        ]);

        $store->update([
            'is_paused' => $data['is_paused'],
            'pause_note' => $data['pause_note'] ?? null,
        ]);

        $status = $data['is_paused'] ? 'paused' : 'resumed';

        return $this->success([
            'is_paused' => $store->is_paused,
            'pause_note' => $store->pause_note,
        ], 200, "Store {$status} successfully.");
    }

    public function uploadLogo(Request $request): JsonResponse
    {
        $store = Auth::user()->store;

        if (!$store) {
            return $this->forbidden('No store found for this account.');
        }

        $request->validate(['logo' => ['required', 'image', 'max:2048']]);

        if ($store->logo_path) {
            Storage::disk('public')->delete($store->logo_path);
        }

        $path = $request->file('logo')->store('logos', 'public');
        $store->update(['logo_path' => $path]);

        return $this->success(['logo_path' => $path], 200, 'Logo uploaded successfully.');
    }

    public function uploadCover(Request $request): JsonResponse
    {
        $store = Auth::user()->store;

        if (!$store) {
            return $this->forbidden('No store found for this account.');
        }

        $request->validate(['cover' => ['required', 'image', 'max:4096']]);

        if ($store->cover_image) {
            Storage::disk('public')->delete($store->cover_image);
        }

        $path = $request->file('cover')->store('covers', 'public');
        $store->update(['cover_image' => $path]);

        return $this->success(['cover_image' => $path], 200, 'Cover image uploaded successfully.');
    }

    public function wilayas(): JsonResponse
    {
        $wilayas = Wilaya::orderBy('name_fr')->get();
        return $this->success($wilayas);
    }

    public function dairas(int $wilayaId): JsonResponse
    {
        $dairas = Daira::where('wilaya_id', $wilayaId)->orderBy('name_fr')->get();
        return $this->success($dairas);
    }

    public function communes(int $dairaId): JsonResponse
    {
        $communes = Commune::where('daira_id', $dairaId)->orderBy('name_fr')->get();
        return $this->success($communes);
    }
}
