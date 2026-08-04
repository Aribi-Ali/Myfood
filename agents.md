# AGENTS.md — AI Agent Operating Rules 🎯

## Objective: Design, build, debug, and improve this multi-tenant food ordering platform with clean production-ready code. Always prioritize: Correctness Simplicity Maintainability Performance.

## Core Behavior Rules
- Think Before Acting; Break problems into smaller steps; Avoid unnecessary complexity; Write clean readable modular code; Use meaningful variable function names; Follow consistent formatting; Avoid duplication (DRY principle); Always read existing files understand project structure.

## Architecture Overview

This is a **Laravel 12 + Next.js 16** monorepo for a multi-tenant food ordering platform. 

### Backend: Laravel 12 API-only
- API only backend JSON API consumed by the Next.js frontend 
- No server-rendered pages (`resources/views/` unused)
- Route model authorization checks
- Service layer business logic (onboarding, phone verification, subscriptions)
- Sanctum for authentication (SPA session + Bearer token)
- Queue jobs for async operations (domain verification, etc.)
- Redis cache for domain resolution, categories, and storefronts
- Laravel Reverb for real-time WebSocket channels (orders, KDS, delivery)

### Frontend: Next.js 16 App Router
- React 19, TypeScript, Tailwind CSS v4
- 23 premium store templates with unique visual identities
- Page builder using GrapesJS
- Multi-category foods via many-to-many pivot table
- Client order workflow with live tracking
- Owner dashboard with order management, menu, themes, settings
- Delivery dashboard for rider assignments and status updates

## Key Commands & Setup

### Development Setup
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

### Development Workflow
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

## Framework Quirks & Implementation Details

### Phone Verification System
- `phone_verified_at` on users table
- `verified_at` stored in `store_phones`
- `PhoneVerificationCode` model uses polymorphic relation (morphs) for both User and StorePhone
- `isExpired()` and `isVerified()` helpers
- `syncPhones` in onboarding service preserves existing verification status when re-syncing
- user's own pre-verifies if needed

### Template System
- 69 templates with 69 default theme presets (1 preset per template)
- Templates have lifecycle: Draft, Testing, Active
- Stores see only active templates
- Uses React.lazy per template (69 separate dynamic imports instead of single eager import)
- `html_content` and `css_content` as LONGTEXT for admin-editable source code
- Existing templates keep their React component files backward compatibility

### Authentication & Authorization
- Laravel Sanctum SPA session + Bearer token authentication
- Admin must be able to CRUD templates, blocks, theme color presets, edit template source code
- Admin role grants access to client delivery chef roles

### Caching & Performance
- Added Cache-Control headers directly in controllers rather than middleware
- All response caching uses explicit Cache-Control headers on controllers
- Store details Redis cache 15min TTL for public store pages
- Frontend `min-h-0` at every flex level for overflow-y-auto to work correctly

## Internationalization (i18n)
- All user-facing static strings in public pages use `t()` from useLanguage context
- Fully translated: English, French, Arabic
- Brand name "YallahKool" replaced with `t('app_name')`
- Navbar auth-background uses translations
- Translated stores listing, store detail, orders become-chef, error verify-email, profile, KDS, delivery, order tracking, reservation

## Testing & Debugging
- All test scripts use hardcoded test users fixtures
- Comprehensive end-to-end workflow tests
- TypeScript type checking required (`npm run typecheck`)
- Test cleanup temp files: `tokens.json`, `store_alias.txt`, `order_id.txt` rather than cleaning database

## Repository Structure Notes
- Laravel API routes in `api.php`
- Authentication routes in `web.php` (only password reset redirect and health check)
- All frontend dynamic imports use `next/dynamic` for lazy loading
- No Blade/Livewire-era code - all removed
- Frontend uses `next/dynamic` and React.lazy for template loading

## Important Constraints
- Route caching: no inline closures in route files
- Remove all legacy Blade/Livewire-era code not used by Next.js frontend
- All frontend dynamic imports use `next/dynamic` lazy load
- No server-rendered pages (`resources/views/` unused)