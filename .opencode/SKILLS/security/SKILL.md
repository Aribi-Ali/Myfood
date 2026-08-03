---
name: security
description: Security review and hardening for this Laravel + Next.js project. Use before implementing or reviewing anything that touches authentication, authorization, payments, user data, admin functionality, file uploads, or external integrations, and when auditing code for vulnerabilities. Security is a requirement here, not an optional improvement.
---

# Security

Security is a requirement, not an optional improvement. Every feature is reviewed for security implications before implementation, and high-risk areas get a dedicated security pass.

## Project context

- Backend: Laravel 12 API (Sanctum token auth, role-based access: client / owner / delivery / chef / admin). Multi-tenant-ish: store owners manage only their own stores; clients own only their own carts/orders; delivery sees only assigned orders.
- Frontend: Next.js 16, API-only, sessions via Laravel cookies/`auth:sanctum`.
- All user-facing static strings must go through the `t()` i18n helper (`useLanguage`) — hardcoded strings are a correctness bug (not a security issue, but part of the review standard).

## Non-negotiables

- **Never expose secrets or credentials** — not in code, logs, responses, or git. `.env` / `.env.production` are gitignored; never echo, print, or commit their contents. Use environment variables and the app's config files.
- **Never trust client-provided authorization data** — no trusting a `role` field, `user_id` in the request body, or an `X-role` header. Resolve identity from the authenticated session/token only.
- **Always verify authorization server-side** — the frontend hiding a button is UI, not a security control. Every route/endpoint enforces its own policy.
- **Follow current framework recommendations** — Laravel 12 + Sanctum + Next.js 16 security guidance; prefer the framework's built-in, current mechanisms over custom implementations.

## Review checklist

Work through the areas below that apply to the code under review.

### Authentication
- Credentials validated with `Auth::attempt`/password hashing (`bcrypt`/`Hash::make`) — never plaintext, never MD5/SHA1.
- Login rate limited (`throttle` middleware). Token issuance (Sanctum) uses current APIs; tokens scoped and revocable.
- Password reset tokens single-use and time-limited.

### Authorization / RBAC / permission checks
- Every controller method that mutates or reads a resource checks the caller's role **and** ownership/tenant scope.
- **IDOR / broken object-level authorization:** any `{id}`/`{alias}` lookup on an authenticated route must verify the resource belongs to the caller (or the caller's store). Test that user A cannot read/update user B's data. Look for the `store` scope being derived from the URL instead of the authenticated owner.
- Middleware (owner / delivery / admin) applied at route-group level; no route bypasses its guard.

### Input validation & mass assignment
- Every request validated via FormRequest or `$request->validate()` at the boundary — type, format, length, enum values (Laravel `Rule::enum`).
- `$fillable`/`$guarded` set on every model; no mass-assignment via `create($request->all())` without allowed columns.
- Use Laravel validation rules rather than manual sanitization.

### Injection
- **SQL:** query builder/Eloquent with bound parameters only — no string concatenation of user input into queries, no `whereRaw`/`DB::raw` with interpolated input. Safe use: `where('col', $input)` or `->when()`.
- **XSS:** React escapes by default — do not use `dangerouslySetInnerHTML` except with sanitized content (this project already uses `dompurify` for template HTML). Escape/encode any dynamic content rendered server-side.
- **SSRF:** any feature that fetches user-supplied URLs must restrict schemes/hosts (allowlist), block internal ranges, and set timeouts.

### CSRF
- State-changing cookie-authenticated routes protected by Laravel's CSRF middleware (default for web). For SPA/API session flows, use the standard `XSRF-TOKEN`/`VerifyCsrfToken` flow. Token-based (Sanctum `Authorization: Bearer`) API calls are exempt by design — verify the frontend uses Bearer for API and not cookie CSRF confusion.

### File uploads
- Validate MIME and extension against an allowlist (`image/jpeg`, `image/png`, `image/webp`, …); reject executable types.
- Store outside the web root where possible; serve with restrictive headers; randomize filenames; enforce size limits.
- **Path traversal:** never build storage paths from user input without sanitization; use `Storage` disk paths and `basename()`-style guards. When re-serving uploaded files, resolve against the disk — no `../` escapes.

### Rate limiting
- Public/auth endpoints (login, register, password reset, phone verification `send-code`, OTP `verify`) use `throttle`. Guard brute-force on sensitive operations.

### Session & token security
- Cookies: `http_only`, `secure` in production, `SameSite` appropriate (project uses `lax` for local HTTP dev).
- Sanctum tokens: scoped with abilities, expiration/revocation on logout; tokens never logged.

### API security
- Responses use the project's `ApiResponse` trait and consistent `{ success, data }` shape — no leaking stack traces or query strings in production errors.
- No sensitive fields (password hashes, tokens, PII beyond the actor's own) serialized in API resources.

### Sensitive data & secrets management
- Secrets live in `.env` only, referenced via `config/`. No hardcoded keys, DSNs, or app secrets in code, migrations, seeders, or docs.
- Git history stays clean: verify `.gitignore` covers `.env*`, and `git ls-files` contains no `.env` or credential files.

### Password & token handling
- Password resets and email notifications go through Laravel's built-in brokers/notifications. Tokens (email verification, phone OTP) single-use with expiry; stored hashed where feasible.
- Phone verification (`PhoneVerificationCode`): codes expire (~10 min), old pending codes invalidated on regenerate, verify against the polymorphic verifiable, and never return the code in a production response.

### Webhook verification
- Any external webhook verifies signature/hmac using the provider's shared secret from config/env — never accept unverified payloads.

### Logging
- Log meaningful events with context, but **without secrets**: no passwords, tokens, DSNs, card data, or full PII. Log errors at the right level; never log request bodies that contain credentials.

### Secure error handling
- Production: generic 500 responses; details only to logs (via Laravel's error handler / Sentry). Validation errors may return field messages.
- Don't leak which resources exist vs not (consistent 404s for unauthorized resources where applicable).

### Dependencies
- Run `composer audit` (backend) and `npm audit` (frontend) when adding dependencies. Flag known-vulnerable packages instead of ignoring.
- Prefer stdlib/framework features over new dependencies (see project AGENTS.md).

### Database access
- Parameterized queries only; least-privilege DB credentials; no `DB::raw` with user input.

### Multi-tenant data isolation
- This app has stores owned by owners, client carts/orders, delivery assignments, chef hires. Every cross-entity lookup is scoped by the authenticated actor. Flag any query that can read across tenants by passing arbitrary IDs.

## High-risk feature checklist

Before implementing/merging anything in these categories, do a dedicated security pass:

- **Auth & phone verification** (register, login, OTP)
- **Payments / payouts** (store payouts, checkout)
- **User data & profiles**
- **Admin functionality** (user management, store approval, template/block CRUD, file/media)
- **File uploads** (avatars, store images, food images, media picker)
- **Webhooks / external integrations**

## Definition of done

- [ ] Server-side authorization on every endpoint, no trust in client-supplied identity
- [ ] All inputs validated; models protected from mass assignment
- [ ] No secrets in code, logs, responses, or git
- [ ] Injection (SQL/XSS/SSRF), CSRF, file-upload, and path-traversal vectors reviewed
- [ ] Sensitive operations rate limited
- [ ] Security-relevant tests cover authorization failures (401/403) and validation failures
- [ ] `composer audit` / `npm audit` clean or findings triaged
