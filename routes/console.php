<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('subscriptions:process-renewals')->daily();
Schedule::command('subscriptions:apply-trial')->daily();
Schedule::command('subscriptions:check-tier-upgrades')->hourly();
Schedule::command('subscriptions:dunning')->daily();
Schedule::command('subscriptions:suspend-expired')->daily();
Schedule::command('delivery:reset-monthly-orders')->monthly();
Schedule::command('delivery:check-tier-upgrades')->daily();
Schedule::command('delivery:process-subscription-renewals')->daily();
