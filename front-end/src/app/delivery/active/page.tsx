'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth'
import { useLanguage } from '@/contexts/language'
import { api } from '@/lib/api-client'
import { formatPrice } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { MapPin, PackageCheck } from 'lucide-react'
import type { OrderStatusValue } from '@/types/api'

interface ActiveDelivery {
  id: number
  client_name: string
  client_phone: string
  address: string | null
  distance?: string
  store: { name: string }
  items: { id: number; food: { name: string }; quantity: number; price: number }[]
  total_amount: number
  status: OrderStatusValue
  created_at: string
}

export default function ActiveDeliveriesPage() {
  const { user, loading: authLoading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [orders, setOrders] = useState<ActiveDelivery[]>([])
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [marking, setMarking] = useState<number | null>(null)

  const loadOrders = useCallback(async () => {
    setError('')
    try {
      const res = await api.get<ActiveDelivery[] | { data: ActiveDelivery[] }>(`/delivery/active`)
      setOrders(Array.isArray(res) ? res : (res as any).data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : t('delivery_active_error_load'))
    }
  }, [t])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }
    if (!user) return
    ;(async () => {
      await loadOrders()
      setFetching(false)
    })()
  }, [user, authLoading, router])

  // Auto-poll every 5 seconds
  useEffect(() => {
    if (!user) return
    const interval = setInterval(loadOrders, 5000)
    return () => clearInterval(interval)
  }, [user, loadOrders])

  async function completeDelivery(orderId: number) {
    setMarking(orderId)
    try {
      await api.post(`/delivery/orders/${orderId}/complete`)
      setOrders((prev) => prev.filter((o) => o.id !== orderId))
    } catch (err) {
      setError(err instanceof Error ? err.message : t('delivery_active_error_complete'))
    }
    setMarking(null)
  }

  if (authLoading || fetching) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-5 w-56" />
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <Card key={i}><CardContent className="p-4"><Skeleton className="h-28 w-full" /></CardContent></Card>
          ))}
        </div>
      </div>
    )
  }

  if (error && orders.length === 0) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('delivery_active_heading')}</h1>
        <Card>
          <CardContent className="p-6 text-center text-red-600">{error}</CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('delivery_active_heading')}</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('delivery_active_subtitle')}</p>
      </div>

      {error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/30 p-3 text-sm text-red-700 dark:text-red-400">{error}</div>
      )}

      {orders.length === 0 && !error ? (
        <Card>
          <CardContent className="flex flex-col items-center p-12">
            <PackageCheck className="h-12 w-12 text-gray-300 dark:text-gray-600" />
            <p className="mt-4 text-gray-500 dark:text-gray-400">{t('delivery_active_empty_title')}</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">{t('delivery_active_empty_subtitle')}</p>
            <Button className="mt-4" onClick={() => router.push('/delivery')}>
              {t('delivery_active_empty_action')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">#{order.id}</span>
                      <span className="rounded-full bg-orange-100 dark:bg-orange-900/30 px-2.5 py-0.5 text-xs font-medium text-orange-700 dark:text-orange-300">
                        {order.store.name}
                      </span>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-stone-100">{order.client_name}</p>
                      <div className="mt-1 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <MapPin className="h-3 w-3" />
                        <span>{order.address || t('delivery_no_address')}</span>
                      </div>
                      {order.distance && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t('delivery_active_distance', { distance: order.distance })}</p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {order.items?.map((item) => (
                        <span key={item.id} className="rounded bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs text-gray-600 dark:text-gray-300">
                          {item.food.name} x{item.quantity}
                        </span>
                      ))}
                    </div>

                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatPrice(order.total_amount)}</p>
                  </div>

                  <Button
                    size="sm"
                    disabled={marking === order.id}
                    onClick={() => completeDelivery(order.id)}
                  >
                    {marking === order.id ? t('delivery_active_completing') : t('delivery_mark_delivered')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
