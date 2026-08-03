import { describe, it, expect, afterEach } from 'vitest'
import { cn, formatPrice, getFoodPrice, formatFoodPrice, truncate, getImageUrl, getAppUrl, normalizeImageUrls } from '@/lib/utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2')
  })

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible')
  })

  it('resolves Tailwind conflicts', () => {
    expect(cn('px-4', 'px-6')).toBe('px-6')
  })

  it('returns empty string for no input', () => {
    expect(cn()).toBe('')
  })
})

describe('formatPrice', () => {
  it('formats DA (suffix)', () => {
    expect(formatPrice(1500, 'DA')).toBe('1500.00 DA')
  })

  it('formats USD (prefix)', () => {
    expect(formatPrice(10.5, 'USD')).toBe('$10.50')
  })

  it('formats EUR (prefix)', () => {
    expect(formatPrice(8.99, 'EUR')).toBe('€8.99')
  })

  it('handles null/undefined', () => {
    expect(formatPrice(null)).toBe('0.00 DA')
    expect(formatPrice(undefined)).toBe('0.00 DA')
  })

  it('parses string input', () => {
    expect(formatPrice('12.50', 'DA')).toBe('12.50 DA')
  })

  it('handles NaN gracefully', () => {
    expect(formatPrice('abc', 'DA')).toBe('0.00 DA')
  })
})

describe('getFoodPrice', () => {
  const base = { price: 100, price_usd: 120, price_eur: null, new_price: null, new_price_usd: null, new_price_eur: null }

  it('returns DA price in DA currency', () => {
    expect(getFoodPrice(base, 'DA')).toEqual({ price: 100, currency: 'DA' })
  })

  it('returns USD price in USD currency', () => {
    expect(getFoodPrice(base, 'USD')).toEqual({ price: 120, currency: 'USD' })
  })

  it('falls back to DA when EUR price missing', () => {
    expect(getFoodPrice(base, 'EUR')).toEqual({ price: 100, currency: 'DA' })
  })

  it('uses new_price when available', () => {
    expect(getFoodPrice({ ...base, new_price: 80 }, 'DA')).toEqual({ price: 80, currency: 'DA' })
  })
})

describe('formatFoodPrice', () => {
  const food = { price: 100, new_price: null, price_usd: null, price_eur: null, new_price_usd: null, new_price_eur: null }

  it('formats price in DA', () => {
    expect(formatFoodPrice(food, 'DA')).toBe('100.00 DA')
  })
})

describe('truncate', () => {
  it('returns full string when within limit', () => {
    expect(truncate('hello', 10)).toBe('hello')
  })

  it('truncates with ellipsis when over limit', () => {
    expect(truncate('hello world', 5)).toBe('hello...')
  })

  it('handles empty string', () => {
    expect(truncate('', 5)).toBe('')
  })
})

describe('getImageUrl', () => {
  const origEnv = process.env.NEXT_PUBLIC_API_URL

  afterEach(() => {
    process.env.NEXT_PUBLIC_API_URL = origEnv
  })

  it('returns null for null/undefined', () => {
    expect(getImageUrl(null)).toBeNull()
    expect(getImageUrl(undefined)).toBeNull()
  })

  it('returns absolute URLs as-is', () => {
    expect(getImageUrl('https://example.com/img.jpg')).toBe('https://example.com/img.jpg')
  })

  it('builds URL from relative path', () => {
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8000/api/v1'
    const result = getImageUrl('foods/pizza.jpg')
    expect(result).toBe('http://localhost:8000/storage/foods/pizza.jpg')
  })

  it('handles storage-prefixed paths', () => {
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8000/api/v1'
    const result = getImageUrl('/storage/foods/pizza.jpg')
    expect(result).toBe('http://localhost:8000/storage/foods/pizza.jpg')
  })
})

describe('getAppUrl', () => {
  it('builds app URL from path', () => {
    expect(getAppUrl('/stores')).toBe('http://localhost:8000/stores')
  })

  it('handles missing leading slash', () => {
    expect(getAppUrl('stores')).toBe('http://localhost:8000/stores')
  })
})

describe('normalizeImageUrls', () => {
  it('prefixes relative image src with origin', () => {
    const html = '<img src="/images/pizza.jpg">'
    const result = normalizeImageUrls(html)
    expect(result).toBe('<img src="http://localhost:8000/images/pizza.jpg">')
  })

  it('does not modify absolute URLs', () => {
    const html = '<img src="https://cdn.example.com/img.jpg">'
    expect(normalizeImageUrls(html)).toBe(html)
  })
})
