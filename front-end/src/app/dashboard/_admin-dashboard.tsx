'use client'

import { useApiQuery } from '@/lib/use-api-query'
import { Card, CardContent } from '@/components/ui/card'
import { Users, Store, ShoppingBag, DollarSign } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export default function AdminDashboard() {
  const { data: stats, isLoading } = useApiQuery<any>(['admin', 'stats'], '/admin/stats')

  if (isLoading) return <Skeleton className="h-40 w-full" />

  const cards = [
    { label: 'Total Users', value: stats?.total_users ?? 0, icon: Users, color: 'bg-blue-100 text-blue-600' },
    { label: 'Stores', value: stats?.total_stores ?? 0, icon: Store, color: 'bg-green-100 text-green-600' },
    { label: 'Orders', value: stats?.total_orders ?? 0, icon: ShoppingBag, color: 'bg-orange-100 text-orange-600' },
    { label: 'Revenue', value: stats?.total_revenue ?? 0, prefix: 'DA', icon: DollarSign, color: 'bg-purple-100 text-purple-600' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500">Platform overview</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(card => (
          <Card key={card.label}>
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
        ))}
      </div>
    </div>
  )
}
