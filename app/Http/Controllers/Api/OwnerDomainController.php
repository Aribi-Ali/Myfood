<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\VerifyDomainJob;
use App\Models\StoreDomain;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class OwnerDomainController extends Controller
{
    use ApiResponse;
    public function index()
    {
        $store = Auth::user()->store;
        if (!$store) return $this->forbidden('No store found.');

        return $this->success($store->domains()->orderByDesc('id')->get());
    }

    public function store(Request $request)
    {
        $store = Auth::user()->store;
        if (!$store) return $this->forbidden('No store found.');

        $request->validate([
            'domain' => 'required|string|max:255|unique:store_domains,domain',
        ]);

        $domain = $request->domain;
        $domain = strtolower(trim($domain));
        $domain = preg_replace('#^https?://#', '', $domain);
        $domain = rtrim($domain, '/');

        $existing = StoreDomain::where('domain', $domain)->first();
        if ($existing) {
            return $this->error('This domain is already taken.', 422);
        }

        $verificationCode = Str::random(32);

        $isPrimary = $store->domains()->count() === 0;

        $storeDomain = $store->domains()->create([
            'domain'            => $domain,
            'verification_code' => $verificationCode,
            'is_primary'        => $isPrimary,
        ]);

        Log::info('Domain added to store', [
            'store_id' => $store->id,
            'domain_id' => $storeDomain->id,
            'domain' => $storeDomain->domain,
            'is_primary' => $isPrimary,
        ]);

        return $this->success($storeDomain, 201, 'Domain added. Add the TXT record to verify ownership.');
    }

    public function verify(Request $request, StoreDomain $storeDomain)
    {
        $store = Auth::user()->store;
        if (!$store || $storeDomain->store_id !== $store->id) {
            return $this->forbidden('Unauthorized.');
        }

        if ($storeDomain->verified_at) {
            return $this->success($storeDomain, 200, 'Domain already verified.');
        }

        Log::info('Domain verification requested', [
            'domain_id' => $storeDomain->id,
            'domain' => $storeDomain->domain,
            'store_id' => $store->id,
        ]);

        $verified = $this->checkDnsTxtRecord($storeDomain->domain, $storeDomain->verification_code);

        if ($verified) {
            $storeDomain->update(['verified_at' => now()]);

            Cache::forget('domain:' . $storeDomain->domain);

            Log::info('Domain verified successfully', [
                'domain_id' => $storeDomain->id,
                'domain' => $storeDomain->domain,
            ]);

            return $this->success($storeDomain->fresh(), 200, 'Domain verified successfully!');
        }

        Log::warning('Domain verification failed', [
            'domain_id' => $storeDomain->id,
            'domain' => $storeDomain->domain,
        ]);

        // Dispatch background job for retry
        VerifyDomainJob::dispatch($storeDomain);

        return $this->error(
            'Verification failed. Make sure you added the TXT record: pizza-verify=' . $storeDomain->verification_code,
            422
        );
    }

    public function setPrimary(Request $request, StoreDomain $storeDomain)
    {
        $store = Auth::user()->store;
        if (!$store || $storeDomain->store_id !== $store->id) {
            return $this->forbidden('Unauthorized.');
        }

        if (!$storeDomain->verified_at) {
            return $this->error('Domain must be verified before setting as primary.', 422);
        }

        $store->domains()->where('is_primary', true)->update(['is_primary' => false]);
        $storeDomain->update(['is_primary' => true]);

        return $this->success($storeDomain->fresh(), 200, 'Primary domain updated.');
    }

    public function destroy(Request $request, StoreDomain $storeDomain)
    {
        $store = Auth::user()->store;
        if (!$store || $storeDomain->store_id !== $store->id) {
            return $this->forbidden('Unauthorized.');
        }

        $storeDomain->delete();

        return $this->success(null, 200, 'Domain removed.');
    }

    /**
     * Public endpoint: resolve a domain to a store alias.
     */
    public function resolve(Request $request)
    {
        $request->validate(['domain' => 'required|string']);

        $domain = strtolower(trim($request->domain));
        $domain = preg_replace('#^https?://#', '', $domain);
        $domain = rtrim($domain, '/');

        $storeDomain = Cache::remember('domain:' . $domain, 86400, function () use ($domain) {
            return StoreDomain::where('domain', $domain)
                ->whereNotNull('verified_at')
                ->with('store')
                ->first();
        });

        if (!$storeDomain || !$storeDomain->store) {
            Cache::forget('domain:' . $domain);
            return $this->error('No store found for this domain.', 404);
        }

        return $this->success([
            'store' => [
                'alias' => $storeDomain->store->alias,
                'name'  => $storeDomain->store->name,
            ],
        ]);
    }

    private function checkDnsTxtRecord(string $domain, string $code): bool
    {
        if (app()->environment('local') || config('business.fake_domain_verification')) {
            Log::info('DNS check: fake verification', ['domain' => $domain]);
            return true;
        }

        try {
            $records = dns_get_record($domain, DNS_TXT);

            foreach ($records as $record) {
                if (isset($record['txt']) && str_contains($record['txt'], $code)) {
                    Log::info('DNS check: TXT record found', ['domain' => $domain]);
                    return true;
                }
            }

            Log::warning('DNS check: verification code not found in TXT records', [
                'domain' => $domain,
                'records_found' => count($records),
            ]);
        } catch (\Exception $e) {
            Log::error('DNS check: lookup exception', [
                'domain' => $domain,
                'error' => $e->getMessage(),
            ]);
            return false;
        }

        return false;
    }
}
