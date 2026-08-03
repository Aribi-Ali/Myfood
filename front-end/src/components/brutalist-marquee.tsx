'use client'

import { useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface MarqueeItem {
  label: string
  emoji?: string
}

interface BrutalistMarqueeProps {
  items: MarqueeItem[]
  speed?: number
  className?: string
  reverse?: boolean
}

export function BrutalistMarquee({ items, speed = 30, className, reverse }: BrutalistMarqueeProps) {
  const prefersReducedMotion = useReducedMotion()
  const doubled = [...items, ...items]

  if (prefersReducedMotion) {
    return (
      <div className={cn('relative overflow-hidden border-y-[3px] border-border py-3 bg-cream dark:bg-background', className)}>
        <div className="flex flex-wrap justify-center gap-4">
          {items.map((item, i) => (
            <span key={i} className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-foreground dark:text-foreground font-mono">
              {item.emoji && <span className="text-base">{item.emoji}</span>}
              {item.label}
            </span>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('relative overflow-hidden border-y-[3px] border-border py-3 bg-cream dark:bg-background', className)}>
      <div
        className="flex w-fit gap-8 whitespace-nowrap"
        style={{
          animation: `${reverse ? 'marquee-right' : 'marquee-left'} ${items.length * speed}s linear infinite`,
        }}
      >
        {doubled.map((item, i) => (
          <span
            key={`${item.label}-${i}`}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-foreground dark:text-foreground font-mono"
          >
            {item.emoji && <span className="text-base">{item.emoji}</span>}
            {item.label}
            <span className="text-primary mx-1 text-xs">/</span>
          </span>
        ))}
      </div>
    </div>
  )
}
