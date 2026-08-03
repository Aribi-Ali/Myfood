<?php

namespace Tests\Feature\Api;

use App\Models\Store;
use App\Models\StoreDomain;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class StoreDomainTest extends TestCase
{
    use RefreshDatabase;

    private User $owner;
    private Store $store;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->store = Store::factory()->create(['owner_id' => $this->owner->id]);
    }

    // ── Index ─────────────────────────────────────────────────────────────────

    public function test_can_list_domains(): void
    {
        StoreDomain::factory()->count(2)->create(['store_id' => $this->store->id]);

        $response = $this->actingAs($this->owner)->getJson('/api/v1/owner/domains');

        $response->assertStatus(200)
            ->assertJsonStructure(['data'])
            ->assertJsonCount(2, 'data');
    }

    // ── Store ─────────────────────────────────────────────────────────────────

    public function test_can_add_domain(): void
    {
        $response = $this->actingAs($this->owner)->postJson('/api/v1/owner/domains', [
            'domain' => 'mypizzeria.com',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['data' => ['id', 'domain', 'verification_code']])
            ->assertJsonPath('data.domain', 'mypizzeria.com')
            ->assertJsonPath('data.is_primary', true);

        $this->assertDatabaseHas('store_domains', [
            'store_id' => $this->store->id,
            'domain' => 'mypizzeria.com',
        ]);
    }

    public function test_first_domain_is_primary(): void
    {
        $this->actingAs($this->owner)->postJson('/api/v1/owner/domains', [
            'domain' => 'first.com',
        ]);

        $this->actingAs($this->owner)->postJson('/api/v1/owner/domains', [
            'domain' => 'second.com',
        ]);

        $domains = $this->store->domains()->orderBy('id')->get();
        $this->assertTrue($domains[0]->is_primary);
        $this->assertFalse($domains[1]->is_primary);
    }

    public function test_cannot_add_duplicate_domain(): void
    {
        StoreDomain::factory()->create(['domain' => 'existing.com']);

        $response = $this->actingAs($this->owner)->postJson('/api/v1/owner/domains', [
            'domain' => 'existing.com',
        ]);

        $response->assertStatus(422);
    }

    public function test_cannot_add_domain_without_store(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/v1/owner/domains', [
            'domain' => 'mypizzeria.com',
        ]);

        $response->assertStatus(403);
    }

    // ── Verify ────────────────────────────────────────────────────────────────

    public function test_can_verify_domain(): void
    {
        $domain = StoreDomain::factory()->create([
            'store_id' => $this->store->id,
            'verified_at' => null,
        ]);

        $response = $this->actingAs($this->owner)
            ->postJson("/api/v1/owner/domains/{$domain->id}/verify");

        $response->assertStatus(200);

        $this->assertDatabaseHas('store_domains', [
            'id' => $domain->id,
            'verified_at' => now(), // Within current second tolerance
        ]);
    }

    public function test_verify_already_verified(): void
    {
        $domain = StoreDomain::factory()->verified()->create([
            'store_id' => $this->store->id,
        ]);

        $response = $this->actingAs($this->owner)
            ->postJson("/api/v1/owner/domains/{$domain->id}/verify");

        $response->assertStatus(200)
            ->assertJsonPath('message', 'Domain already verified.');
    }

    public function test_cannot_verify_another_stores_domain(): void
    {
        $otherStore = Store::factory()->create();
        $domain = StoreDomain::factory()->create([
            'store_id' => $otherStore->id,
        ]);

        $response = $this->actingAs($this->owner)
            ->postJson("/api/v1/owner/domains/{$domain->id}/verify");

        $response->assertStatus(403);
    }

    // ── Set Primary ───────────────────────────────────────────────────────────

    public function test_can_set_primary_domain(): void
    {
        $primary = StoreDomain::factory()->primary()->create([
            'store_id' => $this->store->id,
        ]);
        $secondary = StoreDomain::factory()->verified()->create([
            'store_id' => $this->store->id,
        ]);

        $response = $this->actingAs($this->owner)
            ->postJson("/api/v1/owner/domains/{$secondary->id}/primary");

        $response->assertStatus(200);

        $this->assertFalse($primary->fresh()->is_primary);
        $this->assertTrue($secondary->fresh()->is_primary);
    }

    public function test_cannot_set_unverified_domain_as_primary(): void
    {
        $domain = StoreDomain::factory()->create([
            'store_id' => $this->store->id,
            'verified_at' => null,
        ]);

        $response = $this->actingAs($this->owner)
            ->postJson("/api/v1/owner/domains/{$domain->id}/primary");

        $response->assertStatus(422);
    }

    public function test_cannot_set_primary_for_another_store(): void
    {
        $otherStore = Store::factory()->create();
        $domain = StoreDomain::factory()->verified()->create([
            'store_id' => $otherStore->id,
        ]);

        $response = $this->actingAs($this->owner)
            ->postJson("/api/v1/owner/domains/{$domain->id}/primary");

        $response->assertStatus(403);
    }

    // ── Destroy ───────────────────────────────────────────────────────────────

    public function test_can_delete_domain(): void
    {
        $domain = StoreDomain::factory()->create([
            'store_id' => $this->store->id,
        ]);

        $response = $this->actingAs($this->owner)
            ->deleteJson("/api/v1/owner/domains/{$domain->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('store_domains', ['id' => $domain->id]);
    }

    public function test_cannot_delete_another_stores_domain(): void
    {
        $otherStore = Store::factory()->create();
        $domain = StoreDomain::factory()->create([
            'store_id' => $otherStore->id,
        ]);

        $response = $this->actingAs($this->owner)
            ->deleteJson("/api/v1/owner/domains/{$domain->id}");

        $response->assertStatus(403);
    }

    // ── Public Resolve ────────────────────────────────────────────────────────

    public function test_resolve_verified_domain(): void
    {
        $domain = StoreDomain::factory()->verified()->create([
            'store_id' => $this->store->id,
        ]);

        $response = $this->getJson('/api/v1/resolve-domain?domain=' . $domain->domain);

        $response->assertStatus(200)
            ->assertJsonPath('data.store.alias', $this->store->alias)
            ->assertJsonPath('data.store.name', $this->store->name);
    }

    public function test_resolve_caches_result(): void
    {
        $domain = StoreDomain::factory()->verified()->create([
            'store_id' => $this->store->id,
        ]);

        Cache::shouldReceive('remember')
            ->once()
            ->andReturn(
                StoreDomain::where('domain', $domain->domain)
                    ->whereNotNull('verified_at')
                    ->with('store')
                    ->first()
            );

        $response = $this->getJson('/api/v1/resolve-domain?domain=' . $domain->domain);
        $response->assertStatus(200);
    }

    public function test_resolve_unverified_domain_returns_404(): void
    {
        $domain = StoreDomain::factory()->create([
            'store_id' => $this->store->id,
            'verified_at' => null,
        ]);

        $response = $this->getJson('/api/v1/resolve-domain?domain=' . $domain->domain);

        $response->assertStatus(404);
    }

    public function test_resolve_nonexistent_domain_returns_404(): void
    {
        $response = $this->getJson('/api/v1/resolve-domain?domain=nonexistent.com');

        $response->assertStatus(404);
    }

    // ── Authentication ────────────────────────────────────────────────────────

    public function test_unauthenticated_user_cannot_access_owner_endpoints(): void
    {
        $this->getJson('/api/v1/owner/domains')->assertStatus(401);
        $this->postJson('/api/v1/owner/domains')->assertStatus(401);
    }

    public function test_owner_without_store_gets_403(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->getJson('/api/v1/owner/domains')->assertStatus(403);
    }
}
