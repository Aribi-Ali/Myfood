<?php

namespace Tests\Feature;

use Livewire\Livewire;
use Tests\TestCase;
use App\Livewire\Admin\Dashboard;

class PageBuilderTest extends TestCase
{
    public function test_admin_dashboard_renders_and_contains_title(): void
    {
        Livewire::test(Dashboard::class)
            ->assertStatus(200)
            ->assertSee('Admin Dashboard');
    }
}
