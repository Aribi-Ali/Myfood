'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api-client'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, Globe, CheckCircle, XCircle } from 'lucide-react'

interface Domain {
  id: number
  store: { id: number; name: string; alias: string }
  domain: string
  verification_code: string | null
  verified_at: string | null
  is_primary: boolean
  created_at: string
}

export default function AdminDomainsPage() {
  const [domains, setDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [verifiedFilter, setVerifiedFilter] = useState<string | null>(null)

  const fetchDomains = () => {
    setLoading(true)
    setError('')
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (verifiedFilter !== null) params.set('verified', verifiedFilter)

    api.get<{ data: { data: Domain[] } }>('/admin/domains?' + params.toString())
      .then(res => setDomains(res.data?.data || []))
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load domains'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchDomains() }, [verifiedFilter])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Domain Management</h1>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          {[null, 'true', 'false'].map(v => (
            <Button key={String(v)} variant={verifiedFilter === v ? 'primary' : 'outline'} size="sm"
              onClick={() => setVerifiedFilter(v)}
              className={verifiedFilter === v ? 'bg-gray-900 text-white hover:bg-gray-800' : ''}>
              {v === null ? 'All' : v === 'true' ? 'Verified' : 'Unverified'}
            </Button>
          ))}
        </div>
        <Input placeholder="Search domain or store..." value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && fetchDomains()}
          className="max-w-xs" />
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}><CardContent className="p-4"><Skeleton className="h-16 w-full" /></CardContent></Card>
          ))}
        </div>
      ) : domains.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Globe className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="font-medium">No domains found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {domains.map(d => (
            <Card key={d.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-400" />
                    {d.domain}
                    {d.is_primary && <span className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">Primary</span>}
                  </p>
                  <p className="text-sm text-gray-500">Store: {d.store?.name} ({d.store?.alias})</p>
                  <p className="text-xs text-gray-400">Created: {d.created_at?.split('T')[0]} · Code: {d.verification_code || 'N/A'}</p>
                </div>
                <div className="flex items-center gap-2">
                  {d.verified_at ? (
                    <span className="flex items-center gap-1 text-xs text-green-600 font-medium"><CheckCircle className="h-3 w-3" />Verified</span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-red-500 font-medium"><XCircle className="h-3 w-3" />Unverified</span>
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
