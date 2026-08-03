'use client'

import { useLanguage } from '@/contexts/language'
import { getImageUrl, cn } from '@/lib/utils'
import { BADGE_PRESETS } from '@/lib/design-tokens'
import type { BadgeData } from '@/types/api'

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
  staff: { name: string; role: string }[]
  ordering_enabled: boolean | null
}

export function StoreHeaderBanner({ store, reviewsCount }: { store: StorePageStore; reviewsCount: number }) {
  const { t } = useLanguage()
  const orderingDisabled = store.ordering_enabled === false
  return (
    <div className="relative h-64 md:h-96 flex items-end overflow-hidden bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900">
      {store.cover_image ? (
        <img src={getImageUrl(store.cover_image) || store.cover_image} alt={store.name}
          className="absolute inset-0 w-full h-full object-cover object-center select-none opacity-60 scale-105 hover:scale-100 transition-transform duration-[2000ms]" loading="lazy" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center select-none">
          <span className="text-8xl opacity-20">🏪</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />

      <div className="absolute top-4 ltr:right-4 rtl:left-4 z-20 flex gap-2">
        <div className={cn(
          BADGE_PRESETS.orange,
          'flex items-center gap-1.5 text-xs',
          orderingDisabled ? 'bg-red-500/90 text-white border-red-400/50' : 'bg-green-500/90 text-white border-green-400/50'
        )}>
          <span className={`w-2 h-2 rounded-full ${orderingDisabled ? 'bg-red-200' : 'bg-green-200'}`} />
          {orderingDisabled ? t('ordering_closed') : t('ordering_open')}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="flex items-start gap-5">
          {store.logo && (
            <img src={getImageUrl(store.logo) || store.logo} alt={store.name}
              className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover border-2 border-white/30 shadow-xl flex-shrink-0" />
          )}
          <div className="pt-1">
          {store.badges.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {store.badges.map((badge) => (
                <span key={badge.id}
                  className="text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm text-white uppercase tracking-wider"
                  style={{ backgroundColor: badge.color || '#f97316' }}>{badge.name}</span>
              ))}
            </div>
          )}
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-lg leading-[1.1]">{store.name}</h1>
          {store.description && (
            <p className="text-sm md:text-base mt-3 max-w-2xl leading-relaxed text-white/70 drop-shadow">{store.description}</p>
          )}
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 shadow-lg">
          <span className="text-2xl text-amber-400 drop-shadow">★</span>
          <div>
            <div className="font-extrabold text-sm text-white">{t('store_detail_rating_format', { rating: store.avg_rating.toFixed(1) })}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-white/60">{t('store_detail_reviews_count', { count: reviewsCount })}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
