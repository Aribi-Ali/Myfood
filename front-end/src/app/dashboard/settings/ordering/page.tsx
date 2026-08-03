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
import { Loader2, Hash } from 'lucide-react'

interface OrderNumSettings {
  order_prefix: string | null
  order_suffix: string | null
  order_padding: number
  order_start_number: number
}

export default function OrderingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { t } = useLanguage()
  const [settings, setSettings] = useState<OrderNumSettings | null>(null)
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
        const res = await api.get<{ data: OrderNumSettings }>('/owner/settings')
        setSettings({
          order_prefix: res.data.order_prefix ?? null,
          order_suffix: res.data.order_suffix ?? null,
          order_padding: res.data.order_padding ?? 4,
          order_start_number: res.data.order_start_number ?? 1,
        })
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
      await api.put('/owner/settings', settings)
      setSuccess(t('saved'))
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    }
    setSaving(false)
  }

  function update<K extends keyof OrderNumSettings>(key: K, value: OrderNumSettings[K]) {
    if (!settings) return
    setSettings({ ...settings, [key]: value })
  }

  const preview = (() => {
    if (!settings) return ''
    const { order_prefix, order_suffix, order_padding, order_start_number } = settings
    const num = String(order_start_number).padStart(order_padding, '0')
    return `${order_prefix ?? ''}${num}${order_suffix ?? ''}`
  })()

  if (loading || fetching) return <Skeleton className="h-48 w-full" />
  if (!settings) return <div className="text-red-600">{error || 'Failed to load'}</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('order_numbering')}</h1>
        <p className="text-gray-500 dark:text-slate-400">{t('order_numbering_desc')}</p>
      </div>
      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {success && <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{success}</div>}

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">{t('numeration_format')}</h2>
        </CardHeader>
        <CardContent className="space-y-6 max-w-lg">
          <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700">
            <Hash className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">{t('preview')}</p>
              <p className="text-xl font-mono font-bold text-gray-900 dark:text-white">{preview}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('order_prefix')}</label>
              <Input
                value={settings.order_prefix ?? ''}
                onChange={(e) => update('order_prefix', e.target.value || null)}
                placeholder="ORD-"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('order_suffix')}</label>
              <Input
                value={settings.order_suffix ?? ''}
                onChange={(e) => update('order_suffix', e.target.value || null)}
                placeholder="-2024"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('order_padding')}</label>
              <Input
                type="number" min={0} max={10}
                value={settings.order_padding}
                onChange={(e) => update('order_padding', Math.max(0, Math.min(10, parseInt(e.target.value) || 0)))}
              />
              <p className="text-xs text-gray-500 mt-1">{t('order_padding_desc')}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('order_start_number')}</label>
              <Input
                type="number" min={0}
                value={settings.order_start_number}
                onChange={(e) => update('order_start_number', Math.max(0, parseInt(e.target.value) || 0))}
              />
              <p className="text-xs text-gray-500 mt-1">{t('order_start_number_desc')}</p>
            </div>
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
