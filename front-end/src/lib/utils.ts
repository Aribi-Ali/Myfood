import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Food } from '@/types/api'

export type Currency = 'DA' | 'USD' | 'EUR'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const CURRENCY_META: Record<Currency, { symbol: string; prefix: boolean }> = {
  DA: { symbol: 'DA', prefix: false },
  USD: { symbol: '$', prefix: true },
  EUR: { symbol: '€', prefix: true },
}

export function formatPrice(price: string | number | null | undefined, currency: Currency = 'DA'): string {
  if (price == null) return formatPrice(0, currency)
  const n = typeof price === 'string' ? parseFloat(price) : price
  if (Number.isNaN(n)) return formatPrice(0, currency)
  const meta = CURRENCY_META[currency]
  if (meta.prefix) return `${meta.symbol}${n.toFixed(2)}`
  return `${n.toFixed(2)} ${meta.symbol}`
}

export function getFoodPrice(food: Pick<Food, 'price' | 'new_price' | 'price_usd' | 'price_eur' | 'new_price_usd' | 'new_price_eur'>, currency: Currency): { price: number; currency: Currency } {
  if (currency === 'USD') {
    const usdPrice = food.new_price_usd ?? food.price_usd
    if (usdPrice != null) return { price: usdPrice, currency: 'USD' }
  }
  if (currency === 'EUR') {
    const eurPrice = food.new_price_eur ?? food.price_eur
    if (eurPrice != null) return { price: eurPrice, currency: 'EUR' }
  }
  const effective = food.new_price ?? food.price
  return { price: effective, currency: 'DA' }
}

export function getFoodOriginalPrice(food: Pick<Food, 'price' | 'price_usd' | 'price_eur'>, currency: Currency): { price: number; currency: Currency } {
  // Note: this function intentionally does not check new_price_* fields
  // because it's meant to return the original (non-sale) price.
  if (currency === 'USD' && food.price_usd != null) return { price: food.price_usd, currency: 'USD' }
  if (currency === 'EUR' && food.price_eur != null) return { price: food.price_eur, currency: 'EUR' }
  return { price: food.price, currency: 'DA' }
}

export function formatFoodPrice(food: Pick<Food, 'price' | 'new_price' | 'price_usd' | 'price_eur' | 'new_price_usd' | 'new_price_eur'>, currency: Currency, options?: { original?: boolean }): string {
  const { price, currency: effectiveCurrency } = options?.original
    ? getFoodOriginalPrice(food, currency)
    : getFoodPrice(food, currency)
  return formatPrice(price, effectiveCurrency)
}

export function truncate(str: string, len: number): string {
  if (!str) return ''
  return str.length > len ? str.substring(0, len) + '...' : str
}

export function esc(str: string | null | undefined): string {
  if (str == null) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

export { sanitizeHtml } from './sanitize'

function getApiOrigin(): string {
  const url = process.env.NEXT_PUBLIC_API_URL || '/api/v1'
  if (url.startsWith('http')) {
    try { return new URL(url).origin } catch { return 'http://localhost:8000' }
  }
  if (typeof window !== 'undefined') return window.location.origin
  return 'http://localhost:3000'
}

export function getImageUrl(path: string | null | undefined): string | null {
  if (!path) return null
  if (path.startsWith('http')) return path
  const origin = getApiOrigin()
  const cleanPath = path.startsWith('/storage/') ? path.replace(/^\/?storage\/?/, '') : path
  return `${origin}/storage/${cleanPath}`
}

const APP_BASE = getApiOrigin()

export function getAppUrl(path: string): string {
  return `${APP_BASE}${path.startsWith('/') ? '' : '/'}${path}`
}

export function normalizeImageUrls(html: string): string {
  const origin = getApiOrigin()
  return html.replace(/(<img[^>]+src\s*=\s*["'])\/(?!\/)([^"']+["'])/gi, (match, before, after) => {
    return `${before}${origin}/${after}`
  })
}

export function formatTime(time: string, format?: 'short' | 'long'): string {
  if (!time) return ''
  const parts = time.split(':')
  const rawH = parts[0]
  const rawM = parts[1]
  if (rawH == null || rawM == null) return time
  const h = parseInt(rawH, 10)
  const m = rawM
  if (format === 'short') {
    const ampm = h >= 12 ? 'PM' : 'AM'
    const h12 = h % 12 || 12
    return `${h12}:${m} ${ampm}`
  }
  return `${h.toString().padStart(2, '0')}:${m}`
}
