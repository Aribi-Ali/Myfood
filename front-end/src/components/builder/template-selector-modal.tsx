'use client'

import { useEffect, useState, useRef, type MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import { api } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import type { TemplateData, TemplatePresetData } from '@/types/api'

const CATEGORY_LABELS: Record<string, string> = {
  'dark_luxury': 'Dark Luxury', 'organic': 'Fresh Organic', 'tech': 'Tech / SaaS',
  'streetwear': 'Streetwear', 'artisan': 'Artisan Handmade', 'bistro': 'Bistro Classic',
  'neon': 'Neon Nights', 'coastal': 'Coastal Breeze', 'rustic': 'Rustic Farmhouse',
  'minimal': 'Minimal Mono', 'tropical': 'Tropical Vibes', 'retro': 'Retro Diner',
  'urban': 'Urban Modern', 'luxury': 'Luxury', 'asian': 'Asian Inspired',
  'warm': 'Warm & Cozy', 'industrial': 'Industrial', 'pastel': 'Pastel Dream',
  'italian': 'Italian Classic', 'scandinavian': 'Scandinavian', 'oriental': 'Oriental Spice',
  'american': 'American Casual', 'fresh': 'Fresh & Vibrant',
  'japanese': 'Japanese Zen', 'mexican': 'Mexican Fiesta',
  'indian': 'Indian Royal', 'mediterranean': 'Mediterranean Breeze',
  'bbq': 'American BBQ', 'vegan': 'Vegan & Healthy',
  'patisserie': 'French Patisserie', 'brewpub': 'Brewpub',
  'seafood': 'Seafood',
}

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

interface Props {
  open: boolean
  onClose: () => void
  onSelect: (slug: string) => void
}

export function TemplateSelectorModal({ open, onClose, onSelect }: Props) {
  const [templates, setTemplates] = useState<TemplateData[]>([])
  const [fetching, setFetching] = useState(true)
  const [applying, setApplying] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [selectedPresetId, setSelectedPresetId] = useState<number | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const prevFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    setFetching(true)
    setError(null)
    setSelectedId(null)
    setSelectedPresetId(null)

    api.get<{ data: TemplateData[] }>('/templates')
      .then((res) => {
        setTemplates(res.data || [])
        setFetching(false)
      })
      .catch(() => {
        setError('Failed to load templates. Please try again.')
        setFetching(false)
      })
  }, [open])

  useEffect(() => {
    if (!open) return
    prevFocusRef.current = document.activeElement as HTMLElement
    requestAnimationFrame(() => panelRef.current?.focus())
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
      prevFocusRef.current?.focus()
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  async function handleApply() {
    if (!selectedId) return
    setApplying(selectedId)
    setError(null)
    try {
      const selected = templates.find((t) => t.id === selectedId)
      if (!selected) return
      await api.put('/owner/store/template', {
        template_slug: selected.slug,
        theme_preset_id: selectedPresetId || undefined,
      })
      onSelect(selected.slug)
      onClose()
    } catch {
      setError('Failed to apply template. Please try again.')
      setApplying(null)
    }
  }

  function onBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) onClose()
  }

  if (!open) return null

  const selected = templates.find((t) => t.id === selectedId)
  const categories = [...new Set(templates.map((t) => t.category || 'uncategorized'))]
  const presets = selected?.theme_presets ?? []

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className="relative w-[90vw] max-w-6xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-gray-200 outline-none flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Choose a Template</h2>
            <p className="text-xs text-gray-400 mt-1">Pick a pre-designed layout to start building your store page.</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {fetching ? (
            <div className="flex items-center justify-center py-20">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 rounded-full border-2 border-orange-200" />
                <div className="absolute inset-0 rounded-full border-2 border-orange-600 border-t-transparent animate-spin" />
              </div>
            </div>
          ) : error ? (
            <div className="m-6 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-600 font-medium flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              {error}
            </div>
          ) : templates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-300">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
              </svg>
              <p className="text-xs font-semibold uppercase tracking-wider mt-3">No templates available</p>
            </div>
          ) : (
            <div className="p-6 space-y-8">
              {categories.map((category) => {
                const catTemplates = templates.filter((t) => (t.category || 'uncategorized') === category)
                if (catTemplates.length === 0) return null
                return (
                  <section key={category}>
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        {CATEGORY_LABELS[category] || category.replace(/-/g, ' ')}
                      </h3>
                      <div className="flex-1 h-px bg-gray-100" />
                      <span className="text-[10px] text-gray-300 font-medium">{catTemplates.length}</span>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {catTemplates.map((template) => {
                        const isSelected = selectedId === template.id
                        const tmplPresets = template.theme_presets ?? []
                        const gradient = CATEGORY_GRADIENTS[category] || 'linear-gradient(135deg, #6366f1, #a78bfa)'
                        const accent = CATEGORY_ACCENTS[category] || '#f97316'
                        return (
                          <button
                            key={template.id}
                            onClick={() => {
                              setSelectedId(template.id)
                              const def = tmplPresets.find((p) => p.is_default)
                              setSelectedPresetId(def?.id ?? tmplPresets[0]?.id ?? null)
                            }}
                            className={`text-left rounded-xl border-2 transition-all overflow-hidden cursor-pointer ${
                              isSelected
                                ? 'border-orange-500 shadow-lg shadow-orange-100/50 ring-2 ring-orange-100'
                                : 'border-gray-100 hover:border-gray-300 hover:shadow-md'
                            }`}
                          >
                            <div className="h-36 flex flex-col items-center justify-center relative" style={{ background: gradient }}>
                              {/* Decorative pattern */}
                              <div className="absolute inset-0 opacity-10" style={{
                                backgroundImage: `radial-gradient(circle at 25% 25%, ${accent} 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)`,
                                backgroundSize: '20px 20px'
                              }} />
                              <span className="text-white font-bold text-base drop-shadow-lg relative z-10">{template.name}</span>
                              <span className="text-white/70 text-[10px] font-medium mt-1 relative z-10 bg-white/20 rounded-full px-2.5 py-0.5 backdrop-blur-sm">
                                {CATEGORY_LABELS[category] || category.replace(/-/g, ' ')}
                              </span>
                              {tmplPresets.length > 0 && (
                                <div className="absolute bottom-2.5 right-2.5 flex -space-x-1 relative z-10">
                                  {(tmplPresets[0]?.colors ?? []).slice(0, 5).map((color, i) => (
                                    <div key={i} className="h-4 w-4 rounded-full border-2 border-white/80 shadow-sm" style={{ background: color }} />
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="p-3 space-y-1.5">
                              <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">{template.description}</p>
                              <div className="flex items-center flex-wrap gap-1 text-[10px] text-gray-300">
                                <span className="bg-gray-50 rounded-md px-1.5 py-0.5 font-medium">{template.blocks?.length || 0} sections</span>
                                <span className="bg-gray-50 rounded-md px-1.5 py-0.5 font-medium">{tmplPresets.length} colors</span>
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </section>
                )
              })}
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between shrink-0 bg-gray-50/50">
          {selected && presets.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Color:</span>
              <div className="flex gap-1.5">
                {presets.map((pr) => (
                  <button
                    key={pr.id}
                    onClick={() => setSelectedPresetId(pr.id)}
                    className={`flex -space-x-1 rounded-lg border-2 p-1 transition-all cursor-pointer ${
                      selectedPresetId === pr.id ? 'border-orange-500 bg-orange-50 shadow-sm shadow-orange-100' : 'border-transparent hover:border-gray-200'
                    }`}
                    title={pr.name}
                  >
                    {pr.colors.slice(0, 3).map((color, i) => (
                      <div key={i} className="h-4 w-4 rounded-full border border-gray-200" style={{ background: color }} />
                    ))}
                  </button>
                ))}
              </div>
            </div>
          )}
          {!selected && <div />}
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
            <Button
              variant="primary"
              size="sm"
              disabled={!selectedId || applying !== null}
              onClick={handleApply}
            >
              {applying ? (
                <span className="flex items-center gap-1.5">
                  <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="32" /><path d="M12 2a10 10 0 0 1 10 10" /></svg>
                  Applying...
                </span>
              ) : 'Use This Template'}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
