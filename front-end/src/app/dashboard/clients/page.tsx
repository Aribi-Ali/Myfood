'use client'

import { useState } from 'react'
import { useApiQuery } from '@/lib/use-api-query'
import { api } from '@/lib/api-client'
import { useQueryClient } from '@tanstack/react-query'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/contexts/language'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { toast, ToastContainer } from '@/components/ui/toast'
import {
  Search, ChevronDown, ChevronUp, Ban, Flag, AlertTriangle,
  UserCheck, ShoppingBag, Users,
  ThumbsUp, ThumbsDown, Minus, X, Send
} from 'lucide-react'

interface ClientTrustScore {
  score: number
  completed_orders: number
  cancelled_orders: number
  avg_rating_given: number
  total_complaints: number
  total_reports_against: number
  last_calculated_at: string | null
}

interface ClientData {
  id: number
  name: string
  email: string
  phone: string | null
  profile_image: string | null
  total_orders: number
  is_banned: boolean
  trust_score: ClientTrustScore | null
}

interface TrustDetailData {
  client: {
    id: number
    name: string
    email: string
    phone: string | null
    profile_image: string | null
  }
  trust_score: {
    score: number
    level: string
    completed_orders: number
    cancelled_orders: number
    completion_rate: number
    avg_rating_given: number
    total_complaints: number
    total_reports_against: number
    last_calculated_at: string | null
  } | null
  is_banned: boolean
  ban_reason: string | null
  banned_at: string | null
  reports: Array<{
    id: number
    reason: string
    description: string | null
    status: string
    created_at: string
  }>
}

export default function ClientsPage() {
  const { t } = useLanguage()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [sortBy, setSortBy] = useState('trust_score')
  const [sortDir, setSortDir] = useState('desc')
  const [expandedClient, setExpandedClient] = useState<number | null>(null)

  // Ban modal state
  const [banModalClient, setBanModalClient] = useState<ClientData | null>(null)
  const [banReason, setBanReason] = useState('')
  const [banning, setBanning] = useState(false)

  // Report modal state
  const [reportModalClient, setReportModalClient] = useState<ClientData | null>(null)
  const [reportReason, setReportReason] = useState('')
  const [reportDescription, setReportDescription] = useState('')
  const [reporting, setReporting] = useState(false)

  const params: Record<string, string> = { sort_by: sortBy, sort_dir: sortDir }

  const { data: clientsRes, isLoading } = useApiQuery<any>(
    ['owner', 'clients', sortBy, sortDir],
    '/owner/clients?' + new URLSearchParams(params).toString(),
  )

  const clients: ClientData[] = clientsRes?.data ?? []

  const { data: detailData } = useApiQuery<{ data: TrustDetailData }>(
    ['owner', 'clients', 'detail', expandedClient],
    expandedClient ? '/owner/clients/' + expandedClient + '/trust' : '',
    { enabled: !!expandedClient }
  )

  function handleSearch() {
    setSearch(searchInput)
  }

  function toggleSort(field: string) {
    if (sortBy === field) {
      setSortDir(d => d === 'desc' ? 'asc' : 'desc')
    } else {
      setSortBy(field)
      setSortDir('desc')
    }
  }

  async function handleBan() {
    if (!banModalClient) return
    setBanning(true)
    try {
      await api.post('/owner/clients/' + banModalClient.id + '/ban', { reason: banReason })
      queryClient.invalidateQueries({ queryKey: ['owner', 'clients'] })
      setBanModalClient(null)
      setBanReason('')
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to ban client')
    }
    setBanning(false)
  }

  async function handleUnban(clientId: number) {
    try {
      await api.post('/owner/clients/' + clientId + '/unban')
      queryClient.invalidateQueries({ queryKey: ['owner', 'clients'] })
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to unban client')
    }
  }

  async function handleReport() {
    if (!reportModalClient) return
    if (!reportReason.trim()) {
      alert(t('report_reason_required'))
      return
    }
    setReporting(true)
    try {
      await api.post('/owner/clients/' + reportModalClient.id + '/report', {
        reason: reportReason,
        description: reportDescription,
      })
      queryClient.invalidateQueries({ queryKey: ['owner', 'clients'] })
      toast(t('report_success'), 'success')
      setReportModalClient(null)
      setReportReason('')
      setReportDescription('')
    } catch (err: unknown) {
      toast(t('report_error'), 'error')
    }
    setReporting(false)
  }

  function getScoreColor(score: number): string {
    if (score >= 80) return 'text-green-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  function getScoreBg(score: number): string {
    if (score >= 80) return 'bg-green-100 border-green-300'
    if (score >= 50) return 'bg-yellow-100 border-yellow-300'
    return 'bg-red-100 border-red-300'
  }

  function getScoreIcon(score: number) {
    if (score >= 80) return <ThumbsUp className="w-4 h-4" />
    if (score >= 50) return <Minus className="w-4 h-4" />
    return <ThumbsDown className="w-4 h-4" />
  }

  function getScoreLabel(score: number): string {
    if (score >= 80) return t('trustworthy')
    if (score >= 50) return t('neutral')
    return t('at_risk')
  }

  const filteredClients = search
    ? clients.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        (c.phone && c.phone.includes(search))
      )
    : clients

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <Card key={i}><CardContent className="p-4"><Skeleton className="h-20 w-full" /></CardContent></Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('clients')}</h1>
        <p className="text-gray-500 dark:text-slate-400">{t('manage_clients')}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: t('total_clients'), value: clients.length, icon: Users, color: 'text-blue-600 bg-blue-50' },
          { label: t('banned_clients'), value: clients.filter(c => c.is_banned).length, icon: Ban, color: 'text-red-600 bg-red-50' },
          { label: t('trusted_clients'), value: clients.filter(c => c.trust_score && c.trust_score.score >= 80).length, icon: ThumbsUp, color: 'text-green-600 bg-green-50' },
          { label: t('at_risk_clients'), value: clients.filter(c => c.trust_score && c.trust_score.score < 50).length, icon: AlertTriangle, color: 'text-orange-600 bg-orange-50' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={cn('p-2 rounded-lg', color)}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-lg font-bold text-gray-900">{value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-2">
          <Button variant={sortBy === 'trust_score' ? 'primary' : 'outline'} size="sm" onClick={() => toggleSort('trust_score')} className="flex items-center gap-1">
            {t('trust_score')}
            {sortBy === 'trust_score' && (sortDir === 'desc' ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />)}
          </Button>
          <Button variant={sortBy === 'total_orders' ? 'primary' : 'outline'} size="sm" onClick={() => toggleSort('total_orders')} className="flex items-center gap-1">
            {t('total_orders')}
            {sortBy === 'total_orders' && (sortDir === 'desc' ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />)}
          </Button>
          <Button variant={sortBy === 'name' ? 'primary' : 'outline'} size="sm" onClick={() => toggleSort('name')} className="flex items-center gap-1">
            {t('name')}
            {sortBy === 'name' && (sortDir === 'desc' ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />)}
          </Button>
        </div>
        <div className="flex gap-2 ml-auto">
          <Input placeholder={t('search_by_name_email')} value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} className="w-56" />
          <Button variant="outline" onClick={handleSearch}><Search className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="space-y-3">
        {filteredClients.map((client) => {
          const trustScore = client.trust_score?.score ?? 0
          const hasTrust = client.trust_score !== null

          return (
            <Card key={client.id} className={cn('transition-shadow hover:shadow-md', client.is_banned && 'opacity-75 border-red-200')}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {client.profile_image ? (
                      <img src={client.profile_image} alt={client.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center text-sm font-bold text-orange-600">
                        {client.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-white">{client.name}</span>
                      {client.is_banned && (
                        <span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 rounded-full px-2 py-0.5 font-medium">
                          <Ban className="h-3 w-3" /> {t('banned')}
                        </span>
                      )}
                      {hasTrust && (
                        <span className={cn('inline-flex items-center gap-1 text-xs rounded-full px-2 py-0.5 font-medium border', getScoreBg(trustScore))}>
                          {getScoreIcon(trustScore)} {getScoreLabel(trustScore)}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mt-1">
                      <span>{client.email}</span>
                      {client.phone && <span>{client.phone}</span>}
                      <span className="inline-flex items-center gap-1">
                        <ShoppingBag className="h-3 w-3" /> {client.total_orders} {t('orders')}
                      </span>
                    </div>

                    {hasTrust && (
                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className={cn('h-full rounded-full transition-all duration-500', trustScore >= 80 ? 'bg-green-500' : trustScore >= 50 ? 'bg-yellow-500' : 'bg-red-500')} style={{ width: trustScore + '%' }} />
                        </div>
                        <span className={cn('text-sm font-bold', getScoreColor(trustScore))}>{trustScore}/100</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0" onClick={e => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" onClick={() => setExpandedClient(expandedClient === client.id ? null : client.id)} title={t('view_details')}>
                      {expandedClient === client.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                    {client.is_banned ? (
                      <Button variant="outline" size="sm" onClick={() => handleUnban(client.id)} className="text-green-600 border-green-200 hover:bg-green-50 text-xs">
                        <UserCheck className="h-3.5 w-3.5 mr-1" /> {t('unban')}
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => { setBanModalClient(client); setBanReason('') }} className="text-red-600 border-red-200 hover:bg-red-50 text-xs">
                        <Ban className="h-3.5 w-3.5 mr-1" /> {t('ban')}
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => { setReportModalClient(client); setReportReason(''); setReportDescription('') }} className="text-orange-600 border-orange-200 hover:bg-orange-50 text-xs">
                      <Flag className="h-3.5 w-3.5 mr-1" /> {t('report')}
                    </Button>
                  </div>
                </div>

                {expandedClient === client.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
                    {detailData?.data ? (
                      <TrustDetailView data={detailData.data} t={t} />
                    ) : (
                      <Skeleton className="h-32 w-full" />
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredClients.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-gray-300 mx-auto" />
            <p className="mt-4 text-gray-500">{t('no_clients')}</p>
          </CardContent>
        </Card>
      )}

      <ToastContainer />

      {/* Ban Modal */}
      {banModalClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => { setBanModalClient(null); setBanReason('') }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">{t('ban')} - {banModalClient.name}</h3>
              <button onClick={() => { setBanModalClient(null); setBanReason('') }} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('ban_reason_prompt')}</label>
                <textarea
                  value={banReason}
                  onChange={e => setBanReason(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder={t('ban_reason_placeholder')}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => { setBanModalClient(null); setBanReason('') }}>{t('cancel')}</Button>
                <Button onClick={handleBan} disabled={banning} className="bg-red-600 hover:bg-red-700 text-white">
                  {banning ? t('banning') : t('confirm_ban')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportModalClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => { setReportModalClient(null); setReportReason(''); setReportDescription('') }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">{t('report')} - {reportModalClient.name}</h3>
              <button onClick={() => { setReportModalClient(null); setReportReason(''); setReportDescription('') }} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('report_reason_prompt')} <span className="text-red-500">*</span>
                </label>
                <Input
                  value={reportReason}
                  onChange={e => setReportReason(e.target.value)}
                  placeholder={t('report_reason_placeholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('report_description_prompt')} ({t('optional')})</label>
                <textarea
                  value={reportDescription}
                  onChange={e => setReportDescription(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder={t('report_description_placeholder')}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => { setReportModalClient(null); setReportReason(''); setReportDescription('') }}>{t('cancel')}</Button>
                <Button onClick={handleReport} disabled={reporting || !reportReason.trim()} className="bg-orange-600 hover:bg-orange-700 text-white">
                  <Send className="h-4 w-4 mr-1" />
                  {reporting ? t('submitting') : t('submit_report')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function TrustDetailView({ data, t }: { data: TrustDetailData; t: (key: string) => string }) {
  return (
    <div className="space-y-4">
      {data.is_banned && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-3">
          <Ban className="h-5 w-5 text-red-500 mt-0.5" />
          <div>
            <p className="font-medium text-red-700 text-sm">{t('banned')}</p>
            {data.ban_reason && <p className="text-sm text-red-600 mt-0.5">{t('reason')}: {data.ban_reason}</p>}
          </div>
        </div>
      )}

      {data.trust_score && (
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">{t('trust_score')}</p>
            <p className={cn('text-lg font-bold', getScoreColorClass(data.trust_score.score))}>{data.trust_score.score}/100</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">{t('completion_rate')}</p>
            <p className="text-lg font-bold text-gray-900">{data.trust_score.completion_rate}%</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">{t('completed_orders')}</p>
            <p className="text-lg font-bold text-green-600">{data.trust_score.completed_orders}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">{t('cancelled_orders')}</p>
            <p className="text-lg font-bold text-red-600">{data.trust_score.cancelled_orders}</p>
          </div>
        </div>
      )}

      {data.reports.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">{t('reports')} ({data.reports.length})</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {data.reports.map((report) => (
              <div key={report.id} className="bg-orange-50 rounded-lg p-2 text-sm">
                <p className="font-medium text-orange-800">{report.reason}</p>
                {report.description && <p className="text-orange-600 text-xs mt-0.5">{report.description}</p>}
                <p className="text-xs text-gray-400 mt-1">{new Date(report.created_at).toLocaleDateString()} - {report.status}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function getScoreColorClass(score: number): string {
  if (score >= 80) return 'text-green-600'
  if (score >= 50) return 'text-yellow-600'
  return 'text-red-600'
}
