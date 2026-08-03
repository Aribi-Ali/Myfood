# Project Hand-off

## Current State (July 2026)

### Architecture

- **Backend**: Laravel 12 API-only — no Blade/Livewire views.
- **Frontend**: Next.js 16 App Router with React 19, TypeScript, Tailwind v4.
- **Auth**: Laravel Sanctum SPA session + Bearer token.
- **Real-time**: Laravel Reverb WebSocket channels (orders, KDS, delivery, presence).
- **Database**: MySQL with 100+ migrations, seeded via `db:seed-fake`.

### Key Features (Implemented)

- **Store management**: CRUD, onboarding wizard, multi-phone with OTP verification, custom domains.
- **Menu system**: Foods with categories, offers, multi-currency pricing (DA/USD/EUR).
- **Ordering**: Cart, checkout, order lifecycle (pending → accepted → preparing → ready → delivered), tracking.
- **KDS (Kitchen Display System)**: Real-time order flow for kitchen staff.
- **Delivery**: Rider assignment, location tracking, earnings dashboard, delivery pricing tiers.
- **Chef hiring**: Chef profiles, skills/diplomas, store-chef hiring relationships.
- **Reservations**: Table management, schedules, reservation settings.
- **Page Builder**: GrapesJS-based visual editor for store pages, saved sections, template system.
- **Template system**: 33+ templates with lifecycle (Draft → Testing → Active), theme presets, blocks.
- **Subscriptions & Billing**: Plans, tiers, features, payment gateways, invoices.
- **Admin dashboard**: Full CRUD for stores, users, templates, categories, badges, complaints, reviews, banners, promo codes, payouts, settings.
- **i18n**: English, French, Arabic (full RTL support).
- **Client features**: Favorites, reviews, order history, profile management, complaint system, trust scores.

### Frontend Route Groups

| Route prefix | Purpose |
|---|---|
| `/` | Public pages (home, stores listing, store detail) |
| `/login`, `/register`, `/forgot-password`, `/reset-password` | Auth pages |
| `/auth/verify-email` | Email verification |
| `/orders`, `/orders/[id]/tracking` | Client orders |
| `/profile`, `/profile/store`, `/profile/security`, `/profile/orders`, `/profile/delivery`, `/profile/chef` | Client profile |
| `/stores/[alias]`, `/stores/[alias]/reservation`, `/stores/[alias]/page/[pageSlug]` | Store public pages |
| `/dashboard` | Owner/staff/chef/delivery dashboard |
| `/dashboard/admin/*` | Admin dashboard |
| `/dashboard/menu`, `/dashboard/orders`, `/dashboard/settings/*`, etc. | Owner management |
| `/kds` | Kitchen display (standalone) |
| `/delivery`, `/delivery/active` | Delivery (standalone) |
| `/become-chef` | Chef application |

### Backend API Groups

| Prefix | Purpose |
|---|---|
| `POST /login`, `POST /register`, `POST /logout` | Auth |
| `GET /user` | Current user profile |
| `GET /api/v1/stores` | Public store listing |
| `GET /api/v1/stores/{alias}` | Store detail |
| `GET /api/v1/client/*` | Client-facing endpoints (orders, cart, favorites, reviews, reservations, chef) |
| `GET /api/v1/owner/*` | Owner management (foods, orders, staff, gallery, settings, sales, domains) |
| `GET /api/v1/admin/*` | Admin CRUD (stores, users, templates, categories, badges, complaints, reviews, banners, plans, billing, payouts, promo codes, settings, domains, foods, orders, reservations, store types, delivery pricing, payment gateways) |
| `GET /api/v1/delivery/*` | Delivery rider endpoints |
| `GET /api/v1/phone/*` | Phone verification (add, send-code, verify, remove, set-primary) |
| `GET /api/v1/public/*` | Public template listing, domain resolution |

### Known Issues

- **Pre-existing TS errors**: `grapes-editor.tsx(159,21)`, `template-selector-modal.tsx(54,*)`, `template-2-organic.tsx(70,32)`, `template-4-streetwear.tsx(395,18)` — not introduced by us.
- **Pre-existing Laravel test failure**: Duplicate `personal_access_tokens` migration files.
- **Lint warnings**: ~713 warnings (mostly unused vars, `any` types in channel hooks). 154 errors — mostly `@typescript-eslint/no-explicit-any` in KDS/audio/query utilities.

### Development Workflow

```bash
# Start everything
composer dev

# Frontend only
cd front-end && npm run dev

# Typecheck frontend
cd front-end && npm run typecheck

# Backend tests
php artisan test

# Seed fresh data
php artisan db:seed-fake --fresh
```

---
*Updated July 2026*
