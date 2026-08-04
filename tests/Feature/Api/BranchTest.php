<?php

namespace Tests\Feature\Api;

use App\Models\Store;
use App\Models\StoreBranch;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class BranchTest extends TestCase
{
    use RefreshDatabase;

    /** @var User */
    protected $owner;
    
    /** @var Store */
    protected $store;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create a store owner
        $this->owner = User::factory()->create();
        $this->store = Store::factory()->create(['owner_id' => $this->owner->id]);
        Sanctum::actingAs($this->owner, ['*']);
    }

    /** @test */
    public function it_can_create_a_branch()
    {
        $branchData = [
            'name' => 'Main Branch',
            'alias' => 'main-branch',
            'description' => 'The main branch of our store',
            'wilaya' => 'Algiers',
            'daira' => 'Casbah',
            'commune' => 'Casbah',
            'address' => '123 Main Street',
            'latitude' => 36.7528,
            'longitude' => 3.0566,
            'email' => 'main@branch.com',
            'phone' => '+213 12 34 56 78',
            'avg_prep_time' => 30,
            'delivery_zone_radius' => 5.5,
            'base_delivery_fee' => 250,
        ];

        $response = $this->postJson("/api/v1/stores/{$this->store->id}/branches", $branchData);
        
        $response->assertCreated();
        $response->assertJsonFragment([
            'name' => 'Main Branch',
            'alias' => 'main-branch',
            'description' => 'The main branch of our store',
            'wilaya' => 'Algiers',
            'daira' => 'Casbah',
            'commune' => 'Casbah',
            'address' => '123 Main Street',
            'latitude' => '36.7528000',
            'longitude' => '3.0566000',
            'email' => 'main@branch.com',
            'phone' => '+213 12 34 56 78',
            'avg_prep_time' => 30,
            'delivery_zone_radius' => '5.50',
            'base_delivery_fee' => 250,
        ]);

        $this->assertDatabaseHas('store_branches', [
            'store_id' => $this->store->id,
            'name' => 'Main Branch',
            'alias' => 'main-branch',
        ]);
    }

    /** @test */
    public function it_can_list_all_branches_for_a_store()
    {
        // Create multiple branches for the store
        StoreBranch::factory()->create(['store_id' => $this->store->id, 'name' => 'Branch 1']);
        StoreBranch::factory()->create(['store_id' => $this->store->id, 'name' => 'Branch 2']);

        $response = $this->getJson("/api/v1/owner/stores/{$this->store->id}/branches");
        
        $response->assertOk();
        $response->assertJsonCount(2, 'data');
    }

    /** @test */
    public function it_can_show_a_single_branch()
    {
        $branch = StoreBranch::factory()->create(['store_id' => $this->store->id]);

        $response = $this->getJson("/api/v1/owner/branches/{$branch->id}");
        
        $response->assertOk();
        $response->assertJsonFragment([
            'id' => $branch->id,
            'name' => $branch->name,
        ]);
    }

    /** @test */
    public function it_can_update_a_branch()
    {
        $branch = StoreBranch::factory()->create(['store_id' => $this->store->id]);

        $updateData = [
            'name' => 'Updated Branch Name',
            'description' => 'Updated description',
            'avg_prep_time' => 45,
            'delivery_zone_radius' => 7.2,
        ];

        $response = $this->putJson("/api/v1/branches/{$branch->id}", $updateData);
        
        $response->assertOk();
        $response->assertJsonFragment([
            'name' => 'Updated Branch Name',
            'description' => 'Updated description',
            'avg_prep_time' => 45,
            'delivery_zone_radius' => '7.20',
        ]);

        $this->assertDatabaseHas('store_branches', [
            'id' => $branch->id,
            'name' => 'Updated Branch Name',
            'description' => 'Updated description',
        ]);
    }

    /** @test */
    public function it_can_delete_a_branch()
    {
        // Create two branches to ensure we don't delete the only branch
        StoreBranch::factory()->create(['store_id' => $this->store->id, 'name' => 'Branch 1']);
        $branchToDelete = StoreBranch::factory()->create(['store_id' => $this->store->id, 'name' => 'Branch 2']);

        $response = $this->deleteJson("/api/v1/branches/{$branchToDelete->id}");
        
        $response->assertOk();
        $response->assertJsonFragment([
            'message' => 'Branch deleted successfully.'
        ]);

        $this->assertDatabaseMissing('store_branches', [
            'id' => $branchToDelete->id
        ]);
    }

    /** @test */
    public function it_cannot_delete_the_only_branch_of_a_store()
    {
        // Create only one branch for the store
        $onlyBranch = StoreBranch::factory()->create(['store_id' => $this->store->id]);

        $response = $this->deleteJson("/api/v1/branches/{$onlyBranch->id}");
        
        $response->assertUnprocessable();
        $response->assertJsonFragment([
            'message' => 'Cannot delete the only branch of this store.'
        ]);

        // Verify that the branch still exists
        $this->assertDatabaseHas('store_branches', [
            'id' => $onlyBranch->id
        ]);
    }

    /** @test */
    public function it_cannot_create_a_branch_with_duplicate_alias()
    {
        StoreBranch::factory()->create(['store_id' => $this->store->id, 'alias' => 'duplicate-alias']);

        $branchData = [
            'name' => 'Test Branch',
            'alias' => 'duplicate-alias', // Duplicate alias
            'description' => 'Test description',
        ];

        $response = $this->postJson("/api/v1/stores/{$this->store->id}/branches", $branchData);
        
        $response->assertUnprocessable();
        $response->assertJsonFragment([
            'message' => 'The alias has already been taken.'
        ]);
    }

    /** @test */
    public function it_cannot_update_a_branch_with_duplicate_alias()
    {
        StoreBranch::factory()->create(['store_id' => $this->store->id, 'alias' => 'existing-alias']);
        $branch = StoreBranch::factory()->create(['store_id' => $this->store->id, 'alias' => 'test-branch']);

        $updateData = [
            'alias' => 'existing-alias', // Duplicate alias
        ];

        $response = $this->putJson("/api/v1/branches/{$branch->id}", $updateData);
        
        $response->assertUnprocessable();
        $response->assertJsonFragment([
            'message' => 'The alias has already been taken.'
        ]);
    }

    /** @test */
    public function it_can_update_branch_template()
    {
        $branch = StoreBranch::factory()->create(['store_id' => $this->store->id]);

        $updateData = [
            'template_slug' => 'new-template',
            'theme_preset_id' => 1,
        ];

        $response = $this->putJson("/api/v1/branches/{$branch->id}/template", $updateData);
        
        $response->assertOk();
        $response->assertJsonFragment([
            'template_slug' => 'new-template',
            'theme_preset_id' => 1,
        ]);

        $this->assertDatabaseHas('store_branches', [
            'id' => $branch->id,
            'template_slug' => 'new-template',
            'theme_preset_id' => 1,
        ]);
    }

    /** @test */
    public function it_can_duplicate_template_settings_from_another_branch()
    {
        $sourceBranch = StoreBranch::factory()->create(['store_id' => $this->store->id, 'template_slug' => 'source-template', 'theme_preset_id' => 1]);
        $targetBranch = StoreBranch::factory()->create(['store_id' => $this->store->id]);

        $duplicateData = [
            'source_branch_id' => $sourceBranch->id
        ];

        $response = $this->postJson("/api/v1/branches/{$targetBranch->id}/duplicate-template", $duplicateData);
        
        $response->assertOk();
        $response->assertJsonFragment([
            'template_slug' => 'source-template',
            'theme_preset_id' => 1,
        ]);

        // Verify that the target branch has been updated
        $this->assertDatabaseHas('store_branches', [
            'id' => $targetBranch->id,
            'template_slug' => 'source-template',
            'theme_preset_id' => 1,
        ]);
    }

    /** @test */
    public function it_cannot_duplicate_template_from_same_branch()
    {
        $branch = StoreBranch::factory()->create(['store_id' => $this->store->id]);

        $duplicateData = [
            'source_branch_id' => $branch->id
        ];

        $response = $this->postJson("/api/v1/branches/{$branch->id}/duplicate-template", $duplicateData);
        
        $response->assertUnprocessable();
        $response->assertJsonFragment([
            'message' => 'Cannot duplicate template from the same branch.'
        ]);
    }
}