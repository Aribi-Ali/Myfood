'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useCity } from '@/contexts/city'
import { useGeo } from '@/contexts/geo'
import { api } from '@/lib/api-client'
import { Navbar } from '@/components/navbar'
import { FilmGrain } from '@/components/film-grain'
import { StoreCard, StoreCardSkeleton } from '@/components/store-card'
import { FadeIn, StaggerChildren, staggerItem, ScaleIn } from '@/components/motion-components'
import { Search, MapPin, SlidersHorizontal, X, Store, Tag, Clock, Zap, Star } from 'lucide-react'
import { FloatingStoreLogo } from '@/components/floating-store-logo'
import { useLanguage } from '@/contexts/language'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface TypeCategory {
  id: number
  name: string
  slug: string
  icon: string | null
}

interface StoreListItem {
  id: number
  name: string
  alias: string
  description: string | null
  logo: string | null
  logo_path?: string | null
  cover_image?: string | null
  reviews_avg_rating?: number | null
  reviews_count?: number
  wilaya?: string | null
  address?: string | null
  avg_prep_time?: number | null
  base_delivery_fee?: number | null
  badges?: { id: number; name: string; color?: string; icon?: string }[]
  type_categories?: TypeCategory[]
  is_open?: boolean | null
}

export default function StoresPage() {
  const { city } = useCity()
  const { wilayas } = useGeo()
  const { t } = useLanguage()
  const [stores, setStores] = useState<StoreListItem[]>([])
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [sort, setSort] = useState<'name' | 'rating'>('rating')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedWilaya, setSelectedWilaya] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError('')
    const params = new URLSearchParams()
    const wilayaName = selectedWilaya || city?.wilayaName
    if (wilayaName) params.set('wilaya', wilayaName)
    api.get<{ success: boolean; data: { stores: StoreListItem[] } }>(`/stores?${params}`)
      .then(json => setStores(json.data?.stores ?? []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [city?.wilayaName, selectedWilaya])

  const allCategories = useMemo(() => {
    const map = new Map<number, TypeCategory>()
    for (const s of stores) {
      for (const tc of s.type_categories ?? []) {
        if (!map.has(tc.id)) map.set(tc.id, tc)
      }
    }
    return Array.from(map.values())
  }, [stores])

  const filtered = useMemo(() => {
    let result = [...stores]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) || (s.description || '').toLowerCase().includes(q)
      )
    }
    if (selectedCategory) {
      result = result.filter(s =>
        (s.type_categories ?? []).some(tc => tc.id === selectedCategory)
      )
    }
    result.sort((a, b) => {
      if (sort === 'rating') return (b.reviews_avg_rating ?? 0) - (a.reviews_avg_rating ?? 0)
      return a.name.localeCompare(b.name)
    })
    return result
  }, [stores, search, selectedCategory, sort])

  const groupedByCategory = useMemo(() => {
    if (selectedCategory) return null
    const groups: { category: TypeCategory; stores: StoreListItem[] }[] = []
    const seen = new Set<number>()
    for (const cat of allCategories) {
      const catStores = filtered.filter(s =>
        (s.type_categories ?? []).some(tc => tc.id === cat.id)
      )
      if (catStores.length > 0) {
        groups.push({ category: cat, stores: catStores })
        seen.add(cat.id)
      }
    }
    const uncategorized = filtered.filter(s => !(s.type_categories ?? []).length)
    if (uncategorized.length > 0) {
      groups.push({ category: { id: 0, name: t('stores_other'), slug: '', icon: null }, stores: uncategorized })
    }
    return groups
  }, [filtered, allCategories, selectedCategory, t])

  const handleSearch = useCallback(() => {
    setSearch(searchInput)
  }, [searchInput])

  const cityName = selectedWilaya || city.wilayaName
  const hasActiveFilters = selectedWilaya || search || selectedCategory

  const openCount = stores.filter(s => s.is_open === true).length
  const fastCount = stores.filter(s => s.avg_prep_time != null && s.avg_prep_time <= 30).length
  const topRated = stores.filter(s => s.reviews_avg_rating != null && s.reviews_avg_rating >= 4).length

  return (
    <>
      <Navbar />
      <FilmGrain />
      <main className="flex-1">

        {/* ---- HERO: Sushi-inspired editorial ---- */}
        <section className="relative bg-cream dark:bg-background overflow-hidden">
          <div className="absolute inset-0 warm-gradient opacity-40 pointer-events-none" />

          {/* Decorative kanji */}
          <div className="absolute top-10 right-8 kanji-deco text-[140px] sm:text-[200px] select-none pointer-events-none dark:text-cream">
            shop
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
            <div className="grid lg:grid-cols-12 gap-8 items-end">
              <div className="lg:col-span-8">
                <FadeIn direction="down" delay={0.1}>
                  <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-5">
                    <Store className="h-3.5 w-3.5 text-primary" />
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-primary">{t('stores_label')}</span>
                  </div>
                </FadeIn>

                <FadeIn direction="up" delay={0.2}>
                  <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[0.95] text-foreground">
                    {t('stores_hero_title_line1')}
                    <br />
                    <span className="text-primary">{t('stores_hero_title_line2')}</span>
                  </h1>
                </FadeIn>

                <FadeIn direction="up" delay={0.35}>
                  <p className="mt-4 max-w-lg text-base text-muted leading-relaxed">
                    {t('stores_hero_desc')}
                  </p>
                </FadeIn>
              </div>

              {/* Stats */}
              <div className="lg:col-span-4 grid grid-cols-3 gap-3">
                {[
                  { count: openCount, labelKey: 'stores_stats_open', bg: 'bg-primary', icon: Store },
                  { count: fastCount, labelKey: 'stores_stats_fast', bg: 'bg-charcoal', icon: Zap },
                  { count: topRated, labelKey: 'stores_stats_rated', bg: 'bg-primary/80', icon: Star },
                ].map(({ count, labelKey, bg, icon: Icon }, i) => (
                  <ScaleIn key={labelKey} delay={0.3 + i * 0.1}>
                    <div className={`${bg} rounded-2xl p-3 sm:p-4 text-center`}>
                      <Icon className="h-4 w-4 mx-auto mb-1 text-white" />
                      <div className="text-lg sm:text-xl font-display font-bold leading-none text-white">{count}</div>
                      <div className="text-[8px] sm:text-[9px] font-semibold uppercase tracking-widest text-white/70 mt-1">{t(labelKey)}</div>
                    </div>
                  </ScaleIn>
                ))}
              </div>
            </div>

            {/* Search + Filter */}
            <FadeIn direction="up" delay={0.5}>
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute ltr:left-4 rtl:right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <input
                    type="text"
                    placeholder={t('stores_search_placeholder')}
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    className="w-full bg-surface dark:bg-surface ltr:pl-11 rtl:pr-11 ltr:pr-4 rtl:pl-4 py-3.5 text-sm text-foreground placeholder-muted/60 rounded-xl border border-border transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  />
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn(
                    'flex items-center justify-center gap-2 px-5 py-3.5 text-xs font-semibold rounded-xl border transition-all duration-300 cursor-pointer min-h-[48px]',
                    showFilters
                      ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                      : 'bg-surface dark:bg-surface text-foreground border-border hover:border-foreground/30'
                  )}
                  aria-label={t('stores_filter_toggle')}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('stores_filter')}</span>
                </button>

                <button
                  onClick={() => setSort(sort === 'name' ? 'rating' : 'name')}
                  className="flex items-center justify-center gap-2 px-5 py-3.5 text-xs font-semibold bg-surface dark:bg-surface text-foreground rounded-xl border border-border transition-all duration-300 hover:border-foreground/30 cursor-pointer min-h-[48px]"
                >
                  {sort === 'name' ? t('stores_sort_name') : t('stores_sort_rating')}
                </button>
              </div>
            </FadeIn>

            {/* Expanded Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 bg-surface dark:bg-surface rounded-xl border border-border p-5">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <MapPin className="h-4 w-4 text-primary shrink-0" />
                        <select value={selectedWilaya} onChange={e => setSelectedWilaya(e.target.value)}
                          className="border border-border bg-surface dark:bg-surface text-xs font-semibold text-foreground focus:outline-none cursor-pointer px-3 py-1.5 rounded-lg">
                          <option value="">{cityName || t('stores_all_locations')}</option>
                          {(wilayas || []).map((w: any) => (
                            <option key={w.id || w.name_fr} value={w.name_fr || w.id}>{w.name_fr || w.id}</option>
                          ))}
                        </select>
                      </div>

                      <div className="w-[1px] h-6 bg-border" />

                      <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
                        <button
                          onClick={() => setSelectedCategory(null)}
                          className={cn('text-[10px] font-semibold uppercase tracking-widest px-4 py-2 whitespace-nowrap rounded-full border transition-all duration-300 cursor-pointer',
                            !selectedCategory
                              ? 'bg-foreground text-cream border-foreground'
                              : 'bg-surface dark:bg-surface text-foreground border-border hover:border-foreground/30'
                          )}
                        >
                          {t('all')}
                        </button>
                        {allCategories.map(cat => (
                          <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={cn('text-[10px] font-semibold uppercase tracking-widest px-4 py-2 whitespace-nowrap rounded-full border transition-all duration-300 cursor-pointer',
                              selectedCategory === cat.id
                                ? 'bg-foreground text-cream border-foreground'
                                : 'bg-surface dark:bg-surface text-foreground border-border hover:border-foreground/30'
                            )}
                          >
                            {cat.icon && <span className="mr-1">{cat.icon}</span>}
                            {cat.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Category Pills */}
            {!showFilters && allCategories.length > 0 && (
              <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                {allCategories.slice(0, 8).map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                    className={cn('text-[10px] font-semibold uppercase tracking-widest px-4 py-2 whitespace-nowrap rounded-full border transition-all duration-300 cursor-pointer',
                      selectedCategory === cat.id
                        ? 'bg-foreground text-cream border-foreground'
                        : 'bg-surface dark:bg-surface text-foreground border-border hover:border-foreground/30'
                    )}
                  >
                    {cat.icon && <span className="mr-1">{cat.icon}</span>}
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ---- RESULTS ---- */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          {hasActiveFilters && (
            <FadeIn>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">{t('stores_filtered_results')}</span>
                  <button
                    onClick={() => { setSearch(''); setSearchInput(''); setSelectedWilaya(''); setSelectedCategory(null) }}
                    className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-primary hover:text-primary-hover transition-colors cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                    {t('stores_clear_all')}
                  </button>
                </div>
              </div>
            </FadeIn>
          )}

          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => <StoreCardSkeleton key={i} />)}
            </div>
          ) : error ? (
            <FadeIn>
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mb-4">
                  <Store className="h-7 w-7 text-white" />
                </div>
                <p className="text-base font-bold text-red-600 dark:text-red-400">{t('stores_loading_error')}</p>
                <p className="text-sm text-muted mt-1">{error}</p>
              </div>
            </FadeIn>
          ) : filtered.length === 0 ? (
            <FadeIn>
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-cream-dark dark:bg-surface rounded-full flex items-center justify-center mx-auto mb-5 border border-border">
                  <Search className="h-8 w-8 text-muted" />
                </div>
                <p className="text-xl font-display font-bold text-foreground">{search ? t('stores_no_results_search') : t('stores_no_results_default')}</p>
                <p className="text-sm text-muted mt-2">{t('stores_check_back')}</p>
              </div>
            </FadeIn>
          ) : selectedCategory ? (
            <>
              <FadeIn>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
                    {t('stores_count', { count: filtered.length })}
                  </p>
                </div>
              </FadeIn>
              <StaggerChildren stagger={0.06} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map(store => (
                  <motion.div key={store.id} variants={staggerItem}>
                    <StoreCard
                      name={store.name}
                      alias={store.alias}
                      description={store.description}
                      logo={store.logo || store.logo_path || null}
                      coverImage={store.cover_image || null}
                      avgRating={store.reviews_avg_rating ?? null}
                      reviewsCount={store.reviews_count || 0}
                      badges={(store.badges || []).map(b => typeof b === 'string' ? b : b.name || '').filter(Boolean)}
                      deliveryFee={store.base_delivery_fee ?? null}
                      avgPrepTime={store.avg_prep_time ?? null}
                      address={store.address || store.wilaya || null}
                      isOpen={store.is_open ?? null}
                    />
                  </motion.div>
                ))}
              </StaggerChildren>
            </>
          ) : (
            <div className="space-y-12">
              {groupedByCategory?.map((group, gi) => (
                <section key={group.category.id}>
                  <FadeIn delay={gi * 0.05}>
                    <div className="flex items-center gap-3 mb-6 pb-3 border-b border-border">
                      <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
                        <Tag className="h-4 w-4 text-white" />
                      </div>
                      <h2 className="font-display text-lg font-bold tracking-tight text-foreground">
                        {group.category.icon && <span className="mr-1.5">{group.category.icon}</span>}
                        {group.category.name}
                      </h2>
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-muted bg-cream-dark dark:bg-surface px-2 py-0.5 rounded-full">
                        {group.stores.length}
                      </span>
                    </div>
                  </FadeIn>
                  <StaggerChildren stagger={0.06} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {group.stores.map(store => (
                      <motion.div key={store.id} variants={staggerItem}>
                        <StoreCard
                          name={store.name}
                          alias={store.alias}
                          description={store.description}
                          logo={store.logo || store.logo_path || null}
                          coverImage={store.cover_image || null}
                          avgRating={store.reviews_avg_rating ?? null}
                          reviewsCount={store.reviews_count || 0}
                          badges={(store.badges || []).map(b => typeof b === 'string' ? b : b.name || '').filter(Boolean)}
                          deliveryFee={store.base_delivery_fee ?? null}
                          avgPrepTime={store.avg_prep_time ?? null}
                          address={store.address || store.wilaya || null}
                          isOpen={store.is_open ?? null}
                        />
                      </motion.div>
                    ))}
                  </StaggerChildren>
                </section>
              ))}
            </div>
          )}
        </section>
      </main>
      <FloatingStoreLogo />
    </>
  )
}
