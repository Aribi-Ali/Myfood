'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth'
import { useLanguage } from '@/contexts/language'
import { api } from '@/lib/api-client'
import { getImageUrl } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Dropzone } from '@/components/dropzone'
import { Trash2 } from 'lucide-react'

interface GalleryImage {
  id: number
  path: string
  created_at: string
}

export default function GalleryPage() {
  const { user, loading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [images, setImages] = useState<GalleryImage[]>([])
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')

  const handleUpload = useCallback(async (file: File) => {
    setError('')
    try {
      const res = await api.upload<{ data: GalleryImage }>('/owner/gallery', file, 'image')
      setImages((prev) => [res.data, ...prev])
    } catch (err) {
      setError(err instanceof Error ? err.message : t('upload_failed'))
    }
  }, [t])

  async function deleteImage(id: number) {
    if (!confirm(t('delete_confirm_image'))) return
    try {
      await api.delete(`/owner/gallery/${id}`)
      setImages((prev) => prev.filter((img) => img.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : t('delete_failed'))
    }
  }

  useEffect(() => {
    if (!loading && !user) { router.push('/login'); return }
    if (!user) return
    ;(async () => {
      setFetching(true)
      setError('')
      try {
        const res = await api.get<{ data: GalleryImage[] }>('/owner/gallery')
        setImages(res.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : t('failed_to_load_gallery'))
      }
      setFetching(false)
    })()
  }, [user, loading, router, t])

  if (loading || fetching) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="mb-4 h-40 w-full rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">{t('gallery')}</h1>
        <p className="text-gray-500 dark:text-slate-400">{t('store_images')}</p>
      </div>

      <Dropzone onUpload={handleUpload} disabled={fetching} />

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">{error}</div>
      )}

      {images.length === 0 && !error ? (
        <Card>
          <CardContent className="p-12 text-center text-gray-500 dark:text-slate-400">
            <p className="font-medium">{t('no_images_yet')}</p>
            <p className="text-sm mt-1">{t('upload_first_image')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
          {images.map((img) => (
            <div key={img.id} className="group relative mb-4 break-inside-avoid">
              <img
                src={getImageUrl(img.path) || ''}
                alt={t('gallery')}
                className="w-full rounded-xl object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => deleteImage(img.id)}
                  className="rounded-full bg-red-600 p-2 text-white hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
