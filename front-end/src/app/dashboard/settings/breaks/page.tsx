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
import { Loader2, PauseCircle, PlayCircle } from 'lucide-react'

interface StoreSettings {
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

export default function BreaksPage() {
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
        is_active: settings.is_active,
        ordering_enabled: settings.ordering_enabled,
        break_start: settings.break_start,
        break_end: settings.break_end,
        break_note: settings.break_note,
        is_paused: settings.is_paused,
        pause_note: settings.pause_note,
        allows_pre_orders: settings.allows_pre_orders,
        pre_order_lead_time_hours: settings.pre_order_lead_time_hours,
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('breaks_activity')}</h1>
        <p className="text-gray-500 dark:text-slate-400">{t('breaks_activity_desc')}</p>
      </div>
      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {success && <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{success}</div>}

      <Card>
        <CardHeader><h2 className="text-lg font-semibold">{t('store_status')}</h2></CardHeader>
        <CardContent className="space-y-6 max-w-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{t('enable_ordering')}</p>
              <p className="text-xs text-gray-500">{t('enable_ordering_desc')}</p>
            </div>
            <button
              onClick={() => update('ordering_enabled', !settings.ordering_enabled)}
              className={`relative h-6 w-11 rounded-full transition-colors ${settings.ordering_enabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-slate-600'}`}
            >
              <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${settings.ordering_enabled ? 'translate-x-5' : ''}`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{t('store_active')}</p>
              <p className="text-xs text-gray-500">{t('store_active_desc')}</p>
            </div>
            <button
              onClick={() => update('is_active', !settings.is_active)}
              className={`relative h-6 w-11 rounded-full transition-colors ${settings.is_active ? 'bg-green-500' : 'bg-gray-300 dark:bg-slate-600'}`}
            >
              <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${settings.is_active ? 'translate-x-5' : ''}`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{t('pause_store')}</p>
              <p className="text-xs text-gray-500">{t('pause_store_desc')}</p>
            </div>
            <button
              onClick={() => update('is_paused', !settings.is_paused)}
              className={`relative h-6 w-11 rounded-full transition-colors ${settings.is_paused ? 'bg-amber-500' : 'bg-gray-300 dark:bg-slate-600'}`}
            >
              <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${settings.is_paused ? 'translate-x-5' : ''}`} />
            </button>
          </div>

          {settings.is_paused && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('pause_reason')}</label>
              <Input value={settings.pause_note || ''} onChange={(e) => update('pause_note', e.target.value)} placeholder={t('pause_reason_placeholder')} />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><h2 className="text-lg font-semibold">{t('scheduled_break')}</h2></CardHeader>
        <CardContent className="space-y-4 max-w-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('break_start')}</label>
              <Input type="time" value={settings.break_start?.slice(0, 5) || ''} onChange={(e) => update('break_start', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('break_end')}</label>
              <Input type="time" value={settings.break_end?.slice(0, 5) || ''} onChange={(e) => update('break_end', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('break_note')}</label>
            <Input value={settings.break_note || ''} onChange={(e) => update('break_note', e.target.value)} placeholder={t('break_note_placeholder')} />
          </div>

          <div className="border-t border-gray-100 dark:border-slate-700 pt-4 mt-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{t('allows_pre_orders')}</p>
                <p className="text-xs text-gray-500">{t('allows_pre_orders_desc')}</p>
              </div>
              <button
                onClick={() => update('allows_pre_orders', !settings.allows_pre_orders)}
                className={`relative h-6 w-11 rounded-full transition-colors ${settings.allows_pre_orders ? 'bg-green-500' : 'bg-gray-300 dark:bg-slate-600'}`}
              >
                <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${settings.allows_pre_orders ? 'translate-x-5' : ''}`} />
              </button>
            </div>
            {settings.allows_pre_orders && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('pre_order_lead_time_hours')}</label>
                <Input type="number" min="1" value={settings.pre_order_lead_time_hours || ''} onChange={(e) => update('pre_order_lead_time_hours', parseInt(e.target.value) || null)} />
              </div>
            )}
          </div>

          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('save_changes')}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
