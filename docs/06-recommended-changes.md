# 6. Recommended Changes & Removals

**This is my honest opinion on what I'd change or remove.** Read each item, decide **Keep / Change / Remove**, and tell me. I'll update the codebase accordingly.

Legend: 🔴 Remove · 🟡 Change · 🟢 Keep as-is

---

## 6.1 Things I'd REMOVE (dead weight / low value)

| # | Item | Where | Why |
|---|------|-------|-----|
| 🔴 1 | **Legacy standalone HTML templates** | `templates/*.html` (template-1..4) | Superseded by DB-driven template catalog + React lazy templates. Only dev references left. |
| 🔴 2 | **Legacy `page-builder` web route + `PageBuilderController` + `PageBuilderAssetController`** | `routes/web.php`, `app/Http/Controllers/` | Not used by Next.js frontend (AGENTS.md already flags Blade/Livewire-era code removal). |
| 🔴 3 | **`FeatureGateMiddleware` + `feature` middleware** | `app/Http/Middleware/` | Defined but **never used in routes** — dead code. |
| 🔴 4 | **`throttle:chef-docs` limiter** | `AppServiceProvider`, unused in routes | Never referenced. |
| 🔴 5 | **`AiGenerationJob` / `ai_generation_jobs` / `component_configs`** | Model + table | Leftover scaffolding from an AI page-gen feature; nothing consumes it. Confirm before removing. |
| 🔴 6 | **`SwaggerController`** | Controller | Redundant with l5-swagger's own UI. |
| 🔴 7 | **`mobile/` guide-only directory** | Repo root | It's just an AGENTS.md spec for a React Native app that doesn't exist. Keep only if you actually plan to build it. |
| 🔴 8 | **Duplicate `personal_access_tokens` migrations** | `database/migrations/` | Two files create the same table → breaks `php artisan migrate`/tests. **Must dedupe.** |

## 6.2 Things I'd CHANGE (fixes / improvements)

| # | Item | Where | Change |
|---|------|-------|--------|
| 🟡 1 | **Stale `database-schema.md`** | repo root | Regenerate to include the ~8 new July tables (plans, subscriptions, billing, branches, delivery pricing). |
| 🟡 2 | **Pre-existing TS errors** | `grapes-editor.tsx:159`, `template-selector-modal.tsx:54`, template-2-organic, template-4-streetwear | ~154 lint errors + 713 warnings in frontend. Fix the type errors so `npm run typecheck` passes clean. |
| 🟡 3 | **Role/route model** | Backend | Roles are enforced ad-hoc (middleware + helpers) with no centralized authorization. Consider a small `Role` enum + policy layer only **if** staff permissions grow. (Do **not** add spatie/permission unless needed.) |
| 🟡 4 | **Rate limiter for KDS** | Frontend polling | KDS/delivery poll every 5s; ensure those endpoints aren't under the 60/min public limiter or you'll throttle real devices. Verify. |
| 🟡 5 | **`orders` limiter (20/min/user)** | api.php | Reasonable for place-order, but confirm bulk status endpoints aren't collateral-limited for owners. |
| 🟡 6 | **i18n coverage gaps** | Frontend | Public pages are fully translated; verify the **dashboard/admin** screens are too, or mark them out-of-scope deliberately. |
| ?? 7 | **Template count inconsistencies** | Docs/README | AGENTS.md says 23 templates/46 presets; HANDOFF says 33+; migrations show heavy churn (add 30, remove 30, +10 creative, +10 nature, +15 cuisine). Document the **actual current count** and prune what's not used. **DONE — actual: 69 templates / 69 default presets, matching `template-loader.ts`.** |
| 🟡 8 | **Sentry dependency** | composer.json | Installed but no documented DSN usage — configure it or remove it. |
| 🟡 9 | **`stores` cache TTL** | Backend | Store details cached 15 min. Ensure cache is invalidated on food/store updates (observers exist — verify coverage incl. offers, branches, reservations settings). |
| 🟡 10 | **Legacy web `password.reset` route** | `routes/web.php` | Fine, but confirm the frontend actually links to it and the redirect URL is configured. |
| 🟡 11 | **Empty `auth.php`** | `routes/auth.php` | Keep (Laravel loads it) but delete the file comment/boilerplate or wire real auth routes there for clarity. |

## 6.3 Things I'd KEEP (core value — don't touch)

| # | Item | Why |
|---|------|-----|
| 🟢 1 | Service layer pattern | Onboarding, phone verification, orders, subscriptions, billing — clean separation. |
| 🟢 2 | Store owner onboarding wizard | Differentiator for the "YallahKool" experience. |
| 🟢 3 | Template system (DB-backed + lazy React) | Good perf pattern (33 lazy imports). Just prune unused templates. |
| 🟢 4 | Phone OTP (polymorphic) | Reusable for users + store phones. |
| 🟢 5 | Custom domains with DNS TXT verify | Real multi-tenant value. |
| 🟢 6 | Granular store staff permissions | Without a package — fits the codebase. |
| 🟢 7 | WebSocket events (orders/KDS/delivery/chef) | Live UX is a core feature. |
| 🟢 8 | Redis caching + observers | Correct approach. |
| 🟢 9 | Geography (Algeria wilayas/dairas/communes) | Localized value. |
| 🟢 10 | i18n EN/FR/AR + RTL | Broad audience. |

---

## 6.4 Suggested next steps (in priority order)

1. **Dedupe `personal_access_tokens` migrations** — unblocks tests. *(Quick, high value.)*
2. **Regenerate `database-schema.md`** so docs match reality.
3. **Delete confirmed dead code**: legacy templates, legacy page-builder routes/controllers, unused `feature` middleware, `throttle:chef-docs`, `SwaggerController`.
4. **Fix the ~4 pre-existing TS errors** so `npm run typecheck` is clean.
5. **Audit template catalog** — get the real count, prune unused.
6. Decide on `ai_generation_jobs` / `component_configs` (keep or drop).
