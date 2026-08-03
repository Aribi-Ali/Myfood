'use client'
import { cn } from '@/lib/utils'

interface StoreTypeTagsProps {
  types: { id: number; name: string; slug: string; icon: string | null }[]
  className?: string
}

export function StoreTypeTags({ types, className }: StoreTypeTagsProps) {
  if (!types?.length) return null
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {types.map((t) => (
        <span
          key={t.id}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-black/10 text-white/90 backdrop-blur-sm"
        >
          {t.icon && <span>{t.icon}</span>}
          {t.name}
        </span>
      ))}
    </div>
  )
}
