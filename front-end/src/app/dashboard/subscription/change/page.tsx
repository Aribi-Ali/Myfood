'use client'

import { useCallback, useEffect, useState } from 'react'
import { api } from '@/lib/api-client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from 'next/navigation'
import { CheckCircle, CreditCard, ArrowLeft, Percent, Star } from 'lucide-react'
import type { PlanData, PlanTierData, PlanDurationOfferData } from '@/types/api'

export default function ChangePlanPage() {
  const router = useRouter()
  const [plans, setPlans] = useState<PlanData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedTierId, setSelectedTierId] = useState<number | null>(null)
  const [selectedOfferId, setSelectedOfferId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [currentSub, setCurrentSub] = useState<{ plan_tier_id: number } | null>(null)

  const fetchData = useCallback(() => {
    setLoading(true)
    Promise.all([
      api.get<{ data: PlanData[] }>('/owner/subscription/plans'),
      api.get<{ data: { plan_tier_id: number } }>('/owner/subscription').catch(() => ({ data: null })),
    ])
      .then(([plansRes, subRes]) => {
        setPlans(plansRes.data ?? [])
        setCurrentSub(subRes.data)
      })
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load plans'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const activePlans = plans.filter(p => p.is_active)
  const selectedTier = activePlans.flatMap(p => p.tiers ?? []).find(t => t.id === selectedTierId)
  const selectedPlan = activePlans.find(p => (p.tiers ?? []).some(t => t.id === selectedTierId))
  const selectedOffer = selectedTier?.duration_offers?.find(o => o.id === selectedOfferId)

  const basePrice = selectedTier?.monthly_price ?? 0
  const discountPercent = selectedOffer?.discount_percent ?? 0
  const offerMonths = selectedOffer?.months ?? 1
  const totalBeforeDiscount = basePrice * offerMonths
  const discountAmount = totalBeforeDiscount * (discountPercent / 100)
  const taxRate = 0.09 // 9% tax assumption
  const taxAmount = (totalBeforeDiscount - discountAmount) * taxRate
  const total = totalBeforeDiscount - discountAmount + taxAmount

  const handleConfirm = async () => {
    if (!selectedTierId) return
    setSaving(true)
    setError('')
    try {
      await api.post('/owner/subscription/change', {
        plan_tier_id: selectedTierId,
        plan_duration_offer_id: selectedOfferId,
      })
      router.push('/dashboard/subscription')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to change plan')
    }
    setSaving(false)
  }

  const DURATION_OFFERS: PlanDurationOfferData[] = selectedTier?.duration_offers ?? []

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
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
          <h1 className="text-2xl font-bold">Change Plan</h1>
          <p className="text-sm text-gray-500">Choose a subscription plan that fits your needs</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2">
          {error}
        </div>
      )}

      {activePlans.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <CreditCard className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>No plans available yet.</p>
        </div>
      ) : (
        <>
          {/* Plan Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activePlans.map(plan => {
              const isSelected = selectedPlan?.id === plan.id
              const tiers = plan.tiers?.filter(t => t.is_active) ?? []
              return (
                <Card
                  key={plan.id}
                  className={`cursor-pointer transition-all ${
                    isSelected ? 'ring-2 ring-orange-500 shadow-lg' : 'hover:shadow-md'
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-bold">{plan.name}</h2>
                        {plan.description && (
                          <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                        )}
                      </div>
                      {isSelected && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 text-orange-700 px-3 py-1 text-xs font-medium">
                          <CheckCircle className="w-3.5 h-3.5" /> Selected
                        </span>
                      )}
                    </div>

                    {/* Features */}
                    <div className="space-y-2 mb-4">
                      {(plan.features ?? []).map(f => (
                        <div key={f.id} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>{f.name}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tier Selector */}
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-500 uppercase">Select Tier</p>
                      {tiers.map(tier => (
                        <label
                          key={tier.id}
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedTierId === tier.id
                              ? 'border-orange-300 bg-orange-50'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="tier"
                              checked={selectedTierId === tier.id}
                              onChange={() => { setSelectedTierId(tier.id); setSelectedOfferId(null) }}
                              className="text-orange-600"
                            />
                            <div>
                              <p className="font-medium text-sm">{tier.name}</p>
                              <p className="text-xs text-gray-400">
                                {tier.min_orders} – {tier.max_orders ?? '∞'} orders/mo
                              </p>
                            </div>
                          </div>
                          <p className="font-bold">{tier.monthly_price.toLocaleString()} DA</p>
                        </label>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Duration Selector & Price Summary */}
          {selectedTier && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold">Billing Period</h3>

                {/* Duration offers for selected tier */}
                {DURATION_OFFERS.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {DURATION_OFFERS.filter(o => o.is_active).map(offer => (
                      <button
                        key={offer.id}
                        onClick={() => setSelectedOfferId(selectedOfferId === offer.id ? null : offer.id)}
                        className={`relative p-3 rounded-lg border text-center transition-all ${
                          selectedOfferId === offer.id
                            ? 'border-orange-300 bg-orange-50 ring-1 ring-orange-500'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {offer.is_popular && (
                          <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5" /> Popular
                          </span>
                        )}
                        <p className="text-sm font-medium">{offer.months} months</p>
                        <p className="text-xs text-orange-600 font-bold">{offer.discount_percent}% OFF</p>
                        {offer.discount_label && (
                          <p className="text-[10px] text-gray-400 mt-0.5">{offer.discount_label}</p>
                        )}
                      </button>
                    ))}
                    <button
                      onClick={() => setSelectedOfferId(null)}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        selectedOfferId === null
                          ? 'border-orange-300 bg-orange-50 ring-1 ring-orange-500'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <p className="text-sm font-medium">Monthly</p>
                      <p className="text-xs text-gray-400">No discount</p>
                    </button>
                  </div>
                )}

                {/* Price Summary */}
                <div className="rounded-lg bg-gray-50 p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{selectedTier.name} Plan × {offerMonths} month{offerMonths > 1 ? 's' : ''}</span>
                    <span>{totalBeforeDiscount.toLocaleString()} DA</span>
                  </div>
                  {discountPercent > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span className="flex items-center gap-1">
                        <Percent className="w-3.5 h-3.5" /> Discount ({discountPercent}%)
                      </span>
                      <span>-{discountAmount.toLocaleString()} DA</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (9%)</span>
                    <span>{Math.round(taxAmount).toLocaleString()} DA</span>
                  </div>
                  <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>{Math.round(total).toLocaleString()} DA</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    = {Math.round(total / offerMonths).toLocaleString()} DA/month
                  </p>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  disabled={!selectedTierId || saving}
                  onClick={handleConfirm}
                >
                  {saving ? 'Confirming...' : 'Confirm Change'}
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
