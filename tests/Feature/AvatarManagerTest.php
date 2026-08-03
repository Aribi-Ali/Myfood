<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use App\Models\User;

class AvatarManagerTest extends TestCase
{
  use RefreshDatabase;

  public function test_avatar_update_deletes_old_file()
  {
    Storage::fake('public');

    $user = User::factory()->create(['profile_image' => null]);

    // Put an old file
    Storage::disk('public')->put('profile_images/old.png', 'old');
    $user->update(['profile_image' => 'profile_images/old.png']);

    $this->actingAs($user);

    $file = UploadedFile::fake()->create('avatar.jpg', 100, 'image/jpeg');

    $response = $this->post(route('livewire.message', ['name' => 'profile.avatar-manager', 'method' => 'updateProfileImage']), [
      'profileImage' => $file,
    ]);

    // After update, old file should be removed
    Storage::disk('public')->assertMissing('profile_images/old.png');
  }
}
