'use client'

import { useCallback, useEffect, useState } from 'react'
import { api } from '@/lib/api-client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from 'next/navigation'
import {
  TrendingUp, DollarSign, Percent, CreditCard, Target,
  ArrowRight, X, CheckCircle, BarChart3, History, Star,
} from 'lucide-react'
import type { DeliveryPricingData, DeliveryEarningsData, DeliveryPricingTierData, DeliverySettingsData } from '@/types/api'

const MODEL_ICONS: Record<string, typeof Percent> = {
  commission: Percent,
  flat_fee: DollarSign,
  subscription: CreditCard,
}

export default function EarningsPage() {
  const router = useRouter()
  const [pricing, setPricing] = useState<DeliveryPricingData | null>(null)
  const [earnings, setEarnings] = useState<DeliveryEarningsData | null>(null)
  const [settings, setSettings] = useState<DeliverySettingsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Choose model modal
  const [showChooseModel, setShowChooseModel] = useState(false)
  const [allTiers, setAllTiers] = useState<DeliveryPricingTierData[]>([])
  const [availableModels, setAvailableModels] = useState<string[]>([])

  // Subscribe modal
  const [showSubscribe, setShowSubscribe] = useState(false)
  const [selectedSubTier, setSelectedSubTier] = useState<number | null>(null)
  const [subMonths, setSubMonths] = useState(1)
  const [saving, setSaving] = useState(false)

  const fetchData = useCallback(() => {
    setLoading(true)
    setError('')
    Promise.all([
      api.get<{ data: DeliveryPricingData }>('/delivery/pricing'),
      api.get<{ data: DeliveryEarningsData }>('/delivery/pricing/earnings'),
      api.get<{ data: DeliverySettingsData }>('/admin/delivery-pricing/settings'),
      api.get<{ data: DeliveryPricingTierData[] }>('/admin/delivery-pricing/tiers'),
    ])
      .then(([pricingRes, earningsRes, settingsRes, tiersRes]) => {
        setPricing(pricingRes.data)
        setEarnings(earningsRes.data)
        setSettings(settingsRes.data)
        setAllTiers(tiersRes.data ?? [])
        setAvailableModels(settingsRes.data?.models_enabled ?? [])
      })
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load data'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  // Choose model
  const handleChooseModel = async (model: string) => {
    setSaving(true)
    setError('')
    try {
      await api.post('/delivery/pricing/choose-model', { model_type: model })
      setSuccess(`Switched to ${model.replace('_', ' ')} model`)
      setShowChooseModel(false)
      fetchData()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to switch model')
    }
    setSaving(false)
  }

  // Subscribe
  const handleSubscribe = async () => {
    if (!selectedSubTier) return
    setSaving(true)
    setError('')
    try {
      await api.post('/delivery/pricing/subscribe', {
        tier_id: selectedSubTier,
        months: subMonths,
      })
      setSuccess('Subscribed successfully')
      setShowSubscribe(false)
      fetchData()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to subscribe')
    }
    setSaving(false)
  }

  const currentModel = pricing?.pricing_model
  const currentTier = pricing?.current_tier
  const subData = pricing?.subscription
  const currentMonth = earnings?.current_month

  // Next tier info
  const sortedTiers = [...allTiers]
    .filter(t => t.model_type === (currentModel ?? 'commission') && t.is_active)
    .sort((a, b) => a.min_monthly_orders - b.min_monthly_orders)

  const currentTierIndex = sortedTiers.findIndex(t => t.id === currentTier?.id)
  const nextTier = currentTierIndex >= 0 && currentTierIndex < sortedTiers.length - 1
    ? sortedTiers[currentTierIndex + 1]
    : null

  const ordersToNext = nextTier
    ? Math.max(0, nextTier.min_monthly_orders - (pricing?.current_month_orders ?? 0))
    : 0

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Earnings</h1>
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  const ModelIcon = currentModel ? MODEL_ICONS[currentModel] ?? TrendingUp : TrendingUp

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Earnings</h1>
          <p className="text-sm text-gray-500">Track your delivery earnings and pricing model</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/dashboard/earnings/history')}>
            <History className="w-4 h-4 mr-1" /> History
          </Button>
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

      {/* Current Pricing Model Badge */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-orange-50">
                <ModelIcon className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Current Pricing Model</p>
                <p className="font-semibold capitalize">
                  {currentModel ? currentModel.replace('_', ' ') : 'Not set'}
                  {currentTier && ` — ${currentTier.name}`}
                </p>
                {currentTier && (
                  <p className="text-xs text-gray-400">
                    {currentTier.commission_percent != null && `${currentTier.commission_percent}% per delivery`}
                    {currentTier.flat_fee_per_delivery != null && `${currentTier.flat_fee_per_delivery} DA/delivery`}
                    {currentTier.monthly_price != null && `${currentTier.monthly_price.toLocaleString()} DA/month`}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {currentModel && (
                <Button variant="outline" size="sm" onClick={() => setShowChooseModel(true)}>
                  Change Model <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              )}
              {subData && (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-700 px-3 py-1 text-sm font-medium">
                  <CheckCircle className="w-4 h-4" /> Subscribed
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tier Progression */}
      {currentTier && nextTier && (
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <Target className="w-5 h-5 text-orange-500" />
              <div>
                <p className="font-semibold text-sm">Tier Progression</p>
                <p className="text-xs text-gray-500">
                  {pricing?.current_month_orders ?? 0} deliveries this month — {currentTier.name}
                  {ordersToNext > 0 && ` — ${ordersToNext} more to reach ${nextTier.name}`}
                </p>
              </div>
            </div>
            {nextTier && (
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-orange-500 transition-all"
                  style={{
                    width: `${Math.min(
                      ((pricing?.current_month_orders ?? 0) - currentTier.min_monthly_orders) /
                      Math.max(nextTier.min_monthly_orders - currentTier.min_monthly_orders, 1) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Earnings Breakdown */}
      {currentMonth && (
        <Card>
          <CardContent className="p-5">
            <h3 className="font-semibold flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-green-500" /> This Month's Earnings
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-500">Deliveries</p>
                <p className="text-2xl font-bold">{currentMonth.deliveries}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Gross Fees</p>
                <p className="text-2xl font-bold">{currentMonth.gross_fees.toLocaleString()} DA</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Platform Fee</p>
                <p className="text-2xl font-bold text-red-500">{currentMonth.platform_fee.toLocaleString()} DA</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">You Earn</p>
                <p className="text-2xl font-bold text-green-600">{currentMonth.net_earnings.toLocaleString()} DA</p>
              </div>
            </div>
            {currentMonth.platform_fee > 0 && (
              <div className="mt-3 p-3 rounded-lg bg-gray-50 text-sm">
                <p className="text-gray-500">
                  Platform fee:{' '}
                  {currentTier?.commission_percent
                    ? `${currentTier.commission_percent}% of gross`
                    : `${currentTier?.flat_fee_per_delivery ?? 0} DA/delivery`
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Subscription CTA */}
      {!subData && availableModels.includes('subscription') && (
        <Card className="border-dashed border-2 border-orange-200 bg-orange-50/30">
          <CardContent className="p-5">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-orange-100">
                  <CreditCard className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Switch to Subscription</h3>
                  <p className="text-sm text-gray-600">
                    Save on platform fees with a monthly subscription.
                    {settings && settings.subscription_commission_reduction > 0 && (
                      <> Get {settings.subscription_commission_reduction}% reduced commission rate.</>
                    )}
                  </p>
                </div>
              </div>
              <Button onClick={() => setShowSubscribe(true)}>
                Subscribe <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Choose Model Modal */}
      {showChooseModel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowChooseModel(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Choose Pricing Model</h3>
              <button onClick={() => setShowChooseModel(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              {availableModels.map(model => {
                const Icon = MODEL_ICONS[model] ?? TrendingUp
                const modelTiers = allTiers.filter(t => t.model_type === model && t.is_active)
                const defaultTier = modelTiers[0]
                return (
                  <button
                    key={model}
                    onClick={() => handleChooseModel(model)}
                    disabled={saving || model === currentModel}
                    className={`w-full flex items-center gap-4 p-4 rounded-lg border text-left transition-colors ${
                      model === currentModel
                        ? 'border-orange-300 bg-orange-50'
                        : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                    } ${model === currentModel ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    <div className="p-2 rounded-lg bg-gray-50">
                      <Icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium capitalize">{model.replace('_', ' ')}</p>
                      <p className="text-xs text-gray-500">
                        {defaultTier?.commission_percent != null && `${defaultTier.commission_percent}% per delivery`}
                        {defaultTier?.flat_fee_per_delivery != null && `${defaultTier.flat_fee_per_delivery} DA/delivery`}
                        {defaultTier?.monthly_price != null && `${defaultTier.monthly_price.toLocaleString()} DA/month`}
                        {!defaultTier && 'No tiers configured'}
                      </p>
                    </div>
                    {model === currentModel && (
                      <span className="text-xs text-orange-600 font-medium">Current</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Subscribe Modal */}
      {showSubscribe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowSubscribe(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Subscribe</h3>
              <button onClick={() => setShowSubscribe(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Select Tier</label>
                <select
                  value={selectedSubTier ?? ''}
                  onChange={e => setSelectedSubTier(e.target.value ? Number(e.target.value) : null)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Choose...</option>
                  {allTiers.filter(t => t.model_type === 'subscription' && t.is_active).map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} — {t.monthly_price?.toLocaleString()} DA/month
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Duration</label>
                <div className="flex gap-2">
                  {[1, 3, 6, 12].map(m => (
                    <button
                      key={m}
                      onClick={() => setSubMonths(m)}
                      className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        subMonths === m
                          ? 'border-orange-300 bg-orange-50 text-orange-700'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {m}mo
                      {m === 3 && <span className="block text-[10px] text-green-600">-10%</span>}
                      {m === 6 && <span className="block text-[10px] text-green-600">-20%</span>}
                      {m === 12 && <span className="block text-[10px] text-green-600">-35%</span>}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                className="w-full"
                onClick={handleSubscribe}
                disabled={!selectedSubTier || saving}
              >
                {saving ? 'Subscribing...' : 'Confirm Subscription'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
