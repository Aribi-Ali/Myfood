'use client'

import { useRef, useMemo, useCallback, useEffect, useState } from 'react'
import { useApiQuery } from '@/lib/use-api-query'
import { api } from '@/lib/api-client'
import { useQueryClient } from '@tanstack/react-query'
import { playOrderChime } from '@/lib/kds-audio'
import { useStoreOrdersChannel } from '@/lib/use-realtime-orders'
import { useLanguage } from '@/contexts/language'
import { Clock, UtensilsCrossed, ChefHat, Bike, Bell } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KdsOrderItem {
  id: number
  name: string
  quantity: number
  cooking_time: number
  notes: string | null
}

interface KdsOrder {
  id: number
  store_id: number
  status: 'confirmed' | 'preparing'
  status_label: string
  client_name: string | null
  phone: string | null
  notes: string | null
  delivery_type: 'delivery' | 'pickup'
  estimated_delivery_minutes: number | null
  total_cooking_time: number
  created_at: string
  items: KdsOrderItem[]
}

interface OrderPlacedEvent {
  id: number
  store_id: number
  status_label: string
  client: { name: string } | null
  delivery_type: 'delivery' | 'pickup'
  created_at: string
  items: Array<{
    id: number
    name: string
    quantity: number
    cooking_time: number
  }>
}

interface OrderStatusUpdatedEvent {
  id: number
  status: string
}

interface KdsOrdersResponse {
  data: KdsOrder[]
}

function ElapsedTimer({ start, t }: {
  start: string
  t: (key: string, params?: Record<string, string | number>) => string
}) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const update = () => setElapsed(Math.floor((Date.now() - new Date(start).getTime()) / 60000))
    update()
    const id = setInterval(update, 30000)
    return () => clearInterval(id)
  }, [start])

  const hours = Math.floor(elapsed / 60)
  const mins = elapsed % 60

  return (
    <span className={cn(
      'tabular-nums font-mono text-sm',
      elapsed > 30 ? 'text-red-400' : elapsed > 15 ? 'text-yellow-400' : 'text-slate-300'
    )}>
      {hours > 0 ? t('time_hours', { hours }) : ''}{t('time_minutes', { mins })}
    </span>
  )
}

function OrderCard({ order, onStart, onReady, busy, t }: {
  order: KdsOrder
  onStart?: () => void
  onReady?: () => void
  busy: boolean
  t: (key: string, params?: Record<string, string | number>) => string
}) {
  const isConfirmed = order.status === 'confirmed'

  return (
    <div className={cn(
      'rounded-xl border-2 p-4 flex flex-col gap-3 transition-all',
      isConfirmed
        ? 'bg-slate-800 border-slate-600 hover:border-orange-500/50'
        : 'bg-slate-800/80 border-orange-500/40 hover:border-orange-400'
    )}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-white">#{order.id}</span>
            {order.delivery_type === 'delivery' ? (
              <Bike className="h-4 w-4 text-orange-400 shrink-0" />
            ) : (
              <UtensilsCrossed className="h-4 w-4 text-blue-400 shrink-0" />
            )}
          </div>
          {order.client_name && (
            <p className="text-sm text-slate-400 truncate">{order.client_name}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Clock className="h-4 w-4 text-slate-500" />
          <ElapsedTimer start={order.created_at} t={t} />
        </div>
      </div>

      {/* Items */}
      <div className="space-y-1">
        {order.items.map(item => (
          <div key={item.id} className="flex items-center justify-between text-sm">
            <span className="text-slate-200">
              <span className="text-orange-400 font-medium">x{item.quantity}</span>{' '}
              {item.name}
            </span>
            {item.cooking_time > 0 && (
              <span className="text-xs text-slate-500">{t('time_min_abbr', { time: item.cooking_time })}</span>
            )}
          </div>
        ))}
      </div>

      {/* Total cooking time */}
      {order.total_cooking_time > 0 && (
        <div className="text-xs text-slate-500">
          {t('kds_est_prep_time', { time: order.total_cooking_time })}
        </div>
      )}

      {/* Notes */}
      {order.notes && (
        <div className="rounded-lg bg-yellow-900/20 border border-yellow-700/30 px-3 py-1.5 text-xs text-yellow-300">
          {order.notes}
        </div>
      )}

      {/* Action button */}
      {isConfirmed ? (
        onStart && (
          <button
            onClick={onStart}
            disabled={busy}
            className="mt-1 flex items-center justify-center gap-2 rounded-lg bg-orange-600 py-2.5 text-sm font-semibold text-white hover:bg-orange-500 transition-colors disabled:opacity-50"
          >
            <ChefHat className="h-4 w-4" />
            {busy ? t('kds_starting') : t('kds_start_preparing')}
          </button>
        )
      ) : (
        onReady && (
          <button
            onClick={onReady}
            disabled={busy}
            className="mt-1 flex items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors disabled:opacity-50"
          >
            <Bell className="h-4 w-4" />
            {busy ? t('kds_completing') : t('kds_mark_ready')}
          </button>
        )
      )}
    </div>
  )
}

export default function KdsPage() {
  const { t } = useLanguage()
  const queryClient = useQueryClient()
  const newOrderSoundPlayed = useRef(false)
  const [storeId, setStoreId] = useState<number | undefined>(undefined)
  const [busyIds, setBusyIds] = useState<Set<number>>(new Set())

  const { data: res, isLoading } = useApiQuery<KdsOrdersResponse>(
    ['kds', 'orders'],
    '/kds/orders',
    { refetchInterval: 5000 }
  )
  const orders = res?.data ?? []

  // Derive storeId from orders once available
  useEffect(() => {
    if (orders.length > 0 && !storeId) {
      setStoreId(orders[0]!.store_id)
    }
  }, [orders, storeId])

  // Real-time channel for this store's orders
  const onPlaced = useCallback((raw: Record<string, unknown>) => {
    const evData = raw as unknown as OrderPlacedEvent
    newOrderSoundPlayed.current = true
    playOrderChime()
    queryClient.setQueryData<KdsOrdersResponse>(['kds', 'orders'], (old) => {
      const list = old?.data ?? []
      const exists = list.some(o => o.id === evData.id)
      if (exists) return old
      const newOrder: KdsOrder = {
        id: evData.id,
        store_id: evData.store_id ?? storeId!,
        status: 'confirmed',
        status_label: evData.status_label ?? t('kds_status_confirmed'),
        client_name: evData.client?.name ?? null,
        phone: null,
        notes: null,
        delivery_type: evData.delivery_type,
        estimated_delivery_minutes: null,
        total_cooking_time: (evData.items ?? []).reduce(
          (sum, i) => sum + (i.cooking_time ?? 0), 0
        ),
        created_at: evData.created_at,
        items: (evData.items ?? []).map((i) => ({
          id: i.id,
          name: i.name,
          quantity: i.quantity,
          cooking_time: i.cooking_time ?? 0,
          notes: null,
        })),
      }
      return { ...old, data: [newOrder, ...list] }
    })
  }, [queryClient, storeId])

  const onStatusUpdated = useCallback((raw: Record<string, unknown>) => {
    const evData = raw as unknown as OrderStatusUpdatedEvent
    queryClient.setQueryData<KdsOrdersResponse>(['kds', 'orders'], (old) => {
      const list = old?.data ?? []
      const newStatus = evData.status
      if (newStatus !== 'confirmed' && newStatus !== 'preparing') {
        return { ...old, data: list.filter(o => o.id !== evData.id) }
      }
      return {
        ...old,
        data: list.map(o => o.id === evData.id ? { ...o, status: newStatus } : o),
      }
    })
  }, [queryClient])

  useStoreOrdersChannel(storeId, onPlaced, onStatusUpdated)

  const handleAction = useCallback(async (orderId: number, action: 'start' | 'complete') => {
    setBusyIds(prev => new Set(prev).add(orderId))
    try {
      await api.post(`/kds/orders/${orderId}/${action}`)
    } catch {
      console.error(`Failed to ${action} order #${orderId}`)
    }
    setBusyIds(prev => { const s = new Set(prev); s.delete(orderId); return s })
  }, [])

  const confirmed = useMemo(() => orders.filter(o => o.status === 'confirmed'), [orders])
  const preparing = useMemo(() => orders.filter(o => o.status === 'preparing'), [orders])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-48 animate-pulse rounded-xl bg-slate-800" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-yellow-400" />
          <span className="text-slate-300">{t('kds_stats_incoming')}</span>
          <span className="font-bold text-white">{confirmed.length}</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-orange-400" />
          <span className="text-slate-300">{t('kds_stats_in_prep')}</span>
          <span className="font-bold text-white">{preparing.length}</span>
        </div>
      </div>

      {/* No orders */}
      {orders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-600">
          <ChefHat className="h-16 w-16 mb-4" />
          <p className="text-lg font-medium">{t('kds_no_orders_title')}</p>
          <p className="text-sm">{t('kds_no_orders_subtitle')}</p>
        </div>
      )}

      {/* Columns */}
      {orders.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-max">
          {/* Incoming column */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider px-1">
              {t('kds_column_incoming', { count: confirmed.length })}
            </h2>
            {confirmed.length === 0 ? (
              <p className="text-sm text-slate-600 px-1">{t('kds_column_incoming_empty')}</p>
            ) : (
              confirmed.map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onStart={() => handleAction(order.id, 'start')}
                  busy={busyIds.has(order.id)}
                  t={t}
                />
              ))
            )}
          </div>

          {/* In Prep column */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider px-1">
              {t('kds_column_in_prep', { count: preparing.length })}
            </h2>
            {preparing.length === 0 ? (
              <p className="text-sm text-slate-600 px-1">{t('kds_column_prep_empty')}</p>
            ) : (
              preparing.map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onReady={() => handleAction(order.id, 'complete')}
                  busy={busyIds.has(order.id)}
                  t={t}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
