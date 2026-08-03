'use client'

import { useCallback, useEffect, useState } from 'react'
import { api } from '@/lib/api-client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { CreditCard, ToggleLeft, ToggleRight, Save, ChevronDown, ChevronUp, X, Globe } from 'lucide-react'
import type { PaymentGatewayData } from '@/types/api'

export default function AdminPaymentGatewaysPage() {
  const [gateways, setGateways] = useState<PaymentGatewayData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [configForms, setConfigForms] = useState<Record<number, Record<string, string>>>({})

  const fetchGateways = useCallback(() => {
    setLoading(true)
    api.get<{ data: PaymentGatewayData[] }>('/admin/payment-gateways')
      .then(res => {
        setGateways(res.data ?? [])
        // Init config forms from existing config
        const forms: Record<number, Record<string, string>> = {}
        for (const g of res.data ?? []) {
          if (g.config && typeof g.config === 'object') {
            forms[g.id] = Object.fromEntries(
              Object.entries(g.config as Record<string, unknown>).map(([k, v]) => [k, String(v ?? '')])
            )
          } else {
            forms[g.id] = {}
          }
        }
        setConfigForms(forms)
      })
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load gateways'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchGateways() }, [fetchGateways])

  const handleToggleActive = async (gw: PaymentGatewayData) => {
    try {
      await api.put(`/admin/payment-gateways/${gw.id}`, { is_active: !gw.is_active })
      setGateways(prev => prev.map(g => g.id === gw.id ? { ...g, is_active: !g.is_active } : g))
      setSuccess(`${gw.name} ${gw.is_active ? 'deactivated' : 'activated'}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to toggle')
    }
  }

  const handleSaveConfig = async (gw: PaymentGatewayData) => {
    try {
      const formData = configForms[gw.id] ?? {}
      const config: Record<string, string> = {}
      for (const [k, v] of Object.entries(formData)) {
        if (v) config[k] = v
      }
      await api.put(`/admin/payment-gateways/${gw.id}`, { config })
      setSuccess(`${gw.name} configuration saved`)
      fetchGateways()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save config')
    }
  }

  const updateConfigField = (gwId: number, field: string, value: string) => {
    setConfigForms(prev => ({
      ...prev,
      [gwId]: { ...(prev[gwId] ?? {}), [field]: value },
    }))
  }

  // Determine config fields to show based on gateway code
  const getConfigFields = (gw: PaymentGatewayData): { key: string; label: string; type: string }[] => {
    if (gw.code === 'cash' || !gw.config) return []
    // Common config fields for gateways
    const fields: { key: string; label: string; type: string }[] = []
    const existingKeys = gw.config ? Object.keys(gw.config as Record<string, unknown>) : []
    if (existingKeys.includes('api_key') || existingKeys.length === 0) {
      fields.push({ key: 'api_key', label: 'API Key', type: 'password' })
    }
    if (existingKeys.includes('api_secret')) {
      fields.push({ key: 'api_secret', label: 'API Secret', type: 'password' })
    }
    if (existingKeys.includes('merchant_id')) {
      fields.push({ key: 'merchant_id', label: 'Merchant ID', type: 'text' })
    }
    if (existingKeys.includes('mode')) {
      fields.push({ key: 'mode', label: 'Mode', type: 'text' })
    }
    if (existingKeys.includes('endpoint')) {
      fields.push({ key: 'endpoint', label: 'API Endpoint', type: 'text' })
    }
    // Add any other keys not predefined
    for (const key of existingKeys) {
      if (!['api_key', 'api_secret', 'merchant_id', 'mode', 'endpoint'].includes(key)) {
        fields.push({ key, label: key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), type: 'text' })
      }
    }
    return fields
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Payment Gateways</h1>
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}><CardContent className="p-5"><Skeleton className="h-24 w-full" /></CardContent></Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Payment Gateways</h1>
        <p className="text-sm text-gray-500">Configure payment gateway integrations</p>
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

      <div className="grid gap-4 md:grid-cols-2">
        {gateways.map(gw => {
          const isExpanded = expandedId === gw.id
          const configFields = getConfigFields(gw)
          return (
            <Card key={gw.id}>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-orange-50">
                      <CreditCard className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{gw.name}</h3>
                      <p className="text-xs text-gray-400 font-mono">{gw.code}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleActive(gw)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      gw.is_active ? 'text-green-600 hover:bg-green-50' : 'text-gray-300 hover:bg-gray-100'
                    }`}
                    title={gw.is_active ? 'Deactivate' : 'Activate'}
                  >
                    {gw.is_active ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                  </button>
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ${
                    gw.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {gw.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <span>Sort: {gw.sort_order}</span>
                  {gw.supported_currencies && gw.supported_currencies.length > 0 && (
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3" /> {gw.supported_currencies.join(', ')}
                    </span>
                  )}
                </div>

                {configFields.length > 0 && (
                  <>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : gw.id)}
                      className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      Configure
                    </button>

                    {isExpanded && (
                      <div className="space-y-3 pt-2 border-t border-gray-100">
                        {configFields.map(field => (
                          <Input
                            key={field.key}
                            label={field.label}
                            type={field.type}
                            value={configForms[gw.id]?.[field.key] ?? ''}
                            onChange={e => updateConfigField(gw.id, field.key, e.target.value)}
                          />
                        ))}
                        <Button size="sm" onClick={() => handleSaveConfig(gw)}>
                          <Save className="w-4 h-4 mr-1" /> Save Config
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {gateways.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <CreditCard className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>No payment gateways configured.</p>
        </div>
      )}
    </div>
  )
}
