<?php

namespace App\Services;

use App\Models\PageAsset;
use App\Models\Store;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AssetService
{
    public function upload(Store $store, UploadedFile $file, string $group = 'general', ?int $userId = null): PageAsset
    {
        $extension = $file->getClientOriginalExtension();
        $mimeType = $file->getMimeType();
        $originalName = $file->getClientOriginalName();
        $size = $file->getSize();

        $allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!in_array($mimeType, $allowedMimes)) {
            throw new \InvalidArgumentException('Invalid file type. Allowed: JPEG, PNG, WebP, GIF.');
        }

        if ($size > 5 * 1024 * 1024) {
            throw new \InvalidArgumentException('File size exceeds 5MB limit.');
        }

        $path = $file->store("stores/{$store->id}/assets/{$group}", 'public');

        $url = Storage::url($path);

        [$width, $height] = $this->getImageDimensions($file, $mimeType);

        return PageAsset::create([
            'store_id'      => $store->id,
            'user_id'       => $userId,
            'original_name' => $originalName,
            'path'          => $path,
            'url'           => $url,
            'mime_type'     => $mimeType,
            'size_bytes'    => $size,
            'width'         => $width,
            'height'        => $height,
            'disk'          => 'public',
            'group'         => $group,
            'metadata'      => [
                'extension' => $extension,
            ],
        ]);
    }

    public function list(Store $store, ?string $group = null)
    {
        $query = $store->pageAssets();

        if ($group) {
            $query->where('group', $group);
        }

        return $query->orderByDesc('created_at')->paginate(20);
    }

    public function delete(PageAsset $asset): void
    {
        Storage::disk($asset->disk)->delete($asset->path);
        $asset->delete();
    }

    protected function getImageDimensions(UploadedFile $file, string $mimeType): array
    {
        if (str_starts_with($mimeType, 'image/')) {
            $dimensions = @getimagesize($file->getRealPath());
            if ($dimensions) {
                return [$dimensions[0], $dimensions[1]];
            }
        }
        return [null, null];
    }
}
