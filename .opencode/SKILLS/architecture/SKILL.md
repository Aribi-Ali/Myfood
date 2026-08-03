---
name: architecture
description: Architecture-aware implementation for this Laravel + Next.js monorepo. Use before implementing any complex feature or refactor. Guides the agent to understand the existing architecture first, inspect related code paths and schema, reuse existing abstractions, avoid over-engineering, consider performance/concurrency/caching/queues, and produce a concise implementation plan before writing code.
---

# Architecture

Understand the architecture before modifying it. Inspect before implementing; plan before coding; prefer incremental, reversible changes over rewrites.

## Project architecture (current state)

- **Backend:** Laravel 12, API-only at the repo root. Routes in `routes/api.php` under `/api/v1` (auth, stores, orders, delivery, chef, admin, phone verification, templates). Controllers under `app/Http/Controllers/Api` (+ `Admin/`), business logic in `app/Services/`, models in `app/Models/`. Sanctum auth with roles: client / owner / delivery / chef / admin. Reverb for real-time channels (orders/KDS/delivery/chef/presence).
- **Frontend:** Next.js 16 (App Router) in `front-end/`. i18n via `useLanguage` context + `locales/{en,fr,ar}.json`. Lazy-loads store template components with `next/dynamic` + `React.lazy` (see `template-loader.ts`).
- **Mobile:** `mobile/`. **Reverb server:** `reverb-server/`.
- **Database:** MySQL/PostgreSQL in production; SQLite `:memory:` in tests. Schema is documented in `database-schema.md`.

## Before implementing a complex feature

1. **Understand the existing architecture** — read `README.md`, `AGENTS.md`, `HANDOFF.md`, `docs/` first. These are the long-term memory of the project.
2. **Trace the related code paths** — find the controller/service/model/migration/route/frontend page for the area you will touch. Grep for existing similar features and reuse their patterns.
3. **Inspect the data model** — read the relevant migrations to confirm column names, casts, and relations; note indexes and unique constraints.
4. **Inspect integrations** — events, jobs/queues, Reverb channels, cache keys, external services (delivery, geography, phone OTP, Sentry).
5. **Write a concise implementation plan** — a short list of files to create/modify and the key design decisions. State the plan before writing code. Keep it brief; the plan is a guide, not a document.

## Guiding principles

- **Reuse existing abstractions.** Look for an existing service, trait, resource, or component before creating a new one. This project already centralizes onboarding (`StoreOnboardingService`), responses (`ApiResponse`), templates (`Template` model + `template-loader.ts`), and real-time channels. Do not fork near-duplicate logic.
- **Avoid unnecessary abstractions and over-engineering.** No interface with one implementation, no factory for one product, no config for values that never change. Prefer the simplest correct design.
- **Keep responsibilities clear.** Controllers parse HTTP and return responses; services hold business logic; models hold relations/scopes/casts. Don't stuff business rules into controllers or HTML into services.
- **Respect architectural boundaries.** Laravel ↔ Next.js is a clean API boundary: the frontend consumes `/api/v1` and never touches the DB. Don't leak DB or Eloquent into the frontend, and don't hardcode API internals in tests.
- **Document important decisions.** Note non-obvious architectural decisions in `docs/` or as a concise comment. Keep `HANDOFF.md`/`README.md` in sync on major changes.

## Engineering checklist

### Correctness & data consistency
- **Transactions:** multi-step writes (order creation, onboarding completion, store setup, payout) run in `DB::transaction()` with rollback on failure. Verify no partial state.
- **Race conditions & concurrency:** identify shared mutable state. Stock/quantity decrements should be atomic (`updateOrInsert`, conditional `where` update, or lock). Two concurrent order placements must not oversell.
- **Idempotency:** external-facing operations that may retry (webhooks, payment confirmation, queue jobs) are idempotent or keyed.

### Performance
- **No N+1 queries:** eager-load relations (`->with()`), check `StoreResource` and list endpoints. Watch for `whereHas` and collection loops hitting the DB.
- **Database indexes:** new query patterns on existing columns need an index migration. Confirm uniqueness constraints cover what the code enforces.
- **Caching & invalidation:** the project caches store pages, public store data, and geography (`Cache::remember` + `Cache-Control`). When you change data that feeds a cache, clear the affected keys (the codebase already invalidates `store:alias_*` and `public_store_*`). Cache keys must include the identity of what they represent.
- **Pagination:** list endpoints are paginated; don't return unbounded collections.

### Reliability
- **Queues & async processing:** long work (mail, notifications, heavy jobs) goes through the queue. Jobs: fail-safe, retried with backoff, idempotent on retry.
- **External services:** timeouts, retries, and graceful degradation for third-party calls (SMS OTP, delivery APIs, geocoding, webhooks). Handle their failures without crashing the request.
- **Failure handling:** anticipate partial failure and define the fallback behavior. Never leave data half-written.

### Testability
- Design for the project's test setup (see `testing` skill): PHPUnit on the backend, Vitest on the frontend. Keep business logic in testable service classes rather than buried in controllers.

## API/contract discipline

- **Do not break existing APIs or contracts without a deliberate migration strategy.** The frontend depends on the `{ success, data }` response envelope and resource shapes. Changing a contract is a coordinated change: update the consumer in the same change, or version/deprecate with a migration path.
- **Prefer incremental changes over unnecessary rewrites.** If the current design is workable, extend it. Rewrites require a stated reason (security, correctness, performance) and a migration plan.

## Definition of done

- [ ] Existing architecture and related code paths inspected before implementation
- [ ] Concise implementation plan shared before complex code was written
- [ ] Existing abstractions reused; no over-engineering introduced
- [ ] Transactions, concurrency, caching/invalidation, and queue use reviewed
- [ ] No N+1 queries; new query paths have indexes
- [ ] Existing API contracts preserved (or deliberately migrated with the consumer updated)
- [ ] Important decisions documented
