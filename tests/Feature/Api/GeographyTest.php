<?php

namespace Tests\Feature\Api;

use App\Models\Wilaya;
use App\Models\Daira;
use App\Models\Commune;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GeographyTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_wilayas(): void
    {
        Wilaya::factory()->count(3)->create();

        $response = $this->getJson('/api/v1/geo/wilayas');

        $response->assertStatus(200);
        $response->assertJsonCount(3, 'data');
    }

    public function test_can_list_dairas_for_wilaya(): void
    {
        $wilaya = Wilaya::factory()->create();
        Daira::factory()->count(2)->create(['wilaya_id' => $wilaya->id]);

        $response = $this->getJson("/api/v1/geo/wilayas/{$wilaya->id}/dairas");

        $response->assertStatus(200);
        $response->assertJsonCount(2, 'data');
    }

    public function test_can_list_communes_for_daira(): void
    {
        $wilaya = Wilaya::factory()->create();
        $daira = Daira::factory()->create(['wilaya_id' => $wilaya->id]);
        Commune::factory()->count(3)->create(['daira_id' => $daira->id, 'wilaya_id' => $wilaya->id]);

        $response = $this->getJson("/api/v1/geo/dairas/{$daira->id}/communes");

        $response->assertStatus(200);
        $response->assertJsonCount(3, 'data');
    }

    public function test_endpoints_are_public(): void
    {
        $response = $this->getJson('/api/v1/geo/wilayas');

        $response->assertStatus(200);
    }
}
