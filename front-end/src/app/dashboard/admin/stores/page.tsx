'use client'

import { useCallback, useEffect, useState } from 'react'
import { api } from '@/lib/api-client'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, ChevronLeft, ChevronRight, Eye, X, Store as StoreIcon, CheckCircle, XCircle, Ban, Play, Star, ShoppingBag, MapPin, Phone, Mail, Clock } from 'lucide-react'

interface Badge {
  id: number
  name: string
  color_code: string
  icon: string | null
}

interface Store {
  id: number
  name: string
  alias: string
  description: string | null
  address: string | null
  phone: string | null
  email: string | null
  logo_path: string | null
  cover_image: string | null
  is_approved: boolean
  is_active: boolean
  ordering_enabled: boolean
  owner: { id: number; name: string; email: string; phone: string | null }
  badges: Badge[]
  reviews_avg_rating: number | null
  reviews_count: number
  created_at: string
  food?: { id: number; name: string }[]
  template_slug: string | null
}

interface StoresResponse {
  data: { data: Store[]; last_page: number; total: number }
}

interface BadgesResponse {
  data: Badge[]
}

const FILTERS = [
  { key: 'pending', label: 'Pending', icon: Clock },
  { key: 'approved', label: 'Approved', icon: CheckCircle },
  { key: 'suspended', label: 'Suspended', icon: Ban },
  { key: 'all', label: 'All', icon: StoreIcon },
] as const

export default function AdminStoresPage() {
  const [stores, setStores] = useState<Store[]>([])
  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [filter, setFilter] = useState('pending')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [detailStore, setDetailStore] = useState<Store | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', description: '', phone: '', address: '', is_approved: true, ordering_enabled: true })

  const fetchStores = useCallback(() => {
    setLoading(true)
    setError('')
    const params = new URLSearchParams({ filter, page: String(page) })
    if (search) params.set('search', search)
    api.get<StoresResponse>('/admin/stores?' + params.toString())
      .then(res => {
        setStores(res.data?.data || [])
        setLastPage(res.data?.last_page || 1)
        setTotal(res.data?.total || 0)
      })
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load stores'))
      .finally(() => setLoading(false))
  }, [filter, page, search])

  useEffect(() => { fetchStores() }, [fetchStores])

  useEffect(() => {
    api.get<BadgesResponse>('/admin/badges')
      .then(res => setBadges(res.data || []))
      .catch(() => {})
  }, [])

  const handleSearch = () => { setSearch(searchInput); setPage(1) }

  const action = async (label: string, url: string, cb?: () => void) => {
    try {
      await api.post(url)
      setSuccess(label)
      fetchStores()
      cb?.()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : `Failed: ${label}`)
    }
  }

  const openDetail = async (id: number) => {
    setDetailLoading(true)
    setEditMode(false)
    try {
      const res = await api.get<{ data: Store }>(`/admin/stores/${id}`)
      setDetailStore(res.data)
        setEditForm({
          name: res.data.name || '',
          description: res.data.description || '',
          phone: res.data.phone || '',
          address: res.data.address || '',
          is_approved: res.data.is_approved,
          ordering_enabled: res.data.ordering_enabled ?? true,
        })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load store details')
    }
    setDetailLoading(false)
  }

  const saveEdit = async () => {
    if (!detailStore) return
    try {
      await api.put(`/admin/stores/${detailStore.id}`, editForm)
      setSuccess('Store updated')
      setEditMode(false)
      openDetail(detailStore.id)
      fetchStores()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Update failed')
    }
  }

  const assignBadge = (storeId: number, badgeId: number) => {
    api.post(`/admin/stores/${storeId}/badges/${badgeId}`)
      .then(() => { fetchStores(); openDetail(storeId) })
      .catch(err => setError(err instanceof Error ? err.message : 'Failed'))
  }

  const removeBadge = (storeId: number, badgeId: number) => {
    api.delete(`/admin/stores/${storeId}/badges/${badgeId}`)
      .then(() => { fetchStores(); openDetail(storeId) })
      .catch(err => setError(err instanceof Error ? err.message : 'Failed'))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Restaurants</h1>
          <p className="text-sm text-gray-500">{total} total</p>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2 flex items-center justify-between"><span>{error}</span><button onClick={() => setError('')}><X className="h-4 w-4" /></button></div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-2 flex items-center justify-between"><span>{success}</span><button onClick={() => setSuccess('')}><X className="h-4 w-4" /></button></div>}

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {FILTERS.map(({ key, label, icon: Icon }) => (
            <Button key={key} variant={filter === key ? 'primary' : 'outline'} size="sm"
              onClick={() => { setFilter(key); setPage(1) }}
              className={cn(filter === key && 'bg-gray-900 text-white hover:bg-gray-800')}>
              <Icon className="h-3.5 w-3.5 mr-1" />{label}
            </Button>
          ))}
        </div>
        <div className="flex gap-2 ml-auto">
          <Input placeholder="Search name or owner..." value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()} className="w-52" />
          <Button variant="outline" size="sm" onClick={handleSearch}><Search className="h-4 w-4" /></Button>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}><CardContent className="p-5"><Skeleton className="h-32 w-full" /></CardContent></Card>
          ))}
        </div>
      ) : stores.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <StoreIcon className="h-16 w-16 mx-auto mb-4 text-gray-200" />
          <p className="text-lg font-medium text-gray-500">No {filter !== 'all' ? filter : ''} stores</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stores.map(s => (
            <Card key={s.id} className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden group" onClick={() => openDetail(s.id)}>
              <div className="h-28 bg-gradient-to-br from-orange-50 to-amber-100 relative">
                {s.cover_image ? (
                  <img src={s.cover_image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <StoreIcon className="h-10 w-10 text-orange-200" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  {!s.is_approved && <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200">Pending</span>}
                  {s.is_approved && s.is_active && <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200">Active</span>}
                  {!s.is_active && <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">Suspended</span>}
                </div>
                {s.logo_path && (
                  <div className="absolute -bottom-6 left-4 w-12 h-12 rounded-xl border-2 border-white bg-white shadow-md overflow-hidden">
                    <img src={s.logo_path} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <CardContent className={cn('p-4', s.logo_path ? 'pt-8' : 'pt-3')}>
                <h3 className="font-semibold text-gray-900 truncate">{s.name}</h3>
                <p className="text-xs text-gray-500 truncate">{s.owner?.name} · @{s.alias}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  {s.reviews_avg_rating != null && (
                    <span className="flex items-center gap-1"><Star className="h-3 w-3 text-amber-400" />{s.reviews_avg_rating.toFixed(1)}</span>
                  )}
                  {s.reviews_count > 0 && <span className="flex items-center gap-1"><ShoppingBag className="h-3 w-3" />{s.reviews_count} reviews</span>}
                  {s.reviews_count > 0 && <span>{s.reviews_count} reviews</span>}
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {s.badges?.map(b => (
                    <span key={b.id} className="text-[10px] px-1.5 py-0.5 rounded-full text-white font-medium" style={{ backgroundColor: b.color_code }}>{b.name}</span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {lastPage > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}><ChevronLeft className="h-4 w-4" /></Button>
          <span className="text-sm text-gray-600">Page {page} / {lastPage}</span>
          <Button variant="outline" size="sm" disabled={page >= lastPage} onClick={() => setPage(p => Math.min(lastPage, p + 1))}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      )}

      {detailLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <Card><CardContent className="p-6"><Skeleton className="h-48 w-96" /></CardContent></Card>
        </div>
      )}

      {detailStore && !detailLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => { setDetailStore(null); setEditMode(false) }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {editMode ? (
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Edit {detailStore.name}</h3>
                  <button onClick={() => setEditMode(false)}><X className="h-5 w-5 text-gray-400" /></button>
                </div>
                <div><label className="text-xs text-gray-500">Name</label><Input value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} /></div>
                <div><label className="text-xs text-gray-500">Description</label><textarea value={editForm.description} onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm min-h-[80px]" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs text-gray-500">Phone</label><Input value={editForm.phone} onChange={e => setEditForm(p => ({ ...p, phone: e.target.value }))} /></div>
                  <div><label className="text-xs text-gray-500">Address</label><Input value={editForm.address} onChange={e => setEditForm(p => ({ ...p, address: e.target.value }))} /></div>
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={editForm.is_approved} onChange={e => setEditForm(p => ({ ...p, is_approved: e.target.checked }))} className="rounded" />
                  Approved
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={editForm.ordering_enabled} onChange={e => setEditForm(p => ({ ...p, ordering_enabled: e.target.checked }))} className="rounded" />
                  Ordering Enabled
                </label>
                <Button className="w-full" onClick={saveEdit}>Save Changes</Button>
              </div>
            ) : (
              <div>
                <div className="h-36 bg-gradient-to-br from-orange-50 to-amber-100 relative">
                  {detailStore.cover_image ? (
                    <img src={detailStore.cover_image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><StoreIcon className="h-14 w-14 text-orange-200" /></div>
                  )}
                  <button onClick={() => { setDetailStore(null); setEditMode(false) }} className="absolute top-3 right-3 bg-white/80 rounded-full p-1 hover:bg-white">
                    <X className="h-5 w-5 text-gray-600" />
                  </button>
                  {detailStore.logo_path && (
                    <div className="absolute -bottom-8 left-6 w-16 h-16 rounded-xl border-4 border-white bg-white shadow-lg overflow-hidden">
                      <img src={detailStore.logo_path} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className={cn('px-6', detailStore.logo_path ? 'pt-10' : 'pt-5', 'pb-6')}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{detailStore.name}</h2>
                      <p className="text-sm text-gray-500">@{detailStore.alias}</p>
                    </div>
                    <div className="flex gap-1.5">
                      {!detailStore.is_approved && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => action('Approved', `/admin/stores/${detailStore.id}/approve`)}>
                          <CheckCircle className="h-3.5 w-3.5 mr-1" />Approve
                        </Button>
                      )}
                      {detailStore.is_approved && !detailStore.is_active && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => action('Unsuspended', `/admin/stores/${detailStore.id}/unsuspend`)}>
                          <Play className="h-3.5 w-3.5 mr-1" />Unsuspend
                        </Button>
                      )}
                      {detailStore.is_approved && detailStore.is_active && (
                        <Button size="sm" variant="outline" className="text-red-600 border-red-200" onClick={() => action('Suspended', `/admin/stores/${detailStore.id}/suspend`, () => setDetailStore(null))}>
                          <Ban className="h-3.5 w-3.5 mr-1" />Suspend
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => setEditMode(true)}>Edit</Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Star className="h-4 w-4 text-amber-400" /> {detailStore.reviews_avg_rating?.toFixed(1) || '—'} ({detailStore.reviews_count})</span>
                      <button onClick={() => action(detailStore.ordering_enabled ? 'Ordering disabled' : 'Ordering enabled', `/admin/stores/${detailStore.id}/toggle-ordering`, () => setDetailStore(null))}
                        className={cn('flex items-center gap-1 hover:underline cursor-pointer', detailStore.ordering_enabled ? 'text-green-600' : 'text-gray-400')}>
                        <ShoppingBag className="h-4 w-4" />{detailStore.ordering_enabled ? 'Orders on' : 'Orders off'}
                      </button>
                    <span className={cn('flex items-center gap-1', detailStore.is_active ? 'text-green-600' : 'text-red-500')}>
                      {detailStore.is_active ? 'Active' : 'Suspended'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-gray-400" /><span>{detailStore.owner?.email || '—'}</span></div>
                      <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-gray-400" /><span>{detailStore.phone || detailStore.owner?.phone || '—'}</span></div>
                      <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gray-400" /><span className="truncate">{detailStore.address || '—'}</span></div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-gray-400" /><span>Created {detailStore.created_at?.split('T')[0]}</span></div>
                      {detailStore.template_slug && <div className="text-xs text-gray-400">Template: {detailStore.template_slug}</div>}
                      <div className="text-xs text-gray-400">Owner: {detailStore.owner?.name}</div>
                    </div>
                  </div>

                  {detailStore.description && (
                    <div className="mt-4">
                      <p className="text-xs text-gray-500 mb-1">Description</p>
                      <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{detailStore.description}</p>
                    </div>
                  )}

                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-gray-500 font-medium">Badges</p>
                      <select className="text-xs border rounded px-2 py-1"
                        onChange={e => { if (e.target.value) { assignBadge(detailStore.id, Number(e.target.value)); e.target.value = '' } }}
                        defaultValue="">
                        <option value="" disabled>Add badge...</option>
                        {badges.filter(b => !detailStore.badges?.some(sb => sb.id === b.id)).map(b => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {detailStore.badges?.length ? detailStore.badges.map(b => (
                        <span key={b.id} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: b.color_code }}>
                          {b.name}
                          <button onClick={() => removeBadge(detailStore.id, b.id)} className="hover:text-white/80">&times;</button>
                        </span>
                      )) : <span className="text-xs text-gray-400">No badges</span>}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
