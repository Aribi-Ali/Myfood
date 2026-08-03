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
import { Loader2, Store, CheckCircle, Clock, XCircle, AlertCircle, Plus, Trash2 } from 'lucide-react'

interface StoreData {
  id: number
  name: string
  alias: string
  description: string | null
  phone: string | null
  phones?: { id: number; phone: string; is_primary: boolean }[]
  email: string | null
  address: string | null
  logo: string | null
  cover: string | null
  is_approved: boolean
  is_active: boolean
  onboarding_status: string
}

export default function StorePage() {
  const { user, loading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  const [store, setStore] = useState<StoreData | null>(null)
  const [fetching, setFetching] = useState(true)
  const [onboardingStatus, setOnboardingStatus] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [alias, setAlias] = useState('')
  const [phones, setPhones] = useState<string[]>([''])
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [description, setDescription] = useState('')

  const [saving, setSaving] = useState(false)
  const [creating, setCreating] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function fetchStore() {
    setFetching(true)
    try {
      const res = await api.get<{ data: { onboarding_status: string; store: StoreData } }>('/onboarding/status')
      setStore(res.data.store)
      setOnboardingStatus(res.data.onboarding_status)
      setName(res.data.store.name || '')
      setAlias(res.data.store.alias || '')
      const loadedPhones = res.data.store.phones?.map(p => p.phone) || (res.data.store.phone ? [res.data.store.phone] : [''])
      setPhones(loadedPhones.length ? loadedPhones : [''])
      setEmail(res.data.store.email || '')
      setAddress(res.data.store.address || '')
      setDescription(res.data.store.description || '')
    } catch {
      setStore(null)
      setOnboardingStatus(null)
    }
    setFetching(false)
  }

  useEffect(() => {
    if (!loading && !user) { router.push('/login'); return }
    if (!user) return
    fetchStore()
  }, [user, loading, router])

  async function handleCreateStore(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)
    setError('')
    const validPhones = phones.filter(Boolean)
    try {
      const res = await api.post<{ data: StoreData }>('/client/store', {
        name, alias, phone: validPhones[0] || '', phones: validPhones, email, address,
      })
      setStore(res.data)
      setOnboardingStatus('pending')
      setMessage(t('store_created'))
    } catch (err) {
      setError(err instanceof Error ? err.message : t('failed_to_create_store'))
    }
    setCreating(false)
  }

  async function handleSaveBasicInfo(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const validPhones = phones.filter(Boolean)
    try {
      await api.post('/onboarding/basic-info', {
        name, description, phone: validPhones[0] || '', phones: validPhones, email, address,
      })
      setMessage(t('basic_info_saved'))
    } catch (err) {
      setError(err instanceof Error ? err.message : t('failed_to_save_basic_info'))
    }
    setSaving(false)
  }

  async function handleCompleteOnboarding() {
    setSaving(true)
    setError('')
    try {
      await api.post('/onboarding/complete')
      setOnboardingStatus('completed')
      setMessage(t('onboarding_completed'))
    } catch (err) {
      setError(err instanceof Error ? err.message : t('failed_to_complete_onboarding'))
    }
    setSaving(false)
  }

  function getStatusBadge() {
    if (store?.is_approved) {
      return { icon: CheckCircle, text: t('store_approved'), color: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' }
    }
    switch (onboardingStatus) {
      case 'completed':
        return { icon: Clock, text: t('store_pending_approval'), color: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' }
      case 'rejected':
        return { icon: XCircle, text: t('store_rejected'), color: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20' }
      case 'approved':
        return { icon: CheckCircle, text: t('store_approved'), color: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' }
      default:
        return { icon: AlertCircle, text: t('store_pending_setup'), color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' }
    }
  }

  if (loading || fetching) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Card><CardContent className="p-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
      </div>
    )
  }

  const statusBadge = getStatusBadge()
  const StatusIcon = statusBadge.icon

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('my_store')}</h1>
        <p className="text-gray-500 dark:text-slate-400">{t('my_store_desc')}</p>
      </div>

      {message && (
        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-300">{message}</div>
      )}
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">{error}</div>
      )}

      {store && (
        <div className={`flex items-center gap-3 rounded-lg border px-4 py-3 dark:border-slate-700 ${statusBadge.color}`}>
          <StatusIcon className="h-5 w-5" />
          <span className="text-sm font-medium">{statusBadge.text}</span>
        </div>
      )}

      {!store ? (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('create_store')}</h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateStore} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('store_name')}</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('store_alias')}</label>
                <Input value={alias} onChange={(e) => setAlias(e.target.value)} required placeholder="my-store" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('phone_numbers')}</label>
                {phones.map((p, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <Input
                      value={p}
                      onChange={(e) => {
                        const next = [...phones]
                        next[i] = e.target.value
                        setPhones(next)
                      }}
                      placeholder={t('phone_placeholder')}
                    />
                    {phones.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setPhones(phones.filter((_, j) => j !== i))}
                        className="text-red-400 hover:text-red-600 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                    {i === phones.length - 1 && (
                      <button
                        type="button"
                        onClick={() => setPhones([...phones, ''])}
                        className="text-orange-500 hover:text-orange-600 p-1"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('email')}</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('address')}</label>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={creating}>
                  {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t('create_store_btn')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('store_basic_info')}</h3>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveBasicInfo} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('store_name')}</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('store_alias')}</label>
                  <Input value={alias} onChange={(e) => setAlias(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('description')}</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('phone_numbers')}</label>
                  {phones.map((p, i) => (
                    <div key={i} className="flex items-center gap-2 mb-2">
                      <Input
                        value={p}
                        onChange={(e) => {
                          const next = [...phones]
                          next[i] = e.target.value
                          setPhones(next)
                        }}
                        placeholder={t('phone_placeholder')}
                      />
                      {phones.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setPhones(phones.filter((_, j) => j !== i))}
                          className="text-red-400 hover:text-red-600 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                      {i === phones.length - 1 && (
                        <button
                          type="button"
                          onClick={() => setPhones([...phones, ''])}
                          className="text-orange-500 hover:text-orange-600 p-1"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('email')}</label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('address')}</label>
                  <Input value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div className="flex justify-end gap-3">
                  {onboardingStatus !== 'approved' && onboardingStatus !== 'completed' && (
                    <Button variant="outline" onClick={handleCompleteOnboarding} disabled={saving}>
                      {t('complete_onboarding')}
                    </Button>
                  )}
                  <Button type="submit" disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t('save_basic_info')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('store_details')}</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-gray-500 dark:text-slate-400">{t('status')}</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{store.is_active ? t('active') : t('inactive')}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-slate-400">{t('approval')}</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{store.is_approved ? t('approved') : t('pending')}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-slate-400">{t('onboarding')}</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{store.onboarding_status}</p>
                </div>
                {store.logo && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-slate-400">{t('logo')}</p>
                    <img src={store.logo} alt="Store logo" className="mt-1 h-12 w-12 rounded-lg object-cover" />
                  </div>
                )}
              </div>
              <Button variant="outline" className="w-full" onClick={() => router.push('/profile/store')}>
                Open Full Store Setup Wizard
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
