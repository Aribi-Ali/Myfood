<?php

namespace App\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class DashboardLayout extends Component
{
    public function __construct(
        public string $title = 'Dashboard',
        public string $role = 'admin',
        public array $navItems = [],
        public ?string $storeName = null,
        public ?string $storeRating = null,
        public bool $storeApproved = false,
        public ?string $storeAlias = null,
    ) {}

    public function render(): View|Closure|string
    {
        return view('components.dashboard-layout');
    }
}
