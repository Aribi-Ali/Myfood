'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api-client'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, ChevronLeft, ChevronRight, Eye, X, ShoppingBag, DollarSign } from 'lucide-react'
import type { OrderData, OrderStatusValue } from '@/types/api'

const STATUS_BADGE: Record<string, { label: string; color: string; dot: string }> = {
  pending: { label: 'pending', color: 'bg-gray-100 text-gray-700 border-gray-200', dot: 'bg-gray-400' },
  confirmed: { label: 'confirmed', color: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  preparing: { label: 'preparing', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', dot: 'bg-yellow-500' },
  ready: { label: 'ready', color: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-500' },
  delivering: { label: 'delivering', color: 'bg-orange-100 text-orange-700 border-orange-200', dot: 'bg-orange-500' },
  delivered: { label: 'delivered', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  cancelled: { label: 'cancelled', color: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500' },
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [detailOrder, setDetailOrder] = useState<OrderData | null>(null)

  const fetchOrders = () => {
    setLoading(true)
    setError('')
    const params = new URLSearchParams({ page: String(page) })
    if (statusFilter) params.set('status', statusFilter)
    if (search) params.set('search', search)
    if (dateFrom) params.set('date_from', dateFrom)
    if (dateTo) params.set('date_to', dateTo)

    api.get<{ data: { data: OrderData[]; last_page: number } }>('/admin/orders?' + params.toString())
      .then(res => {
        setOrders(res.data?.data || [])
        setLastPage(res.data?.last_page || 1)
      })
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load orders'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchOrders() }, [page, statusFilter, dateFrom, dateTo])

  const handleSearch = () => { setSearch(searchInput); setPage(1) }

  const cancelOrder = async (id: number) => {
    if (!confirm('Cancel this order?')) return
    try {
      await api.post(`/admin/orders/${id}/cancel`)
      setSuccess('Order cancelled')
      fetchOrders()
      setDetailOrder(null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to cancel')
    }
  }

  const refundOrder = async (id: number) => {
    try {
      await api.post(`/admin/orders/${id}/refund`)
      setSuccess('Order refunded')
      fetchOrders()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to refund')
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Order Management</h1>

      {error && <p className="text-red-600 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          <Button variant={statusFilter === '' ? 'primary' : 'outline'} size="sm" onClick={() => { setStatusFilter(''); setPage(1) }}
            className={statusFilter === '' ? 'bg-gray-900 text-white hover:bg-gray-800' : ''}>All</Button>
          {Object.entries(STATUS_BADGE).map(([key, { label, dot }]) => (
            <Button key={key} variant={statusFilter === key ? 'primary' : 'outline'} size="sm"
              onClick={() => { setStatusFilter(key); setPage(1) }}
              className={statusFilter === key ? 'bg-gray-900 text-white hover:bg-gray-800' : ''}>
              <span className={cn('w-1.5 h-1.5 rounded-full mr-1.5', dot)} />{label}
            </Button>
          ))}
        </div>
        <div className="flex gap-2 ml-auto">
          <Input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(1) }} className="w-32" title="From" />
          <Input type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(1) }} className="w-32" title="To" />
          <Input placeholder="Search..." value={searchInput} onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()} className="w-40" />
          <Button variant="outline" size="sm" onClick={handleSearch}><Search className="h-4 w-4" /></Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}><CardContent className="p-4"><Skeleton className="h-16 w-full" /></CardContent></Card>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 text-gray-500"><ShoppingBag className="h-12 w-12 mx-auto mb-3 text-gray-300" /><p className="font-medium">No orders found</p></div>
      ) : (
        <div className="space-y-2">
          {orders.map(o => (
            <Card key={o.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setDetailOrder(o)}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center flex-shrink-0">
                    #{o.id}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {o.client_name || o.store?.name || `Order #${o.id}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      {o.store?.name} · {o.items?.length || 0} items · {o.total_amount?.toFixed(2)} DZD
                    </p>
                    <p className="text-xs text-gray-400">{o.created_at?.split('T')[0]} {o.delivery_type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full border', STATUS_BADGE[o.status]?.color)}>
                    {STATUS_BADGE[o.status]?.label || o.status}
                  </span>
                  <Button variant="ghost" size="sm" onClick={e => { e.stopPropagation(); setDetailOrder(o) }}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {lastPage > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}><ChevronLeft className="h-4 w-4" /></Button>
          <span className="text-sm text-gray-600">Page {page} / {lastPage}</span>
          <Button variant="outline" size="sm" disabled={page >= lastPage} onClick={() => setPage(p => Math.min(lastPage, p + 1))}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      )}

      {detailOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setDetailOrder(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Order #{detailOrder.id}</h3>
              <button onClick={() => setDetailOrder(null)} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full border', STATUS_BADGE[detailOrder.status]?.color)}>
                  {STATUS_BADGE[detailOrder.status]?.label || detailOrder.status}
                </span>
                <span className="text-xs text-gray-500">{detailOrder.delivery_type}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-gray-500">Store</p><p className="font-medium">{detailOrder.store?.name}</p></div>
                <div><p className="text-xs text-gray-500">Client</p><p className="font-medium">{detailOrder.client_name || 'N/A'}</p></div>
                <div><p className="text-xs text-gray-500">Total</p><p className="font-medium">{detailOrder.total_amount?.toFixed(2) || '0'} DZD</p></div>
                <div><p className="text-xs text-gray-500">Delivery Fee</p><p className="font-medium">{detailOrder.delivery_fee?.toFixed(2) || '0'} DZD</p></div>
                <div><p className="text-xs text-gray-500">Address</p><p className="font-medium">{detailOrder.address || 'N/A'}</p></div>
                <div><p className="text-xs text-gray-500">Phone</p><p className="font-medium">{detailOrder.phone || detailOrder.client_phone || 'N/A'}</p></div>
              </div>
              <div><p className="text-xs text-gray-500 mb-1">Items</p>
                <div className="bg-gray-50 rounded-lg p-2 space-y-1">
                  {detailOrder.items?.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.food?.name || `Food #${item.food_id}`}</span>
                      <span className="font-medium">{item.subtotal?.toFixed(2) || '0'} DZD</span>
                    </div>
                  ))}
                </div>
              </div>
              {detailOrder.notes && <div><p className="text-xs text-gray-500">Notes</p><p className="text-gray-700 bg-gray-50 rounded-lg p-2 mt-1">{detailOrder.notes}</p></div>}
              <div className="flex gap-2 pt-3 border-t">
                {['pending', 'confirmed'].includes(detailOrder.status) && (
                  <Button size="sm" variant="outline" className="text-red-600 border-red-200" onClick={() => cancelOrder(detailOrder.id)}>Cancel Order</Button>
                )}
                {detailOrder.status === 'cancelled' && (
                  <Button size="sm" variant="outline" onClick={() => refundOrder(detailOrder.id)}><DollarSign className="h-4 w-4 mr-1" />Refund</Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
