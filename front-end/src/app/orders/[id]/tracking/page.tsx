'use client'

import { useEffect, useState, useRef, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth'
import { useLanguage } from '@/contexts/language'
import { api } from '@/lib/api-client'
import { formatPrice } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Bike, MapPin, Phone, Clock, CheckCircle2, Circle, PackageCheck, ShoppingBag, ChefHat, Store, AlertTriangle } from 'lucide-react'

interface OrderDetail {
  id: number
  store_order_number: string
  order_number_formatted?: string
  status: string
  status_label: string
  delivery_type: 'delivery' | 'pickup'
  total_amount: number
  discount_amount: number
  delivery_fee: number
  address: string | null
  phone: string | null
  notes: string | null
  estimated_delivery_minutes: number | null
  created_at: string
  store: { id: number; name: string; alias: string; phone?: string | null }
  items: { id: number; food: { name: string; image?: string | null }; quantity: number; price: number; subtotal: number }[]
  delivery_guy: { id: number; name: string; phone?: string | null; transporter_type?: string | null } | null
  promo_code: { code: string; discount: number } | null
}

const STATUS_ORDER: Record<string, number> = {
  pending: 0, confirmed: 1, preparing: 2, ready: 3, delivering: 4, delivered: 5, cancelled: -1,
}

function useSteps(t: (key: string, params?: Record<string, string | number>) => string) {
  return useMemo(() => {
    const deliverySteps = [
      { status: 'pending', label: t('tracking_delivery_pending'), icon: ShoppingBag },
      { status: 'confirmed', label: t('tracking_delivery_confirmed'), icon: CheckCircle2 },
      { status: 'preparing', label: t('tracking_delivery_preparing'), icon: ChefHat },
      { status: 'ready', label: t('tracking_delivery_ready'), icon: PackageCheck },
      { status: 'delivering', label: t('tracking_delivery_delivering'), icon: Bike },
      { status: 'delivered', label: t('tracking_delivery_delivered'), icon: CheckCircle2 },
    ]
    const pickupSteps = [
      { status: 'pending', label: t('tracking_delivery_pending'), icon: ShoppingBag },
      { status: 'confirmed', label: t('tracking_delivery_confirmed'), icon: CheckCircle2 },
      { status: 'preparing', label: t('tracking_delivery_preparing'), icon: ChefHat },
      { status: 'ready', label: t('tracking_pickup_ready'), icon: PackageCheck },
      { status: 'delivered', label: t('tracking_pickup_delivered'), icon: CheckCircle2 },
    ]
    return { deliverySteps, pickupSteps }
  }, [t])
}

export default function OrderTrackingPage() {
  const { id } = useParams<{ id: string }>()
  const { user, loading: authLoading } = useAuth()
  const { t } = useLanguage()
  const { deliverySteps: STEPS_DELIVERY, pickupSteps: STEPS_PICKUP } = useSteps(t)
  const router = useRouter()
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [complaintOpen, setComplaintOpen] = useState(false)
  const [complaintSubject, setComplaintSubject] = useState('')
  const [complaintDesc, setComplaintDesc] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [complaintDone, setComplaintDone] = useState(false)
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!authLoading && !user) { router.push('/login'); return }
    if (!user || !id) return
    ;(async () => {
      try {
        const res = await api.get<{ data: OrderDetail }>(`/client/orders/${id}`)
        setOrder(res.data)
      } catch {
        setError(t('tracking_not_found'))
      }
      setFetching(false)
    })()
  }, [user, authLoading, router, id])

  // Auto-poll
  useEffect(() => {
    if (!order || order.status === 'delivered' || order.status === 'cancelled') return
    pollingRef.current = setInterval(async () => {
      try {
        const res = await api.get<{ data: OrderDetail }>(`/client/orders/${id}`)
        setOrder(res.data)
      } catch { /* ignore */ }
    }, 5000)
    return () => { if (pollingRef.current) clearInterval(pollingRef.current) }
  }, [order?.status, id])

  async function submitComplaint() {
    if (!complaintSubject || !complaintDesc) return
    setSubmitting(true)
    try {
      await api.post(`/client/orders/${id}/complaint`, {
        subject: complaintSubject,
        description: complaintDesc,
      })
      setComplaintDone(true)
      setComplaintOpen(false)
    } catch { /* ignore */ }
    setSubmitting(false)
  }

  if (authLoading || fetching) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 p-6">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-72" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <Card>
          <CardContent className="p-8 text-center text-red-600">{error || t('tracking_not_found')}</CardContent>
        </Card>
      </div>
    )
  }

  const steps = order.delivery_type === 'delivery' ? STEPS_DELIVERY : STEPS_PICKUP
  const currentStep = STATUS_ORDER[order.status] ?? -1
  const isTerminal = order.status === 'delivered' || order.status === 'cancelled'
  const isCancelled = order.status === 'cancelled'

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('tracking_order_number', { id: order.order_number_formatted || order.store_order_number || order.id })}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{order.store.name} &bull; {new Date(order.created_at).toLocaleDateString()}</p>
        </div>
        {order.estimated_delivery_minutes && order.status !== 'delivered' && order.status !== 'cancelled' && (
          <div className="flex items-center gap-1.5 text-sm text-orange-600 bg-orange-50 dark:bg-orange-900/30 rounded-full px-3 py-1.5">
            <Clock className="h-4 w-4" />
            <span className="font-medium">{t('time_min_abbr', { time: order.estimated_delivery_minutes })}</span>
          </div>
        )}
      </div>

      {/* Status Timeline */}
      <Card>
        <CardContent className="p-6">
          {isCancelled ? (
            <div className="text-center py-4">
              <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <p className="mt-3 text-lg font-semibold text-red-600">{t('tracking_order_cancelled')}</p>
            </div>
          ) : (
            <div className="relative">
              {/* Progress line */}
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
              <div
                className="absolute left-5 top-0 w-0.5 bg-orange-500 transition-all duration-700"
                style={{ height: `${Math.max(0, currentStep / (steps.length - 1)) * 100}%` }}
              />

              <div className="space-y-6 relative">
                {steps.map((step, i) => {
                  const isActive = i <= currentStep
                  const isCurrent = i === currentStep
                  const Icon = step.icon
                  return (
                    <div key={step.status} className="flex items-start gap-4 pl-1">
                      <div
                        className={`relative z-10 h-10 w-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                          isActive
                            ? isCurrent
                              ? 'bg-orange-500 ring-4 ring-orange-100 dark:ring-orange-900/30'
                              : 'bg-orange-500'
                            : 'bg-gray-100 dark:bg-gray-800'
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`} />
                      </div>
                      <div className="pt-1.5">
                        <p className={`text-sm font-medium ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>
                          {step.label}
                        </p>
                        {isCurrent && (
                          <p className="text-xs text-orange-600 mt-0.5">{t('tracking_current')}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delivery / Rider Info */}
      {(() => {
        const deliveryGuy = order.delivery_guy
        if (!deliveryGuy || order.delivery_type !== 'delivery') return null
        return (
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">{t('tracking_rider_title')}</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <Bike className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{deliveryGuy.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{deliveryGuy.transporter_type || t('tracking_delivery_label')}</p>
                  </div>
                </div>
                {deliveryGuy.phone && (
                  <Button variant="outline" size="sm" onClick={() => window.open(`tel:${deliveryGuy.phone}`)}>
                    <Phone className="h-4 w-4 mr-1" /> {t('tracking_rider_call')}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })()}

      {/* Store & Delivery Info */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400">{t('tracking_store')}</p>
              <p className="font-medium text-gray-900 dark:text-white">{order.store.name}</p>
              {order.store.phone && (
                <p className="text-xs text-gray-500 dark:text-gray-400">{order.store.phone}</p>
              )}
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">{t('tracking_type')}</p>
              <p className="font-medium text-gray-900 dark:text-white capitalize">{order.delivery_type === 'delivery' ? t('tracking_delivery_label') : t('tracking_pickup_label')}</p>
            </div>
            {order.address && (
              <div className="col-span-2">
                <p className="text-gray-500 dark:text-gray-400">{t('tracking_delivery_address')}</p>
                <p className="font-medium text-gray-900 dark:text-white">{order.address}</p>
              </div>
            )}
            {order.phone && (
              <div>
                <p className="text-gray-500 dark:text-gray-400">{t('tracking_contact_phone')}</p>
                <p className="font-medium text-gray-900 dark:text-white">{order.phone}</p>
              </div>
            )}
            {order.notes && (
              <div className="col-span-2">
                <p className="text-gray-500 dark:text-gray-400">{t('tracking_customer_notes')}</p>
                <p className="font-medium text-gray-900 dark:text-white">{order.notes}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">{t('tracking_items_title')}</h3>
          <div className="divide-y">
            {order.items.map(item => (
              <div key={item.id} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-900 dark:text-white">{item.food.name}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">x{item.quantity}</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="border-t mt-3 pt-3 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">{t('tracking_subtotal')}</span>
              <span className="text-gray-900 dark:text-white">{formatPrice(order.total_amount + order.discount_amount - order.delivery_fee)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">{t('delivery_fee')}</span>
              <span className="text-gray-900 dark:text-white">{formatPrice(order.delivery_fee)}</span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>{t('tracking_discount')} {order.promo_code && `(${order.promo_code.code})`}</span>
                <span>-{formatPrice(order.discount_amount)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold pt-2 border-t">
              <span>{t('tracking_total')}</span>
              <span>{formatPrice(order.total_amount)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Complaint */}
      {order.status === 'delivered' && !complaintDone && (
        <Card>
          <CardContent className="p-4">
            {!complaintOpen ? (
              <Button variant="outline" className="w-full text-red-600 border-red-200 dark:border-red-900/50" onClick={() => setComplaintOpen(true)}>
                <AlertTriangle className="h-4 w-4 mr-2" /> {t('tracking_complaint_title')}
              </Button>
            ) : (
              <div className="space-y-3">
                <Input
                  placeholder={t('tracking_complaint_subject_placeholder')}
                  value={complaintSubject}
                  onChange={e => setComplaintSubject(e.target.value)}
                />
                <textarea
                  placeholder={t('tracking_complaint_desc_placeholder')}
                  value={complaintDesc}
                  onChange={e => setComplaintDesc(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button onClick={submitComplaint} disabled={submitting || !complaintSubject || !complaintDesc}>
                    {submitting ? t('tracking_complaint_submitting') : t('tracking_complaint_submit')}
                  </Button>
                  <Button variant="outline" onClick={() => setComplaintOpen(false)}>{t('tracking_complaint_cancel')}</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {complaintDone && (
        <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900/50">
          <CardContent className="p-4 text-sm text-green-700 dark:text-green-400 text-center">
            {t('tracking_complaint_success')}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
