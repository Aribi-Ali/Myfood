'use client'

import { useCallback, useEffect, useState } from 'react'
import { api } from '@/lib/api-client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Trash2, Edit3, X, Check, Tag } from 'lucide-react'
import type { PlanFeatureData } from '@/types/api'

export default function AdminPlanFeaturesPage() {
  const [features, setFeatures] = useState<PlanFeatureData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formCode, setFormCode] = useState('')
  const [formName, setFormName] = useState('')
  const [formDesc, setFormDesc] = useState('')
  const [formIcon, setFormIcon] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchFeatures = useCallback(() => {
    setLoading(true)
    api.get<{ data: PlanFeatureData[] }>('/admin/plan-features')
      .then(res => setFeatures(res.data ?? []))
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load features'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchFeatures() }, [fetchFeatures])

  const resetForm = () => {
    setFormCode('')
    setFormName('')
    setFormDesc('')
    setFormIcon('')
    setEditingId(null)
    setShowForm(false)
  }

  const openEdit = (f: PlanFeatureData) => {
    setFormCode(f.code)
    setFormName(f.name)
    setFormDesc(f.description ?? '')
    setFormIcon(f.icon ?? '')
    setEditingId(f.id)
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!formCode.trim() || !formName.trim()) return
    setSaving(true)
    setError('')
    try {
      const payload = { code: formCode.trim(), name: formName.trim(), description: formDesc || null, icon: formIcon || null }
      if (editingId) {
        await api.put(`/admin/plan-features/${editingId}`, payload)
      } else {
        await api.post('/admin/plan-features', payload)
      }
      resetForm()
      fetchFeatures()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save feature')
    }
    setSaving(false)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this feature? It will be removed from all plans.')) return
    try {
      await api.delete(`/admin/plan-features/${id}`)
      setFeatures(prev => prev.filter(f => f.id !== id))
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete')
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Plan Features</h1>
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Plan Features</h1>
          <p className="text-sm text-gray-500">{features.length} master features</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true) }}>
          <Plus className="w-4 h-4 mr-1" /> Add Feature
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')}><X className="h-4 w-4" /></button>
        </div>
      )}

      {showForm && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold">{editingId ? 'Edit Feature' : 'New Feature'}</h3>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Code" value={formCode} onChange={e => setFormCode(e.target.value)} placeholder="e.g. online_ordering" />
              <Input label="Name" value={formName} onChange={e => setFormName(e.target.value)} placeholder="e.g. Online Orders" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
              <textarea
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows={2}
                value={formDesc}
                onChange={e => setFormDesc(e.target.value)}
              />
            </div>
            <Input label="Icon (optional)" value={formIcon} onChange={e => setFormIcon(e.target.value)} placeholder="e.g. shopping-cart" />
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving || !formCode.trim() || !formName.trim()}>
                {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </Button>
              <Button variant="outline" onClick={resetForm}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {features.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Tag className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>No features defined yet. Create features that can be assigned to subscription plans.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-600">Code</th>
                <th className="px-4 py-3 font-medium text-gray-600">Name</th>
                <th className="px-4 py-3 font-medium text-gray-600">Description</th>
                <th className="px-4 py-3 font-medium text-gray-600">Icon</th>
                <th className="px-4 py-3 font-medium text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {features.map(f => (
                <tr key={f.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{f.code}</td>
                  <td className="px-4 py-3 font-medium">{f.name}</td>
                  <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{f.description ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-400">{f.icon ?? '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(f)} className="p-1.5 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(f.id)} className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
