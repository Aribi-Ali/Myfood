'use client'
import { Tag } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Offer {
  id: number
  title: string
  description: string | null
  discount_percent: number | null
}

interface OffersSectionProps {
  offers: Offer[]
  className?: string
}

export function OffersSection({ offers, className }: OffersSectionProps) {
  if (!offers?.length) return null
  return (
    <div className={cn('space-y-3', className)}>
      <h3 className="text-sm font-bold uppercase tracking-wider opacity-60">Offers</h3>
      {offers.map((offer) => (
        <div key={offer.id} className="flex items-start gap-3 p-3 rounded-lg bg-black/5 backdrop-blur-sm">
          <Tag className="w-5 h-5 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-sm">{offer.title}</p>
            {offer.description && <p className="text-xs opacity-70 mt-0.5">{offer.description}</p>}
            {offer.discount_percent && (
              <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-bold bg-green-500/20 text-green-700">
                -{offer.discount_percent}%
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
