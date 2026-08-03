# YallahKool — Multi-Tenant Food Ordering Platform

Multi-tenant food ordering platform built with **Laravel 12 API** + **Next.js 16 frontend**.

## Tech Stack

- **Backend**: Laravel 12, PHP 8.2+, MySQL
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4
- **Auth**: Laravel Sanctum (SPA session + Bearer token)
- **Queue**: Database / Redis, Laravel Horizon
- **Cache**: Redis
- **WebSockets**: Laravel Reverb

## Development Setup

```bash
# Backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
php artisan db:seed-fake

# Frontend
cd front-end
npm install
npm run dev
```

## Key Commands

```bash
# Start all services (server, queue, logs, frontend)
composer dev

# Fake data seeder (idempotent, safe to re-run)
php artisan db:seed-fake

# Fresh database + seed
php artisan db:seed-fake --fresh

# Frontend typecheck
cd front-end && npm run typecheck

# Run backend tests
php artisan test
```

## Architecture

- **API-only backend** — Laravel serves a JSON API consumed by the Next.js frontend.
- **No server-rendered pages** — the Laravel `resources/views/` directory is unused.
- All auth via Sanctum (SPA session or Bearer token).
- Route model binding with authorization checks.
- Service layer for business logic (onboarding, phone verification, subscriptions).
- Queue jobs for async operations (domain verification, etc.).
- Redis cache for domain resolution, categories, and storefronts.
- Laravel Reverb for real-time WebSocket channels (orders, KDS, delivery).

## Custom Domains (Multi-Tenant)

Store owners can map their own domain to their store page.

1. Owner adds a domain in dashboard settings.
2. System generates a verification code.
3. Owner adds a TXT record `pizza-verify=<code>` to their DNS.
4. Owner clicks **Verify** — system checks DNS and marks verified.
5. Owner sets the domain as **Primary**.
6. Nginx (wildcard `server_name _;`) forwards all requests to the app.
7. Frontend `CustomDomainDetector` reads the host, calls `/resolve-domain`, and redirects to the correct store page.

### DNS Records

| Type  | Name             | Value                          |
|-------|------------------|--------------------------------|
| CNAME | `@` or `www`     | `<your-app-domain>`            |
| TXT   | `@`              | `pizza-verify=<verification_code>` |

### Development DNS Verification

In local/CI environments, set `DOMAIN_FAKE_VERIFICATION=true` to skip real DNS lookups.

## API Endpoints

- `api.php` — all public and authenticated API routes (50+ controllers).
- `web.php` — password reset redirect and health check only.

## License

MIT
