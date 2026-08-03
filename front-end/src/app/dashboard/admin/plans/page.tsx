'use client'

import { useCallback, useEffect, useState } from 'react'
import { api } from '@/lib/api-client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from 'next/navigation'
import { Plus, CreditCard, CheckCircle, XCircle, Layers, Package, X } from 'lucide-react'
import type { PlanData, PlanFeatureData } from '@/types/api'

export default function AdminPlansPage() {
  const router = useRouter()
  const [plans, setPlans] = useState<PlanData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [createName, setCreateName] = useState('')
  const [createSlug, setCreateSlug] = useState('')
  const [createDesc, setCreateDesc] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchPlans = useCallback(() => {
    setLoading(true)
    api.get<{ data: PlanData[] }>('/admin/plans')
      .then(res => setPlans(res.data ?? []))
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load plans'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchPlans() }, [fetchPlans])

  const handleCreate = async () => {
    if (!createName.trim() || !createSlug.trim()) return
    setSaving(true)
    setError('')
    try {
      await api.post('/admin/plans', {
        name: createName.trim(),
        slug: createSlug.trim(),
        description: createDesc || null,
      })
      setShowCreate(false)
      setCreateName('')
      setCreateSlug('')
      setCreateDesc('')
      fetchPlans()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create plan')
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Plans</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}><CardContent className="p-4"><Skeleton className="h-32 w-full" /></CardContent></Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Plans</h1>
          <p className="text-sm text-gray-500">{plans.length} subscription plans</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4 mr-1" /> Create Plan
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')}><X className="h-4 w-4" /></button>
        </div>
      )}

      {showCreate && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold">New Subscription Plan</h3>
            <Input label="Plan Name" value={createName} onChange={e => setCreateName(e.target.value)} placeholder="e.g. Menu Only" />
            <Input label="Slug" value={createSlug} onChange={e => setCreateSlug(e.target.value)} placeholder="e.g. menu-only" />
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
              <textarea
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows={2}
                value={createDesc}
                onChange={e => setCreateDesc(e.target.value)}
                placeholder="Describe what this plan offers"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreate} disabled={saving || !createName.trim() || !createSlug.trim()}>
                {saving ? 'Creating...' : 'Create'}
              </Button>
              <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {plans.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>No plans yet. Create your first subscription plan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map(plan => (
            <Card
              key={plan.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => router.push(`/dashboard/admin/plans/${plan.id}`)}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-orange-50">
                      <CreditCard className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                      <p className="text-xs text-gray-400">/{plan.slug}</p>
                    </div>
                  </div>
                  {plan.is_active ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      <CheckCircle className="w-3 h-3" /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                      <XCircle className="w-3 h-3" /> Inactive
                    </span>
                  )}
                </div>
                {plan.description && (
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">{plan.description}</p>
                )}
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5" />
                    {(plan.features ?? []).length} features
                  </span>
                  <span className="flex items-center gap-1">
                    <Package className="w-3.5 h-3.5" />
                    {(plan.tiers ?? []).length} tiers
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
