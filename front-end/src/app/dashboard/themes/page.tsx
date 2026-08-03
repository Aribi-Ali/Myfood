'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth'
import { useLanguage } from '@/contexts/language'
import { api } from '@/lib/api-client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { TemplateData } from '@/types/api'

const CATEGORY_GRADIENTS: Record<string, string> = {
  'dark_luxury': 'linear-gradient(135deg, #0a0a0a, #1a1a2e)',
  'organic': 'linear-gradient(135deg, #16a34a, #86efac)',
  'tech': 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
  'streetwear': 'linear-gradient(135deg, #0f0a0a, #ec4899)',
  'artisan': 'linear-gradient(135deg, #c2410c, #fcd34d)',
  'bistro': 'linear-gradient(135deg, #bc6c25, #fefae0)',
  'neon': 'linear-gradient(135deg, #0a0a1a, #06d6a0)',
  'coastal': 'linear-gradient(135deg, #0ea5e9, #f0f9ff)',
  'rustic': 'linear-gradient(135deg, #b91c1c, #fef9ef)',
  'minimal': 'linear-gradient(135deg, #1f2937, #fafafa)',
  'tropical': 'linear-gradient(135deg, #14b8a6, #ecfdf5)',
  'retro': 'linear-gradient(135deg, #dc2626, #f8f5f0)',
  'urban': 'linear-gradient(135deg, #1e293b, #fafaf9)',
  'luxury': 'linear-gradient(135deg, #0d0d0d, #1a1a1a)',
  'asian': 'linear-gradient(135deg, #2d8a4e, #f5f0e8)',
  'warm': 'linear-gradient(135deg, #d97706, #fffbf0)',
  'industrial': 'linear-gradient(135deg, #334155, #f8fafc)',
  'pastel': 'linear-gradient(135deg, #a855f7, #faf5ff)',
  'italian': 'linear-gradient(135deg, #991b1b, #fdf2f2)',
  'scandinavian': 'linear-gradient(135deg, #e2e8f0, #f8fafc)',
  'oriental': 'linear-gradient(135deg, #c2410c, #fef9ef)',
  'american': 'linear-gradient(135deg, #1d4ed8, #f8fafc)',
  'fresh': 'linear-gradient(135deg, #14b8a6, #f0fdf4)',
  'japanese': 'linear-gradient(135deg, #d4617a, #faf5f7)',
  'mexican': 'linear-gradient(135deg, #ff6b35, #ffd700)',
  'indian': 'linear-gradient(135deg, #2d1b69, #ffbf00)',
  'mediterranean': 'linear-gradient(135deg, #1e90ff, #fdfbf7)',
  'bbq': 'linear-gradient(135deg, #3e2723, #ff6f00)',
  'vegan': 'linear-gradient(135deg, #87c442, #f5f5dc)',
  'patisserie': 'linear-gradient(135deg, #ffb6c1, #fff5ee)',
  'brewpub': 'linear-gradient(135deg, #4a3728, #f5e6cc)',
  'seafood': 'linear-gradient(135deg, #0a4c7a, #f4e4c1)',
}

const CATEGORY_ACCENTS: Record<string, string> = {
  'dark_luxury': '#d4a017', 'organic': '#facc15', 'tech': '#22d3ee',
  'streetwear': '#22d3ee', 'artisan': '#fefce8', 'bistro': '#dda15e',
  'neon': '#ef476f', 'coastal': '#f97316', 'rustic': '#15803d',
  'minimal': '#f59e0b', 'tropical': '#f43f5e', 'retro': '#fcd34d',
  'urban': '#f97316', 'luxury': '#c9a84c', 'asian': '#e8c87a',
  'warm': '#fbbf24', 'industrial': '#f97316', 'pastel': '#f472b6',
  'italian': '#fbbf24', 'scandinavian': '#38bdf8', 'oriental': '#fcd34d',
  'american': '#fbbf24', 'fresh': '#ec4899',
  'japanese': '#93c572', 'mexican': '#2a9d8f', 'indian': '#50c878',
  'mediterranean': '#f5deb3', 'bbq': '#fff3e0', 'vegan': '#2d3748',
  'patisserie': '#d4af37', 'brewpub': '#b87333', 'seafood': '#ff7f50',
}

const categoryColors: Record<string, string[]> = {
  'cafe': ['#D4A574', '#FFF8E7', '#8B4513', '#F5DEB3'],
  'premium': ['#1A1A2E', '#E8D5A3', '#C9A84C', '#0D0D0D'],
  'seafood': ['#0077B6', '#F0F8FF', '#00B4D8', '#CAF0F8'],
  'brewpub': ['#B87333', '#2F2F2F', '#F5DEB3', '#1A1A1A'],
  'patisserie': ['#FFB6C1', '#FFF0F5', '#98FB98', '#E6E6FA'],
  'mediterranean': ['#E2725B', '#F5DEB3', '#2F4F2F', '#DEB887'],
  'vegan': ['#228B22', '#F5FFFA', '#8B4513', '#2E4B2E'],
  'american': ['#0A0A2E', '#FF00FF', '#00FFFF', '#1A1A4E'],
  'italian': ['#704214', '#FFF8DC', '#DEB887', '#F5DEB3'],
  'mexican': ['#CC5500', '#008080', '#FFD700', '#F5DEB3'],
  'modern': ['#4682B4', '#F0F8FF', '#00BFFF', '#1E90FF'],
  'minimal': ['#C0C0C0', '#F8F8F8', '#4A4A4A', '#E8E8E8'],
  'fresh': ['#FF8C00', '#32CD32', '#FFFFFF', '#FFF8DC'],
  'organic': ['#CC7722', '#F5F5DC', '#228B22', '#FFF8DC'],
}

function getGradientForCategory(category: string): string {
  if (CATEGORY_GRADIENTS[category]) return CATEGORY_GRADIENTS[category]
  const colors = categoryColors[category]
  if (colors) return `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`
  const hash = category.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const hue = hash % 360
  return `linear-gradient(135deg, hsl(${hue}, 60%, 40%), hsl(${(hue + 60) % 360}, 50%, 80%))`
}

function getAccentForCategory(category: string): string {
  if (CATEGORY_ACCENTS[category]) return CATEGORY_ACCENTS[category]
  const colors = categoryColors[category]
  if (colors) return colors[2]!
  const hash = category.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const hue = (hash * 137) % 360
  return `hsl(${hue}, 70%, 50%)`
}

export default function TemplatesPage() {
  const { user, loading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [templates, setTemplates] = useState<TemplateData[]>([])
  const [currentSlug, setCurrentSlug] = useState('dark-luxury')
  const [applying, setApplying] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [storeAlias, setStoreAlias] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && user) {
      const isAdmin = user.role === 'admin'
      const templatePromise = isAdmin
        ? api.get<{ data: TemplateData[] }>('/admin/templates?per_page=50').catch(() => ({ data: [] }))
        : api.get<{ data: TemplateData[] }>('/templates').catch(() => ({ data: [] }))
      Promise.all([
        templatePromise,
        api.get<{ store: { template_slug?: string; alias?: string } }>('/owner/store').catch(() => ({ data: null })),
      ]).then(([tplRes, storeRes]) => {
        setTemplates(tplRes.data || [])
        const s = (storeRes as { store?: { template_slug?: string; alias?: string } })?.store
        if (s?.template_slug) setCurrentSlug(s.template_slug)
        if (s?.alias) setStoreAlias(s.alias)
        setFetching(false)
      })
    }
  }, [user, loading])

  const handleApply = async (slug: string) => {
    const tpl = templates.find(t => t.slug === slug)
    if (!confirm(t('apply_template_confirm', { name: tpl?.name ?? '' }))) return
    setApplying(true)
    setError(null)
    try {
      const defaultPreset = tpl?.theme_presets?.find(p => p.is_default)
      const themePresetId = defaultPreset?.id ?? tpl?.theme_presets?.[0]?.id ?? undefined
      await api.put('/owner/store/template', {
        template_slug: slug,
        theme_preset_id: themePresetId || undefined,
      })
      setCurrentSlug(slug)
    } catch {
      setError('Failed to apply template. Please try again.')
    }
    setApplying(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('themes')}</h1>
          <p className="text-gray-500">{t('choose_template')}</p>
        </div>
        {storeAlias && (
          <Link href={`/stores/${storeAlias}`}>
            <Button variant="outline" className="shrink-0">
              {t('see_my_store')}
            </Button>
          </Link>
        )}
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">{error}</div>
      )}

      {fetching ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-600 border-t-transparent" />
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((tpl) => {
            const gradient = getGradientForCategory(tpl.category || '')
            const accent = getAccentForCategory(tpl.category || '')
            const presets = tpl.theme_presets ?? []
            const colors = presets.length > 0 ? presets[0]!.colors : []
            return (
              <Card
                key={tpl.id}
                className={`transition-all hover:shadow-lg ${currentSlug === tpl.slug ? 'ring-2 ring-orange-500' : ''}`}
              >
                <CardContent className="p-5">
                  <div
                    className="h-32 rounded-lg border flex items-center justify-center text-2xl font-bold mb-4 text-white relative overflow-hidden"
                    style={{ background: gradient }}
                  >
                    <span className="drop-shadow-lg">{tpl.name}</span>
                    {colors.length > 0 && (
                      <div className="absolute bottom-2 right-2 flex gap-1">
                        {colors.slice(0, 4).map((color, i) => (
                          <div key={i} className="h-3 w-3 rounded-full border border-white/40" style={{ background: color }} />
                        ))}
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900">{tpl.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{tpl.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {tpl.blocks && (
                      <span className="text-[11px] font-medium text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
                        {tpl.blocks.length} sections
                      </span>
                    )}
                    {presets.length > 0 && (
                      <span className="text-[11px] font-medium text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
                        {presets.length} presets
                      </span>
                    )}
                  </div>
                  <Button
                    className="mt-4 w-full"
                    variant={currentSlug === tpl.slug ? 'outline' : 'primary'}
                    onClick={() => handleApply(tpl.slug)}
                    disabled={applying}
                  >
                    {currentSlug === tpl.slug ? t('current') : t('apply')}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
