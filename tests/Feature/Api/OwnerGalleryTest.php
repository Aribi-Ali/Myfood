<?php

namespace Tests\Feature\Api;

use App\Models\User;
use App\Models\Store;
use App\Models\StoreImage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class OwnerGalleryTest extends TestCase
{
    use RefreshDatabase;

    private User $owner;
    private Store $store;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->store = Store::factory()->create(['owner_id' => $this->owner->id]);
        Storage::fake('public');
    }

    public function test_can_list_gallery_images(): void
    {
        StoreImage::create([
            'store_id' => $this->store->id,
            'path' => 'gallery/test1.jpg',
            'is_cover' => false,
        ]);
        StoreImage::create([
            'store_id' => $this->store->id,
            'path' => 'gallery/test2.jpg',
            'is_cover' => false,
        ]);

        $response = $this->actingAs($this->owner)->getJson('/api/v1/owner/gallery');

        $response->assertStatus(200)
            ->assertJsonStructure(['data']);
    }

    public function test_can_upload_image(): void
    {
        $file = UploadedFile::fake()->create('store-photo.jpg', 100, 'image/jpeg');

        $response = $this->actingAs($this->owner)->postJson('/api/v1/owner/gallery', [
            'image' => $file,
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['data' => ['id', 'path']]);
    }

    public function test_can_delete_image(): void
    {
        $image = StoreImage::create([
            'store_id' => $this->store->id,
            'path' => 'gallery/test-delete.jpg',
            'is_cover' => false,
        ]);

        $response = $this->actingAs($this->owner)->deleteJson("/api/v1/owner/gallery/{$image->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('store_images', ['id' => $image->id]);
    }

    public function test_unauthenticated_user_cannot_access_gallery(): void
    {
        $this->getJson('/api/v1/owner/gallery')->assertStatus(401);
        $this->postJson('/api/v1/owner/gallery')->assertStatus(401);
    }

    public function test_returns_403_without_store(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user)->getJson('/api/v1/owner/gallery')->assertStatus(403);
    }
}
