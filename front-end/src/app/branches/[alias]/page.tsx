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
import { ReviewInput } from '@/components/store/review-input'

// ── Dynamic imports (same lazy pipeline as store page) ───────────────────────

const DynamicPageRenderer = dynamic(
  () =>
    import('@/components/builder/blocks/renderers/dynamic-page-renderer').then(
      (mod) => mod.DynamicPageRenderer,
    ),
  {
    ssr: false,
    loading: () => <Skeleton className="min-h-[60vh] w-full" />,
  },
)

const StorefrontRenderer = dynamic(
  () =>
    import('@/components/templates/storefront-renderer').then(
      (mod) => mod.StorefrontRenderer,
    ),
  {
    ssr: false,
    loading: () => <Skeleton className="min-h-[60vh] w-full" />,
  },
)

const CartDrawer = dynamic(
  () => import('@/components/cart/cart-drawer').then((mod) => mod.CartDrawer),
  {
    ssr: false,
    loading: () => <Skeleton className="h-16 w-16 fixed bottom-4 right-4 rounded-full" />,
  },
)

// ── Types ────────────────────────────────────────────────────────────────────

interface BranchReviewData {
  id: number
  rating: number
  comment: string | null
  user: string
  avatar: string | null
  created_at: string
}

interface BranchStoreData {
  id: number
  name: string
  alias: string
  logo: string | null
  avg_rating: number
}

interface BranchData {
  id: number
  name: string
  alias: string
  description: string | null
  email: string | null
  phone: string | null
  address: string | null
  wilaya: string | null
  daira: string | null
  commune: string | null
  latitude: number | null
  longitude: number | null
  cover_image: string | null
  logo_path: string | null
  opening_hours: Record<string, { open: string; close: string }> | null
  template_slug: string | null
  theme_preset_id: number | null
  is_active: boolean
  is_paused: boolean
  pause_note: string | null
  ordering_enabled: boolean
  allows_pre_orders: boolean
  pre_order_lead_time_hours: number | null
  avg_prep_time: number | null
  base_delivery_fee: number | null
  delivery_zone_radius: number | null
  avg_delivery_time_per_km: number | null
  social_links?: { id: number; platform: string; url: string; icon: string | null }[]
  images?: { id: number; image: string | null; caption: string | null }[]
  offers?: { id: number; title: string; description: string | null; discount_percent: number | null; is_active: boolean }[]
  badges?: BadgeData[]
  staff?: StaffMember[]
  reviews_count?: number
  avg_rating?: number
}

interface BranchPageResponse {
  branch: BranchData
  store: BranchStoreData
  foods: Food[]
  reviews: BranchReviewData[]
  is_paused?: boolean
  pause_note?: string | null
}

interface ThemePresetCssVars {
  [key: string]: string
}

// ── JSON-LD ──────────────────────────────────────────────────────────────────

function BranchJsonLd({ branch, store }: { branch: BranchData; store: BranchStoreData }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: branch.name,
    description: branch.description || undefined,
    image: branch.cover_image || undefined,
    address: branch.address
      ? {
          '@type': 'PostalAddress',
          streetAddress: branch.address,
          addressLocality: branch.commune || undefined,
          addressRegion: branch.wilaya || undefined,
        }
      : undefined,
    telephone: branch.phone || undefined,
    email: branch.email || undefined,
    containedInPlace: {
      '@type': 'Restaurant',
      name: store.name,
    },
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ── Page Component ───────────────────────────────────────────────────────────

export default function BranchDetailPage() {
  const params = useParams<{ alias: string }>()
  const alias = params.alias
  const { t } = useLanguage()
  const router = useRouter()
  const { user } = useAuth()

  const [branch, setBranch] = useState<BranchData | null>(null)
  const [store, setStore] = useState<BranchStoreData | null>(null)
  const [foods, setFoods] = useState<Food[]>([])
  const [reviews, setReviews] = useState<BranchReviewData[]>([])
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [isPaused, setIsPaused] = useState(false)
  const [pauseNote, setPauseNote] = useState<string | null>(null)
  const [templateSlug, setTemplateSlug] = useState<string | null>(null)
  const [templateHtml, setTemplateHtml] = useState<string | null>(null)
  const [templateCss, setTemplateCss] = useState<string | null>(null)
  const [processedTemplateHtml, setProcessedTemplateHtml] = useState<string | null>(null)
  const [themeCssVars, setThemeCssVars] = useState<ThemePresetCssVars | null>(null)
  const [processingTemplate, setProcessingTemplate] = useState(false)
  const [eagerTemplate, setEagerTemplate] = useState<React.ComponentType<{
    store: TemplateStore
    onAddToCart?: (foodId: number) => void
  }> | null>(null)
  const [eagerLoading, setEagerLoading] = useState(false)

  const { addToCart: rawAddToCart } = useCart()
  const { currency } = useCurrency()
  const contentRef = useRef<HTMLDivElement>(null)
  const hiddenRenderRef = useRef<HTMLDivElement>(null)

  const addToCart = (food: Food) => {
    if (branch?.ordering_enabled === false) return
    if (isPaused) return
    rawAddToCart(food)
  }

  const [activeCategory, setActiveCategory] = useState<number | null>(null)

  const categories = foods.reduce<{ id: number; name: string }[]>((acc, f) => {
    ;(f.categories || []).forEach((cat) => {
      if (!acc.find((c) => c.id === cat.id)) acc.push(cat)
    })
    return acc
  }, [])

  const filteredFoods = foods.filter((f) =>
    activeCategory === null ||
    (f.categories || []).some((cat) => cat.id === activeCategory),
  )

  // ── Fetch branch data ──────────────────────────────────────────────────────

  useEffect(() => {
    if (!alias) return
    ;(async () => {
      setFetching(true)
      try {
        const res = await api.get<{ data: BranchPageResponse }>(`/branches/${alias}`)
        const { branch: bd, store: sd, foods: fds, reviews: revs } = res.data

        setBranch(bd)
        setStore(sd)
        setFoods(fds || [])
        setReviews(revs || [])

        if (bd.is_paused !== undefined) {
          setIsPaused(bd.is_paused)
          setPauseNote(bd.pause_note ?? null)
        }

        // Template handling
        if (bd.template_slug) {
          setTemplateSlug(bd.template_slug)

          // Attempt to load theme vars from the store's preset or branch's theme_preset_id
          const preset = getThemePreset(bd.template_slug)
          if (preset) {
            setThemeCssVars(preset.vars as unknown as ThemePresetCssVars)
          }
        }
      } catch {
        setError('Failed to load branch')
      }
      setFetching(false)
    })()
  }, [alias])

  // Inject theme CSS vars from the selected template preset
  const styleRef = useRef<HTMLStyleElement | null>(null)
  useEffect(() => {
    if (!themeCssVars || Object.keys(themeCssVars).length === 0) return
    if (!styleRef.current) {
      styleRef.current = document.createElement('style')
      styleRef.current.id = 'branch-theme-vars-' + alias
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

  const activeTemplateSlug = templateSlug
  const TemplateComponent = activeTemplateSlug
    ? TEMPLATE_COMPONENTS[activeTemplateSlug]
    : null

  // Pre-load template component eagerly so the hidden render works synchronously
  useEffect(() => {
    if (!activeTemplateSlug || templateHtml || !branch) return
    setEagerLoading(true)
    let cancelled = false
    ;(async () => {
      try {
        const imp = TEMPLATE_IMPORTS[activeTemplateSlug]
        if (!imp) return
        const mod = await imp()
        if (!cancelled) {
          setEagerTemplate(() => mod.default)
          setEagerLoading(false)
        }
      } catch {
        if (!cancelled) {
          setEagerTemplate(null)
          setEagerLoading(false)
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [activeTemplateSlug, templateHtml, branch])

  // Process React template component: render hidden, extract HTML,
  // replace colors with theme CSS vars (mirrors page-builder pipeline)
  useLayoutEffect(() => {
    if (!eagerTemplate || !branch || !themeCssVars || templateHtml) return
    if (processedTemplateHtml) return
    setProcessingTemplate(true)
  }, [eagerTemplate, branch, themeCssVars, templateHtml, processedTemplateHtml])

  useLayoutEffect(() => {
    if (!processingTemplate || !hiddenRenderRef.current) return
    const rawHtml = hiddenRenderRef.current.innerHTML
    if (
      !rawHtml ||
      rawHtml.trim() === '' ||
      rawHtml.trim() === '<!---->' ||
      rawHtml.trim() === '<!-- -->'
    )
      return
    const processed = replaceColorsWithCssVars(
      rawHtml,
      themeCssVars as unknown as Record<string, string>,
      activeTemplateSlug ?? undefined,
    )
    setProcessedTemplateHtml(processed)
    setProcessingTemplate(false)
  }, [processingTemplate, themeCssVars, activeTemplateSlug])

  // ── Render pipeline booleans ───────────────────────────────────────────────

  const shouldProcessReactTemplate =
    !!templateSlug && !!eagerTemplate && !!branch && !templateHtml
  const readyToRenderProcessed =
    shouldProcessReactTemplate && !!processedTemplateHtml

  // ── Event delegation for Add to Cart buttons in static published HTML ──────

  // Event delegation for Add to Cart buttons in static published HTML only
  // (template buttons have their own onClick handlers, so this would double-add)
  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const btn = target.closest('[data-add-to-cart]') as HTMLElement | null
      if (!btn) return
      const foodId = Number(btn.getAttribute('data-add-to-cart'))
      if (isNaN(foodId)) return
      const food = foods.find((f) => f.id === foodId)
      if (food) addToCart(food)
    }
    el.addEventListener('click', handler)
    return () => el.removeEventListener('click', handler)
  }, [foods, addToCart])

  async function handleReviewSubmit(rating: number, comment: string) {
    if (!user || !branch) return
    try {
      const res = await api.post<{ review: BranchReviewData }>(
        `/stores/${store?.id}/reviews`,
        { rating, comment },
      )
      setReviews((prev) => [
        ...prev,
        res.review || {
          id: Date.now(),
          rating,
          comment,
          user: user.name,
          avatar: null,
          created_at: new Date().toISOString(),
        },
      ])
    } catch {
      /* ignore */
    }
  }

  // ── Loading state ──────────────────────────────────────────────────────────

  if (fetching) {
    return (
      <div key="loading-state" className="contents">
        <header className="flex h-16 items-center border-b border-stone-200 bg-white px-6 dark:border-stone-700 dark:bg-stone-800 sticky top-0 z-30">
          <Link
            href="/"
            className="text-lg font-extrabold text-amber-700 dark:text-amber-400"
          >
            {t('app_name')}
          </Link>
        </header>
        <div className="flex min-h-[60vh] items-center justify-center bg-stone-50 dark:bg-stone-950">
          <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-amber-600 border-t-transparent" />
        </div>
      </div>
    )
  }

  // ── Error state ────────────────────────────────────────────────────────────

  if (error || !branch) {
    return (
      <div key="error-state" className="contents">
        <header className="flex h-16 items-center border-b border-stone-200 bg-white px-6 dark:border-stone-700 dark:bg-stone-800">
          <Link
            href="/"
            className="text-lg font-extrabold text-amber-700 dark:text-amber-400"
          >
            {t('app_name')}
          </Link>
        </header>
        <div className="flex min-h-[60vh] items-center justify-center bg-stone-50 dark:bg-stone-950">
          <div className="text-center">
            <div className="mb-4 text-5xl">😕</div>
            <p className="mb-6 text-sm font-medium text-stone-600 dark:text-stone-300">
              {error || 'Branch not found'}
            </p>
            <Link
              href="/"
              className="inline-block rounded-xl bg-amber-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-amber-700"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ── Build TemplateStore from branch + store data ───────────────────────────

  const orderingDisabled = branch.ordering_enabled === false
  const branchAsStore: TemplateStore = {
    id: branch.id,
    name: branch.name,
    alias: branch.alias,
    description: branch.description,
    phone: branch.phone,
    email: branch.email,
    address: branch.address,
    logo: branch.logo_path || null,
    cover: null,
    cover_image: branch.cover_image || null,
    avg_rating: branch.avg_rating ?? 0,
    reviews_count: branch.reviews_count ?? reviews.length,
    opening_hours: branch.opening_hours,
    ordering_enabled: branch.ordering_enabled ?? true,
    badges: branch.badges || [],
    staff: branch.staff || [],
    foods: foods,
    reviews: reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      user: r.user,
      avatar: r.avatar,
      created_at: r.created_at,
    })),
    // Extended fields
    wilaya: branch.wilaya,
    daira: branch.daira,
    commune: branch.commune,
    latitude: branch.latitude,
    longitude: branch.longitude,
    type_categories: [],
    phones: [],
    social_links: branch.social_links || [],
    avg_prep_time: branch.avg_prep_time,
    base_delivery_fee: branch.base_delivery_fee,
    delivery_zone_radius: branch.delivery_zone_radius,
    avg_delivery_time_per_km: branch.avg_delivery_time_per_km,
    allows_pre_orders: branch.allows_pre_orders,
    pre_order_lead_time_hours: branch.pre_order_lead_time_hours,
    is_paused: branch.is_paused,
    pause_note: branch.pause_note,
    images: branch.images || [],
    offers: (branch.offers || []).map(o => ({ ...o, starts_at: null, ends_at: null })),
    posts: [],
    banners: [],
    reservation_enabled: false,
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div key="success-state" className="contents">
        <div
          ref={contentRef}
          className="min-h-screen bg-stone-50 text-stone-800 dark:bg-stone-950 dark:text-stone-100"
        >
          {/* Ordering status banner */}
          <div
            className={`border-b px-4 py-3 text-center ${
              orderingDisabled
                ? 'border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/30'
                : 'border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-950/30'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  orderingDisabled ? 'bg-red-500' : 'bg-green-500'
                }`}
              />
              <p
                className={`text-sm font-semibold ${
                  orderingDisabled
                    ? 'text-red-700 dark:text-red-400'
                    : 'text-green-700 dark:text-green-400'
                }`}
              >
                {orderingDisabled
                  ? t('ordering_disabled_banner')
                  : t('ordering_enabled_banner')}
              </p>
            </div>
          </div>

          {/* Paused banner */}
          {isPaused && (
            <div className="border-b border-orange-300 bg-orange-100 px-4 py-3 text-center dark:border-orange-900/50 dark:bg-orange-950/30">
              <div className="flex items-center justify-center gap-2">
                <PauseCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                <p className="text-sm font-semibold text-orange-700 dark:text-orange-400">
                  {pauseNote || t('store_temporarily_paused')}
                </p>
              </div>
            </div>
          )}

          {/* ── Hidden container for React component HTML extraction ── */}
          {shouldProcessReactTemplate && !processedTemplateHtml && (
            <div ref={hiddenRenderRef} className="hidden" aria-hidden="true">
              {eagerTemplate &&
                (() => {
                  const EagerTemplate = eagerTemplate
                  return (
                    <EagerTemplate
                      store={branchAsStore}
                      onAddToCart={(foodId: number) => {
                        const food = foods.find((f) => f.id === foodId)
                        if (food) addToCart(food)
                      }}
                    />
                  )
                })()}
            </div>
          )}

          {/* ── Content pipeline (3 modes) ── */}

          {/* Mode 1: Processed React template (HTML extracted from hidden render) */}
          {readyToRenderProcessed ? (
            <ErrorBoundary key={activeTemplateSlug + '_processed'}>
              <StorefrontRenderer
                html={processedTemplateHtml!}
                css={templateCss}
                js={null}
              />
            </ErrorBoundary>
          ) : // Mode 2: Loading template (extraction in progress)
          shouldProcessReactTemplate && !processedTemplateHtml ? (
            <div className="flex min-h-[60vh] items-center justify-center">
              <div className="flex flex-col items-center gap-3 text-gray-400">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-600 border-t-transparent" />
                <span className="text-sm font-medium">Loading template...</span>
              </div>
            </div>
          ) : // Mode 3: Eager loading before template is ready
          eagerLoading && !eagerTemplate && TemplateComponent && branch ? (
            <div className="flex min-h-[60vh] items-center justify-center">
              <div className="flex flex-col items-center gap-3 text-gray-400">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-600 border-t-transparent" />
                <span className="text-sm font-medium">Loading template...</span>
              </div>
            </div>
          ) : // Mode 4: Live React lazy template component
          TemplateComponent && branch ? (
            <ErrorBoundary key={activeTemplateSlug}>
              <Suspense
                fallback={
                  <div className="flex min-h-[60vh] items-center justify-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-amber-600 border-t-transparent" />
                  </div>
                }
              >
                <TemplateComponent
                  store={branchAsStore}
                  onAddToCart={(foodId: number) => {
                    const food = foods.find((f) => f.id === foodId)
                    if (food) addToCart(food)
                  }}
                />
              </Suspense>
            </ErrorBoundary>
          ) : // Mode 5: DB-stored HTML template
          templateHtml ? (
            <ErrorBoundary key={templateHtml}>
              <StorefrontRenderer
                html={templateHtml}
                css={templateCss}
                js={null}
              />
            </ErrorBoundary>
          ) : (
            /* ── Fallback: Default branch layout ── */
            <>
              <BranchJsonLd branch={branch} store={store!} />

              {/* Cover image */}
              {branch.cover_image && (
                <div className="relative h-48 w-full overflow-hidden sm:h-64 lg:h-80">
                  <img
                    src={getImageUrl(branch.cover_image) ?? branch.cover_image}
                    alt={branch.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              {/* Store link */}
              {store && (
                <div className="border-b border-stone-200 bg-white px-4 py-3 dark:border-stone-700 dark:bg-stone-800">
                  <div className="mx-auto flex max-w-7xl items-center gap-2 text-sm">
                    <span className="text-stone-500 dark:text-stone-400">Part of</span>
                    <Link
                      href={`/stores/${store.alias}`}
                      className="font-semibold text-orange-600 hover:underline dark:text-orange-400"
                    >
                      {store.name}
                    </Link>
                    {store.avg_rating > 0 && (
                      <span className="text-xs text-amber-500">
                        ★ {store.avg_rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Branch header */}
              <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
                      {branch.name}
                    </h1>
                    {branch.description && (
                      <p className="mt-2 max-w-2xl text-stone-600 dark:text-stone-400">
                        {branch.description}
                      </p>
                    )}
                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-stone-500 dark:text-stone-400">
                      {branch.email && (
                        <span>
                          <span className="font-medium text-stone-700 dark:text-stone-300">
                            Email:
                          </span>{' '}
                          {branch.email}
                        </span>
                      )}
                      {branch.phone && (
                        <span>
                          <span className="font-medium text-stone-700 dark:text-stone-300">
                            Phone:
                          </span>{' '}
                          {branch.phone}
                        </span>
                      )}
                      {branch.address && (
                        <span>
                          <span className="font-medium text-stone-700 dark:text-stone-300">
                            Address:
                          </span>{' '}
                          {branch.address}
                          {[branch.wilaya, branch.daira, branch.commune]
                            .filter(Boolean)
                            .length > 0 && (
                            <span>
                              ,{' '}
                              {[branch.wilaya, branch.daira, branch.commune]
                                .filter(Boolean)
                                .join(', ')}
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Main content: Foods + Info ── */}
              <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                  {/* Left: Foods */}
                  <div className="space-y-8 lg:col-span-2">
                    <div
                      className={cn(
                        'overflow-hidden rounded-2xl shadow-sm',
                        CARD_PRESETS.base,
                      )}
                    >
                      <div className="border-b border-stone-100 bg-stone-50/50 px-6 py-4 dark:border-stone-700 dark:bg-stone-800/50">
                        <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-stone-500 dark:text-stone-400">
                          {t('menu')}
                        </h2>
                      </div>

                      {/* Category filter */}
                      {categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 px-6 pb-2 pt-4">
                          <button
                            onClick={() => setActiveCategory(null)}
                            className={`rounded-xl border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-150 ${
                              activeCategory === null
                                ? 'border-orange-500 bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm'
                                : 'border-stone-200 bg-white text-stone-500 hover:border-orange-300 hover:text-orange-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:hover:border-orange-600 dark:hover:text-orange-400'
                            }`}
                          >
                            {t('store_menu_filter_all')}
                          </button>
                          {categories.map((cat) => (
                            <button
                              key={cat.id}
                              onClick={() => setActiveCategory(cat.id)}
                              className={`rounded-xl border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-150 ${
                                activeCategory === cat.id
                                  ? 'border-orange-500 bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm'
                                  : 'border-stone-200 bg-white text-stone-500 hover:border-orange-300 hover:text-orange-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:hover:border-orange-600 dark:hover:text-orange-400'
                              }`}
                            >
                              {cat.name}
                            </button>
                          ))}
                        </div>
                      )}

                      <div className="p-6 pt-4">
                        {filteredFoods.length === 0 ? (
                          <div className="py-12 text-center">
                            <p className="text-xs font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500">
                              {t('store_menu_empty')}
                            </p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {filteredFoods.map((food) => (
                              <div
                                key={food.id}
                                className="group flex flex-col justify-between rounded-xl border border-stone-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-lg dark:border-stone-700 dark:bg-stone-800 dark:hover:border-amber-700"
                              >
                                <div>
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-2">
                                        <h3 className="truncate text-sm font-bold text-stone-800 dark:text-stone-100">
                                          {food.name}
                                        </h3>
                                        {food.is_offer && (
                                          <span className="shrink-0 rounded-full border border-red-200 bg-red-50 px-1.5 py-0.5 text-[9px] font-bold text-red-500 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                                            {t('promo')}
                                          </span>
                                        )}
                                      </div>
                                      {food.description && (
                                        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-stone-500 dark:text-stone-400">
                                          {food.description}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="mt-3 flex gap-3 text-[10px] font-semibold text-stone-400 dark:text-stone-500">
                                    {food.cooking_time && (
                                      <span>
                                        {t('store_menu_cooking_time', {
                                          time: food.cooking_time,
                                        })}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3 dark:border-stone-700">
                                  <div className="font-mono">
                                    {food.new_price ? (
                                      <>
                                        <span className="ltr:mr-1.5 text-xs line-through text-stone-400 rtl:ml-1.5 dark:text-stone-500">
                                          {formatFoodPrice(food, currency, {
                                            original: true,
                                          })}
                                        </span>
                                        <span className="text-sm font-bold text-amber-700 dark:text-amber-400">
                                          {formatFoodPrice(food, currency)}
                                        </span>
                                      </>
                                    ) : (
                                      <span className="text-sm font-bold text-stone-800 dark:text-stone-100">
                                        {formatFoodPrice(food, currency)}
                                      </span>
                                    )}
                                  </div>
                                  {orderingDisabled ? (
                                    <span className="px-2 text-[11px] font-semibold text-amber-500 dark:text-amber-400">
                                      {t('store_menu_unavailable')}
                                    </span>
                                  ) : (
                                    <button
                                      onClick={() => addToCart(food)}
                                      className="min-h-[44px] rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2.5 text-[11px] font-bold text-white shadow-sm transition-all duration-200 hover:from-orange-600 hover:to-orange-700 hover:shadow-md active:scale-95"
                                    >
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

                  {/* Right: Info sidebar */}
                  <div className="space-y-6">
                    {branch.opening_hours && (
                      <OpeningHoursCard hours={branch.opening_hours} />
                    )}

                    <div
                      className={cn('rounded-2xl p-5', CARD_PRESETS.base)}
                    >
                      <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.15em] text-stone-500 dark:text-stone-400">
                        {t('store_contact_heading')}
                      </h3>
                      <div className="space-y-3 text-sm">
                        {branch.phone && (
                          <p className="text-stone-600 dark:text-stone-300">
                            <span className="font-medium text-stone-700 dark:text-stone-200">
                              {t('phone')}:
                            </span>{' '}
                            {branch.phone}
                          </p>
                        )}
                        {branch.email && (
                          <p className="text-stone-600 dark:text-stone-300">
                            <span className="font-medium text-stone-700 dark:text-stone-200">
                              {t('email')}:
                            </span>{' '}
                            {branch.email}
                          </p>
                        )}
                        {branch.address && (
                          <p className="text-stone-600 dark:text-stone-300">
                            <span className="font-medium text-stone-700 dark:text-stone-200">
                              {t('address')}:
                            </span>{' '}
                            {branch.address}
                          </p>
                        )}
                        {!branch.phone && !branch.email && !branch.address && (
                          <p className="text-stone-500 dark:text-stone-400">
                            {t('store_contact_unavailable')}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Reviews */}
                    <div>
                      <h2 className="mb-5 px-1 text-xs font-bold uppercase tracking-[0.15em] text-stone-500 dark:text-stone-400">
                        {t('store_reviews_heading')}
                      </h2>
                      <ReviewInput user={user} onSubmit={handleReviewSubmit} />

                      {reviews.length === 0 ? (
                        <p className="py-8 text-center text-sm italic text-stone-400 dark:text-stone-500">
                          {t('store_reviews_empty')}
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {reviews.map((rev) => (
                            <div
                              key={rev.id}
                              className={cn(
                                'rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md',
                                CARD_PRESETS.base,
                              )}
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  className={cn(
                                    AVATAR_PRESETS.base,
                                    AVATAR_PRESETS.md,
                                    'shadow-sm',
                                  )}
                                >
                                  {rev.user.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="truncate text-sm font-bold text-stone-800 dark:text-stone-100">
                                      {rev.user}
                                    </div>
                                    <span className="shrink-0 text-sm text-amber-500">
                                      {'★'.repeat(rev.rating)}
                                      {'☆'.repeat(5 - rev.rating)}
                                    </span>
                                  </div>
                                  {rev.comment && (
                                    <p className="mt-1.5 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
                                      {rev.comment}
                                    </p>
                                  )}
                                  <span className="mt-2 block text-[10px] font-medium text-stone-400 dark:text-stone-500">
                                    {new Date(rev.created_at).toLocaleDateString()}
                                  </span>
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

          {/* Cart drawer (always shown unless ordering is disabled) */}
          {!orderingDisabled && store && (
            <CartDrawer storeId={store.id} />
          )}
        </div>
    </div>
  )
}
