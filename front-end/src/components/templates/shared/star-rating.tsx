'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  size?: number
  activeColor?: string
  inactiveColor?: string
  className?: string
}

export function StarRating({
  rating,
  size = 18,
  activeColor = '#FFD700',
  inactiveColor = '#F5DEB3',
  className,
}: StarRatingProps) {
  const rounded = Math.round(rating)
  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className="transition-colors"
          style={{
            fill: i < rounded ? activeColor : 'none',
            color: i < rounded ? activeColor : inactiveColor,
          }}
        />
      ))}
    </div>
  )
}
