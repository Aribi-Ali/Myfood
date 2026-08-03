'use client'
import { Bike, Clock, Utensils, CalendarClock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency'
import { formatPrice } from '@/lib/utils'

interface DeliveryInfoProps {
  baseDeliveryFee: number | null
  avgPrepTime: number | null
  avgDeliveryTimePerKm: number | null
  deliveryZoneRadius: number | null
  allowsPreOrders: boolean
  preOrderLeadTimeHours: number | null
  className?: string
}

export function DeliveryInfo({
  baseDeliveryFee,
  avgPrepTime,
  avgDeliveryTimePerKm,
  deliveryZoneRadius,
  allowsPreOrders,
  preOrderLeadTimeHours,
  className,
}: DeliveryInfoProps) {
  const { currency } = useCurrency()
  const items: { icon: React.ReactNode; label: string }[] = []

  if (baseDeliveryFee !== null && baseDeliveryFee !== undefined) {
    items.push({
      icon: <Bike className="w-4 h-4" />,
      label: `Delivery from ${formatPrice(baseDeliveryFee, currency)}`,
    })
  }
  if (avgPrepTime) {
    items.push({
      icon: <Utensils className="w-4 h-4" />,
      label: `Prep: ~${avgPrepTime} min`,
    })
  }
  if (avgDeliveryTimePerKm) {
    items.push({
      icon: <Clock className="w-4 h-4" />,
      label: `~${avgDeliveryTimePerKm} min/km`,
    })
  }
  if (allowsPreOrders) {
    items.push({
      icon: <CalendarClock className="w-4 h-4" />,
      label: preOrderLeadTimeHours ? `Pre-order ${preOrderLeadTimeHours}h ahead` : 'Pre-orders available',
    })
  }

  if (!items.length) return null

  return (
    <div className={cn('space-y-2 text-xs', className)}>
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2 opacity-70">
          {item.icon}
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  )
}
