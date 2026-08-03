'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useApiQuery, useApiMutation } from '@/lib/use-api-query'
import { useQueryClient } from '@tanstack/react-query'
import { cn, formatPrice } from '@/lib/utils'
import { useLanguage } from '@/contexts/language'
import { useAuth } from '@/contexts/auth'
import { useStoreOrdersChannel } from '@/lib/use-realtime-orders'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Search, ChevronLeft, ChevronRight, Bike, X, Star,
  ChevronDown, Eye, Phone, MapPin, Clock, ShoppingBag, DollarSign, TrendingUp, Users, PackageCheck
} from 'lucide-react'
import type { OrderData, OrderStatusValue, OrderDeliveryGuy } from '@/types/api'

type OrderStatus = OrderStatusValue

interface Rider {
  id: number
  name: string
  delivery_profile: {
    transporter_type: string | null
    is_working: boolean
    phone: string | null
  } | null
}

interface DailyProfit {
  order_count: number
  total_revenue: number
  total_commission: number
  net_profit: number
}

const STATUS_BADGE: Record<OrderStatus, { label: string; color: string; dot: string }> = {
  pending: { label: 'pending', color: 'bg-gray-100 text-gray-700 border-gray-200', dot: 'bg-gray-400' },
  confirmed: { label: 'confirmed', color: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  preparing: { label: 'preparing', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', dot: 'bg-yellow-500' },
  ready: { label: 'ready', color: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-500' },
  delivering: { label: 'delivering', color: 'bg-orange-100 text-orange-700 border-orange-200', dot: 'bg-orange-500' },
  delivered: { label: 'delivered', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  cancelled: { label: 'cancelled', color: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500' },
}

const STATUS_TRANSITIONS: Record<OrderStatus, { next: OrderStatus; label: string; color: string }[]> = {
  pending: [
    { next: 'confirmed', label: 'confirm', color: 'bg-blue-600 hover:bg-blue-700 text-white' },
    { next: 'cancelled', label: 'cancel', color: 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200' },
  ],
  confirmed: [
    { next: 'preparing', label: 'start_preparing', color: 'bg-yellow-600 hover:bg-yellow-700 text-white' },
    { next: 'cancelled', label: 'cancel', color: 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200' },
  ],
  preparing: [
    { next: 'ready', label: 'mark_ready', color: 'bg-green-600 hover:bg-green-700 text-white' },
  ],
  ready: [
    { next: 'delivering', label: 'start_delivering', color: 'bg-orange-600 hover:bg-orange-700 text-white' },
  ],
  delivering: [
    { next: 'delivered', label: 'mark_delivered', color: 'bg-emerald-600 hover:bg-emerald-700 text-white' },
  ],
  delivered: [],
  cancelled: [
    { next: 'pending', label: 'reopen', color: 'bg-gray-600 hover:bg-gray-700 text-white' },
  ],
}

export default function OrdersPage() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())

  // Rider modal state
  const [riderModal, setRiderModal] = useState<{ open: boolean; orderIds: number[]; singleOrderId?: number }>({ open: false, orderIds: [] })
  const [riders, setRiders] = useState<Rider[]>([])
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set())
  const [riderSearch, setRiderSearch] = useState('')
  const [loadingRiders, setLoadingRiders] = useState(false)
  const [hasMoreRiders, setHasMoreRiders] = useState(true)
  const riderCursorRef = useRef<string | null>(null)

  // Order detail modal
  const [detailOrder, setDetailOrder] = useState<OrderData | null>(null)

  // Bulk action state
  const [bulkStatus, setBulkStatus] = useState<OrderStatus | ''>('')

  // Cached query params
  const params: Record<string, string> = { page: String(page) }
  if (statusFilter) params.status = statusFilter
  if (search) params.search = search

  const { data: ordersRes, isLoading } = useApiQuery<any>(
    ['owner', 'orders', statusFilter, search, page],
    '/owner/orders?' + new URLSearchParams(params).toString(),
    { refetchInterval: 5000 }
  )

  const { data: dailyProfit } = useApiQuery<any>(
    ['owner', 'sales', 'today'],
    '/owner/sales/stats?period=today',
    { refetchInterval: 5000 }
  )

  const orders: OrderData[] = ordersRes?.data?.data ?? []
  const lastPage = ordersRes?.data?.last_page ?? 1

  // Status update mutation
  const statusMutation = useApiMutation<any, any>(
    '/owner/orders/bulk/status',
    'post',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['owner', 'orders'] })
        queryClient.invalidateQueries({ queryKey: ['owner', 'sales'] })
      },
    }
  )

  // Sync detail modal with the latest fetched orders
  useEffect(() => {
    if (!detailOrder) return
    const updated = orders.find(o => o.id === detailOrder.id)
    if (updated) setDetailOrder(updated)
  }, [orders, detailOrder])

  // Real-time order updates for owner dashboard
  const storeId = user?.store?.id
  const onPlaced = useCallback((data: Record<string, unknown>) => {
    queryClient.invalidateQueries({ queryKey: ['owner', 'orders'] })
    queryClient.invalidateQueries({ queryKey: ['owner', 'sales'] })
  }, [queryClient])

  const onStatusUpdated = useCallback((data: Record<string, unknown>) => {
    queryClient.invalidateQueries({ queryKey: ['owner', 'orders'] })
    queryClient.invalidateQueries({ queryKey: ['owner', 'sales'] })
  }, [queryClient])

  useStoreOrdersChannel(storeId, onPlaced, onStatusUpdated)

  function handleSearch() {
    setSearch(searchInput)
    setPage(1)
  }

  async function updateStatus(orderId: number, newStatus: OrderStatus) {
    try {
      await statusMutation.mutateAsync({ order_ids: [orderId], status: newStatus })
    } catch { /* ignore */ }
  }

  function toggleSelect(id: number) {
    setSelectedIds(prev => {
      const s = new Set(prev)
      if (s.has(id)) s.delete(id); else s.add(id)
      return s
    })
  }

  function toggleSelectAll() {
    if (selectedIds.size === orders.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(orders.map(o => o.id)))
    }
  }

  async function handleBulkStatus(newStatus: OrderStatus) {
    if (selectedIds.size === 0) return
    try {
      await statusMutation.mutateAsync({ order_ids: Array.from(selectedIds), status: newStatus })
      setSelectedIds(new Set())
    } catch { /* ignore */ }
  }

  async function handleBulkDelete() {
    if (selectedIds.size === 0 || !confirm('Delete selected orders?')) return
    try {
      await fetch('/api/owner/orders/bulk', {
        method: 'DELETE',
        body: JSON.stringify({ order_ids: Array.from(selectedIds) }),
      })
      queryClient.invalidateQueries({ queryKey: ['owner', 'orders'] })
      setSelectedIds(new Set())
    } catch { /* ignore */ }
  }

  const fetchRiders = useCallback(async (cursor?: string | null) => {
    setLoadingRiders(true)
    try {
      const params = new URLSearchParams()
      if (cursor) params.set('cursor', cursor)
      if (riderSearch) params.set('search', riderSearch)
      params.set('per_page', '20')
      const res = await fetch('/api/owner/riders?' + params.toString())
      const json = await res.json()
      if (cursor) {
        setRiders(prev => [...prev, ...(json.data?.data ?? [])])
      } else {
        setRiders(json.data?.data ?? [])
      }
      setHasMoreRiders(!!json.data?.next_cursor_url)
      riderCursorRef.current = json.data?.next_cursor_url
    } catch { /* ignore */ }
    setLoadingRiders(false)
  }, [riderSearch])

  function openRiderModal(orderId: number) {
    setRiderModal({ open: true, orderIds: [orderId], singleOrderId: orderId })
    setRiders([])
    riderCursorRef.current = null
    setHasMoreRiders(true)
    fetchRiders(null)
  }

  function openBulkRiderModal() {
    if (selectedIds.size === 0) return
    setRiderModal({ open: true, orderIds: Array.from(selectedIds) })
    setRiders([])
    riderCursorRef.current = null
    setHasMoreRiders(true)
    fetchRiders(null)
  }

  async function assignRider(userId: number) {
    try {
      for (const orderId of riderModal.orderIds) {
        await fetch('/api/owner/orders/' + orderId + '/assign', {
          method: 'POST',
          body: JSON.stringify({ delivery_id: userId }),
        })
      }
      queryClient.invalidateQueries({ queryKey: ['owner', 'orders'] })
      setRiderModal({ open: false, orderIds: [] })
    } catch { /* ignore */ }
  }

  async function toggleFavorite(userId: number) {
    try {
      const res = await fetch('/api/owner/riders/' + userId + '/favorite', { method: 'POST' })
      const json = await res.json()
      if (json.data?.is_favorited) {
        setFavoriteIds(prev => new Set(prev).add(userId))
      } else {
        setFavoriteIds(prev => { const s = new Set(prev); s.delete(userId); return s })
      }
    } catch { /* ignore */ }
  }

  if (isLoading && orders.length === 0) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
        <Skeleton className="h-10 w-full" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <Card key={i}><CardContent className="p-4"><Skeleton className="h-20 w-full" /></CardContent></Card>
          ))}
        </div>
      </div>
    )
  }

  const filteredRiders = riders.filter(r =>
    !riderSearch || r.name.toLowerCase().includes(riderSearch.toLowerCase())
  )
  const sortedRiders = [...filteredRiders].sort((a, b) => {
    const aFav = favoriteIds.has(a.id)
    const bFav = favoriteIds.has(b.id)
    if (aFav && !bFav) return -1
    if (!aFav && bFav) return 1
    return 0
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('orders')}</h1>
          <p className="text-gray-500">{t('manage_orders')}</p>
        </div>
        {selectedIds.size > 0 && (
          <span className="text-sm text-orange-600 font-medium">{selectedIds.size} selected</span>
        )}
      </div>

      {/* Daily Profit Banner */}
      {dailyProfit && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Today Orders', value: dailyProfit.order_count ?? 0, icon: ShoppingBag, color: 'text-blue-600 bg-blue-50' },
            { label: 'Revenue', value: formatPrice(dailyProfit.total_revenue ?? 0), icon: DollarSign, color: 'text-green-600 bg-green-50' },
            { label: 'Commission', value: formatPrice(dailyProfit.total_commission ?? 0), icon: TrendingUp, color: 'text-orange-600 bg-orange-50' },
            { label: 'Net Profit', value: formatPrice(dailyProfit.net_profit ?? 0), icon: PackageCheck, color: 'text-emerald-600 bg-emerald-50' },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label} className="border-0 shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={cn('p-2 rounded-lg', color)}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="text-lg font-bold text-gray-900">{value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          <Button
            variant={statusFilter === '' ? 'primary' : 'outline'} size="sm"
            onClick={() => { setStatusFilter(''); setPage(1) }}
            className={statusFilter === '' ? 'bg-gray-900 text-white hover:bg-gray-800' : ''}
          >
            All
          </Button>
          {Object.entries(STATUS_BADGE).map(([key, { label, dot }]) => (
            <Button
              key={key}
              variant={statusFilter === key ? 'primary' : 'outline'} size="sm"
              onClick={() => { setStatusFilter(key); setPage(1) }}
              className={statusFilter === key ? 'bg-gray-900 text-white hover:bg-gray-800' : ''}
            >
              <span className={cn('w-1.5 h-1.5 rounded-full mr-1.5', dot)} />
              {t(label)}
            </Button>
          ))}
        </div>
        <div className="flex gap-2 ml-auto">
          <Input
            placeholder={t('search_by_id_or_client')}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-56"
          />
          <Button variant="outline" onClick={handleSearch}><Search className="h-4 w-4" /></Button>
        </div>
      </div>

      {/* Bulk actions bar */}
      {selectedIds.size > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-3 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-orange-800 mr-2">{selectedIds.size} selected</span>
            <select
              value={bulkStatus}
              onChange={(e) => {
                const val = e.target.value as OrderStatus
                if (val) { handleBulkStatus(val); setBulkStatus('') }
              }}
              className="text-sm border border-orange-200 rounded-lg px-2 py-1 bg-white"
            >
              <option value="">Set status...</option>
              {Object.keys(STATUS_TRANSITIONS).filter(s => !['delivered', 'cancelled'].includes(s)).map(s => (
                <option key={s} value={s}>{t(s)}</option>
              ))}
            </select>
            <Button variant="outline" size="sm" onClick={openBulkRiderModal} className="border-orange-200">
              <Bike className="h-4 w-4 mr-1" /> Assign Rider
            </Button>
            <Button variant="danger" size="sm" onClick={handleBulkDelete}>
              <X className="h-4 w-4 mr-1" /> Delete
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setSelectedIds(new Set())} className="text-orange-600">
              Clear
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Orders list */}
      <div className="space-y-3">
        {orders.map((order) => {
          const transitions = STATUS_TRANSITIONS[order.status] || []
          const isSelected = selectedIds.has(order.id)
          return (
            <Card
              key={order.id}
              className={cn(
                'transition-shadow hover:shadow-md cursor-pointer',
                isSelected && 'ring-2 ring-orange-400 border-orange-400'
              )}
              onClick={() => setDetailOrder(order)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <div className="pt-1" onClick={e => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(order.id)}
                      className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Top row: ID, status, date, rider */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-sm font-bold text-gray-900">{order.order_number_formatted || `#${order.store_order_number || order.id}`}</span>
                      <span className={cn('inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium', STATUS_BADGE[order.status].color)}>
                        <span className={cn('w-1.5 h-1.5 rounded-full', STATUS_BADGE[order.status].dot)} />
                        {order.status_label || t(order.status)}
                      </span>
                      {order.delivery_guy && (
                        <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 rounded-full px-2 py-0.5">
                          <Bike className="h-3 w-3" />
                          {order.delivery_guy.name}
                        </span>
                      )}
                      {order.delivery_type === 'delivery' && (
                        <span className="text-xs text-orange-600 bg-orange-50 rounded-full px-2 py-0.5">
                          Delivery
                        </span>
                      )}
                      {order.delivery_type === 'pickup' && (
                        <span className="text-xs text-blue-600 bg-blue-50 rounded-full px-2 py-0.5">
                          Pickup
                        </span>
                      )}
                      <span className="text-xs text-gray-400 ml-auto">
                        {new Date(order.created_at).toLocaleString()}
                      </span>
                    </div>

                    {/* Client info */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                      <span className="font-medium text-gray-800">{order.client_name || 'Client'}</span>
                      {order.phone && (
                        <span className="inline-flex items-center gap-1 text-gray-500">
                          <Phone className="h-3 w-3" /> {order.phone}
                        </span>
                      )}
                      {order.address && (
                        <span className="inline-flex items-center gap-1 text-gray-500 truncate max-w-[200px]">
                          <MapPin className="h-3 w-3 shrink-0" /> {order.address}
                        </span>
                      )}
                    </div>

                    {/* Items */}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {order.items?.map((item) => (
                        <span key={item.id} className="rounded-md bg-gray-50 border border-gray-100 px-2 py-0.5 text-xs text-gray-600">
                          {item.food.name} <span className="text-gray-400">x{item.quantity}</span>
                        </span>
                      ))}
                    </div>

                    {/* Total */}
                    <div className="mt-3 flex items-center gap-3">
                      <span className="text-base font-bold text-gray-900">{formatPrice(order.total_amount)}</span>
                      {order.promo_code && (
                        <span className="text-xs text-green-600">-{formatPrice(order.discount_amount)}</span>
                      )}
                    </div>

                    {/* Actions row */}
                    <div className="mt-2 flex flex-wrap gap-1.5" onClick={e => e.stopPropagation()}>
                      {!transitions.find(t => t.next === 'cancelled') && order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <Button
                          variant="outline" size="sm"
                          onClick={() => openRiderModal(order.id)}
                          className="text-xs"
                        >
                          <Bike className="h-3.5 w-3.5 mr-1" />
                          {order.delivery_guy ? 'Change Rider' : 'Assign Rider'}
                        </Button>
                      )}
                      {transitions.filter(t => t.next !== 'cancelled').map(({ next, label, color }) => (
                        <Button
                          key={next}
                          size="sm"
                          disabled={statusMutation.isPending}
                          onClick={() => updateStatus(order.id, next)}
                          className={cn('text-xs', color)}
                        >
                          {statusMutation.isPending ? '...' : t(label)}
                        </Button>
                      ))}
                      {transitions.filter(t => t.next === 'cancelled').map(({ next, label, color }) => (
                        <Button
                          key={next}
                          size="sm"
                          disabled={statusMutation.isPending}
                          onClick={() => updateStatus(order.id, next)}
                          className={cn('text-xs', color)}
                        >
                          {t(label)}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {orders.length === 0 && !isLoading && (
        <Card>
          <CardContent className="p-12 text-center">
            <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto" />
            <p className="mt-4 text-gray-500">{t('no_orders')}</p>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {lastPage > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-600">{t('page_of', { page, lastPage })}</span>
          <Button variant="outline" size="sm" disabled={page >= lastPage} onClick={() => setPage(p => p + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Rider Assignment Modal */}
      {riderModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setRiderModal({ open: false, orderIds: [] })}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Assign Delivery Rider</h3>
                <p className="text-sm text-gray-500">
                  {riderModal.orderIds.length === 1
                    ? `Order #${riderModal.orderIds[0]}`
                    : `${riderModal.orderIds.length} orders selected`}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setRiderModal({ open: false, orderIds: [] })}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-4 border-b">
              <Input
                placeholder="Search riders..."
                value={riderSearch}
                onChange={e => {
                  setRiderSearch(e.target.value)
                  setRiders([])
                  riderCursorRef.current = null
                  fetchRiders(null)
                }}
              />
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {sortedRiders.length === 0 && loadingRiders ? (
                <div className="space-y-2 p-2">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 rounded-xl" />)}
                </div>
              ) : sortedRiders.length === 0 ? (
                <p className="text-center text-gray-400 py-8">No riders available</p>
              ) : (
                <div className="space-y-1">
                  {sortedRiders.map(rider => (
                    <div
                      key={rider.id}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => assignRider(rider.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                          <Bike className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{rider.name}</span>
                            {favoriteIds.has(rider.id) && <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            {rider.delivery_profile?.transporter_type && (
                              <span className="capitalize">{rider.delivery_profile.transporter_type}</span>
                            )}
                            {rider.delivery_profile?.phone && (
                              <span>{rider.delivery_profile.phone}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost" size="sm"
                          onClick={e => { e.stopPropagation(); toggleFavorite(rider.id) }}
                          className="text-gray-400 hover:text-yellow-500"
                        >
                          <Star className={cn('h-4 w-4', favoriteIds.has(rider.id) && 'fill-yellow-500 text-yellow-500')} />
                        </Button>
                        <Button size="sm" className="bg-gray-900 text-white hover:bg-gray-800 text-xs">
                          Assign
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {hasMoreRiders && !loadingRiders && (
                <Button
                  variant="ghost" className="w-full mt-2 text-gray-500"
                  onClick={() => fetchRiders(riderCursorRef.current)}
                >
                  <ChevronDown className="h-4 w-4 mr-1" /> Load more
                </Button>
              )}
              {loadingRiders && riders.length > 0 && (
                <div className="flex justify-center p-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-orange-600 border-t-transparent" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {detailOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setDetailOrder(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-gray-900">Order #{detailOrder.id}</h2>
                <span className={cn('inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium', STATUS_BADGE[detailOrder.status].color)}>
                  <span className={cn('w-1.5 h-1.5 rounded-full', STATUS_BADGE[detailOrder.status].dot)} />
                  {detailOrder.status_label || t(detailOrder.status)}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setDetailOrder(null)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Client</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium text-gray-900">{detailOrder.client_name || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{detailOrder.phone || '-'}</p>
                  </div>
                  {detailOrder.address && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium text-gray-900">{detailOrder.address}</p>
                    </div>
                  )}
                  {detailOrder.notes && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Notes</p>
                      <p className="font-medium text-gray-900">{detailOrder.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Delivery</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="font-medium text-gray-900 capitalize">{detailOrder.delivery_type}</p>
                  </div>
                  {detailOrder.estimated_delivery_minutes && (
                    <div>
                      <p className="text-sm text-gray-500">Est. Delivery</p>
                      <p className="font-medium text-gray-900">{detailOrder.estimated_delivery_minutes} min</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">Delivery Fee</p>
                    <p className="font-medium text-gray-900">{formatPrice(detailOrder.delivery_fee)}</p>
                  </div>
                  {detailOrder.delivery_guy && (
                    <div>
                      <p className="text-sm text-gray-500">Rider</p>
                      <p className="font-medium text-gray-900">{detailOrder.delivery_guy.name}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium text-gray-900">{new Date(detailOrder.created_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Items</h3>
                <div className="divide-y">
                  {detailOrder.items?.map(item => (
                    <div key={item.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">{item.food.name}</span>
                        <span className="text-xs text-gray-400">x{item.quantity}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-900">{formatPrice(detailOrder.total_amount + detailOrder.discount_amount - detailOrder.delivery_fee)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery Fee</span>
                  <span className="text-gray-900">{formatPrice(detailOrder.delivery_fee)}</span>
                </div>
                {detailOrder.discount_amount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Discount {detailOrder.promo_code && `(${detailOrder.promo_code.code})`}</span>
                    <span className="text-green-600">-{formatPrice(detailOrder.discount_amount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold pt-2 border-t">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">{formatPrice(detailOrder.total_amount)}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t">
                {STATUS_TRANSITIONS[detailOrder.status]?.map(({ next, label, color }) => (
                  <Button
                    key={next}
                    onClick={() => updateStatus(detailOrder.id, next)}
                    className={cn(color)}
                    disabled={statusMutation.isPending}
                  >
                    {t(label)}
                  </Button>
                ))}
                {detailOrder.status !== 'delivered' && detailOrder.status !== 'cancelled' && (
                  <Button
                    variant="outline"
                    onClick={() => { setDetailOrder(null); openRiderModal(detailOrder.id) }}
                  >
                    <Bike className="h-4 w-4 mr-1" />
                    Assign Rider
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
