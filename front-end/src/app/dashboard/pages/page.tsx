'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/contexts/auth'
import { useLanguage } from '@/contexts/language'
import { api } from '@/lib/api-client'
import { Plus, ExternalLink, Pencil, Trash2, Home } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface PageItem {
  slug: string | null
  title: string
  is_main: boolean
}

export default function PagesPage() {
  const { user, loading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [pages, setPages] = useState<PageItem[]>([])
  const [fetching, setFetching] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newSlug, setNewSlug] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  const [storeAlias, setStoreAlias] = useState('')

  const fetchPages = useCallback(async () => {
    setFetching(true)
    try {
      const [pagesRes, storeRes] = await Promise.all([
        api.get<{ pages: PageItem[] }>('/owner/pages'),
        api.get<{ store: { alias: string } }>('/owner/store'),
      ])
      setPages(pagesRes.pages)
      setStoreAlias(storeRes.store.alias)
    } catch { /* ignore */ }
    setFetching(false)
  }, [])

  useEffect(() => {
    if (loading) return
    if (!user) { router.push('/login'); return }
    fetchPages()
  }, [user, loading, router, fetchPages])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSlug.trim()) return
    setCreating(true)
    setCreateError('')
    try {
      await api.post('/owner/pages', { slug: newSlug.trim(), title: newTitle.trim() || undefined })
      setNewSlug('')
      setNewTitle('')
      setShowCreate(false)
      await fetchPages()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t('failed_to_create_page')
      setCreateError(msg)
    }
    setCreating(false)
  }

  const handleDelete = async (slug: string | null) => {
    if (!confirm(t('delete_page_confirm'))) return
    try {
      if (slug) {
        await api.delete(`/owner/pages/${slug}`)
      }
      await fetchPages()
    } catch { /* ignore */ }
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
          <h1 className="text-2xl font-bold text-gray-900">{t('pages')}</h1>
          <p className="text-gray-500 text-sm">{t('manage_pages')}</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> {t('new_page')}
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="rounded-xl border border-stone-200 bg-white p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-1.5">{t('slug')}</label>
            <input
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              placeholder="about-us"
              required
              className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
            />
            <p className="text-xs text-stone-400 mt-1">URL: /stores/{storeAlias || 'your-store'}/page/<strong>{newSlug || 'slug'}</strong></p>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-1.5">{t('title_optional')}</label>
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="About Us"
              className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
            />
          </div>
          {createError && <p className="text-xs font-bold text-red-500">{createError}</p>}
          <div className="flex gap-3">
            <button type="submit" disabled={creating || !newSlug.trim()}
              className="rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-700 transition-colors disabled:opacity-50">
              {creating ? t('creating') : t('create_page')}
            </button>
            <button type="button" onClick={() => setShowCreate(false)}
              className="rounded-lg border border-stone-200 px-5 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors">
              {t('cancel')}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {pages.map((page) => (
          <div key={page.slug || '__main__'} className="rounded-xl border border-stone-200 bg-white p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-stone-100 p-3 text-stone-600">
                {page.is_main ? <Home className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
              </div>
              <div>
                <p className="font-bold text-gray-900">{page.title}</p>
                <p className="text-xs text-stone-500">
                  {page.is_main ? '/' : `/page/${page.slug}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/stores/${storeAlias}${page.is_main ? '' : `/page/${page.slug}`}`} target="_blank"
                className="rounded-lg border border-stone-200 p-2 text-stone-500 hover:bg-stone-50 hover:text-blue-600 transition-colors">
                <ExternalLink className="h-4 w-4" />
              </Link>
              <Link href={page.is_main ? '/dashboard/page-builder' : `/dashboard/page-builder?page=${page.slug}`}
                className="rounded-lg border border-stone-200 p-2 text-stone-500 hover:bg-stone-50 hover:text-orange-600 transition-colors">
                <Pencil className="h-4 w-4" />
              </Link>
              {!page.is_main && (
                <button onClick={() => handleDelete(page.slug)}
                  className="rounded-lg border border-stone-200 p-2 text-stone-500 hover:bg-red-50 hover:text-red-600 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
        {pages.length === 0 && !fetching && (
          <div className="text-center py-16 text-stone-400">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm font-bold uppercase tracking-wider">{t('no_pages')}</p>
            <p className="text-xs mt-2">{t('create_first_page')}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function FileText(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  )
}
