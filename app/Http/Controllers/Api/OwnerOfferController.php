<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Offer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class OwnerOfferController extends Controller
{
    use ApiResponse;

    private function getStoreOrFail()
    {
        $store = Auth::user()->store;
        if (!$store) {
            abort(403, 'No store found for this account.');
        }
        return $store;
    }

    private function getOfferOrFail($id)
    {
        $offer = Offer::where('id', $id)->where('store_id', $this->getStoreOrFail()->id)->first();
        if (!$offer) {
            abort(404, 'Offer not found.');
        }
        return $offer;
    }

    public function index(Request $request): JsonResponse
    {
        $store = $this->getStoreOrFail();
        $offers = Offer::where('store_id', $store->id)
            ->orderByDesc('created_at')
            ->paginate(min((int)$request->input('per_page', 15), 100));
        return $this->success($offers);
    }

    public function store(Request $request): JsonResponse
    {
        $store = $this->getStoreOrFail();
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'valid_from' => 'required|date',
            'valid_to' => 'required|date|after_or_equal:valid_from',
            'active' => 'boolean',
            'image' => 'nullable|image|max:2048',
        ]);
        $data['store_id'] = $store->id;
        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('offers', 'public');
        }
        $offer = Offer::create($data);
        return $this->success($offer->fresh(), 201);
    }

    public function show(int $id): JsonResponse
    {
        return $this->success($this->getOfferOrFail($id));
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $offer = $this->getOfferOrFail($id);
        $data = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'valid_from' => 'sometimes|date',
            'valid_to' => 'sometimes|date|after_or_equal:valid_from',
            'active' => 'boolean',
            'image' => 'nullable|image|max:2048',
        ]);
        if ($request->hasFile('image')) {
            if ($offer->image_path) {
                Storage::disk('public')->delete($offer->image_path);
            }
            $data['image_path'] = $request->file('image')->store('offers', 'public');
        }
        $offer->update($data);
        return $this->success($offer->fresh());
    }

    public function destroy(int $id): JsonResponse
    {
        $offer = $this->getOfferOrFail($id);
        if ($offer->image_path) {
            Storage::disk('public')->delete($offer->image_path);
        }
        $offer->delete();
        return $this->success(null, 200, 'Offer deleted.');
    }

    public function uploadImage(Request $request, int $id): JsonResponse
    {
        $offer = $this->getOfferOrFail($id);
        $request->validate(['image' => ['required', 'image', 'max:2048']]);
        if ($offer->image_path) {
            Storage::disk('public')->delete($offer->image_path);
        }
        $path = $request->file('image')->store('offers', 'public');
        $offer->update(['image_path' => $path]);
        return $this->success($offer->fresh());
    }

    public function toggle(int $id): JsonResponse
    {
        $offer = $this->getOfferOrFail($id);
        $offer->update(['active' => !$offer->active]);
        return $this->success($offer->fresh());
    }
}
