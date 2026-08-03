'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api-client'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { DollarSign, CheckCircle, XCircle, Banknote } from 'lucide-react'

interface Payout {
  id: number
  store: { id: number; name: string; alias: string }
  amount: number
  currency: string
  status: 'pending' | 'approved' | 'rejected' | 'paid'
  bank_name: string | null
  bank_account: string | null
  phone: string | null
  notes: string | null
  approver: { id: number; name: string } | null
  approved_at: string | null
  paid_at: string | null
  created_at: string
}

interface PayoutStats {
  total_pending: number
  total_approved: number
  total_paid: number
  pending_count: number
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  approved: 'bg-blue-100 text-blue-700 border-blue-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
  paid: 'bg-green-100 text-green-700 border-green-200',
}

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [stats, setStats] = useState<PayoutStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const fetch = () => {
    setLoading(true)
    setError('')
    const params = new URLSearchParams()
    if (statusFilter) params.set('status', statusFilter)

    Promise.all([
      api.get<{ data: { data: Payout[] } }>('/admin/payouts?' + params.toString()),
      api.get<{ data: PayoutStats }>('/admin/payouts/stats'),
    ])
      .then(([pRes, sRes]) => {
        setPayouts(pRes.data?.data || [])
        setStats(sRes.data)
      })
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetch() }, [statusFilter])

  const approve = async (id: number) => {
    try { await api.post(`/admin/payouts/${id}/approve`); setSuccess('Approved'); fetch() }
    catch (err: unknown) { setError(err instanceof Error ? err.message : 'Failed') }
  }

  const reject = async (id: number) => {
    const notes = prompt('Rejection reason (optional):')
    try { await api.post(`/admin/payouts/${id}/reject`, { notes }); setSuccess('Rejected'); fetch() }
    catch (err: unknown) { setError(err instanceof Error ? err.message : 'Failed') }
  }

  const markPaid = async (id: number) => {
    try { await api.post(`/admin/payouts/${id}/mark-paid`); setSuccess('Marked as paid'); fetch() }
    catch (err: unknown) { setError(err instanceof Error ? err.message : 'Failed') }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Payout Management</h1>

      {error && <p className="text-red-600 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Pending', value: `${stats.pending_count} (${stats.total_pending.toFixed(0)} DZD)`, icon: DollarSign, color: 'text-yellow-600 bg-yellow-50' },
            { label: 'Approved', value: `${stats.total_approved.toFixed(0)} DZD`, icon: CheckCircle, color: 'text-blue-600 bg-blue-50' },
            { label: 'Paid', value: `${stats.total_paid.toFixed(0)} DZD`, icon: Banknote, color: 'text-green-600 bg-green-50' },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label} className="border-0 shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={cn('p-2 rounded-lg', color)}><Icon className="h-5 w-5" /></div>
                <div>
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="text-sm font-bold text-gray-900">{value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2">
        {['', 'pending', 'approved', 'rejected', 'paid'].map(s => (
          <Button key={s} variant={statusFilter === s ? 'primary' : 'outline'} size="sm"
            onClick={() => setStatusFilter(s)}
            className={statusFilter === s ? 'bg-gray-900 text-white hover:bg-gray-800' : ''}>
            {s || 'All'}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}><CardContent className="p-4"><Skeleton className="h-16 w-full" /></CardContent></Card>
          ))}
        </div>
      ) : payouts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No payouts found</div>
      ) : (
        <div className="space-y-2">
          {payouts.map(p => (
            <Card key={p.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{p.store?.name || `Store #${p.store?.id}`}</p>
                  <p className="text-sm text-gray-500">{p.amount.toFixed(2)} {p.currency || 'DZD'}</p>
                  <p className="text-xs text-gray-400">
                    {p.bank_name ? `${p.bank_name} · ${p.bank_account}` : p.phone ? `Phone: ${p.phone}` : ''}
                    {p.approver && ` · by ${p.approver.name}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full border', STATUS_STYLES[p.status])}>{p.status}</span>
                  {p.status === 'pending' && (
                    <div className="flex gap-1">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 h-auto" onClick={() => approve(p.id)}>Approve</Button>
                      <Button size="sm" variant="outline" className="text-red-600 border-red-200 text-xs px-2 py-1 h-auto" onClick={() => reject(p.id)}>Reject</Button>
                    </div>
                  )}
                  {p.status === 'approved' && (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1 h-auto" onClick={() => markPaid(p.id)}>
                      <Banknote className="h-3 w-3 mr-1" />Mark Paid
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
