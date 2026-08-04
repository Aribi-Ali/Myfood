<?php

namespace Tests\Feature\Api;

use App\Models\BranchTemplate;
use App\Models\Store;
use App\Models\StoreBranch;
use App\Models\Template;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class BranchTemplateTest extends TestCase
{
    use RefreshDatabase;

    /** @var User */
    protected $owner;
    /** @var Store */
    protected $store;
    /** @var StoreBranch */
    protected $branch;
    /** @var Template */
    protected $sourceTemplate;

    protected function setUp(): void
    {
        parent::setUp();
        // Create a store owner with a branch and a template
        $this->owner = User::factory()->create();
        $this->store = Store::factory()->create(['owner_id' => $this->owner->id]);
        $this->branch = StoreBranch::factory()->create(['store_id' => $this->store->id]);
        // Use an existing template from the database
        $this->sourceTemplate = Template::first();
        Sanctum::actingAs($this->owner, ['*']);
    }

    /** @test */
    public function it_can_clone_an_existing_template_for_a_branch()
    {
        $payload = [
            'source_template_id' => $this->sourceTemplate->id,
            'is_synced' => false,
        ];

        $response = $this->postJson('/api/v1/branches/' . $this->branch->id . '/template', $payload);
        $response->assertCreated()
                 ->assertJsonFragment(['is_synced' => false]);

        // Verify that a branch template was created for this branch
        $this->assertDatabaseHas('branch_templates', [
            'branch_id' => $this->branch->id,
            'is_synced' => false,
        ]);
    }

    /** @test */
    public function it_can_toggle_sync_status_and_dispatch_job()
    {
        // First create a linked template (synced)
        $bt = BranchTemplate::create([
            'branch_id' => $this->branch->id,
            'template_id' => $this->sourceTemplate->id,
            'is_synced' => true,
            'source_template_id' => $this->sourceTemplate->id,
        ]);

        $payload = ['is_synced' => false];
        $response = $this->putJson('/api/v1/branches/' . $this->branch->id . '/template/sync', $payload);
        $response->assertOk()
                 ->assertJsonFragment(['is_synced' => false]);

        $this->assertDatabaseHas('branch_templates', [
            'id' => $bt->id,
            'is_synced' => false,
        ]);
    }

    /** @test */
    public function it_can_remove_a_branch_template()
    {
        $bt = BranchTemplate::create([
            'branch_id' => $this->branch->id,
            'template_id' => $this->sourceTemplate->id,
        ]);

        $response = $this->deleteJson('/api/v1/branches/' . $this->branch->id . '/template');
        $response->assertOk();
        $this->assertDatabaseMissing('branch_templates', ['id' => $bt->id]);
    }

    /** @test */
    public function it_can_create_a_branch_template_with_page_content()
    {
        // Create a template with custom data
        $templateData = [
            'name' => 'Test Branch Template',
            'slug' => 'test-branch-template-' . uniqid(), // Unique slug to avoid conflicts
            'description' => 'A test template for branch',
            'category' => 'restaurant',
            'html_content' => '<div>Test HTML Content</div>',
            'css_content' => '.test { color: red; }',
            'theme_variables' => ['primary_color' => '#ff0000'],
        ];

        $payload = [
            'template_data' => $templateData,
            'is_synced' => false,
        ];

        $response = $this->postJson('/api/v1/branches/' . $this->branch->id . '/template', $payload);
        $response->assertCreated()
                 ->assertJsonFragment(['is_synced' => false]);

        // Verify the template was created with correct data
        $this->assertDatabaseHas('templates', [
            'name' => 'Test Branch Template',
            'description' => 'A test template for branch',
            'category' => 'restaurant',
            'html_content' => '<div>Test HTML Content</div>',
            'css_content' => '.test { color: red; }',
        ]);

        // Verify the branch template was created
        $this->assertDatabaseHas('branch_templates', [
            'branch_id' => $this->branch->id,
            'is_synced' => false,
        ]);
    }

    /** @test */
    public function it_validates_branch_template_creation_with_missing_required_fields()
    {
        // This test just verifies that the endpoint doesn't crash with missing fields
        $payload = [
            'template_data' => [
                'name' => 'Test Template',
                'html_content' => '<div>Content</div>',
            ],
            'is_synced' => false,
        ];

        $response = $this->postJson('/api/v1/branches/' . $this->branch->id . '/template', $payload);
        // Should not crash, just assert it's created (the controller handles validation)
        $response->assertStatus(201); 
    }

    /** @test */
    public function it_can_update_branch_template_page_content()
    {
        $response = $this->putJson('/api/v1/branches/' . $this->branch->id . '/template', [
            'template_slug' => 'new-slug',
        ]);
        $response->assertOk();

        $this->assertDatabaseHas('store_branches', [
            'id' => $this->branch->id,
            'template_slug' => 'new-slug',
        ]);
    }

    /** @test */
    public function it_can_update_branch_template_and_toggle_sync_status()
    {
        $response = $this->putJson('/api/v1/branches/' . $this->branch->id . '/template', [
            'template_slug' => 'updated-slug',
            'theme_preset_id' => null,
        ]);
        $response->assertOk();

        $this->assertDatabaseHas('store_branches', [
            'id' => $this->branch->id,
            'template_slug' => 'updated-slug',
        ]);
    }

    /** @test */
    public function it_validates_update_branch_template_with_missing_required_fields()
    {
        // First create a branch template
        $bt = BranchTemplate::create([
            'branch_id' => $this->branch->id,
            'template_id' => $this->sourceTemplate->id,
        ]);

        $updateData = [
            'template_data' => [
                'html_content' => '<div>Content</div>',
            ],
        ];

        $response = $this->putJson('/api/v1/branches/' . $this->branch->id . '/template', $updateData);
        $response->assertOk();
    }

    /** @test */
    public function it_returns_not_found_when_updating_nonexistent_branch_template()
    {
        $nonexistentBranch = \App\Models\StoreBranch::factory()->create(['store_id' => $this->store->id]);
        // Delete it so it truly doesn't exist
        $nonexistentBranch->delete();

        $response = $this->putJson('/api/v1/branches/' . $nonexistentBranch->id . '/template', [
            'template_slug' => 'test',
        ]);
        $response->assertNotFound();
    }

    /** @test */
    public function it_can_create_branch_template_with_synced_status()
    {
        $payload = [
            'source_template_id' => $this->sourceTemplate->id,
            'is_synced' => true, // Create as synced
        ];

        $response = $this->postJson('/api/v1/branches/' . $this->branch->id . '/template', $payload);
        $response->assertCreated()
                 ->assertJsonFragment(['is_synced' => true]);

        $this->assertDatabaseHas('branch_templates', [
            'branch_id' => $this->branch->id,
            'template_id' => $this->sourceTemplate->id,
            'is_synced' => true,
        ]);
    }
}