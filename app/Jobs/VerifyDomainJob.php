<?php

namespace App\Jobs;

use App\Models\StoreDomain;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class VerifyDomainJob implements ShouldQueue
{
    use Dispatchable, Queueable;

    public function __construct(
        public StoreDomain $storeDomain
    ) {}

    public function handle(): void
    {
        if ($this->storeDomain->verified_at) {
            Log::info('VerifyDomainJob: domain already verified', [
                'domain_id' => $this->storeDomain->id,
                'domain' => $this->storeDomain->domain,
            ]);
            return;
        }

        Log::info('VerifyDomainJob: starting verification', [
            'domain_id' => $this->storeDomain->id,
            'domain' => $this->storeDomain->domain,
        ]);

        $verified = $this->checkDnsTxtRecord(
            $this->storeDomain->domain,
            $this->storeDomain->verification_code
        );

        if ($verified) {
            $this->storeDomain->update(['verified_at' => now()]);

            Cache::forget('domain:' . $this->storeDomain->domain);

            Log::info('VerifyDomainJob: verification successful', [
                'domain_id' => $this->storeDomain->id,
                'domain' => $this->storeDomain->domain,
            ]);
        } else {
            Log::warning('VerifyDomainJob: verification failed', [
                'domain_id' => $this->storeDomain->id,
                'domain' => $this->storeDomain->domain,
                'verification_code' => $this->storeDomain->verification_code,
            ]);
        }
    }

    private function checkDnsTxtRecord(string $domain, string $code): bool
    {
        if (app()->environment('local') || config('business.fake_domain_verification')) {
            Log::info('VerifyDomainJob: fake verification', [
                'domain' => $domain,
            ]);
            return true;
        }

        try {
            $records = dns_get_record($domain, DNS_TXT);
            foreach ($records as $record) {
                if (isset($record['txt']) && str_contains($record['txt'], $code)) {
                    return true;
                }
            }
        } catch (\Exception $e) {
            Log::error('VerifyDomainJob: DNS lookup exception', [
                'domain' => $domain,
                'exception' => $e->getMessage(),
            ]);
            return false;
        }

        return false;
    }
}
