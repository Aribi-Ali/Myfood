'use client'

import { formatTime } from '@/lib/utils'

export default function ScheduleDisplay({
  openingHours,
  t,
}: {
  openingHours?: Record<string, { open: string; close: string; closed?: boolean }>
  t: (key: string) => string
}) {
  if (!openingHours) return <p className="text-gray-500 dark:text-slate-400">{t('schedule_unavailable')}</p>

  const entries = Object.entries(openingHours).sort(([a], [b]) => a.localeCompare(b))
  return (
    <div className="space-y-2">
      {entries.map(([day, { open, close, closed }]) => (
        <div key={day} className="flex items-center gap-2">
          <span className="w-24 text-sm font-medium text-gray-700 dark:text-slate-300 capitalize">{day}</span>
          <span className="text-sm">
            {closed ? (
              <span className="text-red-500 dark:text-red-300">{t('closed')}</span>
            ) : (
              <>
                <span className="font-medium">{formatTime(open, 'short')} – {formatTime(close, 'short')}</span>
              </>
            )}
          </span>
        </div>
      ))}
    </div>
  )
}