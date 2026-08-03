'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useAuth } from '@/contexts/auth'
import { useLanguage } from '@/contexts/language'
import { api } from '@/lib/api-client'
import { Upload, Trash2, Copy, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Asset {
  id: number
  url: string
  original_name: string
  mime_type: string
  size_bytes: number
  width: number | null
  height: number | null
  group: string
  created_at: string
}

interface AssetsResponse {
  data: Asset[]
  meta: { total: number }
}

export default function MediaPage() {
  const { user, loading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [assets, setAssets] = useState<Asset[]>([])
  const [fetching, setFetching] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const fetchAssets = useCallback(async () => {
    setFetching(true)
    try {
      const res = await api.get<AssetsResponse>('/owner/assets')
      setAssets(res.data || [])
    } catch { /* ignore */ }
    setFetching(false)
  }, [])

  useEffect(() => {
    if (loading) return
    if (!user) { router.push('/login'); return }
    fetchAssets()
  }, [user, loading, router, fetchAssets])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      await api.upload('/owner/assets', file, 'image')
      await fetchAssets()
    } catch { /* ignore */ }
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleDelete = async (id: number) => {
    if (!confirm(t('delete_confirm_image'))) return
    try {
      await api.delete(`/owner/assets/${id}`)
      setAssets((prev) => prev.filter((a) => a.id !== id))
    } catch { /* ignore */ }
  }

  const handleCopyUrl = async (url: string, id: number) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch { /* ignore */ }
  }

  function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  if (loading || fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-orange-600 rounded-full animate-spin border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('media')}</h1>
          <p className="text-gray-500 text-sm">{t('manage_media')}</p>
        </div>
        <label className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white cursor-pointer transition-colors ${uploading ? 'bg-orange-400' : 'bg-orange-600 hover:bg-orange-700'}`}>
          <Upload className="h-4 w-4" />
          {uploading ? t('uploading') : t('upload')}
          <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      </div>

      {assets.length === 0 ? (
        <div className="text-center py-16 text-stone-400">
          <div className="text-5xl mb-4">🖼️</div>
          <p className="text-sm font-bold uppercase tracking-wider">{t('no_images')}</p>
          <p className="text-xs mt-2">{t('upload_first')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {assets.map((asset) => (
            <div key={asset.id} className="group relative rounded-xl border border-stone-200 overflow-hidden bg-white">
              <div className="aspect-square overflow-hidden">
                <img
                  src={asset.url}
                  alt={asset.original_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-2.5">
                <p className="text-xs font-medium text-stone-700 truncate">{asset.original_name}</p>
                <p className="text-[10px] text-stone-400">{formatSize(asset.size_bytes)}</p>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleCopyUrl(asset.url, asset.id)}
                  className="rounded-lg bg-black/60 p-1.5 text-white hover:bg-black/80 transition-colors"
                  title={t('copy_url')}
                >
                  {copiedId === asset.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
                <button
                  onClick={() => handleDelete(asset.id)}
                  className="rounded-lg bg-black/60 p-1.5 text-white hover:bg-red-600 transition-colors"
                  title={t('delete_image')}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
