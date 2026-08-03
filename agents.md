# AGENTS.md — AI Agent Operating Rules 🎯

## Objective: Design, build, debug, and improve this multi-tenant food ordering platform with clean production-ready code. Always prioritize: Correctness Simplicity Maintainability Performance.

Core Behavior Rules: Think Before Acting; Break problems into smaller steps; Avoid unnecessary complexity; Write clean readable modular code; Use meaningful variable function names; Follow consistent formatting; Avoid duplication (DRY principle); Always read existing files understand project structure.

Architecture Guidelines:
- Frontend: Next.js 16 App Router - All public pages fully translated with i18n support for English French Arabic, Uses next/dynamic and React.lazy() for lazy loading of templates, For main flex container to respect overflow hidden on children min-h-0 must be present on every flex child in chain; Use component-based architecture small reusable components Separation UI logic.

Backend: Laravel 12 API-only - API only backend JSON API consumed Next.js frontend No server-rendered pages resources/views unused Route model authorization checks Service layer business logic (onboarding phone verification subscriptions) Uses Sanctum for authentication SPA session Bearer token.

Tech Stack: Frontend: Next.js 16 React 19 TypeScript Tailwind CSS v4 Backend: Laravel 12 PHP 8.2 MySQL Auth Sanctum Queue Database Redis Laravel Horizon Cache Redis WebSockets Reverb. Setup Instructions - cp .env.example .env composer install php artisan key:generate php artisan migrate --seed # Frontend cd front-end npm install Start all services composer dev

## Key Commands
Fake data seeder idempotent safe to re-run; PHP artisan db:seed-fake Fresh database seed; cd front-node and npm run typecheck Run backend test.

## Critical Implementation Details
**Phone Verification System**: phone_verified_at on users table verified_at stored store_phones, PhoneVerificationCode model uses polymorphic relation (morphs) for both User StorePhone pending isExpired(); isVerified() helpers syncPhones in onboarding service preserves existing verification status when re-syncing; user's own pre-verifies if needed.

**Template System**: 69 templates with 69 default theme presets (1 preset per template) Templates have lifecycle Draft Testing Active store owners see only, Uses React.lazy per template 69 separate dynamic imports instead single eagerimport reduces initial JS payload Stores html_content css_content as LONGTEXT for admin-editable source code, Existing templates keep their React component files backward compatibility

**Authentication & Authorization**: Laravel Sanctum SPA session Bearer token authentication Admin must be able to CRUD templates blocks theme color presets edit template source code; Admin role grants access client delivery chef roles.


**Caching & Performance**: Added Cache-Control headers directly controllers rather middleware all response caching uses explicit Cache-Control headers on controllers Store details Redis cache 15min TTL public store pages Frontend min-h-0 at every flex level overflow-y-auto work correctly

## Internationalization (i18n)
All user-facing static strings in public pages use t() from useLanguage context Fully translated English French Arabic Brand name "YallahKool" replaced with t('app_name') navbar auth-background. Translated stores listing store detail orders become-chef error verify-email profile KDS delivery order tracking reservation,

## Testing & Debugging
All test scripts use hardcoded test users fixtures Comprehensive end-to-end workflow tests TypeScript type checking required npm run typecheck; Test cleanup temp files tokens.json store_alias.txt order_id.txt rather than cleaning database. Repository Structure Notes - Laravel API routes api.php Authentication routes web.php assets only development - all production assets built Next.js app front-end/admin directory was deleted dead code

## Git Guidelines
All commands run from repository root; Changes migration files review compatibility existing data Use git status and diff before commit never commit secrets Write concise clear commits matching repo style. Important Constraints Route caching no inline closures route files Remove all legacy Blade/Livewire-era code not used Next.js frontend All frontend dynamic imports uses next/dynamic lazy load

## Critical Context
npm run typecheck passes clean; stores locale keys map Restaurants/Magasins navbar uses t('stores'); AssetController+AssetService+PageAsset model actively used media-picker frontend templates html_content css_content rendered by StorefrontRenderer on storefront

## Relevant Files
database/migrations/2026_07_01_000001_add_10_new_templates.php; front-end/src/components/templates/template-trattoria-roma.tsx and 9 others; template loader TypeScript updated TemplateId union TEMPLATE_NAMES routes api.php cleanup dead imports admin public routes chef stores route models templates status active, available AdminController create store approve role auth backend delivery middleware API payment reset

(End of file - total 131 lines)