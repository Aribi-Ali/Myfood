<?php

declare(strict_types=1);

namespace App\Models\Observers;

use App\Models\Food;
use Illuminate\Support\Facades\Cache;

class FoodObserver
{
    public function created(Food $food): void
    {
        $this->bustStoreFoodsCache($food->store_id);
    }

    public function updated(Food $food): void
    {
        Cache::forget('food:' . $food->id);
        $this->bustStoreFoodsCache($food->store_id);

        // If store_id changed (unlikely but defensive)
        if ($food->wasChanged('store_id') && $food->getOriginal('store_id')) {
            $this->bustStoreFoodsCache($food->getOriginal('store_id'));
        }
    }

    public function deleted(Food $food): void
    {
        Cache::forget('food:' . $food->id);
        $this->bustStoreFoodsCache($food->store_id);
    }

    private function bustStoreFoodsCache(int $storeId): void
    {
        Cache::forget('store_foods_' . $storeId);
    }
}
