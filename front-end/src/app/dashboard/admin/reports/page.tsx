'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api-client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Flag, CheckCircle, XCircle, MessageSquare, Ban, ExternalLink } from 'lucide-react'

interface ReportData {
  id: number
  store_id: number
  client_id: number
  reporter_id: number
  reason: string
  description: string | null
  status: string
  admin_reply: string | null
  created_at: string
  client: { id: number; name: string; email: string; phone: string | null; profile_image: string | null }
  store: { id: number; name: string; alias: string }
  reporter: { id: number; name: string }
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<ReportData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null)
  const [adminReply, setAdminReply] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  const fetchReports = () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (statusFilter) params.set('status', statusFilter)
    api.get<{ data: { data: ReportData[] } }>('/admin/reports?' + params.toString())
      .then(res => setReports(res.data?.data || []))
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchReports() }, [statusFilter])

  const resolveReport = async (id: number, status: 'reviewed' | 'dismissed') => {
    setActionLoading(true)
    try {
      await api.post(`/admin/reports/${id}/resolve`, { status, admin_reply: adminReply || null })
      setSuccess(`Report ${status}`)
      setSelectedReport(null)
      setAdminReply('')
      fetchReports()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to process')
    }
    setActionLoading(false)
  }

  const banClient = async (clientId: number) => {
    if (!confirm('Ban this client from the entire app?')) return
    try {
      await api.post(`/admin/users/${clientId}/ban`, { reason: 'Banned due to multiple reports' })
      setSuccess('Client banned globally')
      fetchReports()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to ban')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Client Reports</h1>
          <p className="text-gray-500">Review reports submitted by store owners against clients</p>
        </div>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}

      <div className="flex gap-2">
        {['', 'pending', 'reviewed', 'dismissed'].map(s => (
          <Button key={s} variant={statusFilter === s ? 'primary' : 'outline'} size="sm" onClick={() => setStatusFilter(s)}>
            {s || 'All'}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <Card key={i}><CardContent className="p-4"><Skeleton className="h-20 w-full" /></CardContent></Card>)}
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No reports found</div>
      ) : (
        <div className="space-y-3">
          {reports.map(r => (
            <Card key={r.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Flag className="h-4 w-4 text-orange-500" />
                      <span className="font-semibold text-gray-900">{r.client.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        r.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        r.status === 'reviewed' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>{r.status}</span>
                    </div>
                    <p className="text-sm text-gray-600"><strong>Reason:</strong> {r.reason}</p>
                    <p className="text-xs text-gray-400">
                      Reported by {r.reporter.name} · Store: {r.store.name} · {new Date(r.created_at).toLocaleDateString()}
                    </p>
                    {r.description && <p className="text-sm text-gray-500 mt-1">{r.description}</p>}
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Button size="sm" variant="ghost" onClick={() => setSelectedReport(r)} title="Review">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => { setSelectedReport(null); setAdminReply('') }}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Review Report</h3>
              <button onClick={() => { setSelectedReport(null); setAdminReply('') }} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>

            <div className="space-y-3 text-sm mb-4">
              <div className="bg-orange-50 rounded-lg p-3">
                <p className="font-medium text-orange-800">{selectedReport.reason}</p>
                {selectedReport.description && <p className="text-orange-600 mt-1">{selectedReport.description}</p>}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><p className="text-xs text-gray-500">Client</p><p className="font-medium">{selectedReport.client.name}</p></div>
                <div><p className="text-xs text-gray-500">Store</p><p className="font-medium">{selectedReport.store.name}</p></div>
                <div><p className="text-xs text-gray-500">Reported by</p><p className="font-medium">{selectedReport.reporter.name}</p></div>
                <div><p className="text-xs text-gray-500">Date</p><p className="font-medium">{new Date(selectedReport.created_at).toLocaleDateString()}</p></div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Reply (optional)</label>
                <textarea
                  value={adminReply}
                  onChange={e => setAdminReply(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  rows={3}
                  placeholder="Add admin note..."
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-end border-t pt-3">
              <Button size="sm" variant="outline" onClick={() => banClient(selectedReport.client.id)} className="text-red-600 border-red-200">
                <Ban className="h-4 w-4 mr-1" /> Ban Client
              </Button>
              <Button size="sm" variant="outline" onClick={() => resolveReport(selectedReport.id, 'dismissed')} disabled={actionLoading} className="text-gray-600">
                <XCircle className="h-4 w-4 mr-1" /> Dismiss
              </Button>
              <Button size="sm" onClick={() => resolveReport(selectedReport.id, 'reviewed')} disabled={actionLoading} className="bg-green-600 hover:bg-green-700 text-white">
                <CheckCircle className="h-4 w-4 mr-1" /> Mark Reviewed
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
