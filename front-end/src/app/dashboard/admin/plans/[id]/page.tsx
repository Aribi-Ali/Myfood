'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { api } from '@/lib/api-client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Plus, Trash2, X, Check, Save, Layers, Clock, Tag, DollarSign } from 'lucide-react'
import type { PlanData, PlanTierData, PlanDurationOfferData, PlanFeatureData } from '@/types/api'

type Tab = 'details' | 'tiers' | 'durations'

export default function AdminPlanDetailPage() {
  const params = useParams()
  const router = useRouter()
  const planId = Number(params.id)
  const [plan, setPlan] = useState<PlanData | null>(null)
  const [allFeatures, setAllFeatures] = useState<PlanFeatureData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [tab, setTab] = useState<Tab>('details')

  // Details form
  const [editName, setEditName] = useState('')
  const [editSlug, setEditSlug] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [editActive, setEditActive] = useState(true)
  const [selectedFeatures, setSelectedFeatures] = useState<number[]>([])

  // Tiers
  const [showTierForm, setShowTierForm] = useState(false)
  const [tierName, setTierName] = useState('')
  const [tierMin, setTierMin] = useState('0')
  const [tierMax, setTierMax] = useState('')
  const [tierPrice, setTierPrice] = useState('')
  const [editingTierId, setEditingTierId] = useState<number | null>(null)

  // Duration Offers
  const [showOfferForm, setShowOfferForm] = useState(false)
  const [offerMonths, setOfferMonths] = useState('')
  const [offerDiscount, setOfferDiscount] = useState('')
  const [offerLabel, setOfferLabel] = useState('')
  const [offerPopular, setOfferPopular] = useState(false)
  const [offerTierId, setOfferTierId] = useState('')
  const [editingOfferId, setEditingOfferId] = useState<number | null>(null)

  const [saving, setSaving] = useState(false)

  const fetchData = useCallback(() => {
    setLoading(true)
    Promise.all([
      api.get<{ data: PlanData }>(`/admin/plans/${planId}`),
      api.get<{ data: PlanFeatureData[] }>('/admin/plan-features'),
    ])
      .then(([planRes, featuresRes]) => {
        const p = planRes.data
        setPlan(p)
        setEditName(p.name)
        setEditSlug(p.slug)
        setEditDesc(p.description ?? '')
        setEditActive(p.is_active)
        setSelectedFeatures(p.features?.map(f => f.id) ?? [])
        setAllFeatures(featuresRes.data ?? [])
      })
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load plan'))
      .finally(() => setLoading(false))
  }, [planId])

  useEffect(() => { fetchData() }, [fetchData])

  // ── Details Tab ──────────────────────────────────────────────────────

  const handleSaveDetails = async () => {
    setSaving(true)
    setError('')
    try {
      const res = await api.put<{ data: PlanData }>(`/admin/plans/${planId}`, {
        name: editName,
        slug: editSlug,
        description: editDesc || null,
        is_active: editActive,
        features: selectedFeatures,
      })
      setPlan(res.data)
      setSuccess('Plan updated')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Update failed')
    }
    setSaving(false)
  }

  const toggleFeature = (featureId: number) => {
    setSelectedFeatures(prev =>
      prev.includes(featureId)
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    )
  }

  // ── Tiers Tab ────────────────────────────────────────────────────────

  const resetTierForm = () => {
    setTierName('')
    setTierMin('0')
    setTierMax('')
    setTierPrice('')
    setEditingTierId(null)
    setShowTierForm(false)
  }

  const openTierEdit = (tier: PlanTierData) => {
    setTierName(tier.name)
    setTierMin(String(tier.min_orders))
    setTierMax(tier.max_orders != null ? String(tier.max_orders) : '')
    setTierPrice(String(tier.monthly_price))
    setEditingTierId(tier.id)
    setShowTierForm(true)
  }

  const handleSaveTier = async () => {
    if (!tierName.trim() || !tierPrice) return
    setSaving(true)
    setError('')
    try {
      const payload = {
        name: tierName.trim(),
        min_orders: Number(tierMin),
        max_orders: tierMax ? Number(tierMax) : null,
        monthly_price: Number(tierPrice),
      }
      if (editingTierId) {
        await api.put(`/admin/plans/${planId}/tiers/${editingTierId}`, payload)
      } else {
        await api.post(`/admin/plans/${planId}/tiers`, payload)
      }
      resetTierForm()
      fetchData()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save tier')
    }
    setSaving(false)
  }

  const handleDeleteTier = async (tierId: number) => {
    if (!confirm('Delete this tier?')) return
    try {
      await api.delete(`/admin/plans/${planId}/tiers/${tierId}`)
      fetchData()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete tier')
    }
  }

  const handleToggleTier = async (tier: PlanTierData) => {
    try {
      await api.put(`/admin/plans/${planId}/tiers/${tier.id}`, { is_active: !tier.is_active })
      fetchData()
    } catch { /* ignore */ }
  }

  // ── Duration Offers Tab ──────────────────────────────────────────────

  const resetOfferForm = () => {
    setOfferMonths('')
    setOfferDiscount('')
    setOfferLabel('')
    setOfferPopular(false)
    setOfferTierId('')
    setEditingOfferId(null)
    setShowOfferForm(false)
  }

  const openOfferEdit = (offer: PlanDurationOfferData) => {
    setOfferMonths(String(offer.months))
    setOfferDiscount(String(offer.discount_percent))
    setOfferLabel(offer.discount_label ?? '')
    setOfferPopular(offer.is_popular)
    setOfferTierId(String(offer.plan_tier_id))
    setEditingOfferId(offer.id)
    setShowOfferForm(true)
  }

  const handleSaveOffer = async () => {
    if (!offerMonths || !offerDiscount || !offerTierId) return
    setSaving(true)
    setError('')
    try {
      const payload = {
        months: Number(offerMonths),
        discount_percent: Number(offerDiscount),
        discount_label: offerLabel || null,
        is_popular: offerPopular,
        plan_tier_id: Number(offerTierId),
      }
      if (editingOfferId) {
        await api.put(`/admin/plans/${planId}/duration-offers/${editingOfferId}`, payload)
      } else {
        await api.post(`/admin/plans/${planId}/duration-offers`, payload)
      }
      resetOfferForm()
      fetchData()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save offer')
    }
    setSaving(false)
  }

  const handleDeleteOffer = async (offerId: number) => {
    if (!confirm('Delete this duration offer?')) return
    try {
      await api.delete(`/admin/plans/${planId}/duration-offers/${offerId}`)
      fetchData()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete offer')
    }
  }

  const handleToggleOffer = async (offer: PlanDurationOfferData) => {
    try {
      await api.put(`/admin/plans/${planId}/duration-offers/${offer.id}`, { is_active: !offer.is_active })
      fetchData()
    } catch { /* ignore */ }
  }

  // ── Render ───────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Plan not found</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push('/dashboard/admin/plans')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Plans
        </Button>
      </div>
    )
  }

  const allTiers = plan.tiers ?? []
  const allOffers = allTiers.flatMap(t => (t.duration_offers ?? []).map(o => ({ ...o, tierName: t.name })))

  const TABS: { key: Tab; label: string; icon: typeof Layers }[] = [
    { key: 'details', label: 'Details', icon: Layers },
    { key: 'tiers', label: 'Tiers', icon: DollarSign },
    { key: 'durations', label: 'Duration Offers', icon: Clock },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/admin/plans')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{plan.name}</h1>
          <p className="text-sm text-gray-500">/{plan.slug}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')}><X className="h-4 w-4" /></button>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-2 flex items-center justify-between">
          <span>{success}</span>
          <button onClick={() => setSuccess('')}><X className="h-4 w-4" /></button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border border-gray-200 p-1 w-fit">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === key
                ? 'bg-orange-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {/* Tab: Details */}
      {tab === 'details' && (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-5 space-y-4">
              <h3 className="font-semibold">Plan Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Name" value={editName} onChange={e => setEditName(e.target.value)} />
                <Input label="Slug" value={editSlug} onChange={e => setEditSlug(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                <textarea
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  rows={2}
                  value={editDesc}
                  onChange={e => setEditDesc(e.target.value)}
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editActive}
                  onChange={e => setEditActive(e.target.checked)}
                  className="rounded"
                />
                Active
              </label>
              <Button onClick={handleSaveDetails} disabled={saving}>
                <Save className="w-4 h-4 mr-1" /> {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold mb-3">Features</h3>
              {allFeatures.length === 0 ? (
                <p className="text-sm text-gray-400">No features defined. Create features first.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {allFeatures.map(f => (
                    <label
                      key={f.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedFeatures.includes(f.id)
                          ? 'border-orange-300 bg-orange-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedFeatures.includes(f.id)}
                        onChange={() => toggleFeature(f.id)}
                        className="rounded"
                      />
                      <div>
                        <p className="text-sm font-medium">{f.name}</p>
                        <p className="text-xs text-gray-400">{f.code}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab: Tiers */}
      {tab === 'tiers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Pricing Tiers ({allTiers.length})</h3>
            <Button size="sm" onClick={() => { resetTierForm(); setShowTierForm(true) }}>
              <Plus className="w-4 h-4 mr-1" /> Add Tier
            </Button>
          </div>

          {showTierForm && (
            <Card>
              <CardContent className="p-4 space-y-3">
                <h4 className="font-medium">{editingTierId ? 'Edit Tier' : 'New Tier'}</h4>
                <Input label="Tier Name" value={tierName} onChange={e => setTierName(e.target.value)} placeholder="e.g. Starter" />
                <div className="grid grid-cols-3 gap-3">
                  <Input label="Min Orders" type="number" value={tierMin} onChange={e => setTierMin(e.target.value)} />
                  <Input label="Max Orders" type="number" value={tierMax} onChange={e => setTierMax(e.target.value)} placeholder="Unlimited" />
                  <Input label="Monthly Price (DA)" type="number" value={tierPrice} onChange={e => setTierPrice(e.target.value)} />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveTier} disabled={saving}>
                    {saving ? 'Saving...' : editingTierId ? 'Update' : 'Add Tier'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={resetTierForm}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {allTiers.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <DollarSign className="h-10 w-10 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No tiers yet. Add pricing tiers for this plan.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-600">Name</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Min Orders</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Max Orders</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Monthly Price</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Status</th>
                    <th className="px-4 py-3 font-medium text-gray-600 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {allTiers.map(t => (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{t.name}</td>
                      <td className="px-4 py-3">{t.min_orders}</td>
                      <td className="px-4 py-3">{t.max_orders != null ? t.max_orders : '∞'}</td>
                      <td className="px-4 py-3">{t.monthly_price.toLocaleString()} DA</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleTier(t)}
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                            t.is_active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {t.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openTierEdit(t)} className="p-1.5 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50">
                            <Save className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteTier(t.id)} className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50">
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
      )}

      {/* Tab: Duration Offers */}
      {tab === 'durations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Duration Offers</h3>
            <Button size="sm" onClick={() => { resetOfferForm(); setShowOfferForm(true) }}>
              <Plus className="w-4 h-4 mr-1" /> Add Offer
            </Button>
          </div>

          {showOfferForm && (
            <Card>
              <CardContent className="p-4 space-y-3">
                <h4 className="font-medium">{editingOfferId ? 'Edit Offer' : 'New Duration Offer'}</h4>
                <label className="block text-xs font-medium text-gray-600 mb-1">Tier</label>
                <select
                  value={offerTierId}
                  onChange={e => setOfferTierId(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select tier...</option>
                  {allTiers.filter(t => t.is_active).map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Months" type="number" value={offerMonths} onChange={e => setOfferMonths(e.target.value)} placeholder="e.g. 12" />
                  <Input label="Discount %" type="number" value={offerDiscount} onChange={e => setOfferDiscount(e.target.value)} placeholder="e.g. 35" />
                </div>
                <Input label="Label (optional)" value={offerLabel} onChange={e => setOfferLabel(e.target.value)} placeholder="e.g. Save 35%" />
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={offerPopular}
                    onChange={e => setOfferPopular(e.target.checked)}
                    className="rounded"
                  />
                  Mark as Popular
                </label>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveOffer} disabled={saving}>
                    {saving ? 'Saving...' : editingOfferId ? 'Update' : 'Add Offer'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={resetOfferForm}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {allOffers.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Clock className="h-10 w-10 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No duration offers yet. Add discounts for longer commitment periods.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-600">Tier</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Months</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Discount</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Label</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Popular</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Status</th>
                    <th className="px-4 py-3 font-medium text-gray-600 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {allOffers.map(o => (
                    <tr key={o.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{o.tierName}</td>
                      <td className="px-4 py-3">{o.months}</td>
                      <td className="px-4 py-3">{o.discount_percent}%</td>
                      <td className="px-4 py-3">{o.discount_label ?? '—'}</td>
                      <td className="px-4 py-3">
                        {o.is_popular ? <Tag className="w-4 h-4 text-orange-500" /> : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleOffer(o)}
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                            o.is_active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {o.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openOfferEdit(o)} className="p-1.5 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50">
                            <Save className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteOffer(o.id)} className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50">
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
      )}
    </div>
  )
}
