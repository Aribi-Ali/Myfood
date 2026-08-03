'use client'

import { useEffect, useState, useRef, Suspense, useLayoutEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Ban, PauseCircle } from 'lucide-react'
import { useAuth } from '@/contexts/auth'
import { useCart } from '@/contexts/cart'
import { useCurrency } from '@/contexts/currency'
import { api } from '@/lib/api-client'
import { getImageUrl, formatFoodPrice, cn } from '@/lib/utils'
import { replaceColorsWithCssVars } from '@/lib/color-replacer'
import { getThemePreset, buildThemeCss, type ThemeVariables } from '@/lib/themes'
import type { Food, BadgeData, StaffMember } from '@/types/api'
import { TEMPLATE_COMPONENTS, TEMPLATE_IMPORTS } from '@/components/templates/template-loader'
import type { TemplateStore } from '@/components/templates/types'
import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'
import { useLanguage } from '@/contexts/language'

import { ErrorBoundary } from '@/components/ui/error-boundary'
import { CARD_PRESETS, BADGE_PRESETS, AVATAR_PRESETS } from '@/lib/design-tokens'
import { StoreHeaderBanner } from '@/components/store/store-header-banner'
import { OpeningHoursCard } from '@/components/store/opening-hours-card'
import { TeamSection } from '@/components/store/team-section'
import { ReviewInput } from '@/components/store/review-input'

const DynamicPageRenderer = dynamic(() => import('@/components/builder/blocks/renderers/dynamic-page-renderer').then(mod => mod.DynamicPageRenderer), {
  ssr: false,
  loading: () => <Skeleton className="min-h-[60vh] w-full" />,
})

const StorefrontRenderer = dynamic(() => import('@/components/templates/storefront-renderer').then(mod => mod.StorefrontRenderer), {
  ssr: false,
  loading: () => <Skeleton className="min-h-[60vh] w-full" />,
})

const CartDrawer = dynamic(() => import('@/components/cart/cart-drawer').then(mod => mod.CartDrawer), {
  ssr: false,
  loading: () => <Skeleton className="h-16 w-16 fixed bottom-4 right-4 rounded-full" />,
})

interface ReviewData {
  id: number
  rating: number
  comment: string | null
  user: string
  avatar: string | null
  created_at: string
}

interface StorePageStore {
  id: number
  name: string
  alias: string
  description: string | null
  cover_image: string | null
  logo: string | null
  avg_rating: number
  reviews_count: number
  opening_hours: Record<string, { open: string; close: string }> | null
  badges: BadgeData[]
  staff: StaffMember[]
  ordering_enabled: boolean | null
  // Extended fields returned by API
  phone: string | null
  email: string | null
  address: string | null
  cover: string | null
  wilaya: string | null
  daira: string | null
  commune: string | null
  latitude: number | null
  longitude: number | null
  type_categories: { id: number; name: string; slug: string; icon: string | null }[]
  phones: { id: number; phone: string; is_primary: boolean; verified_at: string | null }[]
  social_links: { id: number; platform: string; url: string; icon: string | null }[]
  avg_prep_time: number | null
  base_delivery_fee: number | null
  delivery_zone_radius: number | null
  avg_delivery_time_per_km: number | null
  allows_pre_orders: boolean
  pre_order_lead_time_hours: number | null
  is_paused: boolean
  pause_note: string | null
  images: { id: number; image: string | null; caption: string | null }[]
  offers: { id: number; title: string; description: string | null; discount_percent: number | null; is_active: boolean; starts_at: string | null; ends_at: string | null }[]
  posts: { id: number; title: string; content: string | null; image: string | null; created_at: string }[]
  banners: { id: number; title: string | null; description: string | null; image: string | null; link_url: string | null; is_active: boolean }[]
  reservation_enabled: boolean
}

interface StorePageResponse {
  store: StorePageStore
  foods: Food[]
  reviews: ReviewData[]
  is_banned?: boolean
  is_paused?: boolean
  pause_note?: string | null
}

function StoreJsonLd({ store }: { store: StorePageStore }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: store.name,
    description: store.description || undefined,
    image: store.cover_image || undefined,
    ...(store.avg_rating > 0 ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: store.avg_rating,
        reviewCount: store.reviews_count,
      },
    } : {}),
    ...(store.opening_hours ? {
      openingHoursSpecification: Object.entries(store.opening_hours).flatMap(([day, hours]) => {
        if (!hours) return []
        return [{
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: day.charAt(0).toUpperCase() + day.slice(1),
          opens: hours.open,
          closes: hours.close,
        }]
      }),
    } : {}),
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface PublishedPageData {
  html: string
  css: string | null
  js: string | null
  template_slug?: string | null
}

interface TemplateData {
  html_content: string
  css_content: string | null
}

interface ThemePresetCssVars {
  [key: string]: string
}

export default function StoreDetailPage() {
  const params = useParams<{ alias: string }>()
  const alias = params.alias
  const { t } = useLanguage()
  const router = useRouter()
  const { user } = useAuth()

  const [store, setStore] = useState<StorePageStore | null>(null)
  const [foods, setFoods] = useState<Food[]>([])
  const [reviews, setReviews] = useState<ReviewData[]>([])
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [publishedPage, setPublishedPage] = useState<PublishedPageData | null>(null)
  const [pageJs, setPageJs] = useState<string | null>(null)
  const [templateSlug, setTemplateSlug] = useState<string | null>(null)
  const [templateHtml, setTemplateHtml] = useState<string | null>(null)
  const [templateCss, setTemplateCss] = useState<string | null>(null)
  const [processedTemplateHtml, setProcessedTemplateHtml] = useState<string | null>(null)
  const [themeCssVars, setThemeCssVars] = useState<ThemePresetCssVars | null>(null)
  const [customDomain, setCustomDomain] = useState('')
  const [isBanned, setIsBanned] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [pauseNote, setPauseNote] = useState<string | null>(null)
  const [processingTemplate, setProcessingTemplate] = useState(false)
  const [eagerTemplate, setEagerTemplate] = useState<React.ComponentType<{ store: TemplateStore; onAddToCart?: (foodId: number) => void }> | null>(null)
  const [eagerLoading, setEagerLoading] = useState(false)

  const { addToCart: rawAddToCart } = useCart()
  const { currency } = useCurrency()
  const contentRef = useRef<HTMLDivElement>(null)
  const hiddenRenderRef = useRef<HTMLDivElement>(null)

  const addToCart = (food: Food) => {
    if (store?.ordering_enabled === false) return
    if (isBanned) return
    if (isPaused) return
    rawAddToCart(food)
  }

  const [activeCategory, setActiveCategory] = useState<number | null>(null)

  const categories = foods.reduce<{ id: number; name: string }[]>((acc, f) => {
    (f.categories || []).forEach(cat => {
      if (!acc.find(c => c.id === cat.id)) acc.push(cat)
    })
    return acc
  }, [])

  const filteredFoods = foods.filter((f) =>
    activeCategory === null || (f.categories || []).some(cat => cat.id === activeCategory)
  )

  useEffect(() => {
    if (!alias) return
    ;(async () => {
      setFetching(true)
      try {
        const [storeRes, pageRes] = await Promise.all([
          api.get<{ data: StorePageResponse }>(`/stores/${alias}`),
          api.get<{ data: { store: StorePageStore; page: PublishedPageData | null; template: TemplateData | null; theme_css_vars: ThemePresetCssVars | null } }>(`/stores/${alias}/page`).catch(() => null),
        ])
        const sd = storeRes.data
        setStore(sd.store)
        setFoods(sd.foods || [])
        setReviews(sd.reviews || [])
        if (sd.is_banned) setIsBanned(sd.is_banned)
        if (sd.is_paused !== undefined) { setIsPaused(sd.is_paused); setPauseNote(sd.pause_note ?? null) }
        if (pageRes?.data?.page) {
          if (pageRes.data.page.html) {
            setPublishedPage(pageRes.data.page)
            setPageJs(pageRes.data.page.js ?? null)
          } else if (pageRes.data.page.template_slug) {
            setTemplateSlug(pageRes.data.page.template_slug)
          }
        }
        const backendVars = pageRes?.data?.theme_css_vars ?? {}
        const slug = pageRes?.data?.page?.template_slug
        let mergedVars: Record<string, string> = { ...backendVars }
        if (slug) {
          const preset = getThemePreset(slug)
          if (preset) {
            mergedVars = { ...backendVars, ...(preset.vars as unknown as Record<string, string>) }
          }
        }
        if (pageRes?.data?.template?.html_content) {
          const processed = replaceColorsWithCssVars(
            pageRes.data.template.html_content,
            mergedVars,
            slug ?? undefined
          )
          setTemplateHtml(processed)
          setTemplateCss(pageRes.data.template.css_content ?? null)
        }
        if (Object.keys(mergedVars).length > 0) {
          setThemeCssVars(mergedVars as ThemePresetCssVars)
        }
      } catch {
        setError('Failed to load store')
      }
      setFetching(false)
    })()
  }, [alias])

  useEffect(() => {
    const host = window.location.hostname
    const mainDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'localhost'
    if (host !== mainDomain && host !== 'localhost' && host !== '127.0.0.1') {
      setCustomDomain(host)
    }
  }, [])

  // Inject theme CSS vars from the selected theme preset
  const styleRef = useRef<HTMLStyleElement | null>(null)
  useEffect(() => {
    if (!themeCssVars || Object.keys(themeCssVars).length === 0) return
    if (!styleRef.current) {
      styleRef.current = document.createElement('style')
      styleRef.current.id = 'store-theme-vars-' + alias
      document.head.appendChild(styleRef.current)
    }
    styleRef.current.textContent = buildThemeCss(themeCssVars as Partial<ThemeVariables>)
    return () => {
      if (styleRef.current) {
        if (styleRef.current.parentNode) styleRef.current.remove()
        styleRef.current = null
      }
    }
  }, [themeCssVars, alias])

  const activeTemplateSlug = templateSlug || publishedPage?.template_slug
  const TemplateComponent = activeTemplateSlug ? TEMPLATE_COMPONENTS[activeTemplateSlug] : null
  const hasCustomHtml = publishedPage?.html && publishedPage.html.trim().length > 0

  // Pre-load template component eagerly so the hidden render works synchronously
  // (React.lazy components suspend, making innerHTML unavailable on first paint)
  useEffect(() => {
    if (!activeTemplateSlug || hasCustomHtml || templateHtml || !store) return
    setEagerLoading(true)
    let cancelled = false
    ;(async () => {
      try {
        const imp = TEMPLATE_IMPORTS[activeTemplateSlug]
        if (!imp) return
        const mod = await imp()
        if (!cancelled) { setEagerTemplate(() => mod.default); setEagerLoading(false) }
      } catch {
        if (!cancelled) { setEagerTemplate(null); setEagerLoading(false) }
      }
    })()
    return () => { cancelled = true }
  }, [activeTemplateSlug, hasCustomHtml, templateHtml, store])

  // Process React template component: render hidden, extract HTML, replace colors with theme CSS vars
  // This mirrors the page-builder pipeline so the store page looks identical to the builder preview
  useLayoutEffect(() => {
    if (!eagerTemplate || !store || !themeCssVars || hasCustomHtml || templateHtml) return
    if (processedTemplateHtml) return
    setProcessingTemplate(true)
  }, [eagerTemplate, store, themeCssVars, hasCustomHtml, templateHtml, processedTemplateHtml])

  useLayoutEffect(() => {
    if (!processingTemplate || !hiddenRenderRef.current) return
    const rawHtml = hiddenRenderRef.current.innerHTML
    if (!rawHtml || rawHtml.trim() === '' || rawHtml.trim() === '<!---->' || rawHtml.trim() === '<!-- -->') return
    const processed = replaceColorsWithCssVars(
      rawHtml,
      themeCssVars as unknown as Record<string, string>,
      activeTemplateSlug ?? undefined
    )
    setProcessedTemplateHtml(processed)
    setProcessingTemplate(false)
  }, [processingTemplate, themeCssVars, activeTemplateSlug])

  const shouldProcessReactTemplate = !hasCustomHtml && !templateHtml && !!eagerTemplate && !!store
  const readyToRenderProcessed = shouldProcessReactTemplate && !!processedTemplateHtml

  // Event delegation for Add to Cart buttons in static published HTML only
  // (template buttons have their own onClick handlers, so this would double-add)
  useEffect(() => {
    if (hasCustomHtml) {
      const el = contentRef.current
      if (!el) return
      const handler = (e: MouseEvent) => {
        const target = e.target as HTMLElement
        const btn = target.closest('[data-add-to-cart]') as HTMLElement | null
        if (!btn) return
        const foodId = Number(btn.getAttribute('data-add-to-cart'))
        if (isNaN(foodId)) return
        const food = foods.find(f => f.id === foodId)
        if (food) addToCart(food)
      }
      el.addEventListener('click', handler)
      return () => el.removeEventListener('click', handler)
    }
  }, [foods, addToCart, hasCustomHtml])

  async function handleReviewSubmit(rating: number, comment: string) {
    if (!user || !store) return
    try {
      const res = await api.post<{ review: ReviewData }>(`/stores/${store.id}/reviews`, { rating, comment })
      setReviews((prev) => [...prev, res.review || { id: Date.now(), rating, comment, user: user.name, avatar: null, created_at: new Date().toISOString() }])
    } catch { /* ignore */ }
  }

  if (fetching) {
    return (
      <div key="loading-state" className="contents">
        <header className="h-16 border-b border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 flex items-center px-6 sticky top-0 z-30">
          <Link href="/" className="font-extrabold text-amber-700 dark:text-amber-400 text-lg">{t('app_name')}</Link>
        </header>
        <div className="flex items-center justify-center min-h-[60vh] bg-stone-50 dark:bg-stone-950">
          <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-amber-600 border-t-transparent" />
        </div>
      </div>
    )
  }

  if (error || !store) {
    return (
      <div key="error-state" className="contents">
        <header className="h-16 border-b border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 flex items-center px-6">
          <Link href="/" className="font-extrabold text-amber-700 dark:text-amber-400 text-lg">{t('app_name')}</Link>
        </header>
        <div className="flex items-center justify-center min-h-[60vh] bg-stone-50 dark:bg-stone-950">
          <div className="text-center">
            <div className="text-5xl mb-4">😕</div>
            <p className="text-stone-600 dark:text-stone-300 mb-6 text-sm font-medium">{error || t('store_error_default')}</p>
            <Link href="/stores" className="inline-block rounded-xl bg-amber-600 hover:bg-amber-700 px-6 py-3 text-sm font-bold text-white transition shadow-sm">{t('store_error_browse_link')}</Link>
          </div>
        </div>
      </div>
    )
  }

  const orderingDisabled = store.ordering_enabled === false

  return (
    <div key="success-state" className="contents">
    <div ref={contentRef} className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-800 dark:text-stone-100">
      {customDomain && (
        <div className="bg-green-50 dark:bg-green-950/30 border-b border-green-200 dark:border-green-900/50 px-4 py-2 text-center">
          <p className="text-xs font-medium text-green-700 dark:text-green-400">
            {t('custom_domain_banner', { domain: customDomain })}
          </p>
        </div>
      )}

      <div className={`border-b px-4 py-3 text-center ${orderingDisabled ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50' : 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900/50'}`}>
        <div className="flex items-center justify-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${orderingDisabled ? 'bg-red-500' : 'bg-green-500'}`} />
          <p className={`text-sm font-semibold ${orderingDisabled ? 'text-red-700 dark:text-red-400' : 'text-green-700 dark:text-green-400'}`}>
            {orderingDisabled ? t('ordering_disabled_banner') : t('ordering_enabled_banner')}
          </p>
        </div>
      </div>

      {isBanned && (
        <div className="border-b border-red-300 dark:border-red-900/50 bg-red-100 dark:bg-red-950/30 px-4 py-3 text-center">
          <div className="flex items-center justify-center gap-2">
            <Ban className="w-4 h-4 text-red-600 dark:text-red-400" />
            <p className="text-sm font-semibold text-red-700 dark:text-red-400">
              {t('banned_from_store')}
            </p>
          </div>
        </div>
      )}

      {isPaused && (
        <div className="border-b border-orange-300 dark:border-orange-900/50 bg-orange-100 dark:bg-orange-950/30 px-4 py-3 text-center">
          <div className="flex items-center justify-center gap-2">
            <PauseCircle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <p className="text-sm font-semibold text-orange-700 dark:text-orange-400">
              {pauseNote || t('store_temporarily_paused')}
            </p>
          </div>
        </div>
      )}

      {/* Hidden container for React component HTML extraction — only when processing */}
      {shouldProcessReactTemplate && !processedTemplateHtml && (
        <div ref={hiddenRenderRef} className="hidden" aria-hidden="true">
          {eagerTemplate && (() => {
            const EagerTemplate = eagerTemplate
            return (
              <EagerTemplate
                store={{
                  ...store!,
                  foods,
                  reviews,
                  staff: (store as any).staff ?? [],
                  badges: (store as any).badges ?? [],
                  logo: (store as any).logo ?? null,
                  phone: (store as any).phone ?? null,
                  email: (store as any).email ?? null,
                  address: (store as any).address ?? null,
                  cover: (store as any).cover_image ?? null,
                  cover_image: (store as any).cover_image ?? null,
                  opening_hours: (store as any).opening_hours ?? null,
                  ordering_enabled: store!.ordering_enabled ?? true,
                  // NEW FIELDS
                  wilaya: (store as any).wilaya ?? null,
                  daira: (store as any).daira ?? null,
                  commune: (store as any).commune ?? null,
                  latitude: (store as any).latitude ?? null,
                  longitude: (store as any).longitude ?? null,
                  type_categories: (store as any).type_categories ?? [],
                  phones: (store as any).phones ?? [],
                  social_links: (store as any).social_links ?? [],
                  avg_prep_time: (store as any).avg_prep_time ?? null,
                  base_delivery_fee: (store as any).base_delivery_fee ?? null,
                  delivery_zone_radius: (store as any).delivery_zone_radius ?? null,
                  avg_delivery_time_per_km: (store as any).avg_delivery_time_per_km ?? null,
                  allows_pre_orders: (store as any).allows_pre_orders ?? false,
                  pre_order_lead_time_hours: (store as any).pre_order_lead_time_hours ?? null,
                  is_paused: (store as any).is_paused ?? false,
                  pause_note: (store as any).pause_note ?? null,
                  images: (store as any).images ?? [],
                  offers: (store as any).offers ?? [],
                  posts: (store as any).posts ?? [],
                  banners: (store as any).banners ?? [],
                  reservation_enabled: (store as any).reservation_enabled ?? false,
                } as TemplateStore}
                onAddToCart={(foodId: number) => { const food = foods.find(f => f.id === foodId); if (food) addToCart(food) }}
              />
            )
          })()}
        </div>
      )}

      {/* Content: custom page → processed template → template component → db-stored html → default layout */}
      {hasCustomHtml ? (
        <DynamicPageRenderer
          html={publishedPage!.html}
          css={publishedPage!.css}
          js={pageJs}
          store={{ ...store, foods } as unknown as { name: string; foods: Food[]; [key: string]: unknown }}
          onAddToCart={addToCart}
        />
      ) : readyToRenderProcessed ? (
        <ErrorBoundary key={activeTemplateSlug + '_processed'}>
          <StorefrontRenderer html={processedTemplateHtml!} css={templateCss} js={pageJs} />
        </ErrorBoundary>
      ) : shouldProcessReactTemplate && !processedTemplateHtml ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-3 text-gray-400">
            <div className="w-8 h-8 border-4 border-orange-600 rounded-full animate-spin border-t-transparent" />
            <span className="text-sm font-medium">Loading template...</span>
          </div>
        </div>
      ) : eagerLoading && !eagerTemplate && TemplateComponent && store ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-3 text-gray-400">
            <div className="w-8 h-8 border-4 border-orange-600 rounded-full animate-spin border-t-transparent" />
            <span className="text-sm font-medium">Loading template...</span>
          </div>
        </div>
      ) : TemplateComponent && store ? (
        <ErrorBoundary key={activeTemplateSlug}>
          <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="h-10 w-10 animate-spin rounded-full border-[3px] border-amber-600 border-t-transparent" /></div>}>
            <TemplateComponent
              store={{
                ...store,
                foods,
                reviews,
                staff: (store as any).staff ?? [],
                badges: (store as any).badges ?? [],
                logo: (store as any).logo ?? null,
                phone: (store as any).phone ?? null,
                email: (store as any).email ?? null,
                address: (store as any).address ?? null,
                cover: (store as any).cover_image ?? null,
                cover_image: (store as any).cover_image ?? null,
                opening_hours: (store as any).opening_hours ?? null,
                ordering_enabled: store.ordering_enabled ?? true,
                // NEW FIELDS
                wilaya: (store as any).wilaya ?? null,
                daira: (store as any).daira ?? null,
                commune: (store as any).commune ?? null,
                latitude: (store as any).latitude ?? null,
                longitude: (store as any).longitude ?? null,
                type_categories: (store as any).type_categories ?? [],
                phones: (store as any).phones ?? [],
                social_links: (store as any).social_links ?? [],
                avg_prep_time: (store as any).avg_prep_time ?? null,
                base_delivery_fee: (store as any).base_delivery_fee ?? null,
                delivery_zone_radius: (store as any).delivery_zone_radius ?? null,
                avg_delivery_time_per_km: (store as any).avg_delivery_time_per_km ?? null,
                allows_pre_orders: (store as any).allows_pre_orders ?? false,
                pre_order_lead_time_hours: (store as any).pre_order_lead_time_hours ?? null,
                is_paused: (store as any).is_paused ?? false,
                pause_note: (store as any).pause_note ?? null,
                images: (store as any).images ?? [],
                offers: (store as any).offers ?? [],
                posts: (store as any).posts ?? [],
                banners: (store as any).banners ?? [],
                reservation_enabled: (store as any).reservation_enabled ?? false,
              } as TemplateStore}
              onAddToCart={(foodId: number) => { const food = foods.find(f => f.id === foodId); if (food) addToCart(food) }}
            />
          </Suspense>
        </ErrorBoundary>
      ) : templateHtml ? (
        <ErrorBoundary key={templateHtml}>
          <StorefrontRenderer html={templateHtml} css={templateCss} js={pageJs} />
        </ErrorBoundary>
      ) : (
        <>
          <StoreJsonLd store={store} />
          <StoreHeaderBanner store={store} reviewsCount={reviews.length} />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Menu */}
              <div className="lg:col-span-2 space-y-8">
                <div className={cn('rounded-2xl overflow-hidden shadow-sm', CARD_PRESETS.base)}>
                  <div className="px-6 py-4 border-b border-stone-100 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/50">
                    <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-stone-500 dark:text-stone-400">{t('menu')}</h2>
                  </div>

                  {categories.length > 0 && (
                    <div className="px-6 pt-4 pb-2 flex flex-wrap gap-2">
                      <button onClick={() => setActiveCategory(null)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-150 border ${
                          activeCategory === null
                            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-500 shadow-sm'
                            : 'bg-white dark:bg-stone-800 text-stone-500 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-orange-300 hover:text-orange-700 dark:hover:border-orange-600 dark:hover:text-orange-400'
                        }`}>{t('store_menu_filter_all')}</button>
                      {categories.map((cat) => (
                        <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-150 border ${
                            activeCategory === cat.id
                              ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-500 shadow-sm'
                              : 'bg-white dark:bg-stone-800 text-stone-500 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-orange-300 hover:text-orange-700 dark:hover:border-orange-600 dark:hover:text-orange-400'
                          }`}>{cat.name}</button>
                      ))}
                    </div>
                  )}

                  <div className="p-6 pt-4">
                    {filteredFoods.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-xs font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500">{t('store_menu_empty')}</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {filteredFoods.map((food) => (
                          <div key={food.id} className="group rounded-xl border border-stone-200 dark:border-stone-700 p-4 flex flex-col justify-between bg-white dark:bg-stone-800 hover:border-amber-200 dark:hover:border-amber-700 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
                            <div>
                              <div className="flex justify-between items-start gap-3">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-sm text-stone-800 dark:text-stone-100 truncate">{food.name}</h3>
                                    {food.is_offer && (
                                      <span className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-red-50 text-red-500 border border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50">{t('promo')}</span>
                                    )}
                                  </div>
                                  {food.description && (
                                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1.5 line-clamp-2 leading-relaxed">{food.description}</p>
                                  )}
                                </div>
                              </div>
                              <div className="text-[10px] mt-3 flex gap-3 font-semibold text-stone-400 dark:text-stone-500">
                                {food.cooking_time && <span>{t('store_menu_cooking_time', { time: food.cooking_time })}</span>}
                              </div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-700 flex justify-between items-center">
                              <div className="font-mono">
                                {food.new_price ? (
                                  <>
                                    <span className="text-xs line-through ltr:mr-1.5 rtl:ml-1.5 text-stone-400 dark:text-stone-500">{formatFoodPrice(food, currency, { original: true })}</span>
                                    <span className="text-sm font-bold text-amber-700 dark:text-amber-400">{formatFoodPrice(food, currency)}</span>
                                  </>
                                ) : (
                                  <span className="text-sm font-bold text-stone-800 dark:text-stone-100">{formatFoodPrice(food, currency)}</span>
                                )}
                              </div>
                              {orderingDisabled ? (
                                <span className="text-[11px] font-semibold text-amber-500 dark:text-amber-400 px-2">{t('store_menu_unavailable')}</span>
                              ) : (
                                <button onClick={() => addToCart(food)}
                                  className="font-bold text-[11px] px-4 py-2.5 min-h-[44px] rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white transition-all duration-200 shadow-sm hover:shadow-md active:scale-95">
                                  {t('store_menu_add_button')}
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Info */}
              <div className="space-y-6">
                <OpeningHoursCard hours={store.opening_hours} />

                <div className={cn('rounded-2xl p-5', CARD_PRESETS.base)}>
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-stone-500 dark:text-stone-400 mb-4">{t('store_contact_heading')}</h3>
                  <div className="space-y-3 text-sm">
                    <p className="text-stone-500 dark:text-stone-400">{t('store_contact_unavailable')}</p>
                  </div>
                </div>

                <TeamSection staff={store.staff} />

                <div>
                          <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-stone-500 dark:text-stone-400 mb-5 px-1">{t('store_reviews_heading')}</h2>
                  <ReviewInput user={user} onSubmit={handleReviewSubmit} />

                    {reviews.length === 0 ? (
                      <p className="text-sm italic text-stone-400 dark:text-stone-500 text-center py-8">{t('store_reviews_empty')}</p>
                  ) : (
                    <div className="space-y-4">
                      {reviews.map((rev) => (
                        <div key={rev.id} className={cn('rounded-2xl p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5', CARD_PRESETS.base)}>
                          <div className="flex items-start gap-3">
                            <div className={cn(AVATAR_PRESETS.base, AVATAR_PRESETS.md, 'shadow-sm')}>
                              {rev.user.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center gap-2">
                                <div className="font-bold text-sm text-stone-800 dark:text-stone-100 truncate">{rev.user}</div>
                                <span className="text-sm text-amber-500 shrink-0">{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</span>
                              </div>
                              {rev.comment && <p className="text-sm text-stone-600 dark:text-stone-300 mt-1.5 leading-relaxed">{rev.comment}</p>}
                              <span className="text-[10px] text-stone-400 dark:text-stone-500 mt-2 block font-medium">{new Date(rev.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {!orderingDisabled && <CartDrawer storeId={store.id} />}
    </div>
    </div>
  )
}
