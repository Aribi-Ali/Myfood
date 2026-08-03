# 1. Project Overview

## What it is

**YallahKool** is a multi-tenant food ordering platform (like Uber Eats / Talabat for Algeria). Store owners build and run their own online restaurant storefronts; customers order food; delivery riders deliver; chefs can be hired by stores; the platform operator (admin) moderates everything and runs the business.

## Stack

| Layer | Technology |
|-------|-----------|
| Backend API | Laravel 12 (PHP 8.2+), MySQL |
| Auth | Laravel Sanctum (SPA session + Bearer token) |
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4 |
| Data fetching | TanStack React Query |
| Real-time | Laravel Reverb + laravel-echo + pusher-js |
| Queues | Redis + Laravel Horizon |
| Cache | Redis (store details cached 15 min) |
| Image processing | Intervention Image (GD) |
| Page builder | GrapesJS (frontend) |
| Payments | Satim (Algerian e-payment), Cash, Bank Transfer |
| API docs | l5-swagger |
| Mobile | Planned only (React Native) — no code yet |

## Architecture

- **API-only backend.** Laravel serves JSON under `/api/v1`. No Blade/Livewire frontend. `routes/web.php` only handles password-reset redirects and a legacy unused page-builder route.
- **Frontend consumes the API.** Next.js renders public storefronts + dashboards, authenticated via Sanctum.
- **Service layer** on the backend for business logic (onboarding, phone verification, subscriptions, orders, billing).
- **Caching** via Redis with explicit Cache-Control headers set in controllers.
- **i18n**: English, French, Arabic (full RTL) via a custom `useLanguage` context on the frontend.

## Roles (see file 03 for details)

`admin`, `owner`, `delivery`, `client`, `chef` — stored as a string enum on `users.role`.

## Monorepo layout

```
app/          Laravel app (controllers, models, services, jobs, notifications)
config/       Laravel config (+ custom: features, business, algeria)
database/     migrations + seeders
docs/         this documentation
front-end/    Next.js 16 application (public + dashboard)
lang/         Laravel translation files
mobile/       Planned React Native app (only a guide exists)
reverb-server WebSocket config
routes/       api.php, web.php, channels.php
templates/    Legacy standalone HTML template files (dev-only)
tests/        PHPUnit tests
```
