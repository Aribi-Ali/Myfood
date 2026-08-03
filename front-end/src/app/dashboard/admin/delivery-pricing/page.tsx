'use client'

import { useCallback, useEffect, useState } from 'react'
import { api } from '@/lib/api-client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Save, Plus, Trash2, X, Truck, Percent, DollarSign, CreditCard } from 'lucide-react'
import type { DeliveryPricingTierData, DeliverySettingsData } from '@/types/api'

const MODEL_TYPES = [
  { key: 'all', label: 'All', icon: Truck },
  { key: 'commission', label: 'Commission', icon: Percent },
  { key: 'flat_fee', label: 'Flat Fee', icon: DollarSign },
  { key: 'subscription', label: 'Subscription', icon: CreditCard },
]

export default function AdminDeliveryPricingPage() {
  // Settings
  const [settings, setSettings] = useState<DeliverySettingsData | null>(null)
  const [modelsEnabled, setModelsEnabled] = useState<string[]>([])
  const [commReduction, setCommReduction] = useState('0')
  const [feeReduction, setFeeReduction] = useState('0')

  // Tiers
  const [tiers, setTiers] = useState<DeliveryPricingTierData[]>([])
  const [modelFilter, setModelFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editingTierId, setEditingTierId] = useState<number | null>(null)
  const [formModelType, setFormModelType] = useState<'commission' | 'flat_fee' | 'subscription'>('commission')
  const [formName, setFormName] = useState('')
  const [formMinOrders, setFormMinOrders] = useState('0')
  const [formMaxOrders, setFormMaxOrders] = useState('')
  const [formRate, setFormRate] = useState('')
  const [formMaxDeliveries, setFormMaxDeliveries] = useState('')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchData = useCallback(() => {
    setLoading(true)
    Promise.all([
      api.get<{ data: DeliverySettingsData }>('/admin/delivery-pricing/settings'),
      api.get<{ data: DeliveryPricingTierData[] }>('/admin/delivery-pricing/tiers'),
    ])
      .then(([settingsRes, tiersRes]) => {
        const s = settingsRes.data
        setSettings(s)
        setModelsEnabled(s.models_enabled ?? [])
        setCommReduction(String(s.subscription_commission_reduction ?? 0))
        setFeeReduction(String(s.subscription_flat_fee_reduction ?? 0))
        setTiers(tiersRes.data ?? [])
      })
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load data'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const handleSaveSettings = async () => {
    setSaving(true)
    setError('')
    try {
      const res = await api.put<{ data: DeliverySettingsData }>('/admin/delivery-pricing/settings', {
        models_enabled: modelsEnabled,
        subscription_commission_reduction: Number(commReduction),
        subscription_flat_fee_reduction: Number(feeReduction),
      })
      setSettings(res.data)
      setSuccess('Settings saved')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save settings')
    }
    setSaving(false)
  }

  const toggleModel = (model: string) => {
    setModelsEnabled(prev =>
      prev.includes(model) ? prev.filter(m => m !== model) : [...prev, model]
    )
  }

  const resetForm = () => {
    setFormName('')
    setFormMinOrders('0')
    setFormMaxOrders('')
    setFormRate('')
    setFormMaxDeliveries('')
    setEditingTierId(null)
    setShowForm(false)
  }

  const openEdit = (tier: DeliveryPricingTierData) => {
    setFormModelType(tier.model_type)
    setFormName(tier.name)
    setFormMinOrders(String(tier.min_monthly_orders))
    setFormMaxOrders(tier.max_monthly_orders != null ? String(tier.max_monthly_orders) : '')
    const rate = tier.commission_percent ?? tier.flat_fee_per_delivery ?? tier.monthly_price ?? 0
    setFormRate(String(rate))
    setFormMaxDeliveries(tier.max_deliveries != null ? String(tier.max_deliveries) : '')
    setEditingTierId(tier.id)
    setShowForm(true)
  }

  const handleSaveTier = async () => {
    if (!formName.trim() || !formRate) return
    setSaving(true)
    setError('')
    try {
      const basePayload: Record<string, unknown> = {
        name: formName.trim(),
        model_type: formModelType,
        min_monthly_orders: Number(formMinOrders),
        max_monthly_orders: formMaxOrders ? Number(formMaxOrders) : null,
        max_deliveries: formMaxDeliveries ? Number(formMaxDeliveries) : null,
      }
      if (formModelType === 'commission') basePayload.commission_percent = Number(formRate)
      else if (formModelType === 'flat_fee') basePayload.flat_fee_per_delivery = Number(formRate)
      else basePayload.monthly_price = Number(formRate)

      if (editingTierId) {
        await api.put(`/admin/delivery-pricing/tiers/${editingTierId}`, basePayload)
      } else {
        await api.post('/admin/delivery-pricing/tiers', basePayload)
      }
      resetForm()
      fetchData()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save tier')
    }
    setSaving(false)
  }

  const handleDeleteTier = async (id: number) => {
    if (!confirm('Delete this tier?')) return
    try {
      await api.delete(`/admin/delivery-pricing/tiers/${id}`)
      setTiers(prev => prev.filter(t => t.id !== id))
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete tier')
    }
  }

  const filteredTiers = modelFilter === 'all' ? tiers : tiers.filter(t => t.model_type === modelFilter)

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Delivery Pricing</h1>
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Delivery Pricing</h1>
        <p className="text-sm text-gray-500">Configure delivery pricing models and tiers</p>
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

      {/* Section 1: Settings */}
      <Card>
        <CardContent className="p-5 space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Truck className="w-5 h-5 text-gray-500" /> Settings
          </h3>

          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">Active Pricing Models</p>
            <div className="flex flex-wrap gap-3">
              {['commission', 'flat_fee', 'subscription'].map(model => (
                <label
                  key={model}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-colors ${
                    modelsEnabled.includes(model)
                      ? 'border-orange-300 bg-orange-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={modelsEnabled.includes(model)}
                    onChange={() => toggleModel(model)}
                    className="rounded"
                  />
                  <span className="text-sm font-medium capitalize">{model.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Subscription Commission Reduction (%)"
              type="number"
              value={commReduction}
              onChange={e => setCommReduction(e.target.value)}
              placeholder="e.g. 5"
            />
            <Input
              label="Subscription Flat Fee Reduction (DA)"
              type="number"
              value={feeReduction}
              onChange={e => setFeeReduction(e.target.value)}
              placeholder="e.g. 5"
            />
          </div>

          <Button onClick={handleSaveSettings} disabled={saving}>
            <Save className="w-4 h-4 mr-1" /> {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </CardContent>
      </Card>

      {/* Section 2: Tiers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h3 className="font-semibold">Pricing Tiers</h3>
          <Button size="sm" onClick={() => { resetForm(); setShowForm(true) }}>
            <Plus className="w-4 h-4 mr-1" /> Add Tier
          </Button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 rounded-lg border border-gray-200 p-1 w-fit">
          {MODEL_TYPES.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setModelFilter(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                modelFilter === key
                  ? 'bg-orange-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
        </div>

        {showForm && (
          <Card>
            <CardContent className="p-4 space-y-3">
              <h4 className="font-medium">{editingTierId ? 'Edit Tier' : 'New Tier'}</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Model Type</label>
                  <select
                    value={formModelType}
                    onChange={e => setFormModelType(e.target.value as typeof formModelType)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="commission">Commission</option>
                    <option value="flat_fee">Flat Fee</option>
                    <option value="subscription">Subscription</option>
                  </select>
                </div>
                <Input label="Tier Name" value={formName} onChange={e => setFormName(e.target.value)} placeholder="e.g. Bronze" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Input label="Min Orders" type="number" value={formMinOrders} onChange={e => setFormMinOrders(e.target.value)} />
                <Input label="Max Orders" type="number" value={formMaxOrders} onChange={e => setFormMaxOrders(e.target.value)} placeholder="∞" />
                <Input
                  label={formModelType === 'commission' ? 'Commission %' : formModelType === 'flat_fee' ? 'Fee (DA)' : 'Price (DA)'}
                  type="number"
                  value={formRate}
                  onChange={e => setFormRate(e.target.value)}
                />
                <Input label="Max Deliveries" type="number" value={formMaxDeliveries} onChange={e => setFormMaxDeliveries(e.target.value)} placeholder="∞" />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveTier} disabled={saving}>
                  {saving ? 'Saving...' : editingTierId ? 'Update' : 'Add Tier'}
                </Button>
                <Button size="sm" variant="outline" onClick={resetForm}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {filteredTiers.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Truck className="h-10 w-10 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No tiers for this model type.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium text-gray-600">Model</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Name</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Order Range</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Rate</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Max Deliv.</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="px-4 py-3 font-medium text-gray-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTiers.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="capitalize text-xs font-medium bg-gray-100 px-2 py-0.5 rounded">{t.model_type.replace('_', ' ')}</span>
                    </td>
                    <td className="px-4 py-3 font-medium">{t.name}</td>
                    <td className="px-4 py-3">{t.min_monthly_orders} – {t.max_monthly_orders ?? '∞'}</td>
                    <td className="px-4 py-3">
                      {t.commission_percent != null ? `${t.commission_percent}%` : ''}
                      {t.flat_fee_per_delivery != null ? `${t.flat_fee_per_delivery} DA/del` : ''}
                      {t.monthly_price != null ? `${t.monthly_price.toLocaleString()} DA/mo` : ''}
                    </td>
                    <td className="px-4 py-3">{t.max_deliveries ?? '∞'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                        t.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {t.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(t)} className="p-1.5 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50">
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
    </div>
  )
}
