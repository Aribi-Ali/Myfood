import type { Food, BadgeData, StaffMember } from '@/types/api'

export interface ReviewData {
  id: number
  rating: number
  comment: string | null
  user: string
  avatar: string | null
  created_at: string
}

export interface StoreTypeCategory {
  id: number
  name: string
  slug: string
  icon: string | null
}

export interface StorePhone {
  id: number
  phone: string
  is_primary: boolean
  verified_at: string | null
}

export interface StoreSocialLink {
  id: number
  platform: string
  url: string
  icon: string | null
}

export interface StoreImage {
  id: number
  image: string | null
  caption: string | null
}

export interface StoreOffer {
  id: number
  title: string
  description: string | null
  discount_percent: number | null
  is_active: boolean
  starts_at: string | null
  ends_at: string | null
}

export interface StorePost {
  id: number
  title: string
  content: string | null
  image: string | null
  created_at: string
}

export interface StoreBanner {
  id: number
  title: string | null
  description: string | null
  image: string | null
  link_url: string | null
  is_active: boolean
}

export interface TemplateStore {
  id: number
  name: string
  alias: string
  description: string | null
  phone: string | null
  email: string | null
  address: string | null
  logo: string | null
  cover: string | null
  cover_image: string | null
  avg_rating: number
  reviews_count: number
  opening_hours: Record<string, { open: string; close: string }> | null
  badges: BadgeData[]
  staff: StaffMember[]
  foods: Food[]
  reviews: ReviewData[]
  ordering_enabled: boolean
  // New fields for store detail
  wilaya: string | null
  daira: string | null
  commune: string | null
  latitude: number | null
  longitude: number | null
  type_categories: StoreTypeCategory[]
  phones: StorePhone[]
  social_links: StoreSocialLink[]
  avg_prep_time: number | null
  base_delivery_fee: number | null
  delivery_zone_radius: number | null
  avg_delivery_time_per_km: number | null
  allows_pre_orders: boolean
  pre_order_lead_time_hours: number | null
  is_paused: boolean
  pause_note: string | null
  images: StoreImage[]
  offers: StoreOffer[]
  posts: StorePost[]
  banners: StoreBanner[]
  reservation_enabled: boolean
}

export type TemplateId = 'dark-luxury' | 'organic' | 'tech' | 'streetwear' | 'artisan' | 'bistro' | 'neon' | 'coastal' | 'rustic' | 'minimal' | 'tropical' | 'retro' | 'urban' | 'velvet-noir' | 'jade-garden' | 'amber-glow' | 'slate-steel' | 'lavender-haze' | 'crimson-royale' | 'frost-white' | 'saffron-spice' | 'denim-blue' | 'mint-berry' | 'trattoria-roma' | 'sakura-zen' | 'fiesta-vibrant' | 'taj-spice' | 'med-blue' | 'smoke-pit' | 'green-plate' | 'sweet-dreams' | 'hops-barrel' | 'ocean-fresh' | 'petit-paris' | 'bamboo-garden' | 'crimson-night' | 'ocean-wave' | 'sunset-glow' | 'mono-chic' | 'forest-canopy' | 'desert-rose' | 'neon-pulse' | 'harvest-gold' | 'ivory-lace' | 'ember-blaze' | 'aurora-dawn' | 'golden-wok' | 'terracotta' | 'midnight-sushi' | 'whiskey-barrel' | 'blossom-garden' | 'carbon-grill' | 'saffron-dream' | 'arctic-white' | 'kebab-palace' | 'croissant-corner' | 'curry-king' | 'poke-bowl' | 'tokyo-ramen' | 'margherita-bliss' | 'taco-fiesta' | 'burger-joint' | 'brew-bean' | 'steakhouse-premium' | 'garden-salad' | 'sushi-master' | 'tapas-social' | 'pho-street' | 'dim-sum-house'

export const TEMPLATE_NAMES: Record<string, string> = {
  'dark-luxury': 'Dark Luxury',
  'organic': 'Fresh Organic',
  'tech': 'Tech / SaaS',
  'streetwear': 'Rebel Streetwear',
  'artisan': 'Warm Artisan',
  'bistro': 'Bistro Classic',
  'neon': 'Neon Nights',
  'coastal': 'Coastal Breeze',
  'rustic': 'Rustic Farmhouse',
  'minimal': 'Minimal Mono',
  'tropical': 'Tropical Vibes',
  'retro': 'Retro Diner',
  'urban': 'Urban Modern',
  'velvet-noir': 'Velvet Noir',
  'jade-garden': 'Jade Garden',
  'amber-glow': 'Amber Glow',
  'slate-steel': 'Slate & Steel',
  'lavender-haze': 'Lavender Haze',
  'crimson-royale': 'Crimson Royale',
  'frost-white': 'Frost White',
  'saffron-spice': 'Saffron Spice',
  'denim-blue': 'Denim Blue',
  'mint-berry': 'Mint & Berry',
  'trattoria-roma': 'Trattoria Roma',
  'sakura-zen': 'Sakura Zen',
  'fiesta-vibrant': 'Fiesta Vibrant',
  'taj-spice': 'Taj Spice',
  'med-blue': 'Mediterranean Blue',
  'smoke-pit': 'Smoke Pit',
  'green-plate': 'Green Plate',
  'sweet-dreams': 'Sweet Dreams',
  'hops-barrel': 'Hops & Barrel',
  'ocean-fresh': 'Ocean Fresh',
  'petit-paris': 'Petit Paris',
  'bamboo-garden': 'Bamboo Garden',
  'crimson-night': 'Crimson Night',
  'ocean-wave': 'Ocean Wave',
  'sunset-glow': 'Sunset Glow',
  'mono-chic': 'Mono Chic',
  'forest-canopy': 'Forest Canopy',
  'desert-rose': 'Desert Rose',
  'neon-pulse': 'Neon Pulse',
  'harvest-gold': 'Harvest Gold',
  'ivory-lace': 'Ivory Lace',
  'ember-blaze': 'Ember Blaze',
  'aurora-dawn': 'Aurora Dawn',
  'golden-wok': 'Golden Wok',
  'terracotta': 'Terracotta',
  'midnight-sushi': 'Midnight Sushi',
  'whiskey-barrel': 'Whiskey Barrel',
  'blossom-garden': 'Blossom Garden',
  'carbon-grill': 'Carbon Grill',
  'saffron-dream': 'Saffron Dream',
  'arctic-white': 'Arctic White',
  'kebab-palace': 'Kebab Palace',
  'croissant-corner': 'Croissant Corner',
  'curry-king': 'Curry King',
  'poke-bowl': 'Poke Bowl',
  'tokyo-ramen': 'Tokyo Ramen',
  'margherita-bliss': 'Margherita Bliss',
  'taco-fiesta': 'Taco Fiesta',
  'burger-joint': 'Burger Joint',
  'brew-bean': 'Brew & Bean',
  'steakhouse-premium': 'Steakhouse Premium',
  'garden-salad': 'Garden Salad',
  'sushi-master': 'Sushi Master',
  'tapas-social': 'Tapas Social',
  'pho-street': 'Phở Street',
  'dim-sum-house': 'Dim Sum House',
}

// ── Dynamic Block Config Types ──

export interface FoodGridConfig {
  title: string
  maxItems: number
  showAddToCart: boolean
  columns: 2 | 3 | 4
  showCategoryFilter: boolean
  showPrices: boolean
  showDescriptions: boolean
  showCookingTime: boolean
  style: 'grid' | 'list'
}

export interface CategoryGridConfig {
  title: string
  showCount: boolean
  style: 'pills' | 'cards' | 'list'
}

export interface OfferGridConfig {
  title: string
  subtitle: string
  maxItems: number
  showOriginalPrice: boolean
}

export interface ReservationFormConfig {
  title: string
  subtitle: string
  showDate: boolean
  showTime: boolean
  showGuests: boolean
  showName: boolean
  showPhone: boolean
}

export type BlockConfig = FoodGridConfig | CategoryGridConfig | OfferGridConfig | ReservationFormConfig

export interface DynamicBlock {
  type: string
  config: BlockConfig
}

export const BLOCK_RENDERER_MAP: Record<string, string> = {
  'food-grid': 'FoodGrid',
  'category-grid': 'CategoryGrid',
  'offer-grid': 'OfferGrid',
  'reservation-form': 'ReservationForm',
}
