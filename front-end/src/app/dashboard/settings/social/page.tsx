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
import { Loader2, Plus, Trash2, Globe } from 'lucide-react'

const PLATFORM_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  facebook: (props) => <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
  instagram: (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>,
  tiktok: (props) => <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.88 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.36 0 .71.07 1.04.2v-3.5a6.34 6.34 0 0 0-1.04-.08 6.33 6.33 0 1 0 6.33 6.33V8.58a8.22 8.22 0 0 0 4.77 1.53v-3.4a4.84 4.84 0 0 1-1-.02z"/></svg>,
  youtube: (props) => <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12c0 1.95.16 3.87.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14c.34-1.94.5-3.86.5-5.81a31.6 31.6 0 0 0-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z"/></svg>,
  x: (props) => <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  snapchat: (props) => <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M12 22.75c-.49 0-.98-.12-1.41-.35-.33-.18-.68-.28-1.05-.28-.35 0-.7.1-1.01.26l-.01.01c-.32.16-.66.24-1.01.24-.82 0-1.55-.4-2.07-1.11-.27-.37-.5-.8-.67-1.27h-.01c-.17-.47-.27-.9-.27-1.23 0-.14.01-.28.03-.42.07-.52.27-.83.49-1.17.12-.19.25-.38.36-.59.18-.34.2-.69.05-1.01-.21-.44-.73-.69-1.25-.69-.3 0-.6.08-.87.24l-.01.01c-.26.15-.56.24-.87.24-.49 0-.95-.21-1.27-.57-.36-.41-.53-.96-.47-1.52.08-.82.78-1.44 1.69-1.44.14 0 .28.02.42.05.12.03.25.05.38.05.28 0 .53-.07.74-.2.28-.17.41-.44.4-.73 0-.01 0-.02-.01-.03a.82.82 0 0 0-.17-.33l-.02-.02c-.42-.47-.86-.96-1.15-1.56-.2-.4-.32-.84-.35-1.29v-.01c-.1-1.4.36-2.72 1.3-3.72.88-.94 2.09-1.49 3.4-1.57 1.15-.08 2.19.28 3.07 1.03.12.1.24.21.35.32.37.37.68.79.93 1.24.63-1.16 1.73-1.96 3.11-2.17.49-.07.98-.07 1.47.01 1.27.19 2.37.89 3.06 1.96.39.61.62 1.29.67 2.01.04.54-.04 1.08-.24 1.58-.29.72-.76 1.3-1.22 1.88-.07.09-.15.18-.22.27-.13.17-.2.37-.18.58.02.27.18.48.39.61.21.13.46.2.72.2.18 0 .36-.03.53-.08.53-.16 1.1-.12 1.64.01.44.11.84.33 1.16.63.43.4.68.96.68 1.55 0 .51-.19.99-.52 1.35-.32.34-.77.53-1.24.53-.33 0-.65-.09-.93-.27l-.01-.01c-.26-.16-.54-.24-.82-.24-.44 0-.82.22-1.02.58-.15.27-.16.56-.01.83.11.2.24.38.36.57.24.37.46.72.54 1.3.03.2.04.4.04.6 0 1.54-1.16 2.85-2.95 3.33l-.02.01c-.19.05-.38.09-.57.12-.11.02-.22.06-.32.12-.37.2-.61.56-.62.97 0 .1.01.21.04.31.02.06.04.12.04.19 0 .03-.01.06-.01.08z"/></svg>,
  whatsapp: (props) => <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>,
  website: (props) => <Globe className={props.className} />,
}

const PLATFORM_COLORS: Record<string, string> = {
  facebook: 'text-blue-600',
  instagram: 'text-pink-600',
  tiktok: 'text-black dark:text-white',
  youtube: 'text-red-600',
  x: 'text-gray-900 dark:text-white',
  snapchat: 'text-yellow-500',
  whatsapp: 'text-green-500',
  website: 'text-orange-600',
}

interface SocialLink {
  platform?: string
  url?: string
}

interface StoreSettings {
  social_links: SocialLink[] | null
}

export default function SocialPage() {
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
        social_links: settings.social_links,
      })
      setSettings(res.data)
      setSuccess('Saved.')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    }
    setSaving(false)
  }

  function updateLink(i: number, field: 'platform' | 'url', value: string) {
    if (!settings) return
    const updated = [...(settings.social_links || [])]
    updated[i] = { ...updated[i], [field]: value }
    setSettings({ ...settings, social_links: updated })
  }

  function removeLink(i: number) {
    if (!settings) return
    setSettings({ ...settings, social_links: (settings.social_links || []).filter((_, j) => j !== i) })
  }

  function addLink() {
    if (!settings) return
    setSettings({ ...settings, social_links: [...(settings.social_links || []), { platform: '', url: '' }] })
  }

  const links = settings?.social_links || []

  if (loading || fetching) return <Skeleton className="h-48 w-full" />
  if (!settings) return <div className="text-red-600">{error || 'Failed to load'}</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('social_links')}</h1>
        <p className="text-gray-500 dark:text-slate-400">{t('social_links_desc')}</p>
      </div>
      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {success && <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{success}</div>}
      <Card>
        <CardHeader><h2 className="text-lg font-semibold">{t('social_links')}</h2></CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4 max-w-lg">
            {links.map((link, i) => {
              const platform = (link.platform || '').toLowerCase()
              const Icon = PLATFORM_ICONS[platform]
              const color = PLATFORM_COLORS[platform] || 'text-gray-500'
              return (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-slate-700">
                  {Icon ? (
                    <Icon className={`h-5 w-5 shrink-0 ${color}`} />
                  ) : (
                    <Globe className="h-5 w-5 shrink-0 text-gray-400" />
                  )}
                  <div className="flex-1 flex items-center gap-2">
                    <Input
                      placeholder={t('platform')}
                      value={link.platform || ''}
                      onChange={(e) => updateLink(i, 'platform', e.target.value)}
                      className="w-28"
                      list="platforms"
                    />
                    <Input
                      placeholder={t('url_placeholder')}
                      value={link.url || ''}
                      onChange={(e) => updateLink(i, 'url', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <button type="button" onClick={() => removeLink(i)} className="text-red-400 hover:text-red-600 p-1 shrink-0">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )
            })}
            <datalist id="platforms">
              {Object.keys(PLATFORM_ICONS).map(p => <option key={p} value={p} />)}
            </datalist>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={addLink}>
                <Plus className="mr-1 h-4 w-4" /> {t('add_link')}
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('save_changes')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
