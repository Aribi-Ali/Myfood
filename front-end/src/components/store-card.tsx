'use client'

import Link from 'next/link'
import { Star, Clock, MapPin, ShoppingBag } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/language'

interface StoreCardProps {
  name: string
  alias: string
  description: string | null
  logo: string | null
  coverImage: string | null
  avgRating: number | null
  reviewsCount: number
  badges: string[]
  deliveryFee?: number | null
  avgPrepTime?: number | null
  address?: string | null
  isOpen?: boolean | null
}

export function StoreCard({
  name, alias, description, logo, coverImage, avgRating, reviewsCount,
  badges, deliveryFee, avgPrepTime, address, isOpen,
}: StoreCardProps) {
  const { t } = useLanguage()
  return (
    <Link href={`/stores/${alias}`} className="group block">
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        className="bg-surface dark:bg-surface rounded-2xl border border-border overflow-hidden h-full flex flex-col shadow-sm hover:shadow-xl transition-shadow duration-400"
      >
        {/* Cover Image */}
        <div className="relative h-40 bg-cream-dark overflow-hidden rounded-t-2xl">
          {coverImage ? (
            <img src={coverImage} alt={name + ' cover'} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy" width={400} height={160} />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-cream-dark">
              <ShoppingBag className="h-12 w-12 text-muted/20" />
            </div>
          )}

          {/* Status */}
          {isOpen === false && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full">
              {t('store_closed')}
            </div>
          )}
          {isOpen === true && (
            <div className="absolute top-3 left-3 bg-green-500 text-white text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full">
              {t('store_open')}
            </div>
          )}

          {/* Badges */}
          {badges.length > 0 && (
            <div className="absolute top-3 right-3 flex flex-wrap gap-1.5 justify-end max-w-[60%]">
              {badges.slice(0, 2).map(badge => (
                <span key={badge}
                  className="text-[9px] font-semibold uppercase tracking-widest px-2 py-0.5 bg-white/90 dark:bg-surface/90 text-foreground rounded-full backdrop-blur-sm">
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-start gap-3">
            {/* Logo */}
            {logo && (
              <div className="w-11 h-11 rounded-xl overflow-hidden bg-surface border border-border shrink-0">
                <img src={logo} alt={name} className="w-full h-full object-cover" loading="lazy"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="font-display font-bold tracking-tight text-foreground text-sm">{name}</h3>
              {address && (
                <p className="text-[11px] text-muted flex items-center gap-1 truncate mt-0.5">
                  <MapPin className="h-3 w-3 shrink-0" />{address}
                </p>
              )}
            </div>
            {/* Rating */}
            {avgRating != null && (
              <div className="flex items-center gap-1 shrink-0 bg-primary/10 px-2 py-1 rounded-lg">
                <Star className="h-3 w-3 fill-primary text-primary" />
                <span className="text-xs font-bold text-primary">{avgRating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {description && (
            <p className="text-xs text-muted mt-2 line-clamp-2 leading-relaxed">{description}</p>
          )}

          {/* Meta */}
          <div className="flex items-center gap-3 mt-auto pt-3 border-t border-border/50 text-[10px] font-semibold text-muted uppercase tracking-widest">
            {reviewsCount > 0 && (
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3" />{reviewsCount}
              </span>
            )}
            {avgPrepTime != null && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />{avgPrepTime}min
              </span>
            )}
            {deliveryFee != null && (
              <span className={deliveryFee === 0 ? 'text-green-600' : ''}>
                {deliveryFee === 0 ? t('free') : `${deliveryFee.toFixed(0)} ${t('currency_da')}`}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

export function StoreCardSkeleton() {
  return (
    <div className="bg-surface dark:bg-surface rounded-2xl border border-border overflow-hidden animate-pulse">
      <div className="h-40 bg-cream-dark rounded-t-2xl" />
      <div className="p-4 space-y-3">
        <div className="flex gap-3">
          <div className="w-11 h-11 bg-cream-dark rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-cream-dark rounded-lg" />
            <div className="h-3 w-1/2 bg-cream-dark rounded-lg" />
          </div>
        </div>
        <div className="h-3 w-full bg-cream-dark rounded-lg" />
        <div className="h-3 w-2/3 bg-cream-dark rounded-lg" />
      </div>
    </div>
  )
}
