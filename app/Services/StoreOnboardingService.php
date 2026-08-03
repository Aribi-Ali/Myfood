<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Store;
use App\Models\StorePhone;
use App\Models\StoreSocialLink;
use Illuminate\Support\Facades\DB;

class StoreOnboardingService
{
    /**
     * Step 1: Save basic contact and description information.
     */
    public function saveBasicInfo(Store $store, array $data): Store
    {
        $update = [];

        if (isset($data['name'])) {
            $update['name'] = $data['name'];
        }
        if (isset($data['alias'])) {
            $update['alias'] = \Illuminate\Support\Str::slug($data['alias']);
        }
        if (isset($data['description'])) {
            $update['description'] = $data['description'];
        }
        if (isset($data['phone'])) {
            $update['phone'] = $data['phone'];
        }
        if (isset($data['phones']) && is_array($data['phones'])) {
            $this->syncPhones($store, $data['phones']);
        }
        if (isset($data['email'])) {
            $update['email'] = $data['email'];
        }
        if (isset($data['address'])) {
            $update['address'] = $data['address'];
        }
        if (isset($data['wilaya'])) {
            $update['wilaya'] = $data['wilaya'];
        }
        if (isset($data['daira'])) {
            $update['daira'] = $data['daira'];
        }
        if (isset($data['commune'])) {
            $update['commune'] = $data['commune'];
        }

        if (!empty($update)) {
            $store->update($update);
        }

        return $store;
    }

    /**
     * Step 2: Save store types/categories.
     */
    public function saveStoreTypes(Store $store, array $typeIds): Store
    {
        $store->typeCategories()->sync($typeIds);

        return $store;
    }

    /**
     * Step 3: Save geographic location coordinates.
     */
    public function saveLocation(Store $store, array $data): Store
    {
        $store->update([
            'latitude'  => isset($data['latitude']) ? (float)$data['latitude'] : $store->latitude,
            'longitude' => isset($data['longitude']) ? (float)$data['longitude'] : $store->longitude,
            'address'   => $data['address'] ?? $store->address,
            'wilaya'    => $data['wilaya'] ?? $store->wilaya,
            'daira'     => $data['daira'] ?? $store->daira,
            'commune'   => $data['commune'] ?? $store->commune,
        ]);

        return $store;
    }

    /**
     * Step 4: Save store social links.
     */
    public function saveSocialLinks(Store $store, array $links): Store
    {
        DB::transaction(function () use ($store, $links) {
            // Remove old links
            $store->socialLinks()->delete();

            // Add new links
            foreach ($links as $link) {
                if (!empty($link['platform']) && !empty($link['url'])) {
                    StoreSocialLink::create([
                        'store_id' => $store->id,
                        'platform' => $link['platform'],
                        'url'      => $link['url'],
                        'label'    => $link['label'] ?? null,
                    ]);
                }
            }
        });

        return $store;
    }

    /**
     * Step 5: Save break and availability settings.
     */
    public function saveBreakSettings(Store $store, array $data): Store
    {
        $store->update([
            'is_active'   => isset($data['is_active']) ? (bool)$data['is_active'] : $store->is_active,
            'break_start' => !empty($data['break_start']) ? $data['break_start'] : null,
            'break_end'   => !empty($data['break_end']) ? $data['break_end'] : null,
            'break_note'  => $data['break_note'] ?? null,
        ]);

        return $store;
    }

    /**
     * Validate that all required onboarding fields are filled.
     *
     * @return array<string, string> Associative array of field => error message. Empty if valid.
     */
    public function validateRequiredData(Store $store): array
    {
        $missing = [];

        $store->loadMissing(['typeCategories', 'phones']);

        // Step 1: Basic info
        if (empty($store->name)) {
            $missing['name'] = 'Store name is required.';
        }
        if (empty($store->alias)) {
            $missing['alias'] = 'Store alias is required.';
        }
        if ($store->phones->isEmpty()) {
            $missing['phones'] = 'At least one phone number is required.';
        }
        if (empty($store->email)) {
            $missing['email'] = 'Email is required.';
        }
        if (empty($store->address)) {
            $missing['address'] = 'Address is required.';
        }

        // Step 2: Store type categories
        if ($store->typeCategories->isEmpty()) {
            $missing['type_categories'] = 'At least one store type category is required.';
        }

        // Step 3: Location
        if (empty($store->latitude) || empty($store->longitude)) {
            $missing['location'] = 'Location coordinates (latitude/longitude) are required.';
        }

        return $missing;
    }

    /**
     * Step 6: Complete onboarding.
     *
     * @throws \InvalidArgumentException If required data is missing.
     */
    public function completeOnboarding(Store $store): Store
    {
        $missing = $this->validateRequiredData($store);
        if (!empty($missing)) {
            $fields = implode(', ', array_keys($missing));
            throw new \InvalidArgumentException(
                'Cannot complete onboarding. Missing required fields: ' . $fields
            );
        }

        $store->update([
            'onboarding_status' => 'completed',
            'is_active'         => true,
            'ordering_enabled'  => true,
        ]);

        return $store;
    }

    public function getCurrentStep(Store $store): int
    {
        $store->loadMissing(['typeCategories', 'phones']);

        // Step 1: basic info
        if (empty($store->name) || empty($store->alias) || $store->phones->isEmpty() || empty($store->address)) {
            return 1;
        }

        // Step 2: store types
        if ($store->typeCategories->isEmpty()) {
            return 2;
        }

        // Step 3: location (latitude required)
        if (empty($store->latitude) || empty($store->longitude)) {
            return 3;
        }

        // Step 4-5: social links and break settings are optional — skip to completion
        return 6;
    }

    private function syncPhones(Store $store, array $phones): void
    {
        $userPhone = $store->owner->phone;
        $userPhoneVerified = $store->owner->isPhoneVerified();

        $existingPhones = $store->phones()->get()->keyBy('phone');

        $store->phones()->delete();

        foreach ($phones as $i => $phoneData) {
            $phone = is_string($phoneData) ? $phoneData : ($phoneData['phone'] ?? '');
            if (empty($phone)) continue;

            $data = [
                'store_id'    => $store->id,
                'phone'       => $phone,
                'is_primary'  => $i === 0,
                'order_index' => $i,
            ];

            if ($userPhone && $phone === $userPhone && $userPhoneVerified) {
                $data['verified_at'] = now();
            } elseif (isset($existingPhones[$phone]) && $existingPhones[$phone]->isVerified()) {
                $data['verified_at'] = $existingPhones[$phone]->verified_at;
            }

            StorePhone::create($data);
        }
    }
}
