'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { api } from '@/lib/api-client'
import { getImageUrl } from '@/lib/utils'
import { Upload, X, Search } from 'lucide-react'

interface Asset {
  id: number
  url: string
  original_name: string
  mime_type: string
  width: number | null
  height: number | null
}

interface AssetsResponse {
  data: Asset[]
}

interface MediaPickerProps {
  open: boolean
  onClose: () => void
  onSelect: (url: string) => void
}

export function MediaPicker({ open, onClose, onSelect }: MediaPickerProps) {
  const [assets, setAssets] = useState<Asset[]>([])
  const [fetching, setFetching] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [search, setSearch] = useState('')
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
    if (open) {
      fetchAssets()
    }
  }, [open, fetchAssets])

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

  const filtered = search.trim()
    ? assets.filter((a) => a.original_name.toLowerCase().includes(search.toLowerCase()))
    : assets

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <h2 className="text-sm font-bold text-gray-900">Media Library</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search + Upload */}
        <div className="flex items-center gap-3 px-6 py-3 border-b border-gray-50 bg-gray-50/50">
          <div className="flex-1 relative">
            <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search images..."
              className="w-full rounded-lg border border-gray-200 ltr:pl-9 ltr:pr-4 rtl:pr-9 rtl:pl-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all placeholder:text-gray-300 bg-white"
            />
          </div>
          <label className="inline-flex items-center gap-1.5 rounded-lg bg-orange-600 px-3.5 py-2 text-xs font-semibold text-white cursor-pointer hover:bg-orange-700 transition-colors shadow-sm shadow-orange-200">
            <Upload className="h-3.5 w-3.5" />
            {uploading ? '...' : 'Upload'}
            <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
          </label>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {fetching ? (
            <div className="flex items-center justify-center py-16">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 rounded-full border-2 border-orange-200" />
                <div className="absolute inset-0 rounded-full border-2 border-orange-600 border-t-transparent animate-spin" />
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-300">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
              </svg>
              <p className="text-xs font-semibold uppercase tracking-wider mt-3">No images found</p>
              <p className="text-[11px] text-gray-300 mt-1">Upload an image to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {filtered.map((asset) => (
                  <button
                    key={asset.id}
                    onClick={() => { onSelect(getImageUrl(asset.url) ?? asset.url); onClose() }}
                    className="group relative aspect-square rounded-xl border border-gray-200 overflow-hidden hover:border-orange-400 hover:shadow-md hover:shadow-orange-100/50 transition-all cursor-pointer"
                  >
                    <img
                      src={getImageUrl(asset.url) ?? asset.url}
                      alt={asset.original_name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-[10px] font-medium text-white truncate">{asset.original_name}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
