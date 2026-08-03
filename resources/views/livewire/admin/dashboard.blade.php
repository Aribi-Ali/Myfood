<div class="space-y-6 p-6">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-2xl font-bold tracking-tight text-[var(--text)]">Admin Dashboard</h1>
            <p class="text-sm text-[var(--text-muted)]">Platform executive metrics & system health overview</p>
        </div>
        <button class="btn-brand">
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            New Action
        </button>
    </div>

    <!-- Executive KPI Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="stat-card">
            <div>
                <p class="text-xs font-medium text-[var(--text-muted)]">Total Revenue</p>
                <p class="text-2xl font-bold text-[var(--text)] mt-1">$48,290</p>
            </div>
            <span class="badge-verified ml-auto">Resolved</span>
        </div>
        <div class="stat-card">
            <div>
                <p class="text-xs font-medium text-[var(--text-muted)]">Active Stores</p>
                <p class="text-2xl font-bold text-[var(--text)] mt-1">124</p>
            </div>
            <span class="badge-verified ml-auto">Active</span>
        </div>
        <div class="stat-card">
            <div>
                <p class="text-xs font-medium text-[var(--text-muted)]">Active Orders</p>
                <p class="text-2xl font-bold text-[var(--text)] mt-1">89</p>
            </div>
            <span class="section-label ml-auto">Live</span>
        </div>
    </div>

    <!-- Management Panel -->
    <div class="glass p-6">
        <h2 class="section-title mb-4">System Overview</h2>
        <p class="text-sm text-[var(--text-secondary)]">Page builder runtime environment loaded successfully.</p>
    </div>
</div>
