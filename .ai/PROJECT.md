# Project Overview

**Purpose**: YallahKool is a multi‑tenant food‑ordering platform that enables restaurant owners to sell online via a shared SaaS service.

**Main Features**
- API‑only Laravel 12 backend exposing JSON endpoints.
- Next.js 16 (App Router) frontend with i18n (EN/FR/AR).
- Custom domain support per store (DNS verification workflow).
- Phone‑verification onboarding, subscription management.
- Real‑time order/KDS updates via Laravel Reverb/WebSockets.
- Queue jobs (Redis, Horizon) for async tasks.
- Caching (Redis) of store data and assets.
- Role‑based authentication (admin, chef, delivery, client) using Sanctum SPA sessions & Bearer tokens.

**Technology Stack**
- **Backend**: Laravel 12, PHP 8.2+, MySQL, Redis, Sanctum, Horizon, Reverb, Docker.
- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS v4, Vite, Vitest, Playwright.
- **DevOps**: Docker Compose, npm scripts, Composer.

**Important Dependencies**
- laravel/framework ^12.0
- laravel/sanctum ^4.0
- laravel/horizon ^7.0
- laravel/reverb *
- next ^16.0
- react ^19.0
- tailwindcss ^4.0
- typescript ^5.0
