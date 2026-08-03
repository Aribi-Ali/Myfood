<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ChefProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ChefDocumentController extends Controller
{
  /**
   * Serve a chef's verification document from private storage to admins.
   */
  public function show(Request $request, int $id)
  {
    $user = Auth::user();
    if (!$user || !method_exists($user, 'isAdmin') || !$user->isAdmin()) {
      abort(403);
    }

    $profile = ChefProfile::findOrFail($id);

    if (!$profile->verification_document) {
      abort(404);
    }

    $path = $profile->verification_document;
    $disk = Storage::disk('private');
    if (!$disk->exists($path)) {
      abort(404);
    }

    $basePath = realpath(storage_path('app/private'));
    $filePath = realpath($disk->path($path));

    if (!$basePath || !$filePath || !str_starts_with($filePath, $basePath . DIRECTORY_SEPARATOR)) {
      Log::warning('Blocked suspicious chef document path', [
        'admin_id' => $user->id,
        'chef_profile_id' => $profile->id,
        'path' => $path,
        'ip' => $request->ip(),
      ]);

      abort(403);
    }

    $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
    $allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'webp'];

    if (!in_array($extension, $allowedExtensions, true)) {
      Log::warning('Blocked unsupported chef document type', [
        'admin_id' => $user->id,
        'chef_profile_id' => $profile->id,
        'extension' => $extension,
        'ip' => $request->ip(),
      ]);

      abort(415, 'Unsupported document type.');
    }

    $name = 'chef-document-' . $profile->id . '.' . $extension;

    $mime = 'application/octet-stream';
    if (function_exists('mime_content_type')) {
      $detected = @mime_content_type($filePath);
      if ($detected) $mime = $detected;
    }

    $allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!in_array($mime, $allowedMimeTypes, true)) {
      Log::warning('Blocked chef document with invalid MIME type', [
        'admin_id' => $user->id,
        'chef_profile_id' => $profile->id,
        'mime' => $mime,
        'ip' => $request->ip(),
      ]);

      abort(415, 'Unsupported document type.');
    }

    Log::info('Chef document downloaded', [
      'admin_id' => $user->id,
      'chef_profile_id' => $profile->id,
      'chef_user_id' => $profile->user_id,
      'ip' => $request->ip(),
      'user_agent' => $request->userAgent(),
    ]);

    return response()->streamDownload(function () use ($filePath) {
      $fh = fopen($filePath, 'rb');
      if ($fh) {
        while (!feof($fh)) {
          echo fread($fh, 1024 * 8);
        }
        fclose($fh);
      }
    }, $name, ['Content-Type' => $mime]);
  }
}