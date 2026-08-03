'use client'

import { useCallback, useEffect, useState } from 'react'
import { api } from '@/lib/api-client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CreditCard, Trash2, CheckCircle, X, Star, Plus } from 'lucide-react'
import type { PaymentMethodData, PaymentGatewayData } from '@/types/api'

export default function PaymentMethodsPage() {
  const router = useRouter()
  const [methods, setMethods] = useState<PaymentMethodData[]>([])
  const [gateways, setGateways] = useState<PaymentGatewayData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedGatewayId, setSelectedGatewayId] = useState<number | null>(null)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const fetchData = useCallback(() => {
    setLoading(true)
    Promise.all([
      api.get<{ data: { payment_methods: PaymentMethodData[] } }>('/owner/subscription'),
      api.get<{ data: PaymentGatewayData[] }>('/admin/payment-gateways'),
    ])
      .then(([subRes, gatesRes]) => {
        setMethods(subRes.data?.payment_methods ?? [])
        setGateways((gatesRes.data ?? []).filter(g => g.is_active))
      })
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load data'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const resetForm = () => {
    setSelectedGatewayId(null)
    setFormData({})
    setShowForm(false)
  }

  const selectedGateway = gateways.find(g => g.id === selectedGatewayId)

  const getGatewayFields = (): { key: string; label: string; type: string }[] => {
    if (!selectedGateway) return []
    const gwCode = selectedGateway.code
    if (gwCode === 'cash') {
      return [{ key: 'notes', label: 'Notes (optional)', type: 'text' }]
    }
    if (gwCode === 'satim' || gwCode === 'bank_transfer') {
      return [
        { key: 'account_name', label: 'Account Name', type: 'text' },
        { key: 'account_number', label: 'Account Number', type: 'text' },
        { key: 'bank_name', label: 'Bank Name', type: 'text' },
        { key: 'rib', label: 'RIB / IBAN', type: 'text' },
      ]
    }
    return [{ key: 'details', label: 'Payment Details', type: 'text' }]
  }

  const handleAddMethod = async () => {
    if (!selectedGatewayId) return
    setSaving(true)
    setError('')
    try {
      await api.post('/owner/subscription/payment-methods', {
        gateway_id: selectedGatewayId,
        type: selectedGateway?.code ?? 'other',
        details: formData,
      })
      setSuccess('Payment method added')
      resetForm()
      fetchData()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to add method')
    }
    setSaving(false)
  }

  const handleDeleteMethod = async (id: number) => {
    if (!confirm('Delete this payment method?')) return
    try {
      await api.delete(`/owner/subscription/payment-methods/${id}`)
      setMethods(prev => prev.filter(m => m.id !== id))
      setSuccess('Payment method deleted')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete')
    }
  }

  const handleSetDefault = async (id: number) => {
    try {
      await api.post(`/owner/subscription/payment-methods/${id}/set-default`)
      setMethods(prev => prev.map(m => ({ ...m, is_default: m.id === id })))
      setSuccess('Default payment method updated')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to set default')
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/subscription')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Payment Methods</h1>
          <p className="text-sm text-gray-500">Manage how you pay for your subscription</p>
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

      {/* Saved Methods */}
      {methods.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold">Saved Methods ({methods.length})</h3>
          {methods.map(method => (
            <Card key={method.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-50">
                      <CreditCard className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{method.gateway?.name ?? method.type}</p>
                        {method.is_default && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 text-orange-700 px-2 py-0.5 text-xs font-medium">
                            <Star className="w-3 h-3" /> Default
                          </span>
                        )}
                        {method.is_verified && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-xs font-medium">
                            <CheckCircle className="w-3 h-3" /> Verified
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 capitalize">{method.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {!method.is_default && (
                      <Button size="sm" variant="outline" onClick={() => handleSetDefault(method.id)}>
                        Set Default
                      </Button>
                    )}
                    <button
                      onClick={() => handleDeleteMethod(method.id)}
                      className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Method Form */}
      {!showForm ? (
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-1" /> Add Payment Method
        </Button>
      ) : (
        <Card>
          <CardContent className="p-5 space-y-4">
            <h3 className="font-semibold">Add Payment Method</h3>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Payment Gateway</label>
              <select
                value={selectedGatewayId ?? ''}
                onChange={e => { setSelectedGatewayId(e.target.value ? Number(e.target.value) : null); setFormData({}) }}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select gateway...</option>
                {gateways.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>

            {selectedGateway && (
              <div className="space-y-3">
                <p className="text-xs text-gray-500">
                  Configure your {selectedGateway.name} payment details
                </p>
                {getGatewayFields().map(field => (
                  <Input
                    key={field.key}
                    label={field.label}
                    type={field.type}
                    value={formData[field.key] ?? ''}
                    onChange={e => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                  />
                ))}
                <div className="flex gap-2">
                  <Button onClick={handleAddMethod} disabled={saving}>
                    {saving ? 'Adding...' : 'Add Method'}
                  </Button>
                  <Button variant="outline" onClick={resetForm}>Cancel</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {methods.length === 0 && !showForm && (
        <Card>
          <CardContent className="p-6 text-center">
            <CreditCard className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500 mb-2">No payment methods saved.</p>
            <p className="text-xs text-gray-400">Add a payment method to manage your subscription payments.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
