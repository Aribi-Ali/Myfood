'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api-client'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, ChevronLeft, ChevronRight, Eye, X, UtensilsCrossed, Edit3, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'

interface FoodItem {
  id: number
  name: string
  description: string | null
  price: number
  image_path: string | null
  is_available: boolean
  store: { id: number; name: string; alias: string }
  categories: { id: number; name: string }[]
  created_at: string
}

export default function AdminFoodsPage() {
  const [items, setItems] = useState<FoodItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [detail, setDetail] = useState<FoodItem | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', description: '', price: '', is_available: true })

  const fetch = () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page) })
    if (search) params.set('search', search)
    api.get<{ data: { data: FoodItem[]; last_page: number } }>('/admin/foods?' + params.toString())
      .then(res => { setItems(res.data?.data || []); setLastPage(res.data?.last_page || 1) })
      .catch(err => setError(err instanceof Error ? err.message : 'Failed'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetch() }, [page, search])

  const handleSearch = () => { setSearch(searchInput); setPage(1) }

  const openDetail = (item: FoodItem) => {
    setDetail(item)
    setEditMode(false)
    setEditForm({ name: item.name, description: item.description || '', price: String(item.price), is_available: item.is_available })
  }

  const saveEdit = async () => {
    if (!detail) return
    try {
      await api.put(`/admin/foods/${detail.id}`, {
        name: editForm.name,
        description: editForm.description || null,
        price: parseFloat(editForm.price),
        is_available: editForm.is_available,
      })
      setEditMode(false)
      fetch()
      setDetail(null)
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Update failed') }
  }

  const destroy = async (id: number) => {
    if (!confirm('Delete this food item?')) return
    try { await api.delete(`/admin/foods/${id}`); fetch() }
    catch (err: unknown) { setError(err instanceof Error ? err.message : 'Delete failed') }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Food Items</h1>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex gap-2">
        <Input placeholder="Search by name..." value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()} className="w-60" />
        <Button variant="outline" size="sm" onClick={handleSearch}><Search className="h-4 w-4" /></Button>
      </div>

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Card key={i}><CardContent className="p-4"><Skeleton className="h-16 w-full" /></CardContent></Card>)}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-gray-500"><UtensilsCrossed className="h-12 w-12 mx-auto mb-3 text-gray-300" /><p className="font-medium">No food items found</p></div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(item => (
            <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => openDetail(item)}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {item.image_path ? (
                    <img src={item.image_path} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <UtensilsCrossed className="h-6 w-6 text-orange-400" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-sm truncate">{item.name}</p>
                      <span className="text-xs font-bold text-orange-600 flex-shrink-0">{Number(item.price).toFixed(2)} DZD</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{item.store?.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {item.is_available ? <ToggleRight className="h-3.5 w-3.5 text-green-500" /> : <ToggleLeft className="h-3.5 w-3.5 text-gray-300" />}
                      <span className="text-[10px] text-gray-400">{item.categories?.map(c => c.name).join(', ') || 'No category'}</span>
                    </div>
                  </div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => { setDetail(null); setEditMode(false) }}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6" onClick={e => e.stopPropagation()}>
            {editMode ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold">Edit Food</h3>
                  <button onClick={() => setEditMode(false)}><X className="h-5 w-5 text-gray-400" /></button>
                </div>
                <div><label className="text-xs text-gray-500">Name</label><Input value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} /></div>
                <div><label className="text-xs text-gray-500">Description</label><textarea value={editForm.description} onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm min-h-[60px]" /></div>
                <div><label className="text-xs text-gray-500">Price (DZD)</label><Input type="number" step="0.01" value={editForm.price} onChange={e => setEditForm(p => ({ ...p, price: e.target.value }))} /></div>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={editForm.is_available} onChange={e => setEditForm(p => ({ ...p, is_available: e.target.checked }))} className="rounded" />
                  Available
                </label>
                <Button className="w-full" onClick={saveEdit}>Save</Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {detail.image_path ? (
                      <img src={detail.image_path} alt="" className="w-16 h-16 rounded-xl object-cover" />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-orange-100 flex items-center justify-center"><UtensilsCrossed className="h-8 w-8 text-orange-400" /></div>
                    )}
                    <div>
                      <h3 className="text-lg font-bold">{detail.name}</h3>
                      <p className="text-sm text-orange-600 font-bold">{Number(detail.price).toFixed(2)} DZD</p>
                    </div>
                  </div>
                  <button onClick={() => { setDetail(null); setEditMode(false) }}><X className="h-5 w-5 text-gray-400" /></button>
                </div>
                <p className="text-xs text-gray-500">Store: {detail.store?.name} (@{detail.store?.alias})</p>
                {detail.description && <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-2">{detail.description}</p>}
                <div className="flex items-center gap-2 text-xs">
                  {detail.is_available ? <span className="text-green-600 font-medium">Available</span> : <span className="text-red-500 font-medium">Unavailable</span>}
                  {detail.categories?.map(c => <span key={c.id} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{c.name}</span>)}
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" onClick={() => setEditMode(true)}><Edit3 className="h-4 w-4 mr-1" />Edit</Button>
                  <Button size="sm" variant="outline" className="text-red-600 border-red-200" onClick={() => { destroy(detail.id); setDetail(null) }}><Trash2 className="h-4 w-4 mr-1" />Delete</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
