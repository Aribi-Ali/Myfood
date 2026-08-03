'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api-client'
import { useLanguage, type Locale } from '@/contexts/language'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

interface SystemSettings {
  commission_percentage: number
  delivery_fee: number
  chef_hiring_enabled: boolean
  promo_codes_enabled: boolean
  reservations_enabled: boolean
  reviews_enabled: boolean
  zone_delivery_enabled: boolean
  notifications_push_enabled: boolean
  orders_per_page: number
  foods_per_page: number
  stores_per_page: number
  default_locale: Locale
}

interface SettingsResponse {
  data: SystemSettings
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fetchSettings = () => {
    api.get<SettingsResponse>('/admin/settings')
      .then(res => setSettings(res.data))
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load settings'))
  }

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const res = await api.get<SettingsResponse>('/admin/settings')
        setSettings(res.data)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load settings')
      }
      setLoading(false)
    })()
  }, [])

  const handleSave = async () => {
    if (!settings) return
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      await api.put('/admin/settings', settings)
      setSuccess('Settings saved successfully')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  const handleClearCache = async (type: string) => {
    try {
      await api.post('/admin/cache/clear', { type })
      setSuccess(`Cache cleared: ${type}`)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
    }
  }

  const toggle = (key: keyof SystemSettings) => {
    if (!settings) return
    setSettings({ ...settings, [key]: !settings[key] as boolean })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">System Settings</h1>
        <Card><CardContent className="p-4"><Skeleton className="h-64 w-full" /></CardContent></Card>
      </div>
    )
  }

  if (!settings) {
    return <div className="text-center py-12 text-red-600">{error || 'Failed to load settings'}</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">System Settings</h1>

      {error && <p className="text-red-600 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}

      <Card>
        <CardHeader><h3 className="text-lg font-semibold">Application</h3></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm text-gray-500 block mb-1">Default Language</label>
            <select
              value={settings.default_locale || 'en'}
              onChange={e => setSettings({ ...settings, default_locale: e.target.value as Locale })}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="ar">العربية</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><h3 className="text-lg font-semibold">Financial</h3></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm text-gray-500 block mb-1">Commission Percentage (0-1)</label>
            <Input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={settings.commission_percentage}
              onChange={e => setSettings({ ...settings, commission_percentage: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">Delivery Fee (DA)</label>
            <Input
              type="number"
              min="0"
              value={settings.delivery_fee}
              onChange={e => setSettings({ ...settings, delivery_fee: parseFloat(e.target.value) || 0 })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><h3 className="text-lg font-semibold">Feature Toggles</h3></CardHeader>
        <CardContent className="space-y-3">
          {([
            { key: 'chef_hiring_enabled' as keyof SystemSettings, label: 'Chef Hiring' },
            { key: 'promo_codes_enabled' as keyof SystemSettings, label: 'Promo Codes' },
            { key: 'reservations_enabled' as keyof SystemSettings, label: 'Reservations' },
            { key: 'reviews_enabled' as keyof SystemSettings, label: 'Reviews' },
            { key: 'zone_delivery_enabled' as keyof SystemSettings, label: 'Zone Delivery' },
            { key: 'notifications_push_enabled' as keyof SystemSettings, label: 'Push Notifications' },
          ]).map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm">{label}</span>
              <button
                onClick={() => toggle(key)}
                className={`relative w-11 h-6 rounded-full transition-colors ${settings[key] ? 'bg-red-600' : 'bg-gray-300'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings[key] ? 'translate-x-5' : ''}`} />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><h3 className="text-lg font-semibold">Pagination</h3></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-gray-500 block mb-1">Orders per page</label>
            <Input type="number" min="1" value={settings.orders_per_page} onChange={e => setSettings({ ...settings, orders_per_page: parseInt(e.target.value) || 10 })} />
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">Foods per page</label>
            <Input type="number" min="1" value={settings.foods_per_page} onChange={e => setSettings({ ...settings, foods_per_page: parseInt(e.target.value) || 10 })} />
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">Stores per page</label>
            <Input type="number" min="1" value={settings.stores_per_page} onChange={e => setSettings({ ...settings, stores_per_page: parseInt(e.target.value) || 10 })} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><h3 className="text-lg font-semibold">Cache Management</h3></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => handleClearCache('stores')}>Clear Stores Cache</Button>
          <Button variant="outline" size="sm" onClick={() => handleClearCache('categories')}>Clear Categories Cache</Button>
          <Button variant="outline" size="sm" onClick={() => handleClearCache('foods')}>Clear Foods Cache</Button>
          <Button variant="outline" size="sm" onClick={() => handleClearCache('all')}>Clear All Cache</Button>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving} className="w-full md:w-auto">
        {saving ? 'Saving...' : 'Save Settings'}
      </Button>
    </div>
  )
}
