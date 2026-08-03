'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api-client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

interface StoreType {
  id: number
  name: string
  slug: string
  icon: string
  is_active: boolean
  stores_count?: number
}

interface StoreTypesResponse {
  data: StoreType[]
}

export default function AdminStoreTypesPage() {
  const [types, setTypes] = useState<StoreType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState<StoreType | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', slug: '', icon: '🏪', is_active: true })
  const [saving, setSaving] = useState(false)

  const fetchTypes = () => {
    api.get<StoreTypesResponse>('/admin/store-types')
      .then(res => setTypes(res.data || []))
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load store types'))
  }

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const res = await api.get<StoreTypesResponse>('/admin/store-types')
        setTypes(res.data || [])
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load store types')
      }
      setLoading(false)
    })()
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', slug: '', icon: '🏪', is_active: true })
    setShowForm(true)
  }

  const openEdit = (type: StoreType) => {
    setEditing(type)
    setForm({ name: type.name, slug: type.slug, icon: type.icon, is_active: type.is_active })
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    try {
      if (editing) {
        await api.put(`/admin/store-types/${editing.id}`, form)
      } else {
        await api.post('/admin/store-types', form)
      }
      setShowForm(false)
      fetchTypes()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this store type? It will be removed from all stores.')) return
    try {
      await api.delete(`/admin/store-types/${id}`)
      fetchTypes()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
    }
  }

  const ICONS = ['🍕', '🍔', '🥪', '🌯', '🥗', '🍣', '🍜', '🍝', '🥖', '🍰', '🥞', '☕', '🥤', '🍦', '🍗', '🦞', '🔥', '🍽️', '🏪', '🛒', '🌮', '🥙', '🫕', '✨']

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Store Types</h1>
        <Button onClick={openCreate}>Add Store Type</Button>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {showForm && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <Input placeholder="Name (e.g. Pizzeria)" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <Input placeholder="Slug (auto-generated if empty)" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} />
            <div>
              <label className="block text-sm text-gray-500 mb-1">Icon</label>
              <div className="flex flex-wrap gap-2">
                {ICONS.map(ic => (
                  <button
                    key={ic}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, icon: ic }))}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg border text-lg transition ${
                      form.icon === ic
                        ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} className="rounded border-gray-300" />
              Active
            </label>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <Card key={i}><CardContent className="p-4"><Skeleton className="h-16 w-full" /></CardContent></Card>)}
        </div>
      ) : types.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No store types yet</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {types.map(type => (
            <Card key={type.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{type.icon}</span>
                  <div>
                    <h3 className="font-semibold">{type.name}</h3>
                    <p className="text-xs text-gray-400 font-mono">{type.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-block w-2 h-2 rounded-full ${type.is_active ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className="text-xs text-gray-400">{type.is_active ? 'Active' : 'Inactive'}</span>
                  {type.stores_count !== undefined && (
                    <span className="text-xs text-gray-400 ml-auto">{type.stores_count} stores</span>
                  )}
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" onClick={() => openEdit(type)}>Edit</Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(type.id)}>Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
