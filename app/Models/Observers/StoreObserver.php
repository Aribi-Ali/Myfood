<?php

declare(strict_types=1);

namespace App\Models\Observers;

use App\Models\Store;
use Illuminate\Support\Facades\Cache;

class StoreObserver
{
    public function updated(Store $store): void
    {
        Cache::forget('store:alias_' . $store->alias);
        Cache::forget('store:id_' . $store->id);

        // If alias changed, also bust old alias cache
        if ($store->wasChanged('alias') && $store->getOriginal('alias')) {
            Cache::forget('store:alias_' . $store->getOriginal('alias'));
        }

        // Bust general stores list
        Cache::forget('stores_list');
        Cache::forget('stores:approved');
    }

    public function created(Store $store): void
    {
        Cache::forget('stores_list');
        Cache::forget('stores:approved');
    }

    public function deleted(Store $store): void
    {
        Cache::forget('store:alias_' . $store->alias);
        Cache::forget('store:id_' . $store->id);
        Cache::forget('stores_list');
        Cache::forget('stores:approved');
    }
}
