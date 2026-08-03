'use client'

import { useCallback, useEffect, useState } from 'react'
import { api } from '@/lib/api-client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { DollarSign, FileText, CheckCircle, Clock, Calendar, X, CreditCard, TrendingUp } from 'lucide-react'
import type { BillingInvoiceData, BillingStatsData } from '@/types/api'

const STATUS_TABS = [
  { key: '', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'pending_cash', label: 'Pending Cash' },
  { key: 'paid', label: 'Paid' },
  { key: 'failed', label: 'Failed' },
]

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  pending_cash: 'bg-orange-100 text-orange-700',
  paid: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  refunded: 'bg-purple-100 text-purple-700',
  cancelled: 'bg-gray-100 text-gray-600',
}

export default function AdminBillingPage() {
  const [stats, setStats] = useState<BillingStatsData | null>(null)
  const [invoices, setInvoices] = useState<BillingInvoiceData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [markingPaid, setMarkingPaid] = useState<number | null>(null)

  const fetchStats = useCallback(() => {
    api.get<{ data: BillingStatsData }>('/admin/billing/stats')
      .then(res => setStats(res.data))
      .catch(() => {})
  }, [])

  const fetchInvoices = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page) })
    if (statusFilter) params.set('status', statusFilter)

    api.get<{ data: { data: BillingInvoiceData[]; last_page: number; total: number } }>('/admin/billing?' + params.toString())
      .then(res => {
        setInvoices(res.data?.data ?? [])
        setLastPage(res.data?.last_page ?? 1)
      })
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load invoices'))
      .finally(() => setLoading(false))
  }, [statusFilter, page])

  useEffect(() => { fetchStats(); fetchInvoices() }, [fetchStats, fetchInvoices])

  const handleMarkPaid = async (id: number) => {
    setMarkingPaid(id)
    setError('')
    try {
      await api.post(`/admin/billing/invoices/${id}/mark-paid`)
      setSuccess('Invoice marked as paid')
      fetchInvoices()
      fetchStats()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to mark as paid')
    }
    setMarkingPaid(null)
  }

  const STAT_CARDS = [
    { key: 'mrr', label: 'Monthly Recurring Revenue', icon: TrendingUp, prefix: '' },
    { key: 'active_subscriptions', label: 'Active Subscriptions', icon: CreditCard, prefix: '' },
    { key: 'pending_invoices', label: 'Pending Invoices', icon: Clock, prefix: '' },
    { key: 'trial_count', label: 'Trial Count', icon: Calendar, prefix: '' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-sm text-gray-500">Manage subscriptions and invoices</p>
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

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map(({ key, label, icon: Icon, prefix }) => (
          <Card key={key}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-orange-50">
                  <Icon className="w-5 h-5 text-orange-600" />
                </div>
              </div>
              {stats ? (
                <p className="text-2xl font-bold mt-3">
                  {prefix}{stats[key as keyof BillingStatsData] != null ? Number(stats[key as keyof BillingStatsData]).toLocaleString() : '—'}
                </p>
              ) : (
                <Skeleton className="h-8 w-20 mt-3" />
              )}
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Invoices */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-500" /> Invoices
            </h3>
            <div className="flex gap-1 rounded-lg border border-gray-200 p-1">
              {STATUS_TABS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => { setStatusFilter(key); setPage(1) }}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    statusFilter === key
                      ? 'bg-orange-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <DollarSign className="h-10 w-10 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No invoices match the current filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-600">Invoice #</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Store</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Plan / Tier</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Amount</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Period</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Status</th>
                    <th className="px-4 py-3 font-medium text-gray-600 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {invoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs">{inv.invoice_number}</td>
                      <td className="px-4 py-3">{inv.store?.name ?? '—'}</td>
                      <td className="px-4 py-3 text-xs">
                        {inv.plan_name ?? '—'} / {inv.tier_applied ?? '—'}
                      </td>
                      <td className="px-4 py-3 font-medium">{inv.total_amount.toLocaleString()} {inv.currency}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {inv.period_start?.slice(0, 10)} — {inv.period_end?.slice(0, 10)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[inv.status] ?? 'bg-gray-100 text-gray-600'}`}>
                          {inv.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {inv.status === 'pending_cash' && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleMarkPaid(inv.id)}
                            disabled={markingPaid === inv.id}
                          >
                            {markingPaid === inv.id ? '...' : 'Mark Paid'}
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {lastPage > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>
                Previous
              </Button>
              <span className="text-sm text-gray-600">Page {page} / {lastPage}</span>
              <Button variant="outline" size="sm" disabled={page >= lastPage} onClick={() => setPage(p => Math.min(lastPage, p + 1))}>
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
