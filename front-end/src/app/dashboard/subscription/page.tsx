'use client'

import { useCallback, useEffect, useState } from 'react'
import { api } from '@/lib/api-client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from 'next/navigation'
import { CreditCard, CheckCircle, XCircle, AlertTriangle, Calendar, FileText, TrendingUp, Package } from 'lucide-react'
import type { StoreSubscriptionData } from '@/types/api'

const STATUS_STYLES: Record<string, string> = {
  trialing: 'bg-blue-100 text-blue-700',
  active: 'bg-green-100 text-green-700',
  past_due: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-600',
  expired: 'bg-gray-100 text-gray-600',
  suspended: 'bg-red-100 text-red-700',
}

export default function SubscriptionPage() {
  const router = useRouter()
  const [subscription, setSubscription] = useState<StoreSubscriptionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchSubscription = useCallback(() => {
    setLoading(true)
    api.get<{ data: StoreSubscriptionData }>('/owner/subscription')
      .then(res => setSubscription(res.data))
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load subscription'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchSubscription() }, [fetchSubscription])

  const getTrialDaysLeft = (): number | null => {
    if (!subscription?.trial_ends_at) return null
    const now = new Date()
    const end = new Date(subscription.trial_ends_at)
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(0, diff)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Subscription</h1>
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Subscription</h1>
        <Card>
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-10 w-10 mx-auto mb-3 text-red-400" />
            <p className="text-red-600">{error}</p>
            <Button variant="outline" className="mt-4" onClick={fetchSubscription}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!subscription) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Subscription</h1>
        <Card>
          <CardContent className="p-6 text-center">
            <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500 mb-4">No active subscription found.</p>
            <Button onClick={() => router.push('/dashboard/subscription/change')}>
              Get Started
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const tier = subscription.plan_tier
  const plan = tier?.plan
  const trialDaysLeft = getTrialDaysLeft()
  const orderUsage = subscription.current_period_orders ?? 0
  const maxOrders = tier?.max_orders
  const usagePercent = maxOrders ? Math.min((orderUsage / maxOrders) * 100, 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Subscription</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/dashboard/subscription/invoices')}>
            <FileText className="w-4 h-4 mr-1" /> Invoices
          </Button>
          <Button onClick={() => router.push('/dashboard/subscription/change')}>
            <CreditCard className="w-4 h-4 mr-1" /> Change Plan
          </Button>
        </div>
      </div>

      {/* Current Plan Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-orange-50">
                  <CreditCard className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{plan?.name ?? 'Unknown Plan'}</h2>
                  <p className="text-sm text-gray-500">{tier?.name} tier</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{tier?.monthly_price?.toLocaleString() ?? 0} DA</p>
              <p className="text-xs text-gray-500">per month</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${STATUS_STYLES[subscription.status] ?? 'bg-gray-100 text-gray-600'}`}>
              {subscription.status === 'past_due' && <AlertTriangle className="w-4 h-4" />}
              {subscription.status === 'active' && <CheckCircle className="w-4 h-4" />}
              {subscription.status === 'trialing' && <Calendar className="w-4 h-4" />}
              {subscription.status === 'cancelled' && <XCircle className="w-4 h-4" />}
              {subscription.status.replace('_', ' ')}
            </span>
            {subscription.duration_offer && (
              <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 text-purple-700 px-3 py-1 text-sm font-medium">
                {subscription.duration_offer.discount_label ?? `${subscription.duration_offer.months}mo`}
              </span>
            )}
          </div>

          {trialDaysLeft != null && trialDaysLeft > 0 && (
            <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-sm">
              Your trial ends in <strong>{trialDaysLeft} days</strong>. Choose a plan to continue.
            </div>
          )}

          {subscription.status === 'past_due' && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              Your subscription is past due. Please update your payment method to avoid interruption.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Usage */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gray-500" /> Order Usage
            </h3>
            <span className="text-sm text-gray-500">
              {orderUsage} / {maxOrders ?? '∞'} orders
            </span>
          </div>
          {maxOrders ? (
            <>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    usagePercent > 90 ? 'bg-red-500' : usagePercent > 70 ? 'bg-yellow-500' : 'bg-orange-500'
                  }`}
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {orderUsage} of {maxOrders} orders used this period
                {maxOrders - orderUsage > 0 && ` (${maxOrders - orderUsage} remaining)`}
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-500">Unlimited orders in your current plan.</p>
          )}
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-3">Included Features</h3>
          {(!subscription.features || subscription.features.length === 0) ? (
            <p className="text-sm text-gray-400">No features assigned to this plan.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {subscription.features.map(feature => (
                <div key={feature} className="flex items-center gap-2 p-2 rounded-lg bg-green-50">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700 capitalize">{feature.replace(/_/g, ' ')}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
