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

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

interface StoreSettings {
  opening_hours: Record<string, { open: string; close: string; closed?: boolean }> | null
}

export default function HoursPage() {
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
        opening_hours: settings.opening_hours,
      })
      setSettings(res.data)
      setSuccess('Saved.')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    }
    setSaving(false)
  }

  function updateHours(day: string, field: string, value: any) {
    if (!settings?.opening_hours) return
    const updated = { ...settings.opening_hours, [day]: { ...(settings.opening_hours[day] || { open: '09:00', close: '18:00' }), [field]: value } }
    setSettings({ ...settings, opening_hours: updated })
  }

  if (loading || fetching) return <Skeleton className="h-48 w-full" />
  if (!settings) return <div className="text-red-600">{error || 'Failed to load'}</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('opening_hours')}</h1>
        <p className="text-gray-500 dark:text-slate-400">{t('set_opening_hours')}</p>
      </div>
      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {success && <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{success}</div>}
      <Card>
        <CardHeader><h2 className="text-lg font-semibold">{t('weekly_hours')}</h2></CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4 max-w-lg">
            {DAYS.map((day) => {
              const hours = settings.opening_hours?.[day] || { open: '09:00', close: '18:00', closed: false }
              return (
                <div key={day} className="flex items-center gap-3">
                  <span className="w-24 text-sm font-medium text-gray-700 dark:text-slate-300 capitalize">{t(day)}</span>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={!!hours.closed}
                      onChange={(e) => updateHours(day, 'closed', e.target.checked)}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    /> {t('closed')}
                  </label>
                  {!hours.closed && (
                    <>
                      <Input type="time" value={hours.open || '09:00'} onChange={(e) => updateHours(day, 'open', e.target.value)} className="w-32" />
                      <span className="text-gray-500">{t('to')}</span>
                      <Input type="time" value={hours.close || '18:00'} onChange={(e) => updateHours(day, 'close', e.target.value)} className="w-32" />
                    </>
                  )}
                </div>
              )
            })}
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
