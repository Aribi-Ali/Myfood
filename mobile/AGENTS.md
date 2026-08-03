# YallahKool Mobile App — AI Agent Guide

## Overview

Build a cross-platform mobile app (React Native) for **YallahKool**, a food ordering platform with 5 user roles:

| Role         | Purpose                                                      |
| ------------ | ------------------------------------------------------------ |
| **client**   | Browse stores, order food, track delivery, make reservations |
| **owner**    | Manage store (menu, orders, staff, settings)                 |
| **delivery** | Accept/complete deliveries, manage pricing                   |
| **chef**     | View hired stores, KDS orders                                |

## API Base

```
Base URL: process.env.API_URL (default http://localhost:8000/api/v1)
Auth: Sanctum cookie-based (SPA mode) — login sets cookie, no token header needed
```

All authenticated endpoints require `credentials: 'include'` and `X-XSRF-TOKEN` header from the `XSRF-TOKEN` cookie.

**Response format (standardized):**

```ts
// Success
{ "success": true, "data": { ... }, "message": "..." }

// Error
{ "success": false, "message": "..." }

// Error with validation
{ "message": "...", "errors": { "field": ["error msg"] } }

// Paginated
{ "success": true, "data": [...], "pagination": { "current_page": 1, "last_page": 5, "total": 100, "per_page": 50 } }
```

---

## Auth Flow

```
1. GET  /sanctum/csrf-cookie          → get XSRF-TOKEN cookie
2. POST /api/v1/login                 → { email, password } → sets session cookie
3. GET  /api/v1/user                  → returns current user with role
4. POST /api/v1/logout                → clears session
```

Map user.role to app screens:

- `client` → ClientTab
- `owner` → OwnerTab
- `delivery` → DeliveryTab
- `chef` → ChefTab

---

## Screens by Role

### CLIENT

| Screen                      | Endpoint(s)                                                                                                  | Method   |
| --------------------------- | ------------------------------------------------------------------------------------------------------------ | -------- |
| Home / Store List           | `GET /stores`                                                                                                | List     |
| Store Detail                | `GET /stores/{alias}`                                                                                        | Detail   |
| Store Menu                  | `GET /stores/{alias}/foods`                                                                                  | List     |
| Store Reviews               | `GET /stores/{alias}/reviews`                                                                                | List     |
| Cart                        | `GET /client/cart` + `POST /client/cart/add` + `POST /client/cart/remove` + `POST /client/cart/clear`        | CRUD     |
| Place Order                 | `POST /client/orders`                                                                                        | Create   |
| My Orders                   | `GET /client/orders`                                                                                         | List     |
| Order Tracking              | `GET /orders/{id}` + `POST /orders/{id}/status`                                                              | Poll     |
| Profile                     | `GET /user` + `PUT /user` + `POST /user/avatar` + `POST /user/password`                                      | CRUD     |
| Reservations                | `POST /stores/{alias}/reservations/check` + `POST /stores/{alias}/reservations` + `GET /client/reservations` | CRUD     |
| Reservation Settings (read) | `GET /stores/{alias}/reservations/settings`                                                                  | Read     |
| Become a Chef               | `GET /client/chef` + `POST /client/chef` + `POST /client/chef/document`                                      | CRUD     |
| Search                      | `GET /search?q=...`                                                                                          | Search   |
| Chefs List                  | `GET /chefs` + `GET /chefs/{id}`                                                                             | List     |
| Complaints                  | `POST /complaints` + `POST /client/orders/{id}/complaint`                                                    | Create   |
| Promo Validation            | `POST /promo/validate`                                                                                       | Validate |

**Navigation:** Home → Stores → Store Detail → Cart → Checkout → Order Tracking

---

### OWNER

| Screen                | Endpoint(s)                                                                                                                                       | Method   |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Dashboard             | `GET /owner/dashboard`                                                                                                                            | Stats    |
| My Store              | `GET /owner/store`                                                                                                                                | Read     |
| Update Template       | `PUT /owner/store/template`                                                                                                                       | Update   |
| Menu (Foods)          | `GET /owner/foods` + `POST` + `PUT/{id}` + `DELETE/{id}` + `POST/{id}/image`                                                                      | CRUD     |
| Food Categories       | `GET /owner/foods/categories`                                                                                                                     | List     |
| Orders                | `GET /owner/orders` + `GET /owner/orders/{id}` + `PUT/{id}/status`                                                                                | CRUD     |
| Bulk Orders           | `POST /owner/orders/bulk/status` + `POST /owner/orders/bulk/assign` + `DELETE /owner/orders/bulk`                                                 | Batch    |
| Assign Rider          | `POST /owner/orders/{id}/assign` + `GET /owner/riders`                                                                                            | Update   |
| Sales                 | `GET /owner/sales` + `GET /owner/sales/stats` + `/monthly` + `/yearly`                                                                            | Stats    |
| Offers                | `GET /owner/offers` + `POST` + `PUT/{id}` + `DELETE/{id}`                                                                                         | CRUD     |
| Staff                 | `GET /owner/staff` + `POST` + `PUT/{id}` + `DELETE/{id}`                                                                                          | CRUD     |
| Reservations          | `GET /owner/reservations` + `GET/{id}` + `PUT/{id}/status`                                                                                        | CRUD     |
| Reservations Settings | `GET /owner/reservations/settings` + `PUT /owner/reservations/settings` + `PUT /owner/reservations/schedules`                                     | CRUD     |
| Chefs (hire)          | `GET /owner/chefs` + `GET /owner/chefs/hired` + `POST/{id}/hire` + `POST/{id}/fire`                                                               | Hire     |
| Gallery               | `GET /owner/gallery` + `POST` + `DELETE/{id}`                                                                                                     | CRUD     |
| Clients (ban)         | `GET /owner/clients` + `POST/{clientId}/ban` + `/unban` + `/report` + `/trust`                                                                    | Manage   |
| Media Assets          | `GET /owner/assets` + `POST` + `DELETE/{asset}`                                                                                                   | CRUD     |
| Settings              | `GET /owner/settings` + `PUT` + `POST /logo` + `POST /cover` + `POST /pause`                                                                      | CRUD     |
| Onboarding            | `GET /onboarding/status` + `/store-types` + `POST /basic-info` + `/store-types` + `/location` + `/social-links` + `/break-settings` + `/complete` | Wizard   |
| Custom Domains        | `GET /owner/domains` + `POST` + `POST/{id}/verify` + `/primary` + `DELETE/{id}`                                                                   | CRUD     |
| Templates (read)      | `GET /templates` + `GET /templates/{slug}` + `GET /templates/{slug}/presets`                                                                      | List     |
| KDS Orders            | `GET /kds/orders` + `POST /kds/orders/{id}/start` + `POST /kds/orders/{id}/complete`                                                              | KDS      |
| Saved Sections        | `GET /owner/saved-sections` + `POST` + `PUT/{id}` + `DELETE/{id}`                                                                                 | CRUD     |
| Cart                  | `GET /client/cart` + `POST /client/cart/add/update/remove/clear`                                                                                  | Cart     |
| POS Orders            | `GET /pos/orders` + `POST /pos/orders/{id}/status`                                                                                                | POS Sync |

**Navigation:** Dashboard → Orders / Menu / Staff / Settings / Sales / Chefs / Reservations / Gallery

---

### DELIVERY

| Screen           | Endpoint(s)                                     | Method         |
| ---------------- | ----------------------------------------------- | -------------- |
| Available Orders | `GET /delivery/pending`                         | List (poll 5s) |
| Active Orders    | `GET /delivery/active`                          | List (poll 5s) |
| Accept Order     | `POST /delivery/orders/{id}/accept`             | Action         |
| Complete Order   | `POST /delivery/orders/{id}/complete`           | Action         |
| Stats            | `GET /delivery/stats`                           | Stats          |
| Toggle Working   | `POST /delivery/status`                         | Toggle         |
| Update Location  | `POST /delivery/location`                       | Update         |
| Delivery Areas   | `GET /delivery/areas` + `POST /delivery/areas`  | CRUD           |
| Pricing          | `POST /delivery/pricing`                        | Update         |
| Profile          | `GET /user` + `PUT /user` + `POST /user/avatar` | Read           |

**Navigation:** Available → Accept → Active → Complete → Stats

---

### CHEF

| Screen       | Endpoint(s)                                                                          | Method |
| ------------ | ------------------------------------------------------------------------------------ | ------ |
| My Stores    | `GET /client/chef/stores`                                                            | List   |
| KDS Orders   | `GET /kds/orders` + `POST /kds/orders/{id}/start` + `POST /kds/orders/{id}/complete` | KDS    |
| Chef Profile | `GET /client/chef` + `POST /client/chef` + `POST /client/chef/document`              | CRUD   |
| Profile      | `GET /user`                                                                          | Read   |

**Navigation:** My Stores → KDS Orders → Chef Profile

---

## Shared / Utility Endpoints

| Purpose              | Endpoint                        | Method |
| -------------------- | ------------------------------- | ------ |
| Geography (wilayas)  | `GET /geo/wilayas`              | List   |
| Geography (dairas)   | `GET /geo/wilayas/{id}/dairas`  | List   |
| Geography (communes) | `GET /geo/dairas/{id}/communes` | List   |
| Features             | `GET /features`                 | Flags  |
| Upload Asset         | `POST /owner/assets`            | File   |
| Login named route    | `GET /login` → 401 JSON         | Error  |

---

## Core Data Types

```ts
// — Auth —
User {
  id: number; name: string; email: string; phone: string | null
  role: 'client' | 'owner' | 'delivery' | 'chef' 
  profile_image: string | null
  wilaya: string | null; address: string | null
  daira?: string | null; commune?: string | null
  store?: StoreSummary | null
  delivery_profile?: { transporter_type: string; is_working: boolean; ... } | null
  chef_profile?: any | null
}

// — Store —
StoreSummary { id: number; name: string; alias: string; logo: string | null; avg_rating: number; ... }

// — Food —
Food {
  id: number; store_id: number; name: string; description: string | null
  price: number; new_price: number | null; image: string | null
  cooking_time: number | null; is_offer: boolean
  categories?: { id: number; name: string }[]
}

// — Order —
OrderData {
  id: number; status: OrderStatus; delivery_type: 'delivery' | 'pickup'
  total_amount: number; discount_amount: number; delivery_fee: number
  address: string | null; phone: string | null; notes: string | null
  items: OrderItemData[]; delivery_guy: DeliveryGuy | null
  store: StoreSummary & { phone?: string; address?: string }
  client_name?: string; client_phone?: string
  created_at: string
}

type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled'

// — Review —
Review { id: number; rating: number; comment: string | null; user: string; avatar: string | null; created_at: string }

// — Reservation —
ReservationData {
  id: number; store_id: number; name: string; phone: string | null
  party_size: number; reservation_date: string; reservation_time: string
  notes: string | null; status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
}
```

---

## Key Implementation Notes

1. **Auth**: Call `GET /sanctum/csrf-cookie` before login. All subsequent requests include credentials.
2. **Error handling**: Always check `response.success`. If false, show `response.message`. If `response.errors` exists, show field-level errors.
3. **Polling**: Delivery and tracking screens poll every 5s. KDS polls every 5s. Client orders polls every 10s.
4. **Images**: `getImageUrl(path)` → if path starts with `http`, use as-is; otherwise prepend `{API_ORIGIN}/storage/`.
5. **Pagination**: List endpoints return `{ data: [...], pagination: { current_page, last_page, total, per_page } }`. Support page param `?page=N`.
6. **Geography**: Load wilayas first, then dairas on selection, then communes.
7. **Reservation flow**: Check availability first, then create reservation with `{ name, phone, party_size, reservation_date, reservation_time, notes }`.
8. **Order placement**: Cart is managed server-side via `POST /client/cart/*`. Place order with `POST /client/orders` (items come from server cart).
9. **Onboarding wizard**: For new owners — get store types, then sequentially save basic-info, store-types, location, social-links, break-settings, complete.
10. **Template selection**: `PUT /owner/store/template` with `{ template_slug, theme_preset_id }`.
11. **Delivery flow**: Accept → Complete. Location updates sent via `POST /delivery/location`.
12. **Complaints**: Only filed against stores the user has a delivered order from.

---

## Navigation Structure

```
App
├── AuthStack (unauthenticated)
│   ├── Login
│   ├── Register
│   ├── ForgotPassword
│   └── ResetPassword
│
├── ClientTab
│   ├── Home (stores list)
│   ├── StoreDetail (menu + reviews)
│   ├── Cart / Checkout
│   ├── Orders (list + tracking)
│   ├── Reservations
│   ├── Profile (edit, security)
│   ├── BecomeChef
│   └── Chefs (browse)
│
├── OwnerTab
│   ├── Dashboard
│   ├── Orders (list + detail + status update)
│   ├── Menu (foods CRUD)
│   ├── Staff
│   ├── Settings
│   ├── Sales
│   ├── Chefs (hire/fire)
│   ├── Reservations
│   ├── KDS
│   └── Onboarding (first time)
│
├── DeliveryTab
│   ├── Available Orders
│   ├── Active Orders
│   ├── Stats
│   ├── Areas / Pricing
│   └── Profile
│
├── ChefTab
│   ├── My Stores
│   ├── KDS Orders
│   └── Profile│
```
