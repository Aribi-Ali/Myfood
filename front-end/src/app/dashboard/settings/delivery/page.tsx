'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth'
import { useLanguage } from '@/contexts/language'
import { api } from '@/lib/api-client'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Loader2 } from 'lucide-react'

interface StoreSettings {
  avg_prep_time: number | null
  zone_radius: number | null
  base_delivery_fee: number | null
  delivery_time_per_km: number | null
}

export default function DeliveryPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { t } = useLanguage()
  const [settings, setSettings] = useState<StoreSettings | null>(null)
  const [fetching, setFetching] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!loading && !user) { router.push('/login'); return }
    if (!user) return
    ;(async () => {
      setFetching(true)
      try {
        const res = await api.get<{ data: StoreSettings }>('/owner/settings')
        setSettings(res.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load')
      }
      setFetching(false)
    })()
  }, [user, loading, router])

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    if (!settings) return
    setSaving(true)
    setError(''); setSuccess('')
    try {
      const res = await api.put<{ data: StoreSettings }>('/owner/settings', {
        avg_prep_time: settings.avg_prep_time,
        zone_radius: settings.zone_radius,
        base_delivery_fee: settings.base_delivery_fee,
        delivery_time_per_km: settings.delivery_time_per_km,
      })
      setSettings(res.data)
      setSuccess('Saved.')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    }
    setSaving(false)
  }

  function update<K extends keyof StoreSettings>(key: K, value: StoreSettings[K]) {
    if (!settings) return
    setSettings({ ...settings, [key]: value })
  }

  if (loading || fetching) return <Skeleton className="h-48 w-full" />
  if (!settings) return <div className="text-red-600">{error || 'Failed to load'}</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('delivery')}</h1>
        <p className="text-gray-500 dark:text-slate-400">{t('delivery_settings_desc')}</p>
      </div>
      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {success && <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{success}</div>}
      <Card>
        <CardHeader><h2 className="text-lg font-semibold">{t('delivery_settings')}</h2></CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4 max-w-lg">
            <Input id="avgPrep" label={t('avg_prep_time')} type="number" value={settings.avg_prep_time ?? ''} onChange={(e) => update('avg_prep_time', e.target.value ? parseInt(e.target.value) : null)} />
            <Input id="zoneRadius" label={t('delivery_zone_radius')} type="number" step="0.1" value={settings.zone_radius ?? ''} onChange={(e) => update('zone_radius', e.target.value ? parseFloat(e.target.value) : null)} />
            <Input id="baseFee" label={t('base_delivery_fee')} type="number" step="0.01" value={settings.base_delivery_fee ?? ''} onChange={(e) => update('base_delivery_fee', e.target.value ? parseFloat(e.target.value) : null)} />
            <Input id="timePerKm" label={t('delivery_time_per_km')} type="number" step="0.1" value={settings.delivery_time_per_km ?? ''} onChange={(e) => update('delivery_time_per_km', e.target.value ? parseFloat(e.target.value) : null)} />
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
