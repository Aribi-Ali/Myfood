'use client'

import { useLanguage } from '@/contexts/language'
import { cn } from '@/lib/utils'
import { CARD_PRESETS } from '@/lib/design-tokens'

const DAY_NAMES: Record<string, string> = {
  monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu',
  friday: 'Fri', saturday: 'Sat', sunday: 'Sun',
}

export function OpeningHoursCard({ hours }: { hours: Record<string, { open: string; close: string }> | null }) {
  const { t } = useLanguage()
  if (!hours || Object.keys(hours).length === 0) return null
  const todayKey = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][new Date().getDay()]

  return (
    <div className={cn('rounded-2xl overflow-hidden shadow-sm', CARD_PRESETS.base)}>
      <div className="px-5 py-3.5 border-b border-stone-100 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/50">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-stone-500 dark:text-stone-400">{t('store_hours_heading')}</h3>
      </div>
      <div className="divide-y divide-stone-100 dark:divide-stone-700">
        {Object.entries(DAY_NAMES).map(([dk, dl]) => {
          const d = hours[dk]
          const isToday = dk === todayKey
          return (
            <div key={dk} className={`flex items-center justify-between px-5 py-2.5 text-sm ${isToday ? 'bg-amber-50/60 dark:bg-amber-900/20' : 'transition-colors hover:bg-stone-50/50 dark:hover:bg-stone-700/30'}`}>
              <span className={`font-semibold ${isToday ? 'text-amber-900' : 'text-stone-700 dark:text-stone-200'}`}>{dl}</span>
              {d ? (
                <span className={`font-medium ${isToday ? 'text-amber-800 dark:text-amber-400' : 'text-stone-500 dark:text-stone-400'}`}>{d.open} – {d.close}</span>
              ) : (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-red-50 text-red-500 dark:bg-red-950/30 dark:text-red-400">{t('store_hours_closed')}</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
