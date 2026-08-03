'use client'
import { cn } from '@/lib/utils'

interface Banner {
  id: number
  title: string | null
  description: string | null
  image: string | null
  link_url: string | null
  is_active?: boolean
}

interface BannerHeroProps {
  banners: Banner[]
  className?: string
}

export function BannerHero({ banners, className }: BannerHeroProps) {
  const active = banners?.filter((b: Banner) => b.is_active !== false) ?? []
  if (!active.length) return null
  const banner = active[0]!
  return (
    <a
      href={banner.link_url || '#'}
      className={cn('block relative overflow-hidden rounded-xl', className)}
      {...(!banner.link_url ? { onClick: (e: React.MouseEvent) => e.preventDefault() } : {})}
    >
      {banner.image ? (
        <img src={banner.image} alt={banner.title || ''} className="w-full h-48 object-cover" />
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-black/20 to-black/40 flex items-center justify-center">
          <div className="text-center p-6">
            {banner.title && <h3 className="text-xl font-bold text-white">{banner.title}</h3>}
            {banner.description && <p className="text-sm text-white/80 mt-1">{banner.description}</p>}
          </div>
        </div>
      )}
    </a>
  )
}
