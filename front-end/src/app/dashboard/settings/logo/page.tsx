'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth'
import { useLanguage } from '@/contexts/language'
import { api } from '@/lib/api-client'
import { getImageUrl } from '@/lib/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Loader2, Upload, Trash2 } from 'lucide-react'

interface StoreSettings {
  logo: string | null
  cover: string | null
}

export default function LogoCoverPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { t } = useLanguage()
  const logoRef = useRef<HTMLInputElement>(null)
  const coverRef = useRef<HTMLInputElement>(null)
  const [settings, setSettings] = useState<StoreSettings | null>(null)
  const [fetching, setFetching] = useState(true)
  const [uploading, setUploading] = useState<'logo' | 'cover' | null>(null)
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

  async function handleUpload(endpoint: string, file: File, type: 'logo' | 'cover') {
    setUploading(type)
    setError(''); setSuccess('')
    try {
      const res = await api.upload<{ data: StoreSettings }>(endpoint, file, 'image')
      setSettings(res.data)
      setSuccess(t('image_uploaded'))
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('upload_failed'))
    }
    setUploading(null)
  }

  function triggerFileInput(ref: React.RefObject<HTMLInputElement | null>) {
    ref.current?.click()
  }

  if (loading || fetching) return <Skeleton className="h-64 w-full" />
  if (!settings) return <div className="text-red-600">{error || 'Failed to load'}</div>

  const isUploading = uploading !== null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('logo_cover')}</h1>
        <p className="text-gray-500 dark:text-slate-400">{t('logo_cover_desc')}</p>
      </div>
      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {success && <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{success}</div>}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Logo */}
        <Card>
          <CardHeader><h2 className="text-lg font-semibold">{t('logo')}</h2></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center h-48 rounded-xl border-2 border-dashed border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-800/50 relative overflow-hidden group">
              {settings.logo ? (
                <>
                  <img src={getImageUrl(settings.logo) ?? ''} alt="Logo"
                    className="max-h-40 max-w-full object-contain" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button type="button" onClick={() => triggerFileInput(logoRef)}
                      className="flex items-center gap-2 px-4 py-2 bg-white/90 rounded-lg text-sm font-medium text-gray-800 hover:bg-white"
                    >
                      <Upload className="h-4 w-4" /> {t('change')}
                    </button>
                  </div>
                </>
              ) : (
                <button type="button" onClick={() => triggerFileInput(logoRef)}
                  className="flex flex-col items-center gap-2 text-gray-400 hover:text-orange-500 transition-colors"
                >
                  <Upload className="h-10 w-10" />
                  <span className="text-sm font-medium">{t('upload_logo')}</span>
                </button>
              )}
              {uploading === 'logo' && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-xl">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              )}
            </div>
            <input ref={logoRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleUpload('/owner/settings/logo', file, 'logo')
              }} />
          </CardContent>
        </Card>

        {/* Cover */}
        <Card>
          <CardHeader><h2 className="text-lg font-semibold">{t('cover_image')}</h2></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center h-48 rounded-xl border-2 border-dashed border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-800/50 relative overflow-hidden group">
              {settings.cover ? (
                <>
                  <img src={getImageUrl(settings.cover) ?? ''} alt="Cover"
                    className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button type="button" onClick={() => triggerFileInput(coverRef)}
                      className="flex items-center gap-2 px-4 py-2 bg-white/90 rounded-lg text-sm font-medium text-gray-800 hover:bg-white"
                    >
                      <Upload className="h-4 w-4" /> {t('change')}
                    </button>
                  </div>
                </>
              ) : (
                <button type="button" onClick={() => triggerFileInput(coverRef)}
                  className="flex flex-col items-center gap-2 text-gray-400 hover:text-orange-500 transition-colors"
                >
                  <Upload className="h-10 w-10" />
                  <span className="text-sm font-medium">{t('upload_cover')}</span>
                </button>
              )}
              {uploading === 'cover' && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-xl">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              )}
            </div>
            <input ref={coverRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleUpload('/owner/settings/cover', file, 'cover')
              }} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
