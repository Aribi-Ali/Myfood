<?php

namespace Tests\Feature\Api;

use App\Models\User;
use App\Models\Store;
use App\Models\ReservationSetting;
use App\Models\ReservationSchedule;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClientReservationTest extends TestCase
{
    use RefreshDatabase;

    private User $client;
    private Store $store;

    protected function setUp(): void
    {
        parent::setUp();

        $this->client = User::factory()->create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '0555123456',
        ]);
        $owner = User::factory()->create();
        $this->store = Store::factory()->create(['owner_id' => $owner->id]);
    }

    public function test_can_view_reservation_settings(): void
    {
        ReservationSetting::create([
            'store_id' => $this->store->id,
            'enabled' => true,
            'max_party_size' => 10,
        ]);
        ReservationSchedule::create([
            'store_id' => $this->store->id,
            'day_of_week' => now()->addDays(1)->dayOfWeek,
            'open_time' => '10:00',
            'close_time' => '22:00',
            'enabled' => true,
        ]);

        $response = $this->actingAs($this->client)->getJson("/api/v1/stores/{$this->store->alias}/reservations/settings");
        $response->assertStatus(200);
    }

    public function test_can_check_availability(): void
    {
        ReservationSetting::create([
            'store_id' => $this->store->id,
            'enabled' => true,
            'min_party_size' => 1,
            'max_party_size' => 10,
        ]);
        ReservationSchedule::create([
            'store_id' => $this->store->id,
            'day_of_week' => now()->addDays(1)->dayOfWeek,
            'open_time' => '10:00',
            'close_time' => '22:00',
            'enabled' => true,
        ]);

        $response = $this->actingAs($this->client)->postJson("/api/v1/stores/{$this->store->alias}/reservations/check", [
            'date' => now()->addDays(1)->toDateString(),
            'time' => '20:00',
            'guests' => 4,
        ]);
        $response->assertStatus(200);
    }

    public function test_can_create_reservation(): void
    {
        ReservationSetting::create([
            'store_id' => $this->store->id,
            'enabled' => true,
            'max_party_size' => 10,
            'auto_confirm' => true,
        ]);
        ReservationSchedule::create([
            'store_id' => $this->store->id,
            'day_of_week' => now()->addDays(2)->dayOfWeek,
            'open_time' => '10:00',
            'close_time' => '22:00',
            'enabled' => true,
        ]);

        $response = $this->actingAs($this->client)->postJson("/api/v1/stores/{$this->store->alias}/reservations", [
            'date' => now()->addDays(2)->toDateString(),
            'time' => '19:30',
            'party_size' => 4,
            'notes' => 'Anniversary dinner',
        ]);
        $response->assertStatus(201)->assertJsonStructure(['data' => ['id', 'status']]);
    }

    public function test_can_list_reservations(): void
    {
        $response = $this->actingAs($this->client)->getJson('/api/v1/client/reservations');
        $response->assertStatus(200)->assertJsonStructure(['data']);
    }

    public function test_unauthenticated_user_cannot_access_reservations(): void
    {
        $this->getJson('/api/v1/client/reservations')->assertStatus(401);
    }
}
