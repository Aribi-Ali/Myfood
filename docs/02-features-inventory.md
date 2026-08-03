# 2. Features Inventory

Every feature in the platform, grouped by who it serves. Read this file, tick/comment next to any feature you want to **change** or **remove**, and tell me — I'll update the codebase.

---

## 2.1 Public (no login) — customer-facing storefront

| Feature | Description |
|---------|-------------|
| Store listing | Browse/explore all active stores with filters |
| Store detail page | Store profile, menu, info, hours, delivery info (cached 15 min in Redis) |
| Store custom pages | Public stores can have extra pages (e.g. "About", "Events") built via the page builder |
| Menu / foods | View a store's menu, food items, prices, images, offers |
| Reviews | Read store reviews, star rating, average rating |
| Search | Search stores by keyword (throttled) |
| Categories & features | Browse by food category; feature-flag endpoints |
| Banner display | Active platform + per-store banners |
| Chef directory | Public list of chefs (name, specialty, rating, availability) |
| Reservations — settings | View a store's reservation rules/schedules before booking |
| Store branches | Multi-location stores: view each branch's page/menu |
| Custom domain resolve | `resolve-domain` so a store's custom domain shows its page |
| Templates (public) | Preview active store templates + their theme presets |
| Geography (Algeria) | Wilayas → Dairas → Communes dropdowns for addresses |
| Auth | Register, login, forgot/reset password, email verification |

## 2.2 Client (logged-in customer)

| Feature | Description |
|---------|-------------|
| Profile | View/edit profile, avatar, change password |
| Phone verification | Add/verify/remove phone numbers (SMS OTP, polymorphic) |
| Notifications | Read notifications, mark as read |
| Cart | Add/update/remove/clear items (session-based, promo-aware) |
| Orders | Place order, view order history, view single order, **reorder** |
| Order tracking | Follow order status in real time (WebSockets) |
| Complaints | Submit a complaint on an order |
| Promo codes | Validate a promo code at checkout |
| Reviews | Write/delete own review on a store |
| Reservations | Check availability, book a table, view/cancel own reservations |
| Favorites | Favorite stores (model exists) |

## 2.3 Owner (store operator)

| Feature | Description |
|---------|-------------|
| Store onboarding wizard | Multi-step: basic info → store types → location → social links → break settings → complete |
| Store setup | Logo, cover, hours, breaks/pause, ordering toggle, delivery settings |
| Multi-phone OTP | Manage store phone numbers with verification |
| Menu management | CRUD foods + categories + food images |
| Offers | CRUD offers with images |
| Staff | CRUD staff, granular permissions per store (manager/kds/cook/chef roles) |
| Orders | View orders, update status, bulk status, assign riders, bulk delete |
| Dashboard | Summary metrics (orders, sales, etc.) |
| Sales | Sales index, stats, monthly, yearly |
| KDS | Kitchen display: view order queue, mark start/complete |
| Branches | CRUD branches, assign users, per-branch templates & pages, duplicate templates |
| Page builder | Build custom store pages (GrapesJS), saved sections, media assets |
| Templates | Pick store template, apply theme presets, choose colors |
| Reservations | Manage reservations, settings, schedules, statuses |
| Chefs | Browse available chefs, hire/fire, view hired chefs |
| Clients | View clients, ban/unban, report, trust score |
| Gallery | Store image gallery |
| Domains | Custom domain CRUD + DNS verification + primary domain |
| Subscription & billing | View plan, change plan, invoices, payment method, pay invoice |
| POS | Point of sale: view orders, update status (in-store) |
| Banner management | Owner-level banners for own store |

## 2.4 Delivery (rider)

| Feature | Description |
|---------|-------------|
| Rider stats | Own delivery stats (earnings, orders) |
| Pending/active orders | Accept available orders, complete them |
| Working status | Toggle available/offline |
| Live location | Update GPS location (broadcast to clients) |
| Delivery areas | Manage which areas the rider covers |
| Pricing | Choose pricing model, subscribe to tiers |
| Earnings | View earnings + history |

## 2.5 Chef (freelance cook)

| Feature | Description |
|---------|-------------|
| Chef profile | Build profile: skills, diplomas, images, work history |
| Documents | Upload verification documents (for admin approval) |
| Store relationship | See stores that hired me, accepted invitations |
| Verification | Chef profiles need admin approve/reject |
| Hiring | Stores can hire/fire me; receive invitations via WebSockets |

## 2.6 Admin (platform operator)

| Feature | Description |
|---------|-------------|
| Dashboard stats | Platform-wide stats + chart |
| Users | CRUD, verify email, ban/unban, send warning |
| Client reports | View/resolve reported clients |
| Stores | Approve/reject/suspend, toggle ordering, assign badges |
| Orders | View all, cancel, refund |
| Payouts | Approve/reject/mark-paid store payouts |
| Categories / Badges / Store types | CRUD taxonomy |
| Chefs | Approve/reject/delete chef profiles |
| Reviews | Moderate, reply, handle review flags |
| Complaints | Reply, categorize, resolve, reopen |
| Foods | Global food moderation |
| Domains | Overview of all custom domains |
| Reservations | View/cancel any reservation |
| Promo codes | CRUD promo codes |
| Banners | CRUD platform banners + images |
| Templates | CRUD templates, edit source HTML/CSS, lifecycle Draft→Testing→Active |
| Template blocks | CRUD + reorder blocks |
| Theme presets | CRUD + set default |
| Settings | Platform settings (business rules) + clear cache |
| Plans | CRUD subscription plans, features, tiers, duration offers |
| Delivery pricing | Settings + tiers CRUD |
| Payment gateways | CRUD gateway configs |
| Billing | View invoices, stats, mark paid |

## 2.7 Cross-cutting / infrastructure

| Feature | Description |
|---------|-------------|
| Real-time events | Order placed/status, kitchen start/complete, delivery assigned/completed, rider location, chef hire/invite (Reverb) |
| Notifications | Order confirmed, status updates, chef approved/rejected, user warnings (email + in-app) |
| Custom domains | DNS TXT verification `pizza-verify=<code>` + wildcard subdomain |
| Rate limiting | auth 5/min, search 30/min, public 60/min, orders 20/min |
| Feature flags | `config/features.php` exposed at `/api/v1/features` |
| Business rules | `config/business.php` (commission, delivery fee) overridable from DB settings |
| Health check | `GET /health` liveness |
| Swagger | API docs UI |
| Job queue | Async DNS verification, subscription lifecycle (trial/grace/dunning/renewals) |
| Trust & moderation | Client bans, reports, trust scores |
| i18n | EN/FR/AR full translation + RTL on all public pages |
| Templates catalog | 69 templates, each with 1 default theme preset, all lazy-loaded (69 `React.lazy` imports) |
