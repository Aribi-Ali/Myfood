<?php

use App\Models\Store;
use App\Models\StoreStaff;
use App\Models\DeliveryProfile;
use Illuminate\Support\Facades\Broadcast;

// Store owner/staff channel: orders for a specific store
Broadcast::channel('orders.store.{storeId}', function ($user, int $storeId) {
    // Owner of this store
    if ($user->isOwner() && $user->store?->id === $storeId) {
        return ['id' => $user->id, 'name' => $user->name, 'role' => 'owner'];
    }

    // Admin can see all stores
    if ($user->isAdmin()) {
        return ['id' => $user->id, 'name' => $user->name, 'role' => 'admin'];
    }

    // KDS / kitchen staff assigned to this store
    $staff = StoreStaff::where('user_id', $user->id)
        ->where('store_id', $storeId)
        ->whereIn('store_role', ['kds', 'cook', 'chef', 'manager'])
        ->first();

    if ($staff) {
        return ['id' => $user->id, 'name' => $user->name, 'role' => $staff->store_role];
    }

    return false;
}, ['guards' => ['sanctum']]);

// Client channel: their own orders
Broadcast::channel('orders.client.{clientId}', function ($user, int $clientId) {
    return (int) $user->id === (int) $clientId
        ? ['id' => $user->id, 'name' => $user->name, 'role' => 'client']
        : false;
}, ['guards' => ['sanctum']]);

// ── New Channels ──────────────────────────────────────────────────────────────

// KDS (Kitchen Display System) — assigned kitchen staff can view store orders
Broadcast::channel('private-kds.{storeId}', function ($user, int $storeId) {
    // Owner of this store
    if ($user->isOwner() && $user->store?->id === $storeId) {
        return ['id' => $user->id, 'name' => $user->name, 'role' => 'owner'];
    }

    // Admin
    if ($user->isAdmin()) {
        return ['id' => $user->id, 'name' => $user->name, 'role' => 'admin'];
    }

    // Kitchen staff (kds, cook, chef) assigned to this store
    $staff = StoreStaff::where('user_id', $user->id)
        ->where('store_id', $storeId)
        ->whereIn('store_role', ['kds', 'cook', 'chef'])
        ->first();

    if ($staff) {
        return ['id' => $user->id, 'name' => $user->name, 'role' => $staff->store_role];
    }

    return false;
}, ['guards' => ['sanctum']]);

// Private delivery person channel: per-user delivery assignments
Broadcast::channel('private-delivery.{userId}', function ($user, int $userId) {
    return (int) $user->id === (int) $userId && $user->isDelivery()
        ? ['id' => $user->id, 'name' => $user->name, 'role' => 'delivery']
        : false;
}, ['guards' => ['sanctum']]);

// Presence delivery channel: available riders in a wilaya (zone)
Broadcast::channel('presence-delivery.{wilaya}', function ($user, string $wilaya) {
    if (!$user->isDelivery()) {
        return false;
    }

    $profile = DeliveryProfile::where('user_id', $user->id)->first();
    if (!$profile || !$profile->is_working) {
        return false;
    }

    return [
        'id' => $user->id,
        'name' => $user->name,
        'role' => 'delivery',
        'is_working' => $profile->is_working,
    ];
}, ['guards' => ['sanctum']]);

// Private chef channel: per-chef hiring/notification events
Broadcast::channel('private-chef.{chefId}', function ($user, int $chefId) {
    return (int) $user->id === (int) $chefId && $user->isChef()
        ? ['id' => $user->id, 'name' => $user->name, 'role' => 'chef']
        : false;
}, ['guards' => ['sanctum']]);

// Presence channel: admin sees online store owners
Broadcast::channel('presence-store-owners', function ($user) {
    if ($user->isAdmin()) {
        return ['id' => $user->id, 'name' => $user->name, 'role' => 'admin'];
    }

    if ($user->isOwner()) {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'role' => 'owner',
            'store_id' => $user->store?->id,
            'store_name' => $user->store?->name,
        ];
    }

    return false;
}, ['guards' => ['sanctum']]);
