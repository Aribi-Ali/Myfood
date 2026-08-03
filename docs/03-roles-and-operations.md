# 3. Roles and Operations

Five roles exist. Roles are a single string enum column on `users.role` (no roles package, no policies package). Enforcement happens via middleware + model helpers.

**How enforcement works:**
- `admin` middleware → role must be `admin`
- `delivery` middleware → role must be `delivery`
- `store.owner` middleware → role is `owner` (with an approved store) **or** `admin`
- Model helpers: `isAdmin()`, `isOwner()`, `isDelivery()`, `isClient()`, `isChef()`
- Granular store staff permissions: `StoreStaff` with `store_role` + JSON `permissions` array; `hasStorePermission()` / `hasBranchPermission()`

---

## 3.1 Admin (platform operator)

**Full access to everything.** Can CRUD templates, blocks, theme presets, edit template source code; also passes the owner middleware (acts as any owner).

| Area | Operations |
|------|-----------|
| Platform | View global stats + chart, manage settings, clear cache |
| Users | Create/edit users, verify email, ban/unban, send warnings |
| Moderation | Resolve client reports, review flags, complaints (reply/categorize/resolve/reopen), reviews (reply/delete) |
| Stores | Approve/reject/suspend/unsuspend, toggle ordering, assign badges |
| Content taxonomy | CRUD categories, badges, store types |
| Orders | View all, cancel, refund |
| Finance | Payouts approve/reject/mark-paid, billing invoices mark-paid, stats |
| Marketplace | CRUD plans, plan features, tiers, duration offers, payment gateways, delivery pricing, promo codes |
| Templates | CRUD templates + edit html/css source, blocks, theme presets, lifecycle management |
| Media | Banners, global food moderation |
| Chefs | Approve/reject/delete chef profiles |
| Domains | View all custom domains |

## 3.2 Owner (store operator)

**Owns one or more stores.** Must have an approved store (unapproved → 403). Admins can also act as owners.

| Area | Operations |
|------|-----------|
| Onboarding | Multi-step wizard (status, types, location, social, breaks, complete) |
| Store setup | Update store info, template, logo, cover, pause, ordering toggle |
| Phones | Add/verify/set-primary/remove store phones (OTP) |
| Menu | CRUD foods + categories, upload food images |
| Offers | CRUD offers + images |
| Staff | CRUD staff + granular permissions |
| Orders | View, update status, bulk status/assign/delete, assign riders, view/favorite riders |
| POS | View in-store orders, update status |
| KDS | View kitchen queue, start/complete items |
| Sales | View stats, monthly, yearly |
| Reservations | Manage bookings, settings, schedules, statuses |
| Gallery | CRUD store images |
| Branches | CRUD branches, assign/remove users, per-branch templates/pages, duplicate template |
| Page builder | CRUD custom pages + saved sections + media assets |
| Templates | Choose template + theme preset |
| Chefs | Browse, hire, fire |
| Clients | List, ban/unban, report, view trust score |
| Domains | CRUD + verify + set primary |
| Subscription | View/change plan, invoices, payment method, pay |
| Banners | Own-store banners |

/ new
store owner assign some role with permission to staff in some branch


## 3.3 Delivery (rider)

| Area | Operations |
|------|-----------|
| Orders | View pending/active, accept, complete |
| Status | Toggle working/offline |
| Location | Update live GPS position |
| Areas | Manage delivery areas |
| Pricing | Choose model, subscribe, earnings + history |

## 3.4 Chef (freelance cook)

| Area | Operations |
|------|-----------|
| Profile | CRUD skills, diplomas, images, work history |
| Documents | Upload verification docs |
| Stores | View stores that hired me |
| Invitations | Receive/handle hire invitations (WebSocket) |
/ new
upload multiple document
## 3.5 Client (customer)

| Area | Operations |
|------|-----------|
| Account | Profile, avatar, password, phone OTP verification |
| Cart | Add/update/remove/clear |
| Orders | Place, view, reorder, track, complain |
| Reviews | Write/delete own reviews |
| Reservations | Book, view, cancel |
| Notifications | View + mark read |
| Favorites | Favorite stores |
| Promo | Validate codes |

#new features
/ client should have verified phone number  so he can order otherwise redirect him to verify his number or update it and verify it

---

## 3.6 Store staff sub-roles (permission matrix, not top-level roles)

Staff attached to a store via `StoreStaff` with a `store_role` and a JSON `permissions` array. `admin` and store `owner` always bypass; `manager` has all permissions; other roles (e.g. `kds`, `cook`, `chef`) get only what their permission list grants.

| Operation | manager | kds | cook | chef | custom |
|-----------|:-------:|:---:|:----:|:----:|:------:|
| View/update orders | ✅ | orders only | ❌ | ❌ | per list |
| KDS start/complete | ✅ | ✅ | ❌ | ❌ | per list |
| Menu editing | ✅ | ❌ | ❌ | ❌ | per list |
| All owner ops | ✅ | ❌ | ❌ | ❌ | ❌ |

*(This matrix is my understanding of intent — the exact permission keys live in the staff CRUD and `hasStorePermission` helper.)*
