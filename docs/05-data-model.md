# 5. Data Model Summary

~78+ tables. The existing `database-schema.md` at the repo root covers 70 tables but is **stale** — it predates these July migrations:

- `plans`, `store_subscriptions`, `billing_invoices`, `payment_gateways`, `delivery_pricing_tiers`, `delivery_subscriptions`, `store_branches`, `branch_user`

## Table groups

| Domain | Tables |
|--------|--------|
| **Auth/core** | `users`, `user_bans`, `personal_access_tokens`, `password_reset_tokens`, `sessions`, `notifications` |
| **System** | `cache`, `cache_locks`, `jobs`, `job_batches`, `failed_jobs`, `settings` |
| **Geography** | `wilayas`, `dairas`, `communes` |
| **Stores** | `stores`, `store_images`, `store_phones`, `store_social_links`, `store_domains`, `store_payouts`, `store_staff`, `badges`, `store_badge`, `store_type_categories`, `store_type_category`, `zones`, `store_branches`, `branch_user` |
| **Foods** | `categories`, `foods`, `food_images`, `category_food`, `food_offer_items` |
| **Offers/promos** | `offers`, `promo_codes` |
| **Orders** | `orders`, `order_items` |
| **Delivery** | `delivery_profiles`, `delivery_profile_areas`, `favorite_deliveries`, `delivery_pricing_tiers`, `delivery_subscriptions` |
| **Reviews** | `reviews`, `review_flags`, `complaints` |
| **Chefs** | `chef_profiles`, `chef_skills`, `chef_diplomas`, `chef_work_history`, `chef_images`, `chef_store_hires`, `chef_store` |
| **Reservations** | `reservation_settings`, `reservation_schedules`, `restaurant_tables`, `reservations` |
| **Templates/page builder** | `templates`, `template_blocks`, `theme_presets`, `page_assets`, `component_configs`, `ai_generation_jobs`, `saved_sections` |
| **Trust/moderation** | `favorites`, `client_bans`, `client_reports`, `client_trust_scores` |
| **Marketing** | `banners`, `posts` |
| **Billing/subscriptions** | `plans`, `plan_tiers`, `plan_features`, `plan_duration_offers`, `store_subscriptions`, `billing_invoices`, `payment_gateways`, `payment_methods` |

## Key facts

- `stores` is the hub table (30+ child relationships, ~90 FKs, 7 pivot tables).
- `users.role` enum: `admin|owner|delivery|client|chef`.
- Multi-currency pricing on foods (`price_dzd`, `price_usd`, `price_eur`).
- `templates.html_content` / `css_content` are LONGTEXT (admin-editable source).
- 11 legacy page-builder tables already dropped (`themes`, `pb_pages`, `published_pages`, `page_versions`).
- Phone verification: `users.phone_verified_at`, `store_phones.verified_at`.

## Recommended follow-up

I recommend **regenerating** `database-schema.md` to include the new tables (see file 06).
