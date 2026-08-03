# Database Schema Diagram — Food Delivery Application

> **80 tables** (including system, pivot, and legacy-replacement tables)

---

## ER Diagram (Mermaid)

```mermaid
erDiagram
    %% ==============================
    %% 1. CORE / AUTH
    %% ==============================
    users {
        bigint id PK
        string name
        string email UK
        timestamp email_verified_at
        string password
        string phone UK
        string role "admin|owner|delivery|client|chef"
        string profile_image
        string wilaya
        string daira
        string commune
        json delivery_zones
        string address
        decimal latitude
        decimal longitude
        timestamp created_at
        timestamp updated_at
    }

    user_bans {
        bigint id PK
        bigint user_id FK
        bigint banned_by FK
        string reason
        timestamp banned_at
        timestamp unbanned_at
    }

    personal_access_tokens {
        bigint id PK
        string tokenable_type
        bigint tokenable_id
        text name
        string token UK
        text abilities
        timestamp last_used_at
        timestamp expires_at
    }

    password_reset_tokens {
        string email PK
        string token
        timestamp created_at
    }

    sessions {
        string id PK
        bigint user_id FK
        string ip_address
        text user_agent
        longtext payload
        integer last_activity
    }

    notifications {
        uuid id PK
        string type
        string notifiable_type
        bigint notifiable_id
        text data
        timestamp read_at
    }

    %% ==============================
    %% 2. SYSTEM
    %% ==============================
    cache {
        string key PK
        mediumtext value
        integer expiration
    }

    cache_locks {
        string key PK
        string owner
        integer expiration
    }

    jobs {
        bigint id PK
        string queue
        longtext payload
        tinyint attempts
        integer reserved_at
        integer available_at
        integer created_at
    }

    job_batches {
        string id PK
        string name
        integer total_jobs
        integer pending_jobs
        integer failed_jobs
        longtext failed_job_ids
        mediumtext options
        integer cancelled_at
        integer created_at
        integer finished_at
    }

    failed_jobs {
        bigint id PK
        string uuid UK
        text connection
        text queue
        longtext payload
        longtext exception
        timestamp failed_at
    }

    settings {
        bigint id PK
        string key UK
        text value
        string type
    }

    %% ==============================
    %% 3. GEOGRAPHY
    %% ==============================
    wilayas {
        bigint id PK
        string code UK
        string name_fr
        string name_ar
    }

    dairas {
        bigint id PK
        bigint wilaya_id FK
        string name_fr
        string name_ar
    }

    communes {
        bigint id PK
        bigint daira_id FK
        bigint wilaya_id FK
        string name_fr
        string name_ar
    }

    %% ==============================
    %% 4. STORES
    %% ==============================
    stores {
        bigint id PK
        bigint owner_id FK UK
        bigint cover_image_id FK
        bigint main_image_id FK
        bigint theme_preset_id FK
        string name
        string template_slug
        string alias UK
        text description
        decimal latitude
        decimal longitude
        string email
        string phone
        string cover_image
        string logo_path
        text opening_hours
        string document_path
        string wilaya
        string daira
        string commune
        string address
        boolean is_approved
        boolean is_active
        string onboarding_status
        boolean ordering_enabled
        boolean is_paused
        string pause_note
        boolean allows_pre_orders
        integer pre_order_lead_time_hours
        string order_prefix
        string order_suffix
        tinyint order_padding
        integer order_start_number
        integer avg_prep_time
        decimal delivery_zone_radius
        integer base_delivery_fee
        integer avg_delivery_time_per_km
        timestamp break_start
        timestamp break_end
        text break_note
    }

    store_images {
        bigint id PK
        bigint store_id FK
        string path
        boolean is_cover
    }

    store_phones {
        bigint id PK
        bigint store_id FK
        string phone
        boolean is_primary
        tinyint order_index
    }

    store_social_links {
        bigint id PK
        bigint store_id FK
        string platform
        string url
        string label
    }

    store_domains {
        bigint id PK
        bigint store_id FK
        string domain UK
        string verification_code
        timestamp verified_at
        boolean is_primary
    }

    store_payouts {
        bigint id PK
        bigint store_id FK
        decimal amount
        string currency
        string status
        string bank_name
        string bank_account
        string phone
        text notes
        bigint approved_by FK
        timestamp approved_at
        timestamp paid_at
    }

    store_staff {
        bigint id PK
        bigint store_id FK
        bigint user_id FK
        string store_role
        text permissions
        integer years_of_experience
        string diplomas
        integer age
        text bio
        boolean display_on_profile
    }

    badges {
        bigint id PK
        string name
        string description
        string color_code
        string icon
    }

    store_badge {
        bigint id PK
        bigint store_id FK
        bigint badge_id FK
    }

    store_type_categories {
        bigint id PK
        string name
        string slug UK
        string icon
        boolean is_active
    }

    store_type_category {
        bigint id PK
        bigint store_id FK
        bigint store_type_category_id FK
    }

    zones {
        bigint id PK
        bigint store_id FK
        string name
        decimal radius_km
        decimal fee
    }

    %% ==============================
    %% 5. FOODS
    %% ==============================
    categories {
        bigint id PK
        string name
        string slug UK
        string image
        string short_description
        text full_description
        string meta_title
        text meta_description
        string meta_keywords
    }

    foods {
        bigint id PK
        bigint store_id FK
        bigint category_id FK
        string name
        text description
        string image
        decimal price
        decimal price_usd
        decimal price_eur
        decimal new_price
        decimal new_price_usd
        decimal new_price_eur
        boolean is_available
        boolean is_offer
        text ingredients
        integer cooking_time
        integer bought_count
    }

    food_images {
        bigint id PK
        bigint food_id FK
        string image_path
    }

    category_food {
        bigint food_id FK
        bigint category_id FK
    }

    food_offer_items {
        bigint id PK
        bigint parent_food_id FK
        bigint child_food_id FK
        integer quantity
    }

    %% ==============================
    %% 6. OFFERS & PROMOS
    %% ==============================
    offers {
        bigint id PK
        bigint store_id FK
        string title
        text description
        string image_path
        datetime valid_from
        datetime valid_to
        boolean active
    }

    promo_codes {
        bigint id PK
        bigint store_id FK
        string code UK
        string type
        decimal value
        datetime expires_at
        boolean is_active
    }

    %% ==============================
    %% 7. ORDERS
    %% ==============================
    orders {
        bigint id PK
        integer store_order_number
        bigint client_id FK
        bigint store_id FK
        bigint delivery_id FK
        bigint assigned_chef_id FK
        bigint promo_code_id FK
        string status
        string delivery_type
        datetime scheduled_at
        integer estimated_delivery_minutes
        integer delivery_fee
        string pickup_time
        decimal total_amount
        decimal commission_amount
        decimal discount_amount
        text address
        decimal latitude
        decimal longitude
        string phone
        text notes
        timestamp cancelled_at
        timestamp refunded_at
    }

    order_items {
        bigint id PK
        bigint order_id FK
        bigint food_id FK
        integer quantity
        decimal price
    }

    %% ==============================
    %% 8. DELIVERY
    %% ==============================
    delivery_profiles {
        bigint id PK
        bigint user_id FK UK
        string phone
        string image
        string transporter_type
        boolean is_working
        decimal day_price
        decimal night_price
    }

    delivery_profile_areas {
        bigint id PK
        bigint delivery_profile_id FK
        bigint wilaya_id FK
        bigint daira_id FK
        bigint commune_id FK
        decimal day_price
        decimal night_price
    }

    favorite_deliveries {
        bigint id PK
        bigint owner_id FK
        bigint delivery_user_id FK
    }

    %% ==============================
    %% 9. REVIEWS & COMPLAINTS
    %% ==============================
    reviews {
        bigint id PK
        bigint client_id FK
        bigint store_id FK
        integer rating
        text comment
        text admin_reply
    }

    review_flags {
        bigint id PK
        bigint review_id FK
        bigint user_id FK
        string reason
    }

    complaints {
        bigint id PK
        bigint client_id FK
        bigint store_id FK
        bigint order_id FK
        bigint food_id FK
        string subject
        text description
        string status
        string category
        text admin_reply
        timestamp resolved_at
    }

    %% ==============================
    %% 10. CHEFS
    %% ==============================
    chef_profiles {
        bigint id PK
        bigint user_id FK UK
        text bio
        string specialization
        integer years_of_experience
        string cuisines_expertise
        boolean is_available
        json working_hours
        decimal average_rating
        integer reviews_count
        integer hourly_rate
        integer base_menu_rate
        boolean is_verified
        timestamp verified_at
        string verification_document
        timestamp rejected_at
        string rejection_reason
        json skills
        json diplomas
        integer experience_years
        boolean is_public
    }

    chef_skills {
        bigint id PK
        bigint chef_id FK
        string skill_name
        integer proficiency_level
        text description
        year certified_year
    }

    chef_diplomas {
        bigint id PK
        bigint chef_id FK
        string diploma_name
        string issuing_institution
        year issue_date
        string diploma_file
        boolean verified
    }

    chef_work_history {
        bigint id PK
        bigint chef_id FK
        string restaurant_name
        string position
        year start_year
        year end_year
        text description
        string location
    }

    chef_images {
        bigint id PK
        bigint chef_id FK
        bigint chef_profile_id FK
        string image_path
        string image_type
        text description
        boolean is_featured
        integer sort_order
    }

    chef_store_hires {
        bigint id PK
        bigint chef_profile_id FK
        bigint store_id FK
        bigint hired_by FK
        timestamp hired_at
        boolean is_active
    }

    chef_store {
        bigint id PK
        bigint chef_id FK
        bigint store_id FK
        string status
        date start_date
        date end_date
    }

    %% ==============================
    %% 11. RESERVATIONS
    %% ==============================
    reservation_settings {
        bigint id PK
        bigint store_id FK
        boolean enabled
        boolean auto_confirm
        boolean manual_confirm
        integer duration_minutes
        integer slot_interval_minutes
        integer min_advance_hours
        integer max_booking_days
        integer min_party_size
        integer max_party_size
        boolean allow_notes
        boolean allow_special_requests
        boolean allow_cancellation
        integer cancellation_deadline_hours
        boolean reminder_24h
        boolean reminder_2h
    }

    reservation_schedules {
        bigint id PK
        bigint store_id FK
        tinyint day_of_week
        boolean enabled
        time open_time
        time close_time
    }

    restaurant_tables {
        bigint id PK
        bigint store_id FK
        string name
        integer table_number
        integer capacity
        integer min_capacity
        string location
        text description
        string status
    }

    reservations {
        bigint id PK
        integer store_reservation_number
        bigint store_id FK
        bigint client_id FK
        string name
        string email
        string phone
        tinyint party_size
        date reservation_date
        time reservation_time
        text notes
        text special_requests
        string status
        string cancellation_reason
        timestamp cancelled_at
    }

    %% ==============================
    %% 12. TEMPLATES & PAGE BUILDER
    %% ==============================
    templates {
        bigint id PK
        string name
        string slug UK
        text description
        string category
        string thumbnail
        string component_path
        longtext html_content
        longtext css_content
        boolean has_react_component
        smallint sort_order
        boolean is_active
        string status
        json theme_variables
        json grapes_data
        json default_blocks
        string preview_url
    }

    template_blocks {
        bigint id PK
        bigint template_id FK
        string type
        string label
        text description
        string category
        smallint sort_order
        json config_schema
        json default_config
        boolean is_required
        boolean is_active
    }

    theme_presets {
        bigint id PK
        bigint template_id FK
        string name
        text description
        json css_vars
        json colors
        boolean is_default
    }

    page_assets {
        bigint id PK
        bigint store_id FK
        bigint user_id FK
        string original_name
        string path
        string url
        string mime_type
        integer size_bytes
        integer width
        integer height
        string disk
        string group
        json metadata
    }

    component_configs {
        bigint id PK
        bigint store_id FK
        bigint theme_id FK
        string block_type
        string component_id
        json config
        json defaults
        boolean is_active
    }

    ai_generation_jobs {
        bigint id PK
        bigint store_id FK
        bigint user_id FK
        string type
        json input_payload
        json output_payload
        string status
        text error_message
        string queue_job_id
        timestamp completed_at
    }

    saved_sections {
        bigint id PK
        bigint store_id FK
        string name
        longtext html
        longtext css
        string thumbnail
        integer sort_order
    }

    %% ==============================
    %% 13. CLIENT TRUST & MODERATION
    %% ==============================
    favorites {
        bigint id PK
        bigint user_id FK
        bigint store_id FK
        bigint food_id FK
    }

    client_bans {
        bigint id PK
        bigint store_id FK
        bigint client_id FK
        string reason
        timestamp banned_at
    }

    client_reports {
        bigint id PK
        bigint store_id FK
        bigint client_id FK
        bigint reporter_id FK
        string reason
        text description
        string status
        text admin_reply
        timestamp resolved_at
    }

    client_trust_scores {
        bigint id PK
        bigint client_id FK
        bigint store_id FK
        tinyint score
        integer completed_orders
        integer cancelled_orders
        decimal avg_rating_given
        integer total_complaints
        integer total_reports_against
        timestamp last_calculated_at
    }

    %% ==============================
    %% 14. MARKETING
    %% ==============================
    banners {
        bigint id PK
        bigint store_id FK
        string image_path
        string link_url
        boolean active
    }

    posts {
        bigint id PK
        bigint store_id FK
        string title
        text content
        string image
    }

    %% ==============================
    %% 15. SUBSCRIPTIONS & BILLING
    %% ==============================
    plans {
        bigint id PK
        string name
        string slug UK
        text description
        boolean is_active
        integer sort_order
    }

    plan_features {
        bigint id PK
        string code UK
        string name
        text description
        string icon
    }

    plan_feature_assignments {
        bigint id PK
        bigint plan_id FK
        bigint plan_feature_id FK
        unique plan_id+plan_feature_id
    }

    plan_tiers {
        bigint id PK
        bigint plan_id FK
        string name
        integer min_orders
        integer max_orders
        decimal monthly_price
        boolean is_active
        integer sort_order
    }

    plan_duration_offers {
        bigint id PK
        bigint plan_tier_id FK
        integer months
        decimal discount_percent
        string discount_label
        boolean is_popular
        boolean is_active
    }

    store_subscriptions {
        bigint id PK
        bigint store_id FK UK
        bigint plan_tier_id FK
        bigint plan_duration_offer_id FK
        string status "trialing|active|past_due|cancelled|expired|suspended"
        datetime trial_ends_at
        datetime start_date
        datetime end_date
        datetime cancelled_at
        decimal monthly_price_snapshot
        integer current_period_orders
        boolean auto_upgrade
        datetime last_tier_check_at
    }

    billing_invoices {
        bigint id PK
        bigint store_subscription_id FK
        string invoice_number UK
        datetime period_start
        datetime period_end
        integer total_orders
        string tier_applied
        string plan_name
        decimal base_amount
        decimal discount_amount
        decimal tax_amount
        decimal total_amount
        string currency
        string status "pending|pending_cash|paid|failed|refunded|cancelled|void"
        string payment_method_type
        string gateway_transaction_id
        datetime paid_at
        bigint paid_by_user_id FK
        text notes
    }

    payment_gateways {
        bigint id PK
        string code UK
        string name
        boolean is_active
        json config
        json supported_currencies
        integer sort_order
    }

    payment_methods {
        bigint id PK
        bigint store_id FK
        bigint gateway_id FK
        string type "cash|bank_transfer|card"
        json details
        boolean is_default
        boolean is_verified
    }

    delivery_pricing_tiers {
        bigint id PK
        string model_type "commission|flat_fee|subscription"
        string name
        integer tier_level
        integer min_monthly_orders
        integer max_monthly_orders
        decimal commission_percent
        decimal flat_fee_per_delivery
        decimal monthly_price
        integer max_deliveries
        boolean is_active
        integer sort_order
    }

    delivery_subscriptions {
        bigint id PK
        bigint delivery_profile_id FK
        bigint tier_id FK
        bigint duration_offer_id FK
        datetime start_date
        datetime end_date
        string status "active|expired|cancelled"
        boolean auto_renew
        decimal monthly_price_snapshot
    }

    %% ==============================
    %% 16. BRANCHES (multi-location)
    %% ==============================
    store_branches {
        bigint id PK
        bigint store_id FK
        string name
        string alias UK
        text description
        string template_slug
        bigint theme_preset_id FK
        string cover_image
        string logo_path
        string document_path
        text opening_hours
        string wilaya
        string daira
        string commune
        string address
        decimal latitude
        decimal longitude
        string email
        string phone
        boolean is_active
        timestamp break_start
        timestamp break_end
        text break_note
        integer avg_prep_time
        decimal delivery_zone_radius
        integer base_delivery_fee
        integer avg_delivery_time_per_km
        boolean ordering_enabled
        boolean is_paused
        string pause_note
        boolean allows_pre_orders
        integer pre_order_lead_time_hours
        string order_prefix
        string order_suffix
        tinyint order_padding
        integer order_start_number
        bigint cover_image_id FK
        bigint main_image_id FK
        boolean is_subscription_managed
    }

    branch_user {
        bigint id PK
        bigint branch_id FK
        bigint user_id FK
        string role
        json permissions
        unique branch_id+user_id
    }

    %% ==============================
    %% RELATIONSHIPS
    %% ==============================

    %% --- users ---
    users ||--o{ user_bans : "user_id"
    users ||--o{ user_bans : "banned_by"
    users ||--o{ stores : "owner_id"
    users ||--o{ store_staff : "user_id"
    users ||--o{ orders : "client_id"
    users ||--o{ orders : "delivery_id"
    users ||--o{ orders : "assigned_chef_id"
    users ||--o{ delivery_profiles : "user_id"
    users ||--o{ reviews : "client_id"
    users ||--o{ review_flags : "user_id"
    users ||--o{ complaints : "client_id"
    users ||--o{ chef_profiles : "user_id"
    users ||--o{ chef_skills : "chef_id"
    users ||--o{ chef_diplomas : "chef_id"
    users ||--o{ chef_work_history : "chef_id"
    users ||--o{ chef_images : "chef_id"
    users ||--o{ chef_store_hires : "hired_by"
    users ||--o{ chef_store : "chef_id"
    users ||--o{ favorites : "user_id"
    users ||--o{ client_bans : "client_id"
    users ||--o{ client_reports : "client_id"
    users ||--o{ client_reports : "reporter_id"
    users ||--o{ client_trust_scores : "client_id"
    users ||--o{ store_payouts : "approved_by"
    users ||--o{ page_assets : "user_id"
    users ||--o{ ai_generation_jobs : "user_id"
    users ||--o{ reservations : "client_id"
    users ||--o{ sessions : "user_id"
    users ||--o{ favorite_deliveries : "owner_id"
    users ||--o{ favorite_deliveries : "delivery_user_id"

    %% --- stores (hub) ---
    stores ||--o{ store_images : ""
    stores ||--o{ store_phones : ""
    stores ||--o{ store_social_links : ""
    stores ||--o{ store_domains : ""
    stores ||--o{ store_payouts : ""
    stores ||--o{ store_staff : ""
    stores ||--o{ store_badge : ""
    stores ||--o{ store_type_category : ""
    stores ||--o{ zones : ""
    stores ||--o{ foods : ""
    stores ||--o{ offers : ""
    stores ||--o{ promo_codes : ""
    stores ||--o{ orders : ""
    stores ||--o{ reviews : ""
    stores ||--o{ complaints : ""
    stores ||--o{ posts : ""
    stores ||--o{ banners : ""
    stores ||--o{ favorites : ""
    stores ||--o{ reservation_settings : ""
    stores ||--o{ reservation_schedules : ""
    stores ||--o{ restaurant_tables : ""
    stores ||--o{ reservations : ""
    stores ||--o{ page_assets : ""
    stores ||--o{ component_configs : ""
    stores ||--o{ ai_generation_jobs : ""
    stores ||--o{ saved_sections : ""
    stores ||--o{ chef_store_hires : ""
    stores ||--o{ chef_store : ""
    stores ||--o{ client_bans : ""
    stores ||--o{ client_reports : ""
    stores ||--o{ client_trust_scores : ""
    stores ||--o{ store_images : "cover_image_id|main_image_id"

    %% --- geography ---
    wilayas ||--o{ dairas : ""
    wilayas ||--o{ communes : ""
    dairas ||--o{ communes : ""
    delivery_profiles ||--o{ delivery_profile_areas : ""
    wilayas ||--o{ delivery_profile_areas : ""
    dairas ||--o{ delivery_profile_areas : ""
    communes ||--o{ delivery_profile_areas : ""

    %% --- foods ---
    foods ||--o{ food_images : ""
    foods ||--o{ order_items : ""
    foods ||--o{ category_food : ""
    foods ||--o{ food_offer_items : "parent_food_id|child_food_id"
    categories ||--o{ category_food : ""

    %% --- orders ---
    orders ||--o{ order_items : ""
    orders ||--o{ complaints : ""
    promo_codes ||--o{ orders : ""

    %% --- reviews ---
    reviews ||--o{ review_flags : ""
    reviews ||--o{ complaints : ""

    %% --- templates ---
    templates ||--o{ template_blocks : ""
    templates ||--o{ theme_presets : ""
    stores ||--o{ theme_presets : "theme_preset_id"

    %% --- chef_profiles ---
    chef_profiles ||--o{ chef_images : ""
    chef_profiles ||--o{ chef_store_hires : ""

    %% --- plans / subscriptions / billing ---
    plans ||--o{ plan_features : "plan_feature_assignments"
    plans ||--o{ plan_tiers : ""
    plan_features ||--o{ plans : "plan_feature_assignments"
    plan_tiers ||--o{ plan_duration_offers : ""
    stores ||--o{ store_subscriptions : ""
    plan_tiers ||--o{ store_subscriptions : ""
    plan_duration_offers ||--o{ store_subscriptions : ""
    store_subscriptions ||--o{ billing_invoices : ""
    users ||--o{ billing_invoices : "paid_by_user_id"
    payment_gateways ||--o{ payment_methods : ""
    stores ||--o{ payment_methods : ""

    %% --- delivery pricing / subscriptions ---
    delivery_profiles ||--o{ delivery_subscriptions : ""
    delivery_pricing_tiers ||--o{ delivery_subscriptions : "tier_id"
    plan_duration_offers ||--o{ delivery_subscriptions : "duration_offer_id"

    %% --- branches ---
    stores ||--o{ store_branches : ""
    store_branches ||--o{ branch_user : ""
    users ||--o{ branch_user : ""
    theme_presets ||--o{ store_branches : "theme_preset_id"
```

---

## Table Groups Summary

| Group | Tables | Description |
|-------|--------|-------------|
| **Core/Auth** | `users`, `user_bans`, `personal_access_tokens`, `password_reset_tokens`, `sessions`, `notifications` | Users, roles, auth tokens |
| **System** | `cache`, `cache_locks`, `jobs`, `job_batches`, `failed_jobs`, `settings` | Laravel internals |
| **Geography** | `wilayas`, `dairas`, `communes` | Algerian administrative divisions |
| **Stores** | `stores`, `store_images`, `store_phones`, `store_social_links`, `store_domains`, `store_payouts`, `store_staff`, `badges`, `store_badge`, `store_type_categories`, `store_type_category`, `zones` | Store/restaurant entities |
| **Foods** | `categories`, `foods`, `food_images`, `category_food`, `food_offer_items` | Menu items & categories |
| **Offers/Promos** | `offers`, `promo_codes` | Discounts & promotions |
| **Orders** | `orders`, `order_items` | Customer orders |
| **Delivery** | `delivery_profiles`, `delivery_profile_areas`, `favorite_deliveries` | Rider profiles & areas |
| **Reviews** | `reviews`, `review_flags`, `complaints` | Ratings & disputes |
| **Chefs** | `chef_profiles`, `chef_skills`, `chef_diplomas`, `chef_work_history`, `chef_images`, `chef_store_hires`, `chef_store` | Chef profiles & hiring |
| **Reservations** | `reservation_settings`, `reservation_schedules`, `restaurant_tables`, `reservations` | Table booking |
| **Templates** | `templates`, `template_blocks`, `theme_presets`, `page_assets`, `component_configs`, `ai_generation_jobs`, `saved_sections` | Storefront page builder |
| **Trust/Moderation** | `favorites`, `client_bans`, `client_reports`, `client_trust_scores` | Client management |
| **Marketing** | `banners`, `posts` | Promotional content |
| **Subscriptions/Billing** | `plans`, `plan_features`, `plan_feature_assignments`, `plan_tiers`, `plan_duration_offers`, `store_subscriptions`, `billing_invoices`, `payment_gateways`, `payment_methods` | Plan catalog, store subscriptions, invoices, gateways |
| **Delivery Pricing** | `delivery_pricing_tiers`, `delivery_subscriptions` | Rider pricing models & subscriptions |
| **Branches** | `store_branches`, `branch_user` | Multi-location stores & staff assignments |

---

## Quick Stats

- **Total active tables:** 80
- **Legacy tables dropped:** 11 (`themes`, `pb_pages`, `published_pages`, `page_versions`, etc.)
- **Core hub table:** `stores` (30+ child relationships)
- **Foreign keys:** ~120 total across all tables
- **Pivot tables:** 9 (`store_badge`, `store_type_category`, `category_food`, `favorite_deliveries`, `chef_store`, `chef_store_hires`, `food_offer_items`, `plan_feature_assignments`, `branch_user`)
