'use client'

import { useLanguage } from '@/contexts/language'
import { cn } from '@/lib/utils'
import { CARD_PRESETS, AVATAR_PRESETS } from '@/lib/design-tokens'
import type { StaffMember } from '@/types/api'

export function TeamSection({ staff }: { staff: StaffMember[] }) {
  const { t } = useLanguage()
  if (!staff || staff.length === 0) return null
  return (
    <div className={cn('rounded-2xl overflow-hidden shadow-sm', CARD_PRESETS.base)}>
      <div className="px-5 py-3.5 border-b border-stone-100 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/50">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-stone-500 dark:text-stone-400">{t('store_team_heading')}</h3>
      </div>
      <div className="divide-y divide-stone-100 dark:divide-stone-700">
        {staff.map((member, i) => (
          <div key={i} className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-stone-50/50 dark:hover:bg-stone-700/30">
            <div className={cn(AVATAR_PRESETS.base, AVATAR_PRESETS.sm, 'shadow-sm')}>
              {member.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-sm text-stone-800 dark:text-stone-100">{member.name}</p>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
