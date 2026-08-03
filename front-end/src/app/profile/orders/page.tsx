'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/contexts/auth'
import { useLanguage } from '@/contexts/language'
import { api } from '@/lib/api-client'
import { cn, formatPrice } from '@/lib/utils'
import { toast, ToastContainer } from '@/components/ui/toast'
import type { OrderData, OrderStatusValue } from '@/types/api'
import { ChevronLeft, ChevronRight, Package, RotateCcw, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useMemo, useCallback } from 'react'

const ALL_STATUSES: (OrderStatusValue | '')[] = ['', 'pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled']

export default function ProfileOrdersPage() {
  const { t } = useLanguage()
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  const STATUS_META: Record<OrderStatusValue, { label: string; emoji: string; color: string }> = useMemo(() => ({
    pending: { label: t('profile_orders_status_pending'), emoji: '🕐', color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50' },
    confirmed: { label: t('profile_orders_status_confirmed'), emoji: '✅', color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/50' },
    preparing: { label: t('profile_orders_status_preparing'), emoji: '👨‍🍳', color: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/50' },
    ready: { label: t('profile_orders_status_ready'), emoji: '🟢', color: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/50' },
    delivering: { label: t('profile_orders_status_delivering'), emoji: '🛵', color: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/20 dark:text-sky-400 dark:border-sky-900/50' },
    delivered: { label: t('profile_orders_status_delivered'), emoji: '✔️', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800' },
    cancelled: { label: t('profile_orders_status_cancelled'), emoji: '❌', color: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50' },
  }), [t])

  const [orders, setOrders] = useState<OrderData[]>([])
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatusValue | ''>('')
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [prevCursor, setPrevCursor] = useState<string | null>(null)
  const [cursor, setCursor] = useState<string | null>(null)

  // Edit modal state
  const [editOrderId, setEditOrderId] = useState<number | null>(null)
  const [editDeliveryType, setEditDeliveryType] = useState<'delivery' | 'pickup'>('delivery')
  const [editAddress, setEditAddress] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const [editSaving, setEditSaving] = useState(false)
  const [editError, setEditError] = useState('')

  // Reorder state
  const [reorderingId, setReorderingId] = useState<number | null>(null)

  const fetchOrders = useCallback(async (cursorVal: string | null) => {
    if (!user) return
    setFetching(true)
    setError('')
    try {
      const params = new URLSearchParams()
      if (statusFilter) params.set('status', statusFilter)
      if (cursorVal) params.set('cursor', cursorVal)
      const res = await api.get<{
        data: OrderData[]
        next_cursor: string | null
        prev_cursor: string | null
        has_more: boolean
      }>(`/client/orders?${params}`)
      setOrders(Array.isArray(res.data) ? res.data : [])
      setNextCursor(res.next_cursor ?? null)
      setPrevCursor(res.prev_cursor ?? null)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('profile_orders_error_load'))
    }
    setFetching(false)
  }, [user, statusFilter, t])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }
    if (!user) return
    setCursor(null)
    fetchOrders(null)
  }, [user, authLoading, router, statusFilter])

  function goNext() {
    if (nextCursor) {
      setCursor(nextCursor)
      fetchOrders(nextCursor)
    }
  }

  function goPrev() {
    if (prevCursor) {
      setCursor(prevCursor)
      fetchOrders(prevCursor)
    }
  }

  function openEdit(order: OrderData) {
    setEditOrderId(order.id)
    setEditDeliveryType(order.delivery_type)
    setEditAddress(order.address || '')
    setEditNotes(order.notes || '')
    setEditError('')
  }

  function closeEdit() {
    setEditOrderId(null)
    setEditSaving(false)
    setEditError('')
  }

  async function saveEdit() {
    if (!editOrderId) return
    setEditSaving(true)
    setEditError('')
    try {
      await api.put(`/client/orders/${editOrderId}`, {
        delivery_type: editDeliveryType,
        address: editDeliveryType === 'delivery' ? editAddress : null,
        notes: editNotes || null,
      })
      setOrders(prev => prev.map(o => o.id === editOrderId ? {
        ...o,
        delivery_type: editDeliveryType,
        address: editDeliveryType === 'delivery' ? editAddress : null,
        notes: editNotes || null,
      } : o))
      closeEdit()
    } catch (err) {
      setEditError(err instanceof Error ? err.message : t('profile_orders_edit_error'))
    }
    setEditSaving(false)
  }

  async function handleReorder(orderId: number, storeAlias?: string) {
    setReorderingId(orderId)
    try {
      const res = await api.post<{ store_alias: string }>(`/client/orders/${orderId}/reorder`)
      toast(t('reorder_success'), 'success')
      if (res?.store_alias) {
        router.push(`/stores/${res.store_alias}`)
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : t('reorder_error'), 'error')
    }
    setReorderingId(null)
  }

  function canReorder(order: OrderData): boolean {
    return ['delivered', 'cancelled'].includes(order.status)
  }

  if (authLoading || fetching) {
    return (
      <div className="space-y-6">
        <Skeleton className="w-48 h-8" />
        <div className="flex gap-2"><Skeleton className="w-20 h-10" /><Skeleton className="w-20 h-10" /><Skeleton className="w-20 h-10" /></div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}><CardContent className="p-4"><Skeleton className="w-full h-16" /></CardContent></Card>
          ))}
        </div>
        <ToastContainer />
      </div>
    )
  }

  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('profile_orders_heading')}</h1>
          <p className="mt-1 text-sm text-gray-500">{t('profile_orders_subtitle')}</p>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-2">
          {ALL_STATUSES.map((s) => {
            const active = statusFilter === s
            const meta = s ? STATUS_META[s] : { label: t('all'), emoji: '', color: '' }
            return (
              <button
                key={s || 'all'}
                onClick={() => { setStatusFilter(s); setCursor(null) }}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors',
                  active
                    ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900 dark:border-white'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700'
                )}
              >
                {s ? `${meta.emoji} ${meta.label}` : meta.label}
              </button>
            )
          })}
        </div>

        {error && <div className="p-3 text-sm text-red-700 rounded-lg bg-red-50">{error}</div>}

        {/* Orders List */}
        {orders.length === 0 && !error ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-12 h-12 mx-auto text-gray-300" />
              <p className="mt-4 text-gray-500">{t('profile_orders_empty')}</p>
              <Button className="mt-4" onClick={() => router.push('/stores')}>{t('profile_orders_browse_stores')}</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const meta = STATUS_META[order.status]
              return (
                <Card key={order.id} className="transition-shadow hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                      <div className="flex-1 min-w-0">
                        {/* Top row: id, date, status, delivery type */}
                        <div className="flex flex-wrap items-center gap-2.5 mb-2">
                          <span className="text-[10px] font-mono text-gray-400 font-bold">{order.order_number_formatted || `#${order.store_order_number || order.id}`}</span>
                          <span className="text-[10px] text-gray-400 font-semibold">{new Date(order.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                          <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider', meta.color)}>
                            {meta.emoji} {meta.label}
                          </span>
                          <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                            {order.delivery_type === 'pickup' ? t('profile_orders_delivery_type_pickup') : t('profile_orders_delivery_type_delivery')}
                          </span>
                        </div>

                        {/* Store name */}
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                          🏪 {order.store?.name || t('profile_orders_store_default')}
                        </h4>

                        {/* Items list (truncated) */}
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-1 leading-normal">
                          {order.items?.map((item, idx) => (
                            <span key={item.id}>{item.food.name} (x{item.quantity}){idx < order.items.length - 1 ? ', ' : ''}</span>
                          ))}
                        </p>
                      </div>

                      {/* Total + Actions */}
                      <div className="flex items-center justify-between gap-6 pt-3 border-t border-gray-100 md:justify-end shrink-0 md:border-t-0 md:pt-0 dark:border-gray-800">
                        <div>
                          <span className="block text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">{t('profile_orders_total_label')}</span>
                          <span className="text-xs font-bold text-gray-900 dark:text-white">{formatPrice(order.total_amount)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {order.status === 'pending' && (
                            <button
                              onClick={() => openEdit(order)}
                              className="inline-flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-[10px] font-bold rounded border border-gray-200 dark:border-gray-700 transition"
                            >
                              ✏️                               {t('edit')}
                            </button>
                          )}
                          {canReorder(order) && (
                            <button
                              onClick={() => handleReorder(order.id, order.store?.alias)}
                              disabled={reorderingId === order.id}
                              className="inline-flex items-center px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold rounded border border-emerald-200 dark:border-emerald-900/50 transition disabled:opacity-50"
                            >
                              <RotateCcw className="w-3 h-3 mr-1" />
                              {reorderingId === order.id ? '...' : t('reorder')}
                            </button>
                          )}
                        <button
                          onClick={() => router.push(`/orders/${order.id}/tracking`)}
                          className="text-orange-600 hover:underline text-sm"
                        >
                          {t('track_order')}
                        </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Cursor Pagination */}
        {(prevCursor || nextCursor) && (
          <div className="flex items-center justify-center gap-2">
            <Button variant="outline" size="sm" disabled={!prevCursor} onClick={goPrev}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" disabled={!nextCursor} onClick={goNext}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}

      {/* Edit Order Modal */}
      {editOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-lg shadow-xl border border-gray-200 dark:border-gray-800 p-6 relative max-h-[90vh] overflow-y-auto">
            <button onClick={closeEdit} className="absolute p-1 transition rounded-lg top-4 right-4 hover:bg-gray-100 dark:hover:bg-gray-800">
              <X className="w-4 h-4" />
            </button>
            <h2 className="mb-4 text-sm font-bold text-gray-900 dark:text-white">{t('profile_orders_edit_modal_title')} #{editOrderId}</h2>

            {editError && <div className="p-3 mb-4 text-sm text-red-700 rounded-lg bg-red-50">{editError}</div>}

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1.5">{t('profile_orders_edit_type_label')}</label>
                <select
                  value={editDeliveryType}
                  onChange={e => setEditDeliveryType(e.target.value as 'delivery' | 'pickup')}
                  className="w-full px-3.5 py-2 text-sm rounded-lg bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition"
                >
                  <option value="delivery">{t('profile_orders_edit_type_delivery')}</option>
                  <option value="pickup">{t('profile_orders_edit_type_pickup')}</option>
                </select>
              </div>

              {editDeliveryType === 'delivery' && (
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1.5">{t('profile_orders_edit_address_label')}</label>
                  <input
                    type="text"
                    value={editAddress}
                    onChange={e => setEditAddress(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-lg bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition"
                    placeholder={t('profile_orders_edit_address_placeholder')}
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1.5">{t('profile_orders_edit_notes_label')}</label>
                <textarea
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2 text-sm rounded-lg bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition resize-none"
                  placeholder={t('profile_orders_edit_notes_placeholder')}
                />
              </div>

              <div className="flex items-center gap-3 pt-4 mt-6 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="px-4 py-2 text-xs font-bold text-gray-700 transition bg-gray-100 rounded-lg dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  {t('profile_orders_edit_cancel')}
                </button>
                <button
                  onClick={saveEdit}
                  disabled={editSaving}
                  className="flex-1 px-4 py-2 text-xs font-bold text-center text-white transition bg-gray-900 rounded-lg shadow-sm dark:bg-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100 disabled:opacity-50"
                >
                  {editSaving ? t('profile_orders_edit_saving') : t('profile_orders_edit_save')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  )
}
