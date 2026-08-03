---
name: testing
description: Write appropriate automated tests for every new feature and bug fix in this project. Use before or while implementing any feature, bug fix, or refactor, and before declaring work complete. Guides the agent to inspect existing tests, reuse the project's PHPUnit (Laravel) and Vitest (Next.js) infrastructure, cover happy paths and failure modes, and run the relevant suites.
---

# Testing

## Project test infrastructure

This is a monorepo with a Laravel 12 API backend and a Next.js 16 frontend. Each side has its own test setup — always use the framework the code already uses.

| Layer | Framework | Location | Command |
| --- | --- | --- | --- |
| Backend (Laravel) | PHPUnit 11 | `tests/Unit`, `tests/Feature` (incl. `tests/Feature/Api`, `tests/Feature/Services`) | `composer test` (runs `php artisan test`) |
| Frontend (Next.js) | Vitest 3 + Testing Library | `front-end/src/__tests__/` | `npm test` in `front-end/` |
| Frontend static check | TypeScript | — | `npm run typecheck` in `front-end/` |

Do not switch frameworks. Do not add Pest to the backend — the project uses PHPUnit, and `composer test` runs `php artisan test`.

## Workflow

### 1. Inspect existing tests before writing new ones

Before creating any test:

- Find the closest existing test for the code you are touching (search `tests/Feature/Api/*`, `tests/Feature/Services/*`, `front-end/src/__tests__/*`).
- Match its structure, helpers, fixtures, and naming conventions.
- Reuse existing base classes (`tests/TestCase.php`), factories, and traits. Do not build a parallel infrastructure.

### 2. Write tests for every change

Every new feature and every bug fix gets automated tests. Tests are part of the change, not optional follow-up.

Cover, where applicable:

- **Happy path** — the success case.
- **Validation failures** — invalid/missing/malformed input returns the documented error (422 for Laravel validation, etc.).
- **Authorization failures** — wrong role, unauthenticated request, cross-tenant access attempt. Every new API endpoint must be tested for 401/403 when accessed without the required role.
- **Edge cases** — empty lists, boundary values, duplicate keys, nulls, pagination, locale variants (this app supports `en`, `fr`, `ar`).
- **Important failure scenarios** — stock exhausted, duplicate order, rate limit, resource already consumed, external service down.

### 3. Test what matters for this stack

- **Database behavior:** model relations, scopes, casts, constraints, uniqueness.
- **Transactions:** multi-step operations must roll back atomically on failure (e.g., `OrderServiceTransactionTest`). Assert no partial writes.
- **Events, queues, jobs:** assert the event/job was dispatched (with the right payload), and that queued work runs — use `Queue::fake()`, `Event::fake()`, and verify both dispatch and side effects.
- **External integrations / HTTP:** fake the client (`Http::fake()`), assert request shape and response handling. Never make real network calls in tests.
- **API contracts:** response structure `{ success, data }`, HTTP status codes, resource shape. The backend exposes a stable API used by the frontend — a change that breaks the shape is a test failure.

### 4. Bug fixes require regression tests

When fixing a bug:

1. Write a test that reproduces the bug and fails on the unfixed code.
2. Apply the fix.
3. Confirm the test now passes and stays in the suite permanently.

Never weaken or delete a test to make the suite green. If a test fails, determine whether the problem is in **application code**, **test code** (wrong assumption, stale fixture), or the **environment** (missing service, wrong DB, cache) before touching anything — then fix the correct layer. If the test itself is wrong, fix the test and say why; if the app is wrong, fix the app.

### 5. Run the right tests

- After implementing: run the tests that cover the changed code (e.g., the affected `tests/Feature/Api/*Test.php` file or `front-end/src/__tests__` file).
- Backend targeted run: `php artisan test --filter=NameOfTestClass`
- Frontend targeted run: `npx vitest run <file>`
- **Before declaring a feature complete:** run the full relevant suite — `composer test` for backend changes, `npm test` plus `npm run typecheck` for frontend changes. Green and committed.

## Conventions

- Test names describe behavior, not implementation: `test_a_client_cannot_place_an_order_at_an_inactive_store`, not `test_store_method_returns_true`.
- Use Laravel's `RefreshDatabase` for feature tests; prefer factories over raw model creation; use `assertDatabaseHas`/`assertDatabaseMissing` for state checks.
- Use `actingAs` with the correct role (client, owner, delivery, chef, admin) to verify authorization paths.
- Keep tests deterministic — freeze time (`Carbon::setTestNow`), avoid relying on `now()`, sort collections before asserting order.
- Do not assert on timestamps that are set by `now()` unless the test controls time.

## Definition of done

- [ ] Existing tests in the affected area were inspected and reused
- [ ] New tests cover happy path + validation + authorization + edge cases
- [ ] Bug fixes ship with a regression test
- [ ] Full relevant suite passes (`composer test` and/or `npm test` + `npm run typecheck`)
- [ ] No test was weakened or deleted to force a pass
