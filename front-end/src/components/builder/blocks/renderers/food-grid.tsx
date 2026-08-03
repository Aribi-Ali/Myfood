'use client'

import { useState } from 'react'
import type { FoodGridConfig } from '@/components/templates/types'
import type { Food } from '@/types/api'
import { useCurrency } from '@/contexts/currency'
import { useLanguage } from '@/contexts/language'
import { formatFoodPrice } from '@/lib/utils'

interface FoodGridProps {
  config: FoodGridConfig
  foods: Food[]
  onAddToCart?: (food: Food) => void
}

export function FoodGrid({ config, foods, onAddToCart }: FoodGridProps) {
  const { currency } = useCurrency()
  const { t } = useLanguage()
  const [activeCat, setActiveCat] = useState<number | null>(null)

  const cats = foods.reduce<{ id: number; name: string }[]>((acc, f) => {
    ;(f.categories || []).forEach(cat => {
      if (!acc.find(c => c.id === cat.id)) acc.push(cat)
    })
    return acc
  }, [])

  const filtered = activeCat === null ? foods : foods.filter((f) => (f.categories || []).some(cat => cat.id === activeCat))
  const displayed = filtered.slice(0, config.maxItems)
  const gridCols = config.columns === 2 ? 'sm:grid-cols-2' : config.columns === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-4'

  return (
    <div className="py-12 px-6 bg-stone-50">
      <div className="max-w-7xl mx-auto">
        {config.title && (
          <h2 className="text-2xl md:text-3xl font-bold text-center text-stone-800 mb-8">{config.title}</h2>
        )}

        {config.showCategoryFilter && cats.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => setActiveCat(null)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition border ${
                activeCat === null
                  ? 'bg-orange-600 text-white border-orange-600'
                  : 'bg-white text-stone-500 border-stone-200 hover:border-orange-300 hover:text-orange-700'
              }`}
            >
              All
            </button>
            {cats.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition border ${
                  activeCat === cat.id
                    ? 'bg-orange-600 text-white border-orange-600'
                    : 'bg-white text-stone-500 border-stone-200 hover:border-orange-300 hover:text-orange-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        <div className={`grid ${gridCols} gap-4 md:gap-6 ${config.style === 'list' ? 'grid-cols-1' : ''}`}>
          {displayed.map((food) => (
            <div key={food.id} className="bg-white rounded-xl border border-stone-200 p-4 hover:border-orange-200 hover:shadow-md transition-all">
              {food.image && (
                <img src={food.image} alt={food.name} className="w-full h-40 object-cover rounded-lg mb-3" loading="lazy" />
              )}
              <div className="flex justify-between items-start gap-2 mb-2">
                <h3 className="font-bold text-stone-800 text-sm truncate">{food.name}</h3>
                {food.is_offer && (
                  <span className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-red-50 text-red-500 border border-red-200">{t('promo')}</span>
                )}
              </div>
              {config.showDescriptions && food.description && (
                <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mb-3">{food.description}</p>
              )}
              {config.showCookingTime && food.cooking_time && (
                <div className="text-[10px] font-semibold text-stone-400 mb-3">⏱ {food.cooking_time} min</div>
              )}
              <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                {config.showPrices && (
                  <div className="font-mono">
                    {food.new_price ? (
                      <>
                        <span className="text-xs line-through text-stone-400 mr-1">{formatFoodPrice(food, currency, { original: true })}</span>
                        <span className="text-sm font-bold text-orange-700">{formatFoodPrice(food, currency)}</span>
                      </>
                    ) : (
                      <span className="text-sm font-bold text-stone-800">{formatFoodPrice(food, currency)}</span>
                    )}
                  </div>
                )}
                {config.showAddToCart && onAddToCart && (
                  <button
                    onClick={() => onAddToCart(food)}
                    className="font-bold text-[11px] px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white transition active:scale-95"
                  >
                    + {t('add')}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {displayed.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xs font-bold uppercase tracking-widest text-stone-400">{t('no_items')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
