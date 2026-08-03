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
import { Bike, MapPin, Phone } from 'lucide-react'
import type { OrderData } from '@/types/api'

interface PendingOrder {
  id: number
  client_name: string
  client_phone: string
  address: string | null
  store: { name: string }
  items: { id: number; food: { name: string }; quantity: number; price: number }[]
  total_amount: number
  delivery_type: string
  created_at: string
}

export default function AvailableDeliveriesPage() {
  const { user, loading: authLoading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [orders, setOrders] = useState<PendingOrder[]>([])
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [accepting, setAccepting] = useState<number | null>(null)

  const loadOrders = useCallback(async () => {
    setError('')
    try {
      const res = await api.get<PendingOrder[] | { data: PendingOrder[] }>('/delivery/pending')
      setOrders(Array.isArray(res) ? res : (res as any).data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : t('delivery_available_error_load'))
    }
  }, [t])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }
    if (!user) return
    ;(async () => {
      try {
        const res = await api.get<PendingOrder[] | { data: PendingOrder[] }>('/delivery/pending')
        setOrders(Array.isArray(res) ? res : (res as any).data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : t('delivery_available_error_load'))
      }
      setFetching(false)
    })()
  }, [user, authLoading, router, loadOrders])

  // Auto-poll every 5 seconds
  useEffect(() => {
    if (!user) return
    const interval = setInterval(loadOrders, 5000)
    return () => clearInterval(interval)
  }, [user, loadOrders])

  async function acceptDelivery(orderId: number) {
    setAccepting(orderId)
    try {
      await api.post(`/delivery/orders/${orderId}/accept`)
      setOrders((prev) => prev.filter((o) => o.id !== orderId))
    } catch (err) {
      setError(err instanceof Error ? err.message : t('delivery_available_error_accept'))
    }
    setAccepting(null)
  }

  if (authLoading || fetching) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-5 w-72" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}><CardContent className="p-4"><Skeleton className="h-28 w-full" /></CardContent></Card>
          ))}
        </div>
      </div>
    )
  }

  if (error && orders.length === 0) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('delivery_available_heading')}</h1>
        <Card>
          <CardContent className="p-6 text-center text-red-600">{error}</CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('delivery_available_heading')}</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('delivery_available_subtitle')}</p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/30 p-3 text-sm text-red-700 dark:text-red-400">{error}</div>
      )}

      {orders.length === 0 && !error ? (
        <Card>
          <CardContent className="flex flex-col items-center p-12">
            <Bike className="h-12 w-12 text-gray-300 dark:text-gray-600" />
            <p className="mt-4 text-gray-500 dark:text-gray-400">{t('delivery_available_empty_title')}</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">{t('delivery_available_empty_subtitle')}</p>
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
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Phone className="h-3 w-3" />
                        <span>{order.client_phone}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {order.items?.map((item) => (
                        <span key={item.id} className="rounded bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs text-gray-600">
                          {item.food.name} x{item.quantity}
                        </span>
                      ))}
                    </div>

                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatPrice(order.total_amount)}</p>
                  </div>

                  <Button
                    size="sm"
                    disabled={accepting === order.id}
                    onClick={() => acceptDelivery(order.id)}
                  >
                    {accepting === order.id ? t('delivery_accepting') : t('delivery_accept')}
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
