<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ImageService
{
    private ImageManager $manager;

    public function __construct()
    {
        // Require Intervention Image v3
        $this->manager = new ImageManager(new Driver());
    }

    /**
     * Stores an uploaded image and generates optimized WebP versions (original, thumb, display).
     *
     * @param UploadedFile $file The uploaded file
     * @param string $directory The directory to store in (e.g., 'foods', 'profiles')
     * @return string The relative path to the original/display image, compatible with existing code
     */
    public function storeAndOptimize(UploadedFile $file, string $directory): string
    {
        $filename = uniqid() . '_' . time();
        $disk = Storage::disk('public');
        
        // Make sure directory exists
        if (!$disk->exists($directory)) {
            $disk->makeDirectory($directory);
        }

        $image = $this->manager->read($file->getRealPath());

        // Save original (converted to WebP)
        $originalPath = "{$directory}/{$filename}_orig.webp";
        $disk->put($originalPath, (string) $image->toWebp(90));

        // Display size (max 800x800)
        $displayImage = clone $image;
        $displayImage->scaleDown(width: 800, height: 800);
        $displayPath = "{$directory}/{$filename}.webp"; // This is the main one returned
        $disk->put($displayPath, (string) $displayImage->toWebp(85));

        // Thumbnail (max 300x300, cropped/padded)
        $thumbImage = clone $image;
        $thumbImage->coverDown(300, 300);
        $thumbPath = "{$directory}/{$filename}_thumb.webp";
        $disk->put($thumbPath, (string) $thumbImage->toWebp(80));

        // Return the display path so existing $model->image references work directly
        return $displayPath;
    }

    /**
     * Deletes an optimized image and its variants.
     */
    public function deleteOptimized(string $path): void
    {
        $disk = Storage::disk('public');
        
        if ($disk->exists($path)) {
            $disk->delete($path);
        }

        // Try to delete variants
        $origPath = str_replace('.webp', '_orig.webp', $path);
        if ($disk->exists($origPath)) {
            $disk->delete($origPath);
        }

        $thumbPath = str_replace('.webp', '_thumb.webp', $path);
        if ($disk->exists($thumbPath)) {
            $disk->delete($thumbPath);
        }
    }
}
