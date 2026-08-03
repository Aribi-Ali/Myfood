'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api-client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

interface Category {
  id: number
  name: string
  short_description: string
  image_url: string | null
}

interface CategoriesResponse {
  data: Category[]
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState<Category | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', short_description: '', image: null as File | null })
  const [saving, setSaving] = useState(false)

  const fetchCategories = () => {
    api.get<CategoriesResponse>('/admin/categories')
      .then(res => setCategories(res.data || []))
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load categories'))
  }

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const res = await api.get<CategoriesResponse>('/admin/categories')
        setCategories(res.data || [])
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load categories')
      }
      setLoading(false)
    })()
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', short_description: '', image: null })
    setShowForm(true)
  }

  const openEdit = (cat: Category) => {
    setEditing(cat)
    setForm({ name: cat.name, short_description: cat.short_description || '', image: null })
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('short_description', form.short_description)
      if (form.image) fd.append('image', form.image)

      if (editing) {
        fd.append('_method', 'PUT')
        await api.post(`/admin/categories/${editing.id}`, fd)
      } else {
        await api.post('/admin/categories', fd)
      }
      setShowForm(false)
      fetchCategories()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this category?')) return
    try {
      await api.delete(`/admin/categories/${id}`)
      fetchCategories()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Button onClick={openCreate}>Add Category</Button>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {showForm && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <Input placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <Input placeholder="Short description" value={form.short_description} onChange={e => setForm(f => ({ ...f, short_description: e.target.value }))} />
            <Input type="file" accept="image/*" onChange={e => setForm(f => ({ ...f, image: e.target.files?.[0] || null }))} />
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4"><Skeleton className="h-32 w-full mb-2" /><Skeleton className="h-4 w-24" /></CardContent>
            </Card>
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No categories yet</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.map(cat => (
            <Card key={cat.id}>
              <CardContent className="p-4">
                {cat.image_url && <img src={cat.image_url} alt={cat.name} className="w-full h-32 object-cover rounded mb-2" />}
                <h3 className="font-semibold">{cat.name}</h3>
                <p className="text-sm text-gray-500">{cat.short_description}</p>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(cat)}>Edit</Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(cat.id)}>Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
