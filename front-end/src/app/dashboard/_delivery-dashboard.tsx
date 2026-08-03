'use client'

import Link from 'next/link'
import { useLanguage } from '@/contexts/language'
import { useApiQuery } from '@/lib/use-api-query'
import { Card, CardContent } from '@/components/ui/card'
import { ShoppingBag, Store, DollarSign } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export default function DeliveryDashboard() {
  const { t } = useLanguage()
  const { data: stats, isLoading } = useApiQuery<any>(['delivery', 'stats'], '/delivery/stats')

  if (isLoading) return <Skeleton className="h-40 w-full" />

  const cards = [
    { label: 'Pending Deliveries', value: stats?.data?.pending ?? stats?.pending ?? 0, icon: ShoppingBag, color: 'bg-orange-100 text-orange-600' },
    { label: 'Completed', value: stats?.data?.completed ?? stats?.completed ?? 0, icon: Store, color: 'bg-green-100 text-green-600' },
    { label: 'Earnings', value: stats?.data?.earnings ?? stats?.earnings ?? 0, prefix: 'DA', icon: DollarSign, color: 'bg-blue-100 text-blue-600' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Delivery Dashboard</h1>
        <p className="text-gray-500">{t('store_overview')}</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-3">
        {cards.map(card => (
          <Link key={card.label} href="/dashboard/orders">
            <Card className="transition-shadow hover:shadow-md cursor-pointer">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`rounded-lg p-3 ${card.color}`}>
                  <card.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <p className="text-xl font-bold text-gray-900">{card.prefix || ''}{Number(card.value).toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
