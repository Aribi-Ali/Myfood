'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api-client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

interface Badge {
  id: number
  name: string
  description: string
  color_code: string
  stores_count?: number
}

interface BadgesResponse {
  data: Badge[]
}

export default function AdminBadgesPage() {
  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState<Badge | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', color_code: '#ef4444' })
  const [saving, setSaving] = useState(false)

  const fetchBadges = () => {
    api.get<BadgesResponse>('/admin/badges')
      .then(res => setBadges(res.data || []))
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load badges'))
  }

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const res = await api.get<BadgesResponse>('/admin/badges')
        setBadges(res.data || [])
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load badges')
      }
      setLoading(false)
    })()
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', description: '', color_code: '#ef4444' })
    setShowForm(true)
  }

  const openEdit = (badge: Badge) => {
    setEditing(badge)
    setForm({ name: badge.name, description: badge.description || '', color_code: badge.color_code })
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    try {
      if (editing) {
        await api.put(`/admin/badges/${editing.id}`, form)
      } else {
        await api.post('/admin/badges', form)
      }
      setShowForm(false)
      fetchBadges()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this badge? It will be removed from all stores.')) return
    try {
      await api.delete(`/admin/badges/${id}`)
      fetchBadges()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Badges</h1>
        <Button onClick={openCreate}>Add Badge</Button>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {showForm && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <Input placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <Input placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-500">Color:</label>
                <input type="color" value={form.color_code} onChange={e => setForm(f => ({ ...f, color_code: e.target.value }))} className="w-10 h-10 rounded border cursor-pointer" />
                <span className="text-sm font-mono">{form.color_code}</span>
              </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Card key={i}><CardContent className="p-4"><Skeleton className="h-16 w-full" /></CardContent></Card>)}
        </div>
      ) : badges.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No badges yet</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {badges.map(badge => (
            <Card key={badge.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: badge.color_code }} />
                  <h3 className="font-semibold">{badge.name}</h3>
                </div>
                <p className="text-sm text-gray-500">{badge.description}</p>
                {badge.stores_count !== undefined && (
                  <p className="text-xs text-gray-400 mt-1">{badge.stores_count} stores</p>
                )}
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(badge)}>Edit</Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(badge.id)}>Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
