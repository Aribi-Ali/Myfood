'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api-client'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { Users, Store, ShoppingBag, DollarSign, TrendingUp, Calendar, Banknote, Percent } from 'lucide-react'

interface AdminStats {
  total_users: number
  total_stores: number
  total_orders: number
  total_revenue: number
  platform_commission: number
  today_orders: number
  today_revenue: number
}

interface ChartData {
  date: string
  revenue: number
  orders: number
}

interface StatsResponse { data: AdminStats }
interface ChartDataResponse { data: ChartData[] }

const STAT_CARDS = [
  { key: 'total_users', title: 'Total Users', icon: Users, color: 'bg-blue-50 text-blue-600', prefix: '' },
  { key: 'total_stores', title: 'Total Stores', icon: Store, color: 'bg-orange-50 text-orange-600', prefix: '' },
  { key: 'total_orders', title: 'Total Orders', icon: ShoppingBag, color: 'bg-green-50 text-green-600', prefix: '' },
  { key: 'total_revenue', title: 'Total Revenue', icon: DollarSign, color: 'bg-emerald-50 text-emerald-600', prefix: 'DA ' },
  { key: 'platform_commission', title: 'Platform Commission', icon: Percent, color: 'bg-purple-50 text-purple-600', prefix: 'DA ' },
  { key: 'today_orders', title: "Today's Orders", icon: TrendingUp, color: 'bg-amber-50 text-amber-600', prefix: '' },
  { key: 'today_revenue', title: "Today's Revenue", icon: Banknote, color: 'bg-rose-50 text-rose-600', prefix: 'DA ' },
]

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [prevStats, setPrevStats] = useState<AdminStats | null>(null)

  useEffect(() => {
    Promise.all([
      api.get<StatsResponse>('/admin/stats'),
      api.get<ChartDataResponse>('/admin/stats/chart')
    ]).then(([statsRes, chartRes]) => {
      setStats(statsRes.data)
      setChartData(chartRes.data || [])
    }).catch(err => {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
    }).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <Card key={i}><CardHeader><Skeleton className="h-4 w-24" /></CardHeader><CardContent><Skeleton className="h-8 w-16" /></CardContent></Card>
          ))}
        </div>
        <Card><CardContent className="p-6"><Skeleton className="h-40 w-full" /></CardContent></Card>
      </div>
    )
  }

  if (error) {
    return <div className="text-center py-12"><p className="text-red-600">{error}</p></div>
  }

  const maxRevenue = Math.max(...chartData.map(d => d.revenue), 1)
  const maxOrders = Math.max(...chartData.map(d => d.orders), 1)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Platform overview</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map(({ key, title, icon: Icon, color, prefix }) => {
          const value = stats ? (stats as any)[key] ?? 0 : 0
          return (
            <Card key={key} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className={cn('p-2.5 rounded-xl', color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-2xl font-bold mt-3">{prefix}{Number(value).toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">{title}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {chartData.length > 0 && (
          <>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center gap-2"><TrendingUp className="h-4 w-4 text-orange-500" />Revenue</h3>
                  <Calendar className="h-4 w-4 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-1.5 h-48">
                  {chartData.map((day, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group relative">
                      <div
                        className="w-full bg-gradient-to-t from-orange-500 to-amber-400 rounded-t-md transition-all duration-300 hover:opacity-80 cursor-pointer"
                        style={{ height: `${Math.max((day.revenue / maxRevenue) * 100, 2)}%` }}
                        title={`${day.date}: DA ${day.revenue.toLocaleString()}`}
                      />
                      <span className="text-[10px] text-gray-400 -rotate-45 origin-left whitespace-nowrap">{day.date?.slice(5)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center gap-2"><ShoppingBag className="h-4 w-4 text-blue-500" />Orders</h3>
                  <Calendar className="h-4 w-4 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-1.5 h-48">
                  {chartData.map((day, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group relative">
                      <div
                        className="w-full bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t-md transition-all duration-300 hover:opacity-80 cursor-pointer"
                        style={{ height: `${Math.max((day.orders / maxOrders) * 100, 2)}%` }}
                        title={`${day.date}: ${day.orders} orders`}
                      />
                      <span className="text-[10px] text-gray-400 -rotate-45 origin-left whitespace-nowrap">{day.date?.slice(5)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}


