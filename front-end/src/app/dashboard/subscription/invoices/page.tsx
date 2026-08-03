'use client'

import { useCallback, useEffect, useState } from 'react'
import { api } from '@/lib/api-client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from 'next/navigation'
import { ArrowLeft, FileText, Download, CreditCard, Clock, X, AlertTriangle } from 'lucide-react'
import type { BillingInvoiceData } from '@/types/api'

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  pending_cash: 'bg-orange-100 text-orange-700',
  paid: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  refunded: 'bg-purple-100 text-purple-700',
  cancelled: 'bg-gray-100 text-gray-600',
}

export default function InvoicesPage() {
  const router = useRouter()
  const [invoices, setInvoices] = useState<BillingInvoiceData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [payingId, setPayingId] = useState<number | null>(null)

  const fetchInvoices = useCallback(() => {
    setLoading(true)
    api.get<{ data: BillingInvoiceData[] }>('/owner/subscription/invoices')
      .then(res => setInvoices(res.data ?? []))
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load invoices'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchInvoices() }, [fetchInvoices])

  const handlePayNow = async (id: number) => {
    setPayingId(id)
    setError('')
    try {
      const res = await api.post<{ redirect_url?: string }>(`/owner/subscription/pay-invoice/${id}`)
      setSuccess('Payment initiated')
      if (res.redirect_url) {
        window.location.href = res.redirect_url
      } else {
        fetchInvoices()
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Payment failed')
    }
    setPayingId(null)
  }

  const getGracePeriodDays = (inv: BillingInvoiceData): number | null => {
    if (inv.status !== 'pending_cash') return null
    const created = new Date(inv.created_at)
    const now = new Date()
    const graceEnd = new Date(created.getTime() + 7 * 24 * 60 * 60 * 1000)
    const diff = Math.ceil((graceEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(0, diff)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
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
          <h1 className="text-2xl font-bold">Invoices</h1>
          <p className="text-sm text-gray-500">{invoices.length} invoices</p>
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

      {invoices.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">No invoices yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-600">Invoice #</th>
                <th className="px-4 py-3 font-medium text-gray-600">Period</th>
                <th className="px-4 py-3 font-medium text-gray-600">Plan / Tier</th>
                <th className="px-4 py-3 font-medium text-gray-600">Amount</th>
                <th className="px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 font-medium text-gray-600">Payment</th>
                <th className="px-4 py-3 font-medium text-gray-600">Date</th>
                <th className="px-4 py-3 font-medium text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoices.map(inv => {
                const graceDays = getGracePeriodDays(inv)
                return (
                  <tr key={inv.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs font-medium">{inv.invoice_number}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {inv.period_start?.slice(0, 10)} — {inv.period_end?.slice(0, 10)}
                    </td>
                    <td className="px-4 py-3 text-xs">{inv.plan_name ?? '—'} / {inv.tier_applied ?? '—'}</td>
                    <td className="px-4 py-3 font-medium">{inv.total_amount.toLocaleString()} {inv.currency}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[inv.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {inv.status === 'pending_cash' ? 'Pending (Cash)' : inv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 capitalize">{inv.payment_method_type ?? '—'}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{inv.created_at?.slice(0, 10)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {inv.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => handlePayNow(inv.id)}
                            disabled={payingId === inv.id}
                          >
                            {payingId === inv.id ? '...' : 'Pay Now'}
                          </Button>
                        )}
                        {inv.status === 'pending_cash' && graceDays != null && (
                          <div className="flex items-center gap-1 text-xs text-orange-600">
                            <Clock className="w-3.5 h-3.5" />
                            Pay at office — {graceDays}d left
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
