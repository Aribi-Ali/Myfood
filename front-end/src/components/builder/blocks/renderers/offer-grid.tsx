'use client'

import type { OfferGridConfig } from '@/components/templates/types'
import type { Food } from '@/types/api'
import { useCurrency } from '@/contexts/currency'
import { formatFoodPrice } from '@/lib/utils'

interface OfferGridProps {
  config: OfferGridConfig
  foods: Food[]
  onAddToCart?: (food: Food) => void
}

export function OfferGrid({ config, foods, onAddToCart }: OfferGridProps) {
  const { currency } = useCurrency()
  const offers = foods.filter((f) => f.is_offer && f.new_price).slice(0, config.maxItems)

  if (offers.length === 0) {
    return (
      <div className="py-16 px-6 bg-gradient-to-br from-orange-600 to-amber-700 text-white text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">{config.title || 'Featured Offers'}</h2>
        <p className="text-white/80">{config.subtitle || 'No current offers'}</p>
      </div>
    )
  }

  return (
    <div className="py-16 px-6 bg-gradient-to-br from-orange-600 to-amber-700 text-white">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">{config.title || 'Featured Offers'}</h2>
        {config.subtitle && (
          <p className="text-white/80 mb-8 max-w-xl mx-auto">{config.subtitle}</p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((food) => (
            <div key={food.id} className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20 text-left">
              <span className="inline-block text-[10px] font-bold px-2 py-1 rounded-full bg-orange-500 text-white mb-3 uppercase tracking-wider">
                Limited Offer
              </span>
              {food.image && (
                <img src={food.image} alt={food.name} className="w-full h-36 object-cover rounded-lg mb-3" loading="lazy" />
              )}
              <h3 className="font-bold text-lg mb-1">{food.name}</h3>
              {food.description && (
                <p className="text-white/70 text-sm mb-4 line-clamp-2">{food.description}</p>
              )}
              <div className="flex items-center justify-between">
                <div className="font-mono">
                  {config.showOriginalPrice && (
                    <span className="text-sm line-through text-white/50 mr-2">{formatFoodPrice(food, currency, { original: true })}</span>
                  )}
                  <span className="text-xl font-bold">{formatFoodPrice(food, currency)}</span>
                </div>
                {onAddToCart && (
                  <button
                    onClick={() => onAddToCart(food)}
                    className="text-sm font-bold px-5 py-2 rounded-lg bg-white text-orange-700 hover:bg-orange-50 transition active:scale-95"
                  >
                    Add
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
