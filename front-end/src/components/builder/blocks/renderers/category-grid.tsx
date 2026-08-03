'use client'

import type { CategoryGridConfig } from '@/components/templates/types'
import type { Food } from '@/types/api'
import { useLanguage } from '@/contexts/language'

interface CategoryGridProps {
  config: CategoryGridConfig
  foods: Food[]
  onSelectCategory?: (categoryId: number | null) => void
}

export function CategoryGrid({ config, foods, onSelectCategory }: CategoryGridProps) {
  const { t } = useLanguage()
  const cats = foods.reduce<{ id: number; name: string; count: number }[]>((acc, f) => {
    if (f.category) {
      const existing = acc.find((c) => c.id === f.category!.id)
      if (existing) {
        existing.count++
      } else {
        acc.push({ id: f.category!.id, name: f.category!.name, count: 1 })
      }
    }
    return acc
  }, [])

  if (cats.length === 0) {
    return (
      <div className="py-12 px-6 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-stone-400">{t('no_categories')}</p>
      </div>
    )
  }

  return (
    <div className="py-12 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {config.title && (
          <h2 className="text-2xl md:text-3xl font-bold text-center text-stone-800 mb-8">{config.title}</h2>
        )}

        <div className={`flex flex-wrap justify-center gap-3 ${
          config.style === 'cards' ? 'flex-col sm:flex-row' : config.style === 'list' ? 'flex-col items-center' : ''
        }`}>
          {cats.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory?.(cat.id)}
              className={
                config.style === 'cards'
                  ? 'bg-stone-50 rounded-xl border border-stone-200 p-6 text-center hover:border-orange-300 hover:shadow-md transition-all min-w-[160px]'
                  : config.style === 'list'
                  ? 'w-full max-w-md px-6 py-4 rounded-xl border border-stone-200 hover:border-orange-300 hover:shadow-sm transition-all bg-stone-50 flex items-center justify-between'
                  : 'px-5 py-2.5 rounded-full border border-stone-200 bg-white hover:border-orange-300 hover:text-orange-700 transition-all text-sm font-semibold text-stone-600'
              }
            >
              {config.style === 'cards' ? (
                <>
                  <div className="text-3xl mb-3">🍽️</div>
                  <div className="font-bold text-stone-800">{cat.name}</div>
                  {config.showCount && (
                    <div className="text-xs text-stone-400 mt-1">{t('items_count', { count: cat.count })}</div>
                  )}
                </>
              ) : config.style === 'list' ? (
                <>
                  <span className="font-bold text-stone-800">{cat.name}</span>
                  {config.showCount && (
                    <span className="text-xs text-stone-400 bg-stone-200 px-2 py-1 rounded-full">{cat.count}</span>
                  )}
                </>
              ) : (
                <>
                  <span>{cat.name}</span>
                  {config.showCount && (
                    <span className="ml-2 text-[10px] text-stone-400">({cat.count})</span>
                  )}
                </>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
