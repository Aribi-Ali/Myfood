# 4. Frontend Pages Map

All pages live under `front-end/src/app`. Next.js App Router — every folder is a route.

## 4.1 Public storefront

| Route | Description |
|-------|-------------|
| `/` (root) | Landing / home page |
| `/stores` | Store listing/explore |
| `/stores/[alias]` | Store detail page (menu, info) |
| `/stores/[alias]/page/[pageSlug]` | Custom page on a store (built with page builder) |
| `/stores/[alias]/reservation` | Book a reservation at the store |
| `/branches` | Branch listing (multi-location) |
| `/become-chef` | Landing for chefs to sign up |
| `/error` | Error page |

## 4.2 Auth

| Route | Description |
|-------|-------------|
| `/login` | Login |
| `/register` | Registration |
| `/forgot-password` | Request password reset |
| `/reset-password` | Reset password (token from email link) |

## 4.3 Client area

| Route | Description |
|-------|-------------|
| `/profile` | Own profile / settings |
| `/orders` | My orders list + tracking |
| `/delivery` | (client-facing delivery view?) |
| `/kds` | (KDS screens are in dashboard too) |

## 4.4 Owner dashboard (`/dashboard/*`)

| Route | Description |
|-------|-------------|
| `/dashboard` | Owner overview |
| `/dashboard/menu` | Menu / foods management |
| `/dashboard/offers` | Offers |
| `/dashboard/orders` | Orders + status management |
| `/dashboard/sales` | Sales stats |
| `/dashboard/kds` | Kitchen display |
| `/dashboard/staff` | Staff management |
| `/dashboard/branches` | Branches |
| `/dashboard/clients` | Client management (ban/report/trust) |
| `/dashboard/chefs` | Hire/fire chefs |
| `/dashboard/gallery` | Gallery |
| `/dashboard/media` | Media assets |
| `/dashboard/page-builder` | GrapesJS page builder |
| `/dashboard/pages` | Custom pages list |
| `/dashboard/phones` | Store phone OTP management |
| `/dashboard/profile` | Owner profile |
| `/dashboard/profile/store` | Store profile settings |
| `/dashboard/profile/chef` | Chef profile |
| `/dashboard/profile/delivery` | Delivery profile |
| `/dashboard/reservations` | Reservations |
| `/dashboard/sales` | Sales |
| `/dashboard/settings` | Settings hub |
| `/dashboard/settings/breaks` | Break schedule |
| `/dashboard/settings/delivery` | Delivery settings |
| `/dashboard/settings/domain` | Custom domain |
| `/dashboard/settings/hours` | Opening hours |
| `/dashboard/settings/logo` | Logo / cover |
| `/dashboard/settings/ordering` | Ordering toggle |
| `/dashboard/settings/social` | Social links |
| `/dashboard/subscription` | Subscription |
| `/dashboard/subscription/change` | Change plan |
| `/dashboard/subscription/invoices` | Invoices |
| `/dashboard/subscription/payment` | Payment method |
| `/dashboard/templates` | Choose template |
| `/dashboard/themes` | Theme presets |

## 4.5 Admin dashboard (`/dashboard/admin/*`)

| Route | Description |
|-------|-------------|
| `/dashboard/admin` | Admin overview |
| `/dashboard/admin/badges` | Badges CRUD |
| `/dashboard/admin/banners` | Banners CRUD |
| `/dashboard/admin/billing` | Billing |
| `/dashboard/admin/categories` | Categories |
| `/dashboard/admin/chefs` | Chef moderation |
| `/dashboard/admin/complaints` | Complaints |
| `/dashboard/admin/delivery-pricing` | Delivery pricing |
| `/dashboard/admin/domains` | Domains |
| `/dashboard/admin/foods` | Food moderation |
| `/dashboard/admin/orders` | All orders |
| `/dashboard/admin/payment-gateways` | Payment gateways |
| `/dashboard/admin/payouts` | Payouts |
| `/dashboard/admin/plans` | Plans |
| `/dashboard/admin/plans/features` | Plan features |
| `/dashboard/admin/plans/[id]` | Plan detail/tiers |
| `/dashboard/admin/promo-codes` | Promo codes |
| `/dashboard/admin/reports` | Client reports |
| `/dashboard/admin/reservations` | Reservations |
| `/dashboard/admin/reviews` | Reviews |
| `/dashboard/admin/settings` | Platform settings |
| `/dashboard/admin/store-types` | Store types |
| `/dashboard/admin/stores` | Stores moderation |
| `/dashboard/admin/templates` | Template catalog + source editing |
| `/dashboard/admin/users` | Users |

## 4.6 Frontend tech notes

- **State**: React Context (language, auth) + TanStack React Query (server state).
- **Real-time**: laravel-echo + pusher-js for orders/KDS/delivery/chef events.
- **Page builder**: GrapesJS.
- **Maps**: Leaflet + react-leaflet (delivery location).
- **Templates**: lazy-loaded React components per template (69 lazy imports via `template-loader.ts`), matching the backend template catalog exactly (69 templates, 69 default presets).
- **i18n**: `useLanguage` context; all public strings via `t()`; EN/FR/AR + RTL.
- **Layout rule**: every flex child in a scroll chain needs `min-h-0` (documented project rule).
