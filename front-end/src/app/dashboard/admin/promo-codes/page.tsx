'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api-client'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, ChevronLeft, ChevronRight, Plus, X, Percent, Edit3, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'

interface PromoCodeData {
  id: number
  code: string
  type: 'percentage' | 'fixed'
  value: number
  store_id: number | null
  store: { id: number; name: string; alias: string } | null
  expires_at: string | null
  is_active: boolean
  created_at: string
}

export default function AdminPromoCodesPage() {
  const [items, setItems] = useState<PromoCodeData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<PromoCodeData | null>(null)
  const [form, setForm] = useState({ code: '', type: 'percentage' as 'percentage' | 'fixed', value: '', store_id: '', expires_at: '', is_active: true })

  const fetch = () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page) })
    if (search) params.set('search', search)
    api.get<{ data: { data: PromoCodeData[]; last_page: number } }>('/admin/promo-codes?' + params.toString())
      .then(res => { setItems(res.data?.data || []); setLastPage(res.data?.last_page || 1) })
      .catch(err => setError(err instanceof Error ? err.message : 'Failed'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetch() }, [page])

  const handleSearch = () => { setPage(1); fetch() }

  const openCreate = () => { setEditing(null); setForm({ code: '', type: 'percentage', value: '', store_id: '', expires_at: '', is_active: true }); setShowForm(true) }

  const openEdit = (item: PromoCodeData) => {
    setEditing(item)
    setForm({ code: item.code, type: item.type, value: String(item.value), store_id: item.store_id ? String(item.store_id) : '', expires_at: item.expires_at?.split('T')[0] || '', is_active: item.is_active })
    setShowForm(true)
  }

  const save = async () => {
    if (!form.code || !form.value) return
    const payload: Record<string, unknown> = { code: form.code, type: form.type, value: parseFloat(form.value), is_active: form.is_active }
    if (form.store_id) payload.store_id = parseInt(form.store_id)
    if (form.expires_at) payload.expires_at = form.expires_at
    try {
      if (editing) {
        await api.put(`/admin/promo-codes/${editing.id}`, payload)
      } else {
        await api.post('/admin/promo-codes', payload)
      }
      setShowForm(false); setEditing(null); fetch()
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Save failed') }
  }

  const destroy = async (id: number) => {
    if (!confirm('Delete this promo code?')) return
    try { await api.delete(`/admin/promo-codes/${id}`); fetch() } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Delete failed') }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Promo Codes</h1>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-1" />Add</Button>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex gap-2">
        <Input placeholder="Search by code..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} className="w-60" />
        <Button variant="outline" size="sm" onClick={handleSearch}><Search className="h-4 w-4" /></Button>
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Card key={i}><CardContent className="p-4"><Skeleton className="h-12 w-full" /></CardContent></Card>)}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-gray-500"><Percent className="h-12 w-12 mx-auto mb-3 text-gray-300" /><p className="font-medium">No promo codes found</p></div>
      ) : (
        <div className="space-y-2">
          {items.map(item => (
            <Card key={item.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="font-mono font-bold text-lg text-orange-600">{item.code}</div>
                  <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', item.type === 'percentage' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700')}>
                    {item.type === 'percentage' ? `${item.value}%` : `${item.value} DZD`}
                  </span>
                  {item.store && <span className="text-xs text-gray-500">{item.store.name}</span>}
                  {item.is_active ? <ToggleRight className="h-4 w-4 text-green-500" /> : <ToggleLeft className="h-4 w-4 text-gray-300" />}
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(item)}><Edit3 className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm" className="text-red-500" onClick={() => destroy(item.id)}><Trash2 className="h-4 w-4" /></Button>
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

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{editing ? 'Edit' : 'Add'} Promo Code</h3>
              <button onClick={() => setShowForm(false)}><X className="h-5 w-5 text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              <div><label className="text-xs text-gray-500">Code</label><Input value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value }))} placeholder="SUMMER20" /></div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-xs text-gray-500">Type</label>
                  <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as 'percentage' | 'fixed' }))} className="w-full border rounded-lg px-3 py-2 text-sm">
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-500">Value</label>
                  <Input type="number" step="0.01" value={form.value} onChange={e => setForm(p => ({ ...p, value: e.target.value }))} placeholder="20" />
                </div>
              </div>
              <div><label className="text-xs text-gray-500">Store ID (optional)</label><Input type="number" value={form.store_id} onChange={e => setForm(p => ({ ...p, store_id: e.target.value }))} placeholder="Leave empty for all stores" /></div>
              <div><label className="text-xs text-gray-500">Expires At (optional)</label><Input type="date" value={form.expires_at} onChange={e => setForm(p => ({ ...p, expires_at: e.target.value }))} /></div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.is_active} onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))} />
                Active
              </label>
              <Button className="w-full" onClick={save}>{editing ? 'Update' : 'Create'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
