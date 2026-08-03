'use client'
import { MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StoreLocationProps {
  wilaya: string | null
  daira: string | null
  commune: string | null
  address: string | null
  className?: string
}

export function StoreLocation({ wilaya, daira, commune, address, className }: StoreLocationProps) {
  const parts = [wilaya, daira, commune].filter(Boolean)
  if (!parts.length && !address) return null
  return (
    <div className={cn('flex items-start gap-2 text-sm', className)}>
      <MapPin className="w-4 h-4 mt-0.5 shrink-0 opacity-60" />
      <span>
        {parts.join(', ')}
        {address && <span className="block text-xs opacity-60 mt-0.5">{address}</span>}
      </span>
    </div>
  )
}
