'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth'
import { useLanguage } from '@/contexts/language'
import { api } from '@/lib/api-client'
import { getImageUrl, truncate } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'

interface Chef {
  id: number
  name: string
  bio: string | null
  specialization: string | null
  years_of_experience: number | null
  cuisines: string[] | null
  profile_image: string | null
  available: boolean
}

export default function ChefsPage() {
  const { user, loading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [tab, setTab] = useState<'browse' | 'hired'>('browse')
  const [chefs, setChefs] = useState<Chef[]>([])
  const [hired, setHired] = useState<Chef[]>([])
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [specialization, setSpecialization] = useState('')
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')

  async function fetchChefs() {
    setFetching(true)
    setError('')
    try {
      const params = new URLSearchParams()
      if (specialization) params.set('specialization', specialization)
      if (search) params.set('search', search)
      params.set('page', String(page))
      const res = await api.get<{ data: { data: Chef[]; last_page: number; current_page: number } }>(`/owner/chefs?${params}`)
      setChefs(res.data.data)
      setLastPage(res.data.last_page)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('failed_to_load_chefs'))
    }
    setFetching(false)
  }

  async function fetchHired() {
    setFetching(true)
    setError('')
    try {
      const res = await api.get<{ data: { data: Chef[] } }>('/owner/chefs/hired')
      setHired(res.data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('failed_to_load_hired'))
    }
    setFetching(false)
  }

  function handleSearch() {
    setSearch(searchInput)
    setPage(1)
  }

  async function hireChef(id: number) {
    try {
      await api.post(`/owner/chefs/${id}/hire`)
      setChefs((prev) => prev.filter((c) => c.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : t('failed_to_hire'))
    }
  }

  async function fireChef(id: number) {
    if (!confirm(t('fire_chef_confirm'))) return
    try {
      await api.post(`/owner/chefs/${id}/fire`)
      setHired((prev) => prev.filter((c) => c.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : t('failed_to_fire'))
    }
  }

  useEffect(() => {
    if (!loading && !user) { router.push('/login'); return }
    if (!user) return
    ;(async () => {
      setFetching(true)
      setError('')
      try {
        if (tab === 'browse') {
          const params = new URLSearchParams()
          if (specialization) params.set('specialization', specialization)
          if (search) params.set('search', search)
          params.set('page', String(page))
          const res = await api.get<{ data: { data: Chef[]; last_page: number; current_page: number } }>(`/owner/chefs?${params}`)
          setChefs(res.data.data)
          setLastPage(res.data.last_page)
        } else {
          const res = await api.get<{ data: { data: Chef[] } }>('/owner/chefs/hired')
          setHired(res.data.data)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : t('failed_to_load_chefs'))
      }
      setFetching(false)
    })()
  }, [user, loading, router, tab, page, specialization, search])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('chefs')}</h1>
        <p className="text-gray-500">{t('browse_and_hire')}</p>
      </div>

      <div className="flex gap-2">
        <Button variant={tab === 'browse' ? 'primary' : 'outline'} onClick={() => { setTab('browse'); setPage(1) }}>{t('browse_chefs')}</Button>
        <Button variant={tab === 'hired' ? 'primary' : 'outline'} onClick={() => setTab('hired')}>{t('hired_chefs')}</Button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      {tab === 'browse' && (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Input
                placeholder={t('search_by_name_or_email')}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              {searchInput !== search && (
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <Search className="h-4 w-4" />
                </button>
              )}
            </div>
            <select
              value={specialization}
              onChange={(e) => { setSpecialization(e.target.value); setPage(1) }}
              className="block w-44 rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">{t('all_specializations')}</option>
              <option value="pizza">{t('pizza')}</option>
              <option value="pastry">{t('pastry')}</option>
              <option value="grill">{t('grill')}</option>
              <option value="vegan">{t('vegan')}</option>
              <option value="dessert">{t('dessert')}</option>
            </select>
          </div>

          {fetching ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i}><CardContent className="p-4 space-y-2"><Skeleton className="h-32 w-full rounded-lg" /><Skeleton className="h-4 w-3/4" /><Skeleton className="h-3 w-1/2" /></CardContent></Card>
              ))}
            </div>
          ) : chefs.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">{t('no_chefs')}</CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {chefs.map((c) => (
                <Card key={c.id}>
                  <CardContent className="p-4">
                    {c.profile_image && <img src={getImageUrl(c.profile_image) ?? ''} alt={c.name} className="mb-3 h-32 w-full rounded-lg object-cover" />}
                    <h3 className="font-semibold text-gray-900">{c.name}</h3>
                    {c.specialization && <span className="mt-1 inline-block rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">{c.specialization}</span>}
                    {c.bio && <p className="mt-2 text-sm text-gray-600">{truncate(c.bio, 100)}</p>}
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
                      {c.years_of_experience != null && <span>{t('years_exp', { n: c.years_of_experience })}</span>}
                      {c.cuisines && c.cuisines.length > 0 && <span>{c.cuisines.join(', ')}</span>}
                    </div>
                    <Button className="mt-3 w-full" size="sm" onClick={() => hireChef(c.id)}>{t('hire')}</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {lastPage > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-600">{t('page_of', { page, lastPage })}</span>
              <Button variant="outline" size="sm" disabled={page >= lastPage} onClick={() => setPage((p) => p + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}

      {tab === 'hired' && (
        <>
          {fetching ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i}><CardContent className="p-4 space-y-2"><Skeleton className="h-32 w-full rounded-lg" /><Skeleton className="h-4 w-3/4" /></CardContent></Card>
              ))}
            </div>
          ) : hired.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">{t('no_hired_chefs')}</CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {hired.map((c) => (
                <Card key={c.id}>
                  <CardContent className="p-4">
                    {c.profile_image && <img src={getImageUrl(c.profile_image) ?? ''} alt={c.name} className="mb-3 h-32 w-full rounded-lg object-cover" />}
                    <h3 className="font-semibold text-gray-900">{c.name}</h3>
                    {c.specialization && <span className="mt-1 inline-block rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">{c.specialization}</span>}
                    {c.bio && <p className="mt-2 text-sm text-gray-600">{truncate(c.bio, 100)}</p>}
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
                      {c.years_of_experience != null && <span>{t('years_exp', { n: c.years_of_experience })}</span>}
                      {c.cuisines && c.cuisines.length > 0 && <span>{c.cuisines.join(', ')}</span>}
                    </div>
                    <Button variant="danger" className="mt-3 w-full" size="sm" onClick={() => fireChef(c.id)}>{t('fire')}</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
