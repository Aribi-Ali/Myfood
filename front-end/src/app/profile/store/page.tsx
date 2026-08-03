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
import { Loader2, CheckCircle, Clock, XCircle, AlertCircle, Plus, Trash2, ChevronRight, MapPin } from 'lucide-react'

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
  latitude?: number
  longitude?: number
  wilaya?: string | null
  daira?: string | null
  commune?: string | null
  type_categories?: { id: number; name: string }[]
}

interface StoreTypeCategory {
  id: number
  name: string
}

const STEP_LABELS = [
  '',
  'Basic Info',
  'Store Type',
  'Location',
]

export default function StorePage() {
  const { user, loading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  const [store, setStore] = useState<StoreData | null>(null)
  const [fetching, setFetching] = useState(true)
  const [onboardingStatus, setOnboardingStatus] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState<number>(0)

  // Step 1 fields
  const [name, setName] = useState('')
  const [alias, setAlias] = useState('')
  const [phones, setPhones] = useState<string[]>([''])
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [description, setDescription] = useState('')

  // Step 2 fields
  const [storeTypes, setStoreTypes] = useState<StoreTypeCategory[]>([])
  const [selectedTypeIds, setSelectedTypeIds] = useState<number[]>([])

  // Step 3 fields
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')

  const [saving, setSaving] = useState(false)
  const [creating, setCreating] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function fetchStore() {
    setFetching(true)
    try {
      const res = await api.get<{ data: { onboarding_status: string; current_step: number; store: StoreData } }>('/onboarding/status')
      const s = res.data.store
      setStore(s)
      setOnboardingStatus(res.data.onboarding_status)
      setCurrentStep(res.data.current_step)
      setName(s.name || '')
      setAlias(s.alias || '')
      const loadedPhones = s.phones?.map(p => p.phone) || (s.phone ? [s.phone] : [''])
      setPhones(loadedPhones.length ? loadedPhones : [''])
      setEmail(s.email || '')
      setAddress(s.address || '')
      setDescription(s.description || '')
      setSelectedTypeIds(s.type_categories?.map(c => c.id) || [])
      setLatitude(s.latitude ? String(s.latitude) : '')
      setLongitude(s.longitude ? String(s.longitude) : '')
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

  useEffect(() => {
    if (!store) return
    api.get<{ data: StoreTypeCategory[] }>('/onboarding/store-types').then(res => {
      setStoreTypes(res.data)
    }).catch(() => {})
  }, [store])

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
      setCurrentStep(prev => Math.max(prev, 2))
      setMessage(t('basic_info_saved'))
      await fetchStore()
    } catch (err) {
      setError(err instanceof Error ? err.message : t('failed_to_save_basic_info'))
    }
    setSaving(false)
  }

  async function handleSaveStoreTypes(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await api.post('/onboarding/store-types', { type_ids: selectedTypeIds })
      setCurrentStep(prev => Math.max(prev, 3))
      setMessage('Store types saved')
      await fetchStore()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save store types')
    }
    setSaving(false)
  }

  async function handleSaveLocation(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await api.post('/onboarding/location', {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        address,
      })
      setCurrentStep(prev => Math.max(prev, 6))
      setMessage('Location saved')
      await fetchStore()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save location')
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
      await fetchStore()
    } catch (err) {
      const msg = err instanceof Error ? err.message : t('failed_to_complete_onboarding')
      setError(msg)
    }
    setSaving(false)
  }

  function getStatusBadge() {
    if (store?.is_approved) {
      return { icon: CheckCircle, text: store?.onboarding_status === 'approved' ? t('store_approved') : 'Approved', color: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' }
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
  const isCompleted = onboardingStatus === 'completed'
  const isApproved = store?.is_approved

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

      {/* Approved state - show dashboard button */}
      {store && isApproved && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">Store Approved</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400">Your store is live. You can now manage it from the dashboard.</p>
              </div>
              <Button onClick={() => router.push('/dashboard')}>
                Go to Dashboard
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pending approval state */}
      {store && isCompleted && !isApproved && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Waiting for Admin Approval</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400">Your onboarding is complete. An administrator will review and approve your store soon. You will receive a notification once approved.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Steps indicator for in-progress onboarding */}
      {store && !isCompleted && !isApproved && (
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Setup Progress</h3>
            <div className="space-y-2">
              {STEP_LABELS.slice(1).map((label, i) => {
                const step = i + 1
                const done = currentStep > step
                const active = currentStep === step
                return (
                  <div key={step} className="flex items-center gap-3 text-sm">
                    <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      done ? 'bg-green-500 text-white' :
                      active ? 'bg-orange-500 text-white' :
                      'bg-gray-200 text-gray-400 dark:bg-slate-700 dark:text-slate-500'
                    }`}>
                      {done ? <CheckCircle className="h-4 w-4" /> : step}
                    </div>
                    <span className={done ? 'text-gray-500 dark:text-slate-400 line-through' : active ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-400 dark:text-slate-500'}>
                      {label}
                    </span>
                    {active && (
                      <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">In progress</span>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {!store ? (
        // Step 0: No store yet - create form
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('create_store')}</h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateStore} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('store_name')} *</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('store_alias')} *</label>
                <Input value={alias} onChange={(e) => setAlias(e.target.value)} required placeholder="my-store" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('phone_numbers')} *</label>
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
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('email')} *</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('address')} *</label>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} required />
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
      ) : !isCompleted && !isApproved ? (
        <>
          {/* Step 1: Basic Info */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Step 1: {t('store_basic_info')}
                {currentStep > 1 && <CheckCircle className="inline ml-2 h-4 w-4 text-green-500" />}
              </h3>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveBasicInfo} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('store_name')} *</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('store_alias')} *</label>
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('phone_numbers')} *</label>
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('email')} *</label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t('save_basic_info')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Step 2: Store Types */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Step 2: Store Type
                {currentStep > 2 && <CheckCircle className="inline ml-2 h-4 w-4 text-green-500" />}
              </h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 dark:text-slate-400 mb-3">Select at least one category for your store.</p>
              <form onSubmit={handleSaveStoreTypes}>
                <div className="flex flex-wrap gap-2 mb-4">
                  {storeTypes.map(cat => {
                    const selected = selectedTypeIds.includes(cat.id)
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedTypeIds(prev =>
                          selected ? prev.filter(id => id !== cat.id) : [...prev, cat.id]
                        )}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                          selected
                            ? 'bg-orange-50 text-orange-700 border-orange-300 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-600'
                            : 'bg-white text-gray-600 border-gray-300 hover:border-orange-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {cat.name}
                      </button>
                    )
                  })}
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={saving || selectedTypeIds.length === 0}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Store Types
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Step 3: Location */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Step 3: Location
                {currentStep > 3 && <CheckCircle className="inline ml-2 h-4 w-4 text-green-500" />}
              </h3>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveLocation} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Address *</label>
                  <Input value={address} onChange={(e) => setAddress(e.target.value)} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Latitude *</label>
                    <Input type="number" step="any" value={latitude} onChange={(e) => setLatitude(e.target.value)} required placeholder="36.75" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Longitude *</label>
                    <Input type="number" step="any" value={longitude} onChange={(e) => setLongitude(e.target.value)} required placeholder="3.05" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={saving || !latitude || !longitude}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Location
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Complete Onboarding */}
          {currentStep >= 6 && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">All Required Data Filled</h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400">You have completed all required steps. You can now submit for admin review.</p>
                  </div>
                  <Button onClick={handleCompleteOnboarding} disabled={saving} className="shrink-0">
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t('complete_onboarding')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : null}
    </div>
  )
}
