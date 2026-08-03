'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api-client'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, Plus, X, Image, Edit3, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'

interface BannerData {
  id: number
  store_id: number | null
  store: { id: number; name: string; alias: string } | null
  image_path: string
  link_url: string | null
  active: boolean
  created_at: string
}

export default function AdminBannersPage() {
  const [items, setItems] = useState<BannerData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeFilter, setActiveFilter] = useState<'' | 'true' | 'false'>('')
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<BannerData | null>(null)
  const [form, setForm] = useState({ image_path: '', link_url: '', active: true })

  const fetch = () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page) })
    if (activeFilter) params.set('active', activeFilter)
    api.get<{ data: { data: BannerData[]; last_page: number } }>('/admin/banners?' + params.toString())
      .then(res => { setItems(res.data?.data || []); setLastPage(res.data?.last_page || 1) })
      .catch(err => setError(err instanceof Error ? err.message : 'Failed'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetch() }, [page, activeFilter])

  const openCreate = () => { setEditing(null); setForm({ image_path: '', link_url: '', active: true }); setShowForm(true) }

  const openEdit = (item: BannerData) => {
    setEditing(item)
    setForm({ image_path: item.image_path, link_url: item.link_url || '', active: item.active })
    setShowForm(true)
  }

  const save = async () => {
    if (!form.image_path) return
    try {
      if (editing) {
        await api.put(`/admin/banners/${editing.id}`, form)
      } else {
        await api.post('/admin/banners', form)
      }
      setShowForm(false); setEditing(null); fetch()
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Save failed') }
  }

  const destroy = async (id: number) => {
    if (!confirm('Delete this banner?')) return
    try { await api.delete(`/admin/banners/${id}`); fetch() } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Delete failed') }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Banners</h1>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-1" />Add</Button>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex gap-1.5">
        <Button variant={activeFilter === '' ? 'primary' : 'outline'} size="sm" onClick={() => { setActiveFilter(''); setPage(1) }}
          className={activeFilter === '' ? 'bg-gray-900 text-white' : ''}>All</Button>
        <Button variant={activeFilter === 'true' ? 'primary' : 'outline'} size="sm" onClick={() => { setActiveFilter('true'); setPage(1) }}
          className={activeFilter === 'true' ? 'bg-gray-900 text-white' : ''}>Active</Button>
        <Button variant={activeFilter === 'false' ? 'primary' : 'outline'} size="sm" onClick={() => { setActiveFilter('false'); setPage(1) }}
          className={activeFilter === 'false' ? 'bg-gray-900 text-white' : ''}>Inactive</Button>
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Card key={i}><CardContent className="p-4"><Skeleton className="h-16 w-full" /></CardContent></Card>)}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-gray-500"><Image className="h-12 w-12 mx-auto mb-3 text-gray-300" /><p className="font-medium">No banners found</p></div>
      ) : (
        <div className="space-y-2">
          {items.map(item => (
            <Card key={item.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-16 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img src={item.image_path} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{item.link_url || 'No link'}</p>
                    {item.store && <p className="text-xs text-gray-500">{item.store.name}</p>}
                  </div>
                  {item.active ? <ToggleRight className="h-4 w-4 text-green-500" /> : <ToggleLeft className="h-4 w-4 text-gray-300" />}
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

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{editing ? 'Edit' : 'Add'} Banner</h3>
              <button onClick={() => setShowForm(false)}><X className="h-5 w-5 text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              <div><label className="text-xs text-gray-500">Image URL</label><Input value={form.image_path} onChange={e => setForm(p => ({ ...p, image_path: e.target.value }))} placeholder="/uploads/banners/..." /></div>
              {form.image_path && (
                <div className="w-full h-32 rounded-lg overflow-hidden bg-gray-100">
                  <img src={form.image_path} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                </div>
              )}
              <div><label className="text-xs text-gray-500">Link URL (optional)</label><Input value={form.link_url} onChange={e => setForm(p => ({ ...p, link_url: e.target.value }))} placeholder="https://..." /></div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.active} onChange={e => setForm(p => ({ ...p, active: e.target.checked }))} />
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
