<?php

namespace Tests\Feature;

use App\Livewire\Owner\Themes;
use App\Models\Store;
use App\Models\Theme;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

class ThemesTest extends TestCase
{
    use RefreshDatabase;

    protected User $owner;
    protected Store $store;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create(['role' => 'owner']);
        $this->store = Store::factory()->create(['owner_id' => $this->owner->id]);
    }

    private function createComponent(): \Livewire\Features\SupportTesting\Testable
    {
        return Livewire::test(Themes::class, ['storeId' => $this->store->id]);
    }

    private function createTheme(array $overrides = []): Theme
    {
        return Theme::create(array_merge([
            'store_id' => $this->store->id,
            'name' => 'Test Theme',
            'slug' => 'test-theme',
        ], $overrides));
    }

    /** @test */
    public function mounts_with_correct_store(): void
    {
        $this->actingAs($this->owner);

        $this->createComponent()
            ->assertStatus(200)
            ->assertSet('store.id', $this->store->id)
            ->assertSet('editingThemeId', null)
            ->assertSet('name', '');
    }

    /** @test */
    public function mounts_with_store_id_parameter(): void
    {
        $this->actingAs($this->owner);

        Livewire::test(Themes::class, ['storeId' => $this->store->id])
            ->assertSet('store.id', $this->store->id);
    }

    /** @test */
    public function can_create_theme_with_minimal_fields(): void
    {
        $this->actingAs($this->owner);

        $this->createComponent()
            ->set('name', 'Mon Thème')
            ->set('slug', 'mon-theme')
            ->call('createTheme')
            ->assertHasNoErrors()
            ->assertDispatched('notify', type: 'success');

        $this->assertDatabaseHas('themes', [
            'store_id' => $this->store->id,
            'name' => 'Mon Thème',
            'slug' => 'mon-theme',
            'food_card_style' => 'grid',
            'emoji' => '🎨',
        ]);
    }

    /** @test */
    public function can_create_theme_with_all_fields(): void
    {
        $this->actingAs($this->owner);

        $this->createComponent()
            ->set('name', 'Inferno Noir')
            ->set('slug', 'inferno-noir')
            ->set('description', 'Thème sombre')
            ->set('emoji', '🔥')
            ->set('foodCardStyle', 'bistro')
            ->set('sections', ['hero', 'menu', 'footer'])
            ->set('cssVars.--color-bg', '#000')
            ->set('cssVars.--color-primary', '#f59e0b')
            ->set('cssVars.--font-heading', "'Playfair Display', serif")
            ->call('createTheme')
            ->assertHasNoErrors();

        $theme = Theme::where('slug', 'inferno-noir')->first();
        $this->assertNotNull($theme);
        $this->assertEquals('🔥', $theme->emoji);
        $this->assertEquals('bistro', $theme->food_card_style);
        $this->assertEquals('#000', $theme->css_vars['--color-bg']);
    }

    /** @test */
    public function can_edit_and_update_theme(): void
    {
        $this->actingAs($this->owner);
        $theme = $this->createTheme();

        $this->createComponent()
            ->call('editTheme', $theme->id)
            ->assertSet('name', 'Test Theme')
            ->assertSet('slug', 'test-theme')
            ->assertSet('editingThemeId', $theme->id);

        $this->createComponent()
            ->call('editTheme', $theme->id)
            ->set('name', 'Updated Theme')
            ->set('description', 'Description mise à jour')
            ->set('foodCardStyle', 'horizontal')
            ->call('updateTheme')
            ->assertHasNoErrors()
            ->assertDispatched('notify', type: 'success');

        $theme->refresh();
        $this->assertEquals('Updated Theme', $theme->name);
        $this->assertEquals('Description mise à jour', $theme->description);
        $this->assertEquals('horizontal', $theme->food_card_style);
    }

    /** @test */
    public function can_delete_theme(): void
    {
        $this->actingAs($this->owner);
        $theme = $this->createTheme();

        $this->createComponent()
            ->call('deleteTheme', $theme->id)
            ->assertDispatched('notify', type: 'success');

        $this->assertDatabaseMissing('themes', ['id' => $theme->id]);
    }

    /** @test */
    public function deleting_active_theme_detaches_from_store(): void
    {
        $this->actingAs($this->owner);
        $theme = $this->createTheme();
        $this->store->update(['theme_id' => $theme->id]);

        $this->createComponent()
            ->call('deleteTheme', $theme->id);

        $this->store->refresh();
        $this->assertNull($this->store->theme_id);
    }

    /** @test */
    public function can_apply_theme_to_store(): void
    {
        $this->actingAs($this->owner);
        $theme = $this->createTheme();

        $this->createComponent()
            ->call('applyTheme', $theme->id)
            ->assertDispatched('notify', type: 'success');

        $this->store->refresh();
        $this->assertEquals($theme->id, $this->store->theme_id);
    }

    /** @test */
    public function applying_another_theme_replaces_previous(): void
    {
        $this->actingAs($this->owner);
        $theme1 = $this->createTheme(['name' => 'Theme 1', 'slug' => 'theme-1']);
        $theme2 = $this->createTheme(['name' => 'Theme 2', 'slug' => 'theme-2']);

        $component = $this->createComponent();
        $component->call('applyTheme', $theme1->id);
        $component->call('applyTheme', $theme2->id);

        $this->store->refresh();
        $this->assertEquals($theme2->id, $this->store->theme_id);
    }

    /** @test */
    public function resets_form_after_create(): void
    {
        $this->actingAs($this->owner);

        $this->createComponent()
            ->set('name', 'Temp')
            ->set('slug', 'temp')
            ->set('emoji', '🔥')
            ->call('createTheme')
            ->assertSet('name', '')
            ->assertSet('slug', '')
            ->assertSet('emoji', '🎨')
            ->assertSet('editingThemeId', null);
    }

    /** @test */
    public function resets_form_after_update(): void
    {
        $this->actingAs($this->owner);
        $theme = $this->createTheme();

        $this->createComponent()
            ->call('editTheme', $theme->id)
            ->set('name', 'Updated')
            ->call('updateTheme')
            ->assertSet('name', '')
            ->assertSet('editingThemeId', null);
    }

    /** @test */
    public function can_cancel_edit(): void
    {
        $this->actingAs($this->owner);
        $theme = $this->createTheme();

        $this->createComponent()
            ->call('editTheme', $theme->id)
            ->assertSet('editingThemeId', $theme->id)
            ->call('resetForm')
            ->assertSet('editingThemeId', null)
            ->assertSet('name', '');
    }

    /** @test */
    public function validation_fails_without_name(): void
    {
        $this->actingAs($this->owner);

        $this->createComponent()
            ->set('slug', 'no-name')
            ->call('createTheme')
            ->assertHasErrors(['name']);
    }

    /** @test */
    public function validation_fails_without_slug(): void
    {
        $this->actingAs($this->owner);

        $this->createComponent()
            ->set('name', 'No Slug')
            ->call('createTheme')
            ->assertHasErrors(['slug']);
    }

    /** @test */
    public function validation_fails_with_duplicate_slug(): void
    {
        $this->actingAs($this->owner);
        $this->createTheme(['name' => 'Existing', 'slug' => 'my-slug']);

        $this->createComponent()
            ->set('name', 'New')
            ->set('slug', 'my-slug')
            ->call('createTheme')
            ->assertHasErrors(['slug']);
    }

    /** @test */
    public function themes_are_scoped_to_store(): void
    {
        $this->actingAs($this->owner);

        $this->createTheme(['name' => 'Mine', 'slug' => 'mine']);

        $otherStore = Store::factory()->create([
            'owner_id' => User::factory()->create(['role' => 'owner'])->id,
        ]);
        Theme::create([
            'store_id' => $otherStore->id,
            'name' => 'Others',
            'slug' => 'others',
        ]);

        $component = $this->createComponent();
        $themes = $component->get('themes');

        $this->assertCount(1, $themes);
        $this->assertEquals('Mine', $themes->first()->name);
    }

    /** @test */
    public function theme_emoji_defaults_to_art_palette(): void
    {
        $this->actingAs($this->owner);

        $this->createComponent()
            ->set('name', 'Minimal')
            ->set('slug', 'minimal')
            ->call('createTheme');

        $this->assertDatabaseHas('themes', [
            'slug' => 'minimal',
            'emoji' => '🎨',
        ]);
    }
}
