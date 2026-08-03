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
import { Loader2, Plus, Trash2 } from 'lucide-react'

interface StoreSettings {
  name: string
  alias: string
  description: string | null
  phone: string | null
  phones?: { id: number; phone: string; is_primary: boolean }[]
  email: string | null
  address: string | null
  logo: string | null
  cover: string | null
  opening_hours: any
  avg_prep_time: number | null
  zone_radius: number | null
  base_delivery_fee: number | null
  delivery_time_per_km: number | null
  social_links: any[] | null
  is_active: boolean
  ordering_enabled: boolean
  break_start: string | null
  break_end: string | null
  break_note: string | null
  is_paused: boolean
  pause_note: string | null
  allows_pre_orders: boolean
  pre_order_lead_time_hours: number | null
}

export default function GeneralSettingsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { t } = useLanguage()
  const [settings, setSettings] = useState<StoreSettings | null>(null)
  const [fetching, setFetching] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [phones, setPhones] = useState<string[]>([''])

  useEffect(() => {
    if (!loading && !user) { router.push('/login'); return }
    if (!user) return
    ;(async () => {
      setFetching(true)
      try {
        const res = await api.get<{ data: StoreSettings }>('/owner/settings')
        setSettings(res.data)
        const loadedPhones = res.data.phones?.map(p => p.phone) || (res.data.phone ? [res.data.phone] : [''])
        setPhones(loadedPhones.length ? loadedPhones : [''])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load settings')
      }
      setFetching(false)
    })()
  }, [user, loading, router])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!settings) return
    setSaving(true)
    setError('')
    setSuccess('')
    const validPhones = phones.filter(Boolean)
    try {
      const res = await api.put<{ data: StoreSettings }>('/owner/settings', {
        name: settings.name,
        alias: settings.alias,
        description: settings.description,
        phone: validPhones[0] || settings.phone,
        phones: validPhones.length > 1 ? validPhones : undefined,
        email: settings.email,
        address: settings.address,
      })
      setSettings(res.data)
      setSuccess('Settings saved.')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    }
    setSaving(false)
  }

  function updateField<K extends keyof StoreSettings>(key: K, value: StoreSettings[K]) {
    if (!settings) return
    setSettings({ ...settings, [key]: value })
  }

  if (loading || fetching) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Card><CardContent className="p-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <Card><CardContent className="p-6 text-center text-red-600">{error || 'Failed to load settings.'}</CardContent></Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('general_info')}</h1>
        <p className="text-gray-500 dark:text-slate-400">{t('manage_your_store')}</p>
      </div>

      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">{error}</div>}
      {success && <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-300">{success}</div>}

      <Card>
        <CardHeader><h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('general_info')}</h2></CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4 max-w-lg">
            <Input id="name" label={t('store_name')} value={settings.name} onChange={(e) => updateField('name', e.target.value)} required />
            <Input id="alias" label={t('store_alias')} value={settings.alias} onChange={(e) => updateField('alias', e.target.value)} required />
            <div>
              <label htmlFor="desc" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('description')}</label>
              <textarea id="desc" value={settings.description || ''} onChange={(e) => updateField('description', e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200" rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('phone_numbers')}</label>
              {phones.map((p, i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <Input
                    value={p}
                    onChange={(e) => {
                      const next = [...phones]; next[i] = e.target.value; setPhones(next)
                    }}
                    placeholder={t('phone_placeholder')}
                  />
                  {phones.length > 1 && (
                    <button type="button" onClick={() => setPhones(phones.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 p-1">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  {i === phones.length - 1 && (
                    <button type="button" onClick={() => setPhones([...phones, ''])} className="text-orange-500 hover:text-orange-600 p-1">
                      <Plus className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <Input id="email" label={t('email')} type="email" value={settings.email || ''} onChange={(e) => updateField('email', e.target.value)} />
            <Input id="address" label={t('address')} value={settings.address || ''} onChange={(e) => updateField('address', e.target.value)} />
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('save_changes')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
