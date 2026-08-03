'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api-client'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, ChevronLeft, ChevronRight, Eye, X, CalendarClock } from 'lucide-react'

interface ReservationData {
  id: number
  client: { id: number; name: string; email: string } | null
  store: { id: number; name: string; alias: string } | null
  reservation_date: string
  reservation_time: string
  guests: number
  status: string
  notes: string | null
  created_at: string
}

const STATUS_BADGE: Record<string, { label: string; color: string; dot: string }> = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', dot: 'bg-yellow-500' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500' },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-500' },
}

export default function AdminReservationsPage() {
  const [items, setItems] = useState<ReservationData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [detail, setDetail] = useState<ReservationData | null>(null)

  const fetch = () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page) })
    if (statusFilter) params.set('status', statusFilter)
    if (dateFilter) params.set('date', dateFilter)
    api.get<{ data: { data: ReservationData[]; last_page: number } }>('/admin/reservations?' + params.toString())
      .then(res => { setItems(res.data?.data || []); setLastPage(res.data?.last_page || 1) })
      .catch(err => setError(err instanceof Error ? err.message : 'Failed'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetch() }, [page, statusFilter, dateFilter])

  const cancel = async (id: number) => {
    if (!confirm('Cancel this reservation?')) return
    try { await api.post(`/admin/reservations/${id}/cancel`); fetch(); setDetail(null) }
    catch (err: unknown) { setError(err instanceof Error ? err.message : 'Cancel failed') }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reservations</h1>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1.5">
          <Button variant={statusFilter === '' ? 'primary' : 'outline'} size="sm" onClick={() => { setStatusFilter(''); setPage(1) }}
            className={statusFilter === '' ? 'bg-gray-900 text-white' : ''}>All</Button>
          {Object.entries(STATUS_BADGE).map(([key, { label, dot }]) => (
            <Button key={key} variant={statusFilter === key ? 'primary' : 'outline'} size="sm"
              onClick={() => { setStatusFilter(key); setPage(1) }}
              className={statusFilter === key ? 'bg-gray-900 text-white' : ''}>
              <span className={cn('w-1.5 h-1.5 rounded-full mr-1.5', dot)} />{label}
            </Button>
          ))}
        </div>
        <Input type="date" value={dateFilter} onChange={e => { setDateFilter(e.target.value); setPage(1) }} className="w-40 ml-auto" />
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Card key={i}><CardContent className="p-4"><Skeleton className="h-14 w-full" /></CardContent></Card>)}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-gray-500"><CalendarClock className="h-12 w-12 mx-auto mb-3 text-gray-300" /><p className="font-medium">No reservations found</p></div>
      ) : (
        <div className="space-y-2">
          {items.map(item => (
            <Card key={item.id} className="cursor-pointer hover:shadow-md" onClick={() => setDetail(item)}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center flex-shrink-0">#{item.id}</div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900">{item.client?.name || 'N/A'}</p>
                    <p className="text-xs text-gray-500">{item.store?.name} · {item.reservation_date?.split('T')[0]} {item.reservation_time} · {item.guests} guests</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full border', STATUS_BADGE[item.status]?.color)}>
                    {STATUS_BADGE[item.status]?.label || item.status}
                  </span>
                  <Button variant="ghost" size="sm" onClick={e => { e.stopPropagation(); setDetail(item) }}><Eye className="h-4 w-4" /></Button>
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

      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setDetail(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Reservation #{detail.id}</h3>
              <button onClick={() => setDetail(null)}><X className="h-5 w-5 text-gray-400" /></button>
            </div>
            <div className="space-y-3 text-sm">
              <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full border', STATUS_BADGE[detail.status]?.color)}>
                {STATUS_BADGE[detail.status]?.label || detail.status}
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-gray-500">Client</p><p className="font-medium">{detail.client?.name || 'N/A'}</p></div>
                <div><p className="text-xs text-gray-500">Email</p><p className="font-medium">{detail.client?.email || 'N/A'}</p></div>
                <div><p className="text-xs text-gray-500">Store</p><p className="font-medium">{detail.store?.name || 'N/A'}</p></div>
                <div><p className="text-xs text-gray-500">Date</p><p className="font-medium">{detail.reservation_date?.split('T')[0]} at {detail.reservation_time}</p></div>
                <div><p className="text-xs text-gray-500">Guests</p><p className="font-medium">{detail.guests}</p></div>
                <div><p className="text-xs text-gray-500">Created</p><p className="font-medium">{detail.created_at?.split('T')[0]}</p></div>
              </div>
              {detail.notes && <div><p className="text-xs text-gray-500">Notes</p><p className="bg-gray-50 rounded-lg p-2 mt-1">{detail.notes}</p></div>}
              {['pending', 'confirmed'].includes(detail.status) && (
                <Button size="sm" variant="outline" className="text-red-600 border-red-200" onClick={() => cancel(detail.id)}>Cancel Reservation</Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
