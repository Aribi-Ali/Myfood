<?php

namespace Tests\Feature\Api;

use App\Models\BranchTemplate;
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
    /** @var StoreBranch */
    protected $branch;
    /** @var Template */
    protected $sourceTemplate;

    protected function setUp(): void
    {
        parent::setUp();
        // Create a store owner with a branch and a template
        $this->owner = User::factory()->create();
        $this->branch = StoreBranch::factory()->create(['owner_id' => $this->owner->id]);
        $this->sourceTemplate = Template::factory()->create();
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

        $this->assertDatabaseHas('branch_templates', [
            'branch_id' => $this->branch->id,
            'template_id' => $this->sourceTemplate->id,
            'is_synced' => false,
        ]);
    }

    /** @test */
    public function it_can_toggle_sync_status_and_dispatch_job()
    {
        // First create a linked template (synced)
        $bt = BranchTemplate::factory()->create([
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
        $bt = BranchTemplate::factory()->create([
            'branch_id' => $this->branch->id,
            'template_id' => $this->sourceTemplate->id,
        ]);

        $response = $this->deleteJson('/api/v1/branches/' . $this->branch->id . '/template');
        $response->assertOk();
        $this->assertDatabaseMissing('branch_templates', ['id' => $bt->id]);
    }
}
