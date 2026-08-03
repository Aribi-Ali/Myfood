<?php

namespace Tests\Feature;

use App\Livewire\Owner\OrderManager;
use App\Models\Order;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

class OrderManagerTest extends TestCase
{
    use RefreshDatabase;

    protected User $owner;
    protected Store $store;
    protected User $rider;
    protected User $client;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create(['role' => 'owner']);
        $this->store = Store::factory()->create(['owner_id' => $this->owner->id]);
        $this->rider = User::factory()->create(['role' => 'delivery', 'name' => 'Test Rider']);
        $this->client = User::factory()->create(['role' => 'client']);
    }

    private function createComponent()
    {
        return Livewire::test(OrderManager::class, ['storeId' => $this->store->id]);
    }

    private function createOrder(array $overrides = []): Order
    {
        return Order::factory()->create(array_merge([
            'store_id' => $this->store->id,
            'address' => '123 Test St',
            'phone' => '0555000000',
        ], $overrides));
    }

    // ── Mount / Init ──────────────────────────────────────────────

    public function test_mounts_with_correct_properties(): void
    {
        $this->actingAs($this->owner);

        $this->createComponent()
            ->assertStatus(200)
            ->assertSet('storeId', $this->store->id)
            ->assertSet('selectedOrderIds', [])
            ->assertSet('showRiderModal', false)
            ->assertSet('selectedOrderId', null);
    }

    public function test_mount_loads_riders(): void
    {
        User::factory(3)->create(['role' => 'delivery']);
        $this->actingAs($this->owner);

        $c = $this->createComponent();

        $this->assertCount(4, $c->get('riders'));
        $this->assertFalse($c->get('hasMoreRiders'));
    }

    public function test_mount_loads_favorite_rider_ids(): void
    {
        $this->owner->favoriteRiders()->attach($this->rider->id);
        $this->actingAs($this->owner);

        $this->createComponent()
            ->assertSet('favoriteRiderIds', [$this->rider->id]);
    }

    // ── Order listing & filtering ─────────────────────────────────

    public function test_orders_are_scoped_to_store(): void
    {
        $this->createOrder();
        Order::factory()->create([
            'store_id' => Store::factory()->create()->id,
            'address' => '456 Oak Ave',
            'phone' => '0555000002',
        ]);

        $this->actingAs($this->owner);

        $this->createComponent()->assertCount('orders', 1);
    }

    public function test_order_status_filter(): void
    {
        $this->createOrder(['status' => 'pending']);
        $this->createOrder(['status' => 'delivered']);

        $this->actingAs($this->owner);

        $c = $this->createComponent();
        $c->assertCount('orders', 2);
        $c->set('orderStatusFilter', 'delivered');
        $c->assertCount('orders', 1);
    }

    // ── Single-order status update ────────────────────────────────

    public function test_update_order_status(): void
    {
        $order = $this->createOrder(['status' => 'pending']);
        $this->actingAs($this->owner);

        $this->createComponent()
            ->call('updateOrderStatus', $order->id, 'confirmed')
            ->assertDispatched('order-updated', orderId: $order->id, status: 'confirmed');

        $this->assertDatabaseHas('orders', ['id' => $order->id, 'status' => 'confirmed']);
    }

    public function test_update_order_status_ignores_invalid_status(): void
    {
        $order = $this->createOrder(['status' => 'pending']);
        $this->actingAs($this->owner);

        $this->createComponent()->call('updateOrderStatus', $order->id, 'invalid');

        $this->assertDatabaseHas('orders', ['id' => $order->id, 'status' => 'pending']);
    }

    public function test_update_order_status_nonexistent_order_does_not_crash(): void
    {
        $this->actingAs($this->owner);

        $this->createComponent()
            ->call('updateOrderStatus', 99999, 'confirmed')
            ->assertHasNoErrors();
    }

    // ── Single-order assign delivery ──────────────────────────────

    public function test_assign_delivery_transitions_ready_to_delivering(): void
    {
        $order = $this->createOrder(['status' => 'ready']);
        $this->actingAs($this->owner);

        $this->createComponent()->call('assignDelivery', $order->id, $this->rider->id);

        $this->assertDatabaseHas('orders', [
            'id' => $order->id, 'delivery_id' => $this->rider->id, 'status' => 'delivering',
        ]);
    }

    public function test_assign_delivery_keeps_non_ready_status(): void
    {
        $order = $this->createOrder(['status' => 'confirmed']);
        $this->actingAs($this->owner);

        $this->createComponent()->call('assignDelivery', $order->id, $this->rider->id);

        $this->assertDatabaseHas('orders', [
            'id' => $order->id, 'delivery_id' => $this->rider->id, 'status' => 'confirmed',
        ]);
    }

    // ── Rider modal ───────────────────────────────────────────────

    public function test_open_rider_modal(): void
    {
        $order = $this->createOrder();
        $this->actingAs($this->owner);

        $c = $this->createComponent();
        $oldRiders = $c->get('riders');

        $c->call('openRiderModal', $order->id)
            ->assertSet('selectedOrderId', $order->id)
            ->assertSet('showRiderModal', true);

        // Riders reloaded (reset then loaded)
        $this->assertNotEmpty($c->get('riders'));
    }

    public function test_open_bulk_rider_modal(): void
    {
        $this->actingAs($this->owner);

        $this->createComponent()
            ->call('openBulkRiderModal')
            ->assertSet('selectedOrderId', null)
            ->assertSet('showRiderModal', true);
    }

    public function test_close_rider_modal(): void
    {
        $this->actingAs($this->owner);

        $this->createComponent()
            ->call('openBulkRiderModal')
            ->call('closeRiderModal')
            ->assertSet('selectedOrderId', null)
            ->assertSet('showRiderModal', false);
    }

    // ── Rider cursor pagination ───────────────────────────────────

    public function test_load_more_riders(): void
    {
        User::factory(25)->create(['role' => 'delivery']);
        $this->actingAs($this->owner);

        $c = $this->createComponent();

        // 20 loaded from batch, hasMoreRiders should be true
        $this->assertCount(20, $c->get('riders'));
        $this->assertTrue($c->get('hasMoreRiders'));

        $c->call('loadMoreRiders');

        $this->assertCount(26, $c->get('riders'));
        $this->assertFalse($c->get('hasMoreRiders'));
    }

    // ── Favorite riders ───────────────────────────────────────────

    public function test_toggle_favorite_rider_adds_and_removes(): void
    {
        $this->actingAs($this->owner);

        $c = $this->createComponent();
        $c->assertSet('favoriteRiderIds', []);

        // Add
        $c->call('toggleFavoriteRider', $this->rider->id)
            ->assertSet('favoriteRiderIds', [$this->rider->id]);
        $this->assertDatabaseHas('favorite_deliveries', [
            'owner_id' => $this->owner->id, 'delivery_user_id' => $this->rider->id,
        ]);

        // Remove
        $c->call('toggleFavoriteRider', $this->rider->id)
            ->assertSet('favoriteRiderIds', []);
        $this->assertDatabaseMissing('favorite_deliveries', [
            'owner_id' => $this->owner->id, 'delivery_user_id' => $this->rider->id,
        ]);
    }

    public function test_add_and_remove_favorite_rider_methods(): void
    {
        $this->actingAs($this->owner);

        $c = $this->createComponent();

        $c->call('addFavoriteRider', $this->rider->id)
            ->assertSet('favoriteRiderIds', [$this->rider->id]);

        $c->call('removeFavoriteRider', $this->rider->id)
            ->assertSet('favoriteRiderIds', []);
    }

    // ── Order selection ───────────────────────────────────────────

    public function test_toggle_order_selection(): void
    {
        $o1 = $this->createOrder();
        $o2 = $this->createOrder();
        $this->actingAs($this->owner);

        $c = $this->createComponent();

        $c->call('toggleOrderSelection', $o1->id)
            ->assertSet('selectedOrderIds', [$o1->id]);

        $c->call('toggleOrderSelection', $o2->id);
        $this->assertEquals([$o1->id, $o2->id], $c->get('selectedOrderIds'));

        $c->call('toggleOrderSelection', $o1->id)
            ->assertSet('selectedOrderIds', [$o2->id]);
    }

    public function test_select_all_toggles_all_visible_orders(): void
    {
        $orders = [];
        for ($i = 0; $i < 3; $i++) {
            $orders[] = $this->createOrder();
        }
        $ids = collect($orders)->pluck('id')->toArray();
        $this->actingAs($this->owner);

        $c = $this->createComponent();

        // Select all
        $c->call('toggleSelectAll');
        $selected = $c->get('selectedOrderIds');
        sort($selected);
        sort($ids);
        $this->assertEquals($ids, $selected);

        // Deselect all
        $c->call('toggleSelectAll')
            ->assertSet('selectedOrderIds', []);
    }

    // ── Bulk actions ──────────────────────────────────────────────

    public function test_bulk_update_status(): void
    {
        $orders = [];
        for ($i = 0; $i < 3; $i++) {
            $orders[] = $this->createOrder(['status' => 'pending']);
        }
        $this->actingAs($this->owner);

        $c = $this->createComponent();
        foreach ($orders as $o) {
            $c->call('toggleOrderSelection', $o->id);
        }

        $c->call('bulkUpdateStatus', 'confirmed')
            ->assertSet('selectedOrderIds', []);

        foreach ($orders as $o) {
            $this->assertDatabaseHas('orders', ['id' => $o->id, 'status' => 'confirmed']);
        }
    }

    public function test_bulk_assign_delivery(): void
    {
        $orders = [];
        for ($i = 0; $i < 2; $i++) {
            $orders[] = $this->createOrder(['status' => 'ready']);
        }
        $this->actingAs($this->owner);

        $c = $this->createComponent();
        foreach ($orders as $o) {
            $c->call('toggleOrderSelection', $o->id);
        }

        $c->call('bulkAssignDelivery', $this->rider->id)
            ->assertSet('showRiderModal', false)
            ->assertSet('selectedOrderIds', []);

        foreach ($orders as $o) {
            $this->assertDatabaseHas('orders', [
                'id' => $o->id, 'delivery_id' => $this->rider->id, 'status' => 'delivering',
            ]);
        }
    }

    public function test_bulk_delete(): void
    {
        $orders = [];
        for ($i = 0; $i < 2; $i++) {
            $orders[] = $this->createOrder();
        }
        $this->actingAs($this->owner);

        $c = $this->createComponent();
        foreach ($orders as $o) {
            $c->call('toggleOrderSelection', $o->id);
        }

        $c->call('bulkDelete')
            ->assertSet('selectedOrderIds', []);

        foreach ($orders as $o) {
            $this->assertDatabaseMissing('orders', ['id' => $o->id]);
        }
    }

    public function test_bulk_actions_with_empty_selection_do_not_error(): void
    {
        $this->actingAs($this->owner);

        $this->createComponent()
            ->call('bulkUpdateStatus', 'delivered')
            ->call('bulkAssignDelivery', $this->rider->id)
            ->call('bulkDelete')
            ->assertHasNoErrors();
    }
}
