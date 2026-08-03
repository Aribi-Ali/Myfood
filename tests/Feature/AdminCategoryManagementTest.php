<?php

namespace Tests\Feature;

use App\Livewire\Admin\Dashboard;
use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

class AdminCategoryManagementTest extends TestCase
{
    use RefreshDatabase;

    protected User $adminUser;

    protected function setUp(): void
    {
        parent::setUp();

        $this->adminUser = User::factory()->create([
            'role' => 'admin',
        ]);
    }

    public function test_non_admin_cannot_access_dashboard(): void
    {
        $user = User::factory()->create(['role' => 'client']);
        $this->actingAs($user);

        Livewire::test(Dashboard::class)
            ->assertStatus(403);
    }

    public function test_admin_can_load_dashboard(): void
    {
        $this->actingAs($this->adminUser);

        Livewire::test(Dashboard::class)
            ->assertStatus(200)
            ->assertSet('activeTab', 'overview');
    }

    public function test_admin_can_create_category_with_seo_and_descriptions(): void
    {
        $this->actingAs($this->adminUser);

        Livewire::test(Dashboard::class)
            ->set('activeTab', 'categories')
            ->set('categoryName', 'Tacos & Wraps')
            ->set('categoryShortDescription', 'Short description of tacos')
            ->set('categoryFullDescription', 'Full detailed description of tacos and wraps')
            ->set('categoryMetaTitle', 'Best Tacos in Town')
            ->set('categoryMetaDescription', 'SEO description for tacos')
            ->set('categoryMetaKeywords', 'tacos, wraps, fast food')
            ->call('saveCategory')
            ->assertHasNoErrors()
            ->assertSet('categoryName', '')
            ->assertSet('categoryShortDescription', '')
            ->assertSet('categoryFullDescription', '')
            ->assertSet('categoryMetaTitle', '')
            ->assertSet('categoryMetaDescription', '')
            ->assertSet('categoryMetaKeywords', '');

        $this->assertDatabaseHas('categories', [
            'name' => 'Tacos & Wraps',
            'slug' => 'tacos-wraps',
            'short_description' => 'Short description of tacos',
            'full_description' => 'Full detailed description of tacos and wraps',
            'meta_title' => 'Best Tacos in Town',
            'meta_description' => 'SEO description for tacos',
            'meta_keywords' => 'tacos, wraps, fast food',
        ]);
    }

    public function test_admin_can_edit_existing_category(): void
    {
        $category = Category::create([
            'name' => 'Pizza',
            'slug' => 'pizza',
            'short_description' => 'Original description',
        ]);

        $this->actingAs($this->adminUser);

        Livewire::test(Dashboard::class)
            ->set('activeTab', 'categories')
            ->call('editCategory', $category->id)
            ->assertSet('editingCategoryId', $category->id)
            ->assertSet('categoryName', 'Pizza')
            ->assertSet('categoryShortDescription', 'Original description')
            ->set('categoryShortDescription', 'Updated short description')
            ->set('categoryMetaTitle', 'Pizza SEO Title')
            ->call('saveCategory')
            ->assertHasNoErrors()
            ->assertSet('editingCategoryId', null);

        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'name' => 'Pizza',
            'short_description' => 'Updated short description',
            'meta_title' => 'Pizza SEO Title',
        ]);
    }

    public function test_admin_can_delete_category(): void
    {
        $category = Category::create([
            'name' => 'Burger',
            'slug' => 'burger',
        ]);

        $this->actingAs($this->adminUser);

        Livewire::test(Dashboard::class)
            ->set('activeTab', 'categories')
            ->call('deleteCategory', $category->id)
            ->assertHasNoErrors();

        $this->assertDatabaseMissing('categories', [
            'id' => $category->id,
        ]);
    }
}
