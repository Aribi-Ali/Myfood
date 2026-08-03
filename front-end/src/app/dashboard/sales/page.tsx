'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth'
import { useLanguage } from '@/contexts/language'
import { api } from '@/lib/api-client'
import { formatPrice } from '@/lib/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { DollarSign, TrendingUp, TrendingDown, ShoppingCart } from 'lucide-react'

interface Stats {
  total_revenue: number
  total_commission: number
  net_profit: number
  order_count: number
  today_revenue: number
  today_orders: number
}

interface MonthlyData {
  month: string
  revenue: number
  orders: number
}

interface YearlyData {
  year: string
  revenue: number
  orders: number
}

interface Order {
  id: number
  client_name: string
  total: number
  status: string
  created_at: string
}

const periods = ['today', 'week', 'month', 'year', 'all'] as const
type Period = typeof periods[number]

export default function SalesPage() {
  const { user, loading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [monthly, setMonthly] = useState<MonthlyData[]>([])
  const [yearly, setYearly] = useState<YearlyData[]>([])
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [period, setPeriod] = useState<Period>('today')
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  async function fetchAll() {
    setFetching(true)
    setError('')
    try {
      const [statsRes, monthlyRes, yearlyRes, ordersRes] = await Promise.all([
        api.get<{ data: Stats }>(`/owner/sales/stats?period=${period}`),
        api.get<{ data: MonthlyData[] }>('/owner/sales/monthly'),
        api.get<{ data: YearlyData[] }>('/owner/sales/yearly'),
        api.get<{ data: { data: Order[] } }>('/owner/sales'),
      ])
      setStats(statsRes.data)
      setMonthly(monthlyRes.data)
      setYearly(yearlyRes.data)
      setRecentOrders(ordersRes.data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('failed_to_load_sales'))
    }
    setFetching(false)
  }

  function formatMonth(m: string) {
    const d = new Date(m + '-01')
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  useEffect(() => {
    if (!loading && !user) { router.push('/login'); return }
    if (!user) return
    ;(async () => {
      setFetching(true)
      setError('')
      try {
        const [statsRes, monthlyRes, yearlyRes, ordersRes] = await Promise.all([
          api.get<{ data: Stats }>(`/owner/sales/stats?period=${period}`),
          api.get<{ data: MonthlyData[] }>('/owner/sales/monthly'),
          api.get<{ data: YearlyData[] }>('/owner/sales/yearly'),
          api.get<{ data: { data: Order[] } }>('/owner/sales'),
        ])
        setStats(statsRes.data)
        setMonthly(monthlyRes.data)
        setYearly(yearlyRes.data)
        setRecentOrders(ordersRes.data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : t('failed_to_load_sales'))
      }
      setFetching(false)
    })()
  }, [user, loading, router, period])

  if (loading || fetching) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}><CardContent className="p-5 space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-6 w-32" /></CardContent></Card>
          ))}
        </div>
        <Card><CardContent className="p-5 space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-4 w-full" />)}</CardContent></Card>
      </div>
    )
  }

  if (error && !stats) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('sales')}</h1>
        <Card><CardContent className="p-6 text-center text-red-600">{error}</CardContent></Card>
      </div>
    )
  }

  const statCards = stats ? [
    { label: t('total_revenue'), value: formatPrice(stats.total_revenue), icon: TrendingUp, color: 'bg-green-100 text-green-600' },
    { label: t('total_commission'), value: formatPrice(stats.total_commission), icon: TrendingDown, color: 'bg-red-100 text-red-600' },
    { label: t('net_profit'), value: formatPrice(stats.net_profit), icon: DollarSign, color: 'bg-blue-100 text-blue-600' },
    { label: t('order_count'), value: String(stats.order_count), icon: ShoppingCart, color: 'bg-orange-100 text-orange-600' },
  ] : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('sales')}</h1>
        <p className="text-gray-500">{t('track_performance')}</p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      <div className="flex flex-wrap gap-2">
        {periods.map((p) => (
          <Button key={p} variant={period === p ? 'primary' : 'outline'} size="sm" onClick={() => setPeriod(p)}>
            {t(p)}
          </Button>
        ))}
      </div>

      {stats && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map(({ label, value, icon: Icon, color }) => (
              <Card key={label}>
                <CardContent className="p-5 flex items-center gap-4">
                  <div className={`rounded-lg p-3 ${color}`}><Icon className="h-6 w-6" /></div>
                  <div>
                    <p className="text-sm text-gray-500">{label}</p>
                    <p className="text-xl font-bold text-gray-900">{value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader><h2 className="text-lg font-semibold text-gray-900">{t('today')}</h2></CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-600">
                <p>{t('revenue')}: <strong>{formatPrice(stats.today_revenue)}</strong></p>
                <p>{t('orders')}: <strong>{stats.today_orders}</strong></p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><h2 className="text-lg font-semibold text-gray-900">{t('month')}</h2></CardHeader>
              <CardContent>
                {monthly.length === 0 ? (
                  <p className="text-sm text-gray-500">{t('no_monthly_data')}</p>
                ) : (
                  <div className="space-y-2">
                    {monthly.map((m) => (
                      <div key={m.month} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{formatMonth(m.month)}</span>
                        <div className="flex gap-4">
                          <span className="font-medium text-gray-900">{formatPrice(m.revenue)}</span>
                          <span className="text-gray-500">{m.orders} {t('orders')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><h2 className="text-lg font-semibold text-gray-900">{t('year')}</h2></CardHeader>
              <CardContent>
                {yearly.length === 0 ? (
                  <p className="text-sm text-gray-500">{t('no_yearly_data')}</p>
                ) : (
                  <div className="space-y-2">
                    {yearly.map((y) => (
                      <div key={y.year} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{y.year}</span>
                        <div className="flex gap-4">
                          <span className="font-medium text-gray-900">{formatPrice(y.revenue)}</span>
                          <span className="text-gray-500">{y.orders} {t('orders')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">{t('recent_orders')}</h2>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="flex gap-2">
              <Input placeholder={t('search_placeholder')} value={search} onChange={(e) => setSearch(e.target.value)} className="w-48" />
              <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-40" />
              <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-40" />
            </div>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-gray-500">{t('no_orders')}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-500">
                    <th className="pb-2 pr-4">{t('id')}</th>
                    <th className="pb-2 pr-4">{t('client')}</th>
                    <th className="pb-2 pr-4">{t('total')}</th>
                    <th className="pb-2 pr-4">{t('status')}</th>
                    <th className="pb-2 pr-4">{t('date')}</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr key={o.id} className="border-b last:border-0">
                      <td className="py-2 pr-4 font-medium text-gray-900">#{o.id}</td>
                      <td className="py-2 pr-4 text-gray-700">{o.client_name}</td>
                      <td className="py-2 pr-4 text-gray-900">{formatPrice(o.total)}</td>
                      <td className="py-2 pr-4"><span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">{o.status}</span></td>
                      <td className="py-2 pr-4 text-gray-500">{new Date(o.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
