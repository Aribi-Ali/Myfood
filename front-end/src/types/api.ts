export interface Food {
  id: number
  store_id: number
  name: string
  description: string | null
  price: number
  price_usd?: number | null
  price_eur?: number | null
  new_price: number | null
  new_price_usd?: number | null
  new_price_eur?: number | null
  image: string | null
  cooking_time: number | null
  is_offer: boolean
  category_id: number | null
  category?: { id: number; name: string }
  categories?: { id: number; name: string }[]
  created_at?: string
}

export interface Review {
  id: number
  rating: number
  comment: string | null
  user: string
  avatar: string | null
}

export interface StaffMember {
  name: string
  role: string
}

export interface BadgeData {
  id: number
  name: string
  color: string | null
  icon: string | null
}

export interface StoreData {
  id: number
  name: string
  alias: string
  onboarding_status?: string | null
  is_approved?: boolean
  is_active?: boolean
  description: string | null
  phone: string | null
  address: string | null
  email: string | null
  logo: string | null
  cover: string | null
  avg_rating: number
  opening_hours: Record<string, { open: string; close: string }> | null
  foods: Food[]
  reviews: Review[]
  staff: StaffMember[]
  badges: BadgeData[]
}

export interface ThemeVariable {
  key: string
  value: string
}

export interface ThemeData {
  id: number
  name: string
  slug: string
  description: string | null
  category: string | null
  status: 'draft' | 'active' | 'archived'
  version: number
  store_id: number
  preset_id: string | null
  variables: ThemeVariable[]
  created_at: string
  updated_at: string
}

export interface ThemeListResponse {
  data: ThemeData[]
  meta: { current_page: number; last_page: number; per_page: number; total: number }
}

export interface TemplatePresetData {
  id: number
  name: string
  description: string | null
  css_vars: Record<string, string> | null
  colors: string[]
  is_default: boolean
}

export interface TemplateData {
  id: number
  name: string
  slug: string
  description: string | null
  category: string
  thumbnail: string | null
  component_path: string | null
  html_content: string | null
  css_content: string | null
  has_react_component: boolean
  is_active: boolean
  status: string
  sort_order: number
  blocks: { id: number; type: string; label: string | null; is_active: boolean; sort_order: number }[]
  theme_presets: TemplatePresetData[]
  default_preset: TemplatePresetData | null
  variables?: ThemeVariable[]
  created_at: string
  updated_at: string
}

export interface PageBuilderData {
  id: number
  html: string
  css: string
  grapesData: unknown
  themeId: string
  published: boolean
}

export interface PageBuilderPageData {
  has_customization: boolean
  html: string
  css: string
  js: string | null
  grapes_data: string | null
}

export interface PageBuilderResponse {
  page: PageBuilderData
  store: StoreData
}

export interface StorePageResponse {
  store: StoreData
  page: { html: string; css: string; template_slug?: string | null } | null
  themeVars: Record<string, string> | null
}

export interface OwnerPageResponse {
  page: PageBuilderPageData | null
  store: StoreData
  template_slug: string | null
  template?: {
    html_content: string
    css_content: string | null
  } | null
}

export interface PublishedPageData {
  id: number
  store_id: number
  store_alias: string
  html: string
  css: string
  theme_variables: Record<string, string> | null
  theme_preset_id: string | null
  published_at: string
  store: StoreData
}

export interface PublishedBlocksResponse {
  store: StoreData
  blocks: { type: string; content: string; order: number }[]
  theme_variables: Record<string, string> | null
}

export interface DeliveryArea {
  id?: number
  wilaya_id: number
  daira_id: number | null
  commune_id: number | null
  day_price: number
  night_price: number
  wilaya?: { id: number; name_fr: string; name_ar: string }
  daira?: { id: number; name_fr: string; name_ar: string }
  commune?: { id: number; name_fr: string; name_ar: string }
}

export interface DeliveryProfileData {
  transporter_type: string
  is_working: boolean
  phone: string
  day_price: number
  night_price: number
  areas: DeliveryArea[]
}

export interface User {
  id: number
  name: string
  email: string
  phone: string | null
  phone_verified_at: string | null
  role: string
  profile_image: string | null
  wilaya: string | null
  address: string | null
  daira?: string | null
  commune?: string | null
  delivery_profile: DeliveryProfileData | null
  store?: StoreData
  chef_profile?: unknown
}

export interface AuthResponse {
  user: User
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export type OrderStatusValue = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled'

export interface OrderItemFood {
  id: number
  name: string
  image?: string | null
}

export interface OrderItemData {
  id: number
  quantity: number
  price: number
  subtotal: number
  food: OrderItemFood
}

export interface OrderStoreSummary {
  id: number
  name: string
  alias: string
}

export interface OrderDeliveryGuy {
  id: number
  name: string
  phone?: string | null
  transporter_type?: string | null
}

export interface OrderData {
  id: number
  store_order_number: string
  order_number_formatted?: string
  status: OrderStatusValue
  status_label?: string
  delivery_type: 'delivery' | 'pickup'
  pickup_time?: string | null
  total_amount: number
  discount_amount: number
  delivery_fee: number
  address: string | null
  phone: string | null
  notes: string | null
  estimated_delivery_minutes: number | null
  latitude?: number | null
  longitude?: number | null
  store?: OrderStoreSummary & { phone?: string | null; address?: string | null; owner?: { phone?: string | null } }
  items: OrderItemData[]
  delivery_guy: OrderDeliveryGuy | null
  promo_code?: { code: string; discount: number } | null
  client_name?: string
  client_phone?: string
  created_at: string
  updated_at?: string
  wilaya?: string | null
  daira?: string | null
  commune?: string | null
}

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'

export interface ReservationData {
  id: number
  store_reservation_number: string
  store_id: number
  client_id: number | null
  name: string
  email: string | null
  phone: string | null
  party_size: number
  reservation_date: string
  reservation_time: string
  notes: string | null
  special_requests: string | null
  status: ReservationStatus
  cancellation_reason: string | null
  cancelled_at: string | null
  created_at: string
  updated_at: string
  client?: { id: number; name: string; email: string; phone?: string | null } | null
}

export interface ReservationSettingData {
  id: number
  store_id: number
  enabled: boolean
  auto_confirm: boolean
  manual_confirm: boolean
  duration_minutes: number
  slot_interval_minutes: number
  min_advance_hours: number
  max_booking_days: number
  min_party_size: number
  max_party_size: number
  allow_notes: boolean
  allow_special_requests: boolean
  allow_cancellation: boolean
  cancellation_deadline_hours: number
  reminder_24h: boolean
  reminder_2h: boolean
}

export interface ReservationScheduleData {
  id: number
  store_id: number
  day_of_week: number
  enabled: boolean
  open_time: string
  close_time: string
}

// ── Subscription & Billing types ────────────────────────────────────────────

export interface PlanFeatureData {
  id: number
  code: string
  name: string
  description: string | null
  icon: string | null
}

export interface PlanDurationOfferData {
  id: number
  plan_tier_id: number
  months: number
  discount_percent: number
  discount_label: string | null
  is_popular: boolean
  is_active: boolean
}

export interface PlanTierData {
  id: number
  plan_id: number
  name: string
  min_orders: number
  max_orders: number | null
  monthly_price: number
  is_active: boolean
  sort_order: number
  duration_offers?: PlanDurationOfferData[]
}

export interface PlanData {
  id: number
  name: string
  slug: string
  description: string | null
  is_active: boolean
  sort_order: number
  features: PlanFeatureData[]
  tiers: PlanTierData[]
  created_at: string
}

export interface StoreSubscriptionData {
  id: number
  store_id: number
  plan_tier_id: number
  plan_duration_offer_id: number | null
  status: 'trialing' | 'active' | 'past_due' | 'cancelled' | 'expired' | 'suspended'
  trial_ends_at: string | null
  start_date: string
  end_date: string | null
  monthly_price_snapshot: number
  current_period_orders: number
  auto_upgrade: boolean
  plan_tier: PlanTierData & { plan: PlanData }
  duration_offer: PlanDurationOfferData | null
  features: string[]
}

export interface BillingInvoiceData {
  id: number
  store_subscription_id: number
  invoice_number: string
  period_start: string
  period_end: string
  total_orders: number
  tier_applied: string | null
  plan_name: string | null
  base_amount: number
  discount_amount: number
  tax_amount: number
  total_amount: number
  currency: string
  status: 'pending' | 'pending_cash' | 'paid' | 'failed' | 'refunded' | 'cancelled'
  payment_method_type: string | null
  paid_at: string | null
  store?: { id: number; name: string; alias: string }
  created_at: string
}

export interface BillingStatsData {
  mrr: number
  active_subscriptions: number
  pending_invoices: number
  trial_count: number
  churn_rate: number
  currency: string
}

export interface PaymentGatewayData {
  id: number
  code: string
  name: string
  is_active: boolean
  config: Record<string, unknown> | null
  supported_currencies: string[] | null
  sort_order: number
}

export interface PaymentMethodData {
  id: number
  store_id: number
  gateway_id: number
  type: string
  is_default: boolean
  is_verified: boolean
  gateway: PaymentGatewayData
}

export interface DeliveryPricingTierData {
  id: number
  model_type: 'commission' | 'flat_fee' | 'subscription'
  name: string
  tier_level: number
  min_monthly_orders: number
  max_monthly_orders: number | null
  commission_percent: number | null
  flat_fee_per_delivery: number | null
  monthly_price: number | null
  max_deliveries: number | null
  is_active: boolean
  sort_order: number
}

export interface DeliveryPricingData {
  pricing_model: string | null
  current_tier: DeliveryPricingTierData | null
  current_month_orders: number
  total_earnings: number
  total_platform_fees: number
  subscription: {
    id: number
    tier: DeliveryPricingTierData
    start_date: string
    end_date: string
    status: string
    monthly_price_snapshot: number
  } | null
}

export interface DeliveryEarningsData {
  current_month: {
    deliveries: number
    gross_fees: number
    platform_fee: number
    net_earnings: number
  }
  history: Array<{
    month: string
    year: number
    deliveries: number
    gross_fees: number
    platform_fees: number
    net_earnings: number
  }>
}

export interface DeliverySettingsData {
  models_enabled: string[]
  subscription_commission_reduction: number
  subscription_flat_fee_reduction: number
}
