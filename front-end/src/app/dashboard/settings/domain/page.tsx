'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth'
import { useLanguage } from '@/contexts/language'
import { api } from '@/lib/api-client'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Loader2, Globe, CheckCircle, XCircle, Star, ExternalLink, Plus, Trash2 } from 'lucide-react'

interface StoreDomain {
  id: number
  store_id: number
  domain: string
  verification_code: string
  verified_at: string | null
  is_primary: boolean
  created_at: string
}

export default function DomainPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { t } = useLanguage()
  const [domains, setDomains] = useState<StoreDomain[]>([])
  const [fetching, setFetching] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [newDomain, setNewDomain] = useState('')
  const [addingDomain, setAddingDomain] = useState(false)
  const [verifyingId, setVerifyingId] = useState<number | null>(null)

  useEffect(() => {
    if (!loading && !user) { router.push('/login'); return }
    if (!user) return
    fetchDomains()
  }, [user, loading, router])

  async function fetchDomains() {
    setFetching(true)
    try {
      const res = await api.get<{ data: StoreDomain[] }>('/owner/domains')
      setDomains(res.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load domains')
    }
    setFetching(false)
  }

  async function addDomain() {
    if (!newDomain.trim()) return
    setAddingDomain(true)
    setError(''); setSuccess('')
    try {
      const res = await api.post<{ data: StoreDomain }>('/owner/domains', { domain: newDomain })
      setDomains(prev => [...prev, res.data])
      setNewDomain('')
      setSuccess('Domain added.')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add domain')
    }
    setAddingDomain(false)
  }

  async function verifyDomain(id: number) {
    setVerifyingId(id)
    setError(''); setSuccess('')
    try {
      const res = await api.post<{ data: StoreDomain }>(`/owner/domains/${id}/verify`)
      setDomains(prev => prev.map(d => d.id === id ? res.data : d))
      setSuccess('Domain verified!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed')
    }
    setVerifyingId(null)
  }

  async function setPrimary(id: number) {
    setError(''); setSuccess('')
    try {
      const res = await api.post<{ data: StoreDomain }>(`/owner/domains/${id}/primary`)
      setDomains(prev => prev.map(d => d.id === id ? res.data : { ...d, is_primary: false }))
      setSuccess('Primary domain updated.')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set primary')
    }
  }

  async function deleteDomain(id: number) {
    setError(''); setSuccess('')
    try {
      await api.delete(`/owner/domains/${id}`)
      setDomains(prev => prev.filter(d => d.id !== id))
      setSuccess('Domain deleted.')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete')
    }
  }

  if (loading || fetching) return <Skeleton className="h-48 w-full" />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('custom_domain')}</h1>
        <p className="text-gray-500 dark:text-slate-400">{t('custom_domain_desc')}</p>
      </div>
      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {success && <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{success}</div>}

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">{t('custom_domain')}</h2>
          <p className="text-sm text-gray-500">{t('custom_domain_subtitle')}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-2 max-w-lg">
            <Input
              placeholder="mystore.com"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addDomain()}
            />
            <Button onClick={addDomain} disabled={addingDomain || !newDomain.trim()}>
              {addingDomain ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-1" />}
              {t('add')}
            </Button>
          </div>

          {domains.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-10 text-gray-400">
              <Globe className="h-12 w-12" />
              <p className="text-sm">{t('no_domains_yet')}</p>
            </div>
          ) : (
            <div className="space-y-3 max-w-lg">
              {domains.map((domain) => (
                <div key={domain.id} className="flex items-center gap-3 p-4 rounded-lg border border-gray-100 dark:border-slate-700">
                  <Globe className="h-5 w-5 text-gray-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{domain.domain}</span>
                      {domain.is_primary && <Star className="h-4 w-4 text-amber-500 fill-amber-500" />}
                      {domain.verified_at ? (
                        <span className="text-xs text-green-600 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> {t('verified')}</span>
                      ) : (
                        <span className="text-xs text-red-500 flex items-center gap-1"><XCircle className="h-3 w-3" /> {t('unverified')}</span>
                      )}
                    </div>
                    {!domain.verified_at && (
                      <p className="text-xs text-gray-500 mt-1">
                        {t('dns_txt_record')} <code className="bg-gray-100 dark:bg-slate-700 px-1 rounded">{domain.verification_code}</code>
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {!domain.verified_at && (
                      <Button variant="outline" size="sm" onClick={() => verifyDomain(domain.id)} disabled={verifyingId === domain.id}>
                        {verifyingId === domain.id ? <Loader2 className="h-3 w-3 animate-spin" /> : t('verify')}
                      </Button>
                    )}
                    {domain.verified_at && !domain.is_primary && (
                      <Button variant="outline" size="sm" onClick={() => setPrimary(domain.id)}>{t('set_primary')}</Button>
                    )}
                    {domain.verified_at && domain.is_primary && (
                      <a href={`https://${domain.domain}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-600">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    <button onClick={() => deleteDomain(domain.id)} className="text-red-400 hover:text-red-600 p-1">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-lg">
            <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">{t('how_to_setup_domain')}</h4>
            <ol className="text-xs text-blue-700 dark:text-blue-300 space-y-1 list-decimal pl-4">
              <li>{t('domain_step1')}</li>
              <li>{t('domain_step2')}</li>
              <li>{t('domain_step3')}</li>
              <li>{t('domain_step4')}</li>
              <li>{t('domain_step5')}</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
