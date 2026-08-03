'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth'
import { useLanguage } from '@/contexts/language'
import { api } from '@/lib/api-client'
import { formatPrice } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ShoppingBag, ChevronRight } from 'lucide-react'

interface OrderSummary {
  id: number
  store_order_number: string
  order_number_formatted?: string
  status: string
  status_label: string
  total_amount: number
  delivery_type: string
  created_at: string
  store: { id: number; name: string; alias: string }
  items: { id: number; food: { name: string }; quantity: number; price: number }[]
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  confirmed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  preparing: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  ready: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  delivering: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  delivered: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

export default function OrderHistoryPage() {
  const { user, loading: authLoading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [orders, setOrders] = useState<OrderSummary[]>([])
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) { router.push('/login'); return }
    if (!user) return
    ;(async () => {
      try {
        const res = await api.get<any>('/client/orders')
        const items = res?.data?.data ?? res?.data ?? []
        setOrders(Array.isArray(items) ? items : [])
      } catch { /* ignore */ }
      setFetching(false)
    })()
  }, [user, authLoading, router])

  // Polling fallback for orders list (WebSocket is not required)
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await api.get<any>('/client/orders')
        const items = res?.data?.data ?? res?.data ?? []
        setOrders(Array.isArray(items) ? items : [])
      } catch { /* silent */ }
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  if (authLoading || fetching) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 p-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('orders_heading')}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('orders_subtitle')}</p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center p-12">
            <ShoppingBag className="h-12 w-12 text-gray-300 dark:text-gray-600" />
            <p className="mt-4 text-gray-500 dark:text-gray-400">{t('orders_empty_title')}</p>
            <Button className="mt-4" onClick={() => router.push('/stores')}>
              {t('orders_empty_action')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <Link key={order.id} href={`/orders/${order.id}/tracking`}>
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{order.order_number_formatted || `#${order.store_order_number || order.id}`}</span>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[order.status] || ''}`}>
                          {order.status_label || order.status}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">{order.store.name}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {order.items?.slice(0, 3).map(item => (
                          <span key={item.id} className="text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded px-1.5 py-0.5">
                            {item.food.name} x{item.quantity}
                          </span>
                        ))}
                        {order.items && order.items.length > 3 && (
                          <span className="text-xs text-gray-400 dark:text-gray-500">+{order.items.length - 3} {t('orders_more_items')}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>{formatPrice(order.total_amount)}</span>
                        <span className="capitalize">{order.delivery_type}</span>
                        <span>{new Date(order.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-300 dark:text-gray-600 shrink-0" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
