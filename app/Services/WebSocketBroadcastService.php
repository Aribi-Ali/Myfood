<?php

declare(strict_types=1);

namespace App\Services;

use App\Events\ChefFired;
use App\Events\ChefHired;
use App\Events\ChefInvitation;
use App\Events\DeliveryAssigned;
use App\Events\DeliveryCompleted;
use App\Events\KitchenOrderAdded;
use App\Events\KitchenOrderCompleted;
use App\Events\KitchenOrderStarted;
use App\Events\OrderReadyForDelivery;
use App\Events\RiderLocationUpdated;
use App\Models\ChefProfile;
use App\Models\ChefStoreHire;
use App\Models\Order;
use App\Models\Store;

class WebSocketBroadcastService
{
    public function kitchenOrderAdded(Order $order): void
    {
        KitchenOrderAdded::dispatch($order);
    }

    public function kitchenOrderStarted(Order $order): void
    {
        KitchenOrderStarted::dispatch($order);
    }

    public function kitchenOrderCompleted(Order $order): void
    {
        KitchenOrderCompleted::dispatch($order);
    }

    public function deliveryAssigned(Order $order): void
    {
        DeliveryAssigned::dispatch($order);
    }

    public function orderReadyForDelivery(Order $order): void
    {
        OrderReadyForDelivery::dispatch($order);
    }

    public function riderLocationUpdated(Order $order, float $latitude, float $longitude): void
    {
        RiderLocationUpdated::dispatch($order, $latitude, $longitude);
    }

    public function deliveryCompleted(Order $order): void
    {
        DeliveryCompleted::dispatch($order);
    }

    public function chefHired(ChefStoreHire $hire): void
    {
        ChefHired::dispatch($hire);
    }

    public function chefFired(ChefStoreHire $hire): void
    {
        ChefFired::dispatch($hire);
    }

    public function chefInvitation(ChefProfile $chef, Store $store): void
    {
        ChefInvitation::dispatch($chef, $store);
    }
}
