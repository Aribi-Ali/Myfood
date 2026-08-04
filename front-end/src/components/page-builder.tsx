'use client'

import { useRef, useState, useCallback, useEffect, useLayoutEffect, type ComponentType } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api-client'
import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'
import { sanitizeHtml } from '@/lib/sanitize'
import { ErrorBoundary } from '@/components/ui/error-boundary'

import { TEMPLATE_IMPORTS } from '@/components/templates/template-loader'
import { TEMPLATE_NAMES } from '@/components/templates/types'
import { SAMPLE_STORE } from '@/lib/sample-store-data'
import type { TemplateStore } from '@/components/templates/types'
import { toast, ToastContainer } from '@/components/ui/toast'
import { SavedSectionLibrary } from '@/components/builder/saved-section-library'
import { replaceColorsWithCssVars } from '@/lib/color-replacer'
import { useUnsavedChangesGuard, confirmUnsavedNavigation } from '@/hooks/use-unsaved-changes-guard'
import { PageBuilderEditorFallback } from '@/components/builder/page-builder-editor-fallback'
import { normalizeTemplateStore } from '@/components/templates/shared/normalize-template-store'

const GrapesEditor = dynamic(() => import('@/components/builder/editor/grapes-editor').then(mod => mod.GrapesEditor), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
})

const TemplateSelectorModal = dynamic(() => import('@/components/builder/template-selector-modal').then(mod => mod.TemplateSelectorModal), {
  ssr: false,
  loading: () => <Skeleton className="h-96 w-full max-w-lg" />,
})
import { MediaPicker } from '@/components/builder/media-picker'
import { useLanguage } from '@/contexts/language'
import { ThemeProvider, useTheme } from '@/components/builder/theme-provider'
import { ThemeCustomizer } from '@/components/builder/theme-customizer'
import { getThemePreset } from '@/lib/themes'
import type { OwnerPageResponse, PageBuilderPageData, StoreData, PageBuilderResponse } from '@/types/api'

interface Props {
  initialData: OwnerPageResponse
  templateSlug: string
  pageSlug?: string | null
  entityType?: 'store' | 'branch'
  entityId?: number | null
}

function buildPageEndpoint(slug: string | null, entityType: string, entityId?: number | null): string {
  if (entityType === 'branch' && entityId) {
    return slug ? `/branches/${entityId}/pages/${slug}` : `/branches/${entityId}/page`
  }
  return slug ? `/owner/pages/${slug}` : '/owner/page'
}

function buildPagesListEndpoint(entityType: string, entityId?: number | null): string {
  if (entityType === 'branch' && entityId) {
    return `/branches/${entityId}/pages`
  }
  return '/owner/pages'
}

function buildPageData(html: string, css: string, grapesData: string, js: string): PageBuilderPageData {
  return {
    has_customization: true,
    html,
    css,
    js: js || null,
    grapes_data: grapesData,
  }
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 5) return 'just now'
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  return `${hours}h ago`
}

export function PageBuilder({ initialData, templateSlug: initialSlug, pageSlug, entityType = 'store', entityId }: Props) {
  return (
    <ThemeProvider initialPresetId={initialSlug}>
      <PageBuilderInner initialData={initialData} initialSlug={initialSlug} pageSlug={pageSlug} entityType={entityType} entityId={entityId} />
    </ThemeProvider>
  )
}

function PageBuilderInner({ initialData, initialSlug, pageSlug, entityType, entityId }: { initialData: OwnerPageResponse; initialSlug: string; pageSlug?: string | null; entityType?: string; entityId?: number | null }) {
  const router = useRouter();
  const { t } = useLanguage();
  // const router = useRouter(); // duplicate, removed
  // State for the currently selected page (null = main page)
  const [selectedPageSlug, setSelectedPageSlug] = useState<string | null>(pageSlug ?? null);
  // List of custom pages belonging to the store
  const [pagesList, setPagesList] = useState<Array<{ slug: string; title?: string }>>([]);

  // Load selected page data when the slug changes
  useEffect(() => {
    // Reset template HTML and content ready state for new page
    setTemplateHtml(null);
    setContentReady(false);
    if (!selectedPageSlug) {
      // Main page – use initial data
      setPageData(initialData.page);
      return;
    }
    ;(async () => {
      try {
        const res = await api.get<OwnerPageResponse>(buildPageEndpoint(selectedPageSlug?.toLowerCase() ?? null, entityType ?? 'store', entityId));
        setPageData(res.page);
        // If page already has custom HTML or Grapes data, mark as ready
        if (res.page?.html || res.page?.grapes_data) {
          setContentReady(true);
        }
        } catch (e) {
          console.error('Failed to load page', e);
          // If the specific page is missing, fall back to main page
          setSelectedPageSlug(null);
          setPageData(null);
          setContentReady(true); // avoid endless loading spinner
        }
    })();
  }, [selectedPageSlug]);

  useEffect(() => {
        ;(async () => {
          try {
            const res = await api.get<{ pages: { slug: string; title?: string }[] }>(buildPagesListEndpoint(entityType ?? 'store', entityId));
            // Remove duplicate entries that represent the main page (empty slug or "home")
            const filtered = res.pages.filter(p => {
              const slug = p.slug?.toString().trim().toLowerCase();
              return slug && slug !== 'home';
            });
            setPagesList(filtered);
          } catch (e) {
            console.error('Failed to load pages list', e);
          }
        })();
  }, []);


  const editorContainerRef = useRef<HTMLDivElement>(null)
  const editorInstanceRef = useRef<any>(null)
  const templateRenderRef = useRef<HTMLDivElement>(null)
  // Cleanup hidden container's children when switching pages – use safe innerHTML reset
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activePanel, setActivePanel] = useState<string | null>('blocks')
  const [templateModalOpen, setTemplateModalOpen] = useState(false)
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false)
  const pendingMediaCallback = useRef<((url: string) => void) | null>(null)
  const [pageData, setPageData] = useState<PageBuilderPageData | null>(initialData.page)
  const [store] = useState<StoreData>(initialData.store)
  const [branch] = useState<{ id: number; alias: string; name: string } | null>((initialData as any).branch ?? null)
  const [slug, setSlug] = useState(initialSlug)
  const [device, setDevice] = useState('Desktop')
  const [zoom, setZoom] = useState(100)
  const [blockSearch, setBlockSearch] = useState('')
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [hoveredBlock, setHoveredBlock] = useState<{ html: string; label: string; x: number; y: number } | null>(null)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [customJs, setCustomJs] = useState<string>(() => pageData?.js ?? '')
  const [jsModalOpen, setJsModalOpen] = useState(false)
  const [jsError, setJsError] = useState<string | null>(null)
  const [showUnleashConfirm, setShowUnleashConfirm] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [versions, setVersions] = useState<Array<{ id: number; version: number; created_at: string; created_by: number | null }>>([])
  const [versionsLoading, setVersionsLoading] = useState(false)
  const [restoring, setRestoring] = useState<number | null>(null)
  const [templateHtml, setTemplateHtml] = useState<string | null>(() => {
    const raw = (initialData as any).template?.html_content ?? null
    if (raw) {
      return replaceColorsWithCssVars(raw, getThemePreset(initialSlug).vars as unknown as Record<string, string>, initialSlug)
    }
    return null
  })
  const [LoadedTemplate, setLoadedTemplate] = useState<ComponentType<{ store: TemplateStore; onAddToCart?: (foodId: number) => void }> | null>(null)
  const [contentReady, setContentReady] = useState(
    !!(pageData?.html || pageData?.grapes_data || (initialData as any).template?.html_content)
  )

  const dbTemplateCss = (initialData as any).template?.css_content ?? null

    // Safety fallback: ensure spinner doesn't stay forever if template loading hangs
  useEffect(() => {
    if (contentReady) return;
    const timer = setTimeout(() => {
      console.warn('Template loading timeout – marking content ready');
      setContentReady(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [contentReady]);
  const { cssText: themeCss, resolvedVars } = useTheme()

  const pageEndpoint = buildPageEndpoint(selectedPageSlug, entityType ?? 'store', entityId)

  const hasCustomization = pageData?.has_customization ?? false
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [dirty, setDirty] = useState(false)
  const dirtyRef = useRef(false)
  const savedCallback = useRef<(() => void) | null>(null)
  const zoomIsPct = useRef(false)

  const markSaved = useCallback(() => {
    setSaveStatus('saved')
    setDirty(false)
    dirtyRef.current = false
    setLastSaved(new Date())
  }, [])

  const markDirty = useCallback(() => {
    setDirty(true)
    dirtyRef.current = true
  }, [])

  const handleEditorReady = useCallback((ed: any) => {
    editorInstanceRef.current = ed
    setDevice(ed.getDevice?.() || 'Desktop')
    const raw = ed.Canvas?.getZoom?.() ?? 1
    const pct = raw > 10
    zoomIsPct.current = pct
    setZoom(pct ? Math.round(raw) : Math.round(raw * 100))
    ed.on?.('device', (name: string) => setDevice(name))
    ed.on?.('canvas:zoom', () => {
      const r = ed.Canvas?.getZoom?.() ?? 1
      setZoom(zoomIsPct.current ? Math.round(r) : Math.round(r * 100))
    })
    // Re-sync zoom after autofit settles (300ms delay in grapes-editor)
    setTimeout(() => {
      const r = ed.Canvas?.getZoom?.()
      if (r !== undefined) {
        setZoom(zoomIsPct.current ? Math.round(r) : Math.round(r * 100))
      }
    }, 600)
  }, [])

  const switchDevice = useCallback((name: string) => {
    const ed = editorInstanceRef.current
    if (ed?.setDevice) {
      ed.setDevice(name)
      setDevice(name)
    }
  }, [])

  const zoomIn = useCallback(() => {
    const ed = editorInstanceRef.current as any
    if (!ed?.Canvas) return
    const cur = ed.Canvas.getZoom()
    const isPct = zoomIsPct.current
    const display = isPct ? cur : cur * 100
    const next = Math.min(Math.round(display + 10), 200)
    if (isPct) {
      ed.Canvas.setZoom(next)
    } else {
      ed.Canvas.setZoom(next / 100)
    }
    setZoom(next)
  }, [])

  const zoomOut = useCallback(() => {
    const ed = editorInstanceRef.current as any
    if (!ed?.Canvas) return
    const cur = ed.Canvas.getZoom()
    const isPct = zoomIsPct.current
    const display = isPct ? cur : cur * 100
    const next = Math.max(Math.round(display - 10), 30)
    if (isPct) {
      ed.Canvas.setZoom(next)
    } else {
      ed.Canvas.setZoom(next / 100)
    }
    setZoom(next)
  }, [])

  const zoomReset = useCallback(() => {
    const ed = editorInstanceRef.current as any
    if (!ed?.Canvas) return
    if (zoomIsPct.current) {
      ed.Canvas.setZoom(100)
    } else {
      ed.Canvas.setZoom(1)
    }
    setZoom(100)
  }, [])

  useUnsavedChangesGuard(dirtyRef)

  // Block search filter
  useEffect(() => {
    const container = document.getElementById('pb-blocks')
    if (!container) return
    const items = container.querySelectorAll('[title], .gjs-block')
    const q = blockSearch.toLowerCase().trim()
    for (const item of items) {
      const label = (item as HTMLElement).title || item.textContent || ''
      ;(item as HTMLElement).style.display = !q || label.toLowerCase().includes(q) ? '' : 'none'
    }
  }, [blockSearch])

  // Block preview on hover
  useEffect(() => {
    const container = document.getElementById('pb-blocks')
    if (!container) return
    let timer: ReturnType<typeof setTimeout> | null = null

    const handleMouseOver = (e: Event) => {
      const block = (e.target as Element).closest('.gjs-block') as HTMLElement | null
      if (!block) return
      if (timer) { clearTimeout(timer); timer = null }
      const rect = block.getBoundingClientRect()
      const label = block.title || block.querySelector('.gjs-block-label')?.textContent?.trim() || ''
      if (!label) return

      const ed = editorInstanceRef.current
      if (!ed?.Blocks) return

      let content = ''
      const blocks = ed.Blocks.getAll()
      blocks.forEach((b: any) => {
        if (b.get('label') === label || b.get('id') === label) {
          content = b.get('content') || ''
        }
      })
      if (!content) return

      setHoveredBlock({ html: content, label, x: rect.right + 10, y: rect.top })
    }

    const handleMouseOut = (e: Event) => {
      const related = (e as MouseEvent).relatedTarget as Node | null
      if (container.contains(related)) return
      timer = setTimeout(() => setHoveredBlock(null), 80)
    }

    container.addEventListener('mouseover', handleMouseOver)
    container.addEventListener('mouseout', handleMouseOut)
    return () => {
      container.removeEventListener('mouseover', handleMouseOver)
      container.removeEventListener('mouseout', handleMouseOut)
    }
  }, [])

  const callEditor = useCallback(<T,>(fn: (ed: unknown) => T, fallback: T): T => {
    const ed = (window as unknown as Record<string, unknown>).__pb_editor
    if (!ed) return fallback
    return fn(ed)
  }, [])

  const handleUndo = useCallback(() => {
    callEditor(
      (ed) => { (ed as any).UndoManager?.undo(); markDirty() },
      undefined
    )
  }, [callEditor, markDirty])

  const handleRedo = useCallback(() => {
    callEditor(
      (ed) => { (ed as any).UndoManager?.redo(); markDirty() },
      undefined
    )
  }, [callEditor, markDirty])

  // Pre-load the template component to avoid Suspense race
  useEffect(() => {
    if (contentReady || pageData?.html || pageData?.grapes_data || (initialData as any).template?.html_content) return
    let cancelled = false
    const load = async () => {
      try {
        const imp = TEMPLATE_IMPORTS[slug]; if (!imp) return; const mod = await imp()
        if (!cancelled) setLoadedTemplate(() => mod.default)
      } catch {
        if (!cancelled) {
          setTemplateHtml(`<div class="max-w-7xl mx-auto px-4 py-8 space-y-12"><div data-pb-block="category-grid" data-config='{"title":"Categories","style":"pills","showCount":true}'></div><div data-pb-block="food-grid" data-config='{"title":"Our Menu","maxItems":8,"columns":3,"showPrices":true,"showAddToCart":true,"showDescriptions":true,"showCategoryFilter":true,"showCookingTime":true}'></div><div data-pb-block="offer-grid" data-config='{"title":"Featured Offers","subtitle":"Limited time deals","maxItems":3,"showOriginalPrice":true}'></div><div data-pb-block="reservation-form" data-config='{"title":"Make a Reservation","subtitle":"Book your table online","showName":true,"showPhone":true,"showDate":true,"showTime":true,"showGuests":true}'></div></div>`)
          setContentReady(true)
        }
      }
    }
    load()
    return () => { cancelled = true }
  }, [slug, contentReady, pageData, initialData])

  // Once the component is loaded and rendered, capture its HTML synchronously
  useLayoutEffect(() => {
    if (!LoadedTemplate || contentReady) return
    if (!templateRenderRef.current) return
    const rawHtml = templateRenderRef.current.innerHTML
    if (rawHtml.trim() && rawHtml.trim() !== '<!---->' && rawHtml.trim() !== '<!-- -->') {
      const processed = replaceColorsWithCssVars(rawHtml, resolvedVars as unknown as Record<string, string>, initialSlug)
      const trimmed = processed.trim()
      setTemplateHtml(!trimmed || trimmed === '<!---->' || trimmed === '<!-- -->' ? `<div class="max-w-7xl mx-auto px-4 py-8 space-y-12"><div data-pb-block="category-grid" data-config='{"title":"Categories","style":"pills","showCount":true}'></div><div data-pb-block="food-grid" data-config='{"title":"Our Menu","maxItems":8,"columns":3,"showPrices":true,"showAddToCart":true,"showDescriptions":true,"showCategoryFilter":true,"showCookingTime":true}'></div><div data-pb-block="offer-grid" data-config='{"title":"Featured Offers","subtitle":"Limited time deals","maxItems":3,"showOriginalPrice":true}'></div><div data-pb-block="reservation-form" data-config='{"title":"Make a Reservation","subtitle":"Book your table online","showName":true,"showPhone":true,"showDate":true,"showTime":true,"showGuests":true}'></div></div>` : processed)
      setContentReady(true)
    }
  }, [LoadedTemplate, contentReady])

  const doSave = useCallback(async (html: string, css: string, grapesData: string, js: string = '') => {
    setSaving(true)
    setSaveStatus('saving')
    setError(null)
    try {
      await api.put(pageEndpoint, { html, css, js: js || null, grapes_data: JSON.parse(grapesData) })
      setPageData(buildPageData(html, css, grapesData, js))
      markSaved()
      toast('Page saved successfully', 'success')
    } catch (e) {
      const msg = (e as Error)?.message ?? e
      setError(`Save failed: ${msg}`)
      setSaveStatus('idle')
      toast(`Save failed: ${msg}`, 'error')
      console.error('Save failed:', e)
    }
    setSaving(false)
  }, [pageEndpoint, markSaved])

  const handleSave = useCallback(async (payload: { html: string; css: string; grapesData: string; js?: string }) => {
    await doSave(payload.html, payload.css, payload.grapesData, payload.js ?? customJs)
  }, [doSave, customJs])

  const handleTemplateSelected = useCallback((newSlug: string) => {
    const branchParam = entityType === 'branch' && entityId ? `&branch_id=${entityId}` : ''
    router.replace(`/dashboard/page-builder?template_slug=${newSlug}${branchParam}`)
  }, [router, entityType, entityId])

  const handleSaveDraft = useCallback(async () => {
    const ed = (window as unknown as Record<string, unknown>).__pb_editor
    if (!ed) { setError('Editor not loaded yet. Please wait.'); return }
    const html = (ed as { getHtml(): string }).getHtml()
    const css = (ed as { getCss(opts: { avoidProtected: boolean }): string }).getCss({ avoidProtected: true })
    const grapesData = JSON.stringify((ed as { getProjectData(): unknown }).getProjectData())
    await doSave(html, css, grapesData, customJs)
  }, [doSave, customJs])

  const handlePublish = useCallback(async () => {
    const ed = (window as unknown as Record<string, unknown>).__pb_editor
    if (!ed) { setError('Editor not loaded yet. Please wait.'); return }
    const html = (ed as { getHtml(): string }).getHtml()
    const css = (ed as { getCss(opts: { avoidProtected: boolean }): string }).getCss({ avoidProtected: true })
    const grapesData = JSON.stringify((ed as { getProjectData(): unknown }).getProjectData())
    await doSave(html, css, grapesData, customJs)
  }, [doSave, customJs])

  const handleUnpublish = useCallback(async () => {
    try {
      await api.delete(pageEndpoint)
      setPageData(null)
    } catch (e) { console.error('Unpublish failed:', e) }
  }, [pageEndpoint])

  const handleReset = useCallback(async () => {
    try {
      await api.delete(pageEndpoint)
      const fresh = await api.get<OwnerPageResponse>(pageEndpoint)
      setPageData(fresh.page)
      const freshTemplateHtml = fresh.template?.html_content ?? null
      if (freshTemplateHtml) {
        setTemplateHtml(replaceColorsWithCssVars(
          freshTemplateHtml,
          getThemePreset(slug).vars as unknown as Record<string, string>,
          slug,
        ))
      } else {
        setTemplateHtml(null)
      }
      setContentReady(true)
    } catch (e) { console.error('Reset failed:', e) }
  }, [pageEndpoint, slug])

  const handleOpenHistory = useCallback(async () => {
    setVersionsLoading(true)
    setHistoryOpen(true)
    try {
      const res = await api.get<{ versions: Array<{ id: number; version: number; created_at: string; created_by: number | null }> }>(`${pageEndpoint}/versions`)
      setVersions(res.versions ?? [])
    } catch (e) {
      console.error('Failed to load versions', e)
      setVersions([])
    }
    setVersionsLoading(false)
  }, [pageEndpoint])

  const handleRestoreVersion = useCallback(async (version: number) => {
    setRestoring(version)
    try {
      await api.post(`${pageEndpoint}/restore`, { version })
      toast(`Restored to version ${version}`, 'success')
      // Remount the builder with fresh data (editor loads initial data on mount only)
      const url = new URL(window.location.href)
      url.searchParams.set('restored', String(Date.now()))
      router.replace(url.pathname + url.search)
    } catch (e) {
      const msg = (e as Error)?.message ?? e
      toast(`Restore failed: ${msg}`, 'error')
      console.error('Restore failed:', e)
    }
    setRestoring(null)
  }, [pageEndpoint, router])

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.target as Element)?.closest('input, textarea, [contenteditable]')) return
      const ctrl = e.ctrlKey || e.metaKey
      if (!ctrl) return
      switch (e.key.toLowerCase()) {
        case 's':
          e.preventDefault()
          if (e.shiftKey) handlePublish()
          else handleSaveDraft()
          break
        case 'z':
          e.preventDefault()
          if (e.shiftKey) handleRedo()
          else handleUndo()
          break
        case 'y':
          e.preventDefault()
          handleRedo()
          break
        case '=':
        case '+':
          e.preventDefault()
          zoomIn()
          break
        case '-':
          e.preventDefault()
          zoomOut()
          break
        case '0':
          e.preventDefault()
          zoomReset()
          break
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleSaveDraft, handlePublish, handleUndo, handleRedo, zoomIn, zoomOut, zoomReset])

  const mergedData: PageBuilderResponse = {
    page: {
      id: 0,
      html: pageData?.html ?? templateHtml ?? '',
      css: pageData?.css ?? '',
      grapesData: pageData?.grapes_data ? (
        typeof pageData.grapes_data === 'string' ? JSON.parse(pageData.grapes_data) : pageData.grapes_data
      ) : null,
      themeId: slug,
      published: hasCustomization,
    },
    store: store as StoreData,
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
        {/* Hidden container for template HTML extraction – only rendered for main page */}
        {selectedPageSlug === null && (
          <ErrorBoundary key={slug}>
            <div ref={templateRenderRef} className="hidden" aria-hidden="true">
              {LoadedTemplate && !contentReady && !pageData?.html && !pageData?.grapes_data && !templateHtml && (
                <LoadedTemplate store={SAMPLE_STORE as TemplateStore} onAddToCart={() => {}} />
              )}
            </div>
          </ErrorBoundary>
        )}

      {/* ── Top Bar: Page Selector + Primary Actions ── */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b bg-white">
        {/* Left: Page selector + Template badge */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex items-center gap-1.5 bg-gray-100 rounded-lg px-2 py-1">
            <svg className="text-gray-400 shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
            </svg>
            <select
              value={selectedPageSlug ?? ''}
              onChange={e => setSelectedPageSlug(e.target.value || null)}
              className="bg-transparent text-sm font-medium text-gray-700 border-none outline-none cursor-pointer pr-1 appearance-none"
            >
              <option value="">{t('main_page')}</option>
              {pagesList.map(p => (
                <option key={p.slug} value={p.slug}>{p.title ?? p.slug}</option>
              ))}
            </select>
          </div>
          <div className="h-4 w-px bg-gray-200" />
          <span className="text-xs text-gray-400 shrink-0">Template:</span>
          <span className="text-xs font-semibold text-gray-600 shrink-0">{TEMPLATE_NAMES[slug] ?? slug}</span>
          {dirty && <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse shrink-0" title="Unsaved changes" />}
        </div>

        {/* Center: spacer */}
        <div className="flex-1" />

        {/* Right: Primary actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTemplateModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50 transition-all cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
            </svg>
            Templates
          </button>
          <a
            href={branch ? `/branches/${branch.alias}` : `/stores/${store.alias}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            {branch ? 'View Branch' : 'View Store'}
          </a>
          <div className="h-5 w-px bg-gray-200" />
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${hasCustomization ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200' : 'bg-amber-50 text-amber-600 ring-1 ring-amber-200'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${hasCustomization ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            {hasCustomization ? 'Live' : 'Draft'}
          </span>
          <button
            onClick={handleSaveDraft}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <><svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="32" /><path d="M12 2a10 10 0 0 1 10 10" /></svg> Saving...</>
            ) : 'Save Draft'}
          </button>
          {hasCustomization ? (
            <button
              onClick={handleUnpublish}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              Unpublish
            </button>
          ) : (
            <button
              onClick={handlePublish}
              disabled={saving || !contentReady}
              className="inline-flex items-center gap-1.5 rounded-lg bg-orange-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-orange-700 transition-colors disabled:opacity-50 shadow-sm shadow-orange-200 cursor-pointer"
            >
              {saving ? (
                <><svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="32" /><path d="M12 2a10 10 0 0 1 10 10" /></svg> Publishing...</>
              ) : 'Publish'}
            </button>
          )}
          {(saveStatus !== 'idle' || lastSaved) && (
            <span className={`text-[10px] font-medium tabular-nums ${saveStatus === 'saving' ? 'text-orange-500' : 'text-gray-400'}`}>
              {saveStatus === 'saving' ? 'Saving...' : timeAgo(lastSaved!)}
            </span>
          )}
        </div>
      </div>

      {/* ── Editor Toolbar ── */}
      <div className="flex items-center gap-1 px-3 py-1.5 border-b bg-gray-50/80">
        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 pr-2 ltr:mr-1 rtl:ml-1 ltr:border-r rtl:border-l border-gray-200">
          <button
            onClick={handleUndo}
            className="rounded-md p-1.5 text-gray-400 hover:bg-white hover:text-gray-700 transition-all cursor-pointer"
            title="Undo (Ctrl+Z)"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
          </button>
          <button
            onClick={handleRedo}
            className="rounded-md p-1.5 text-gray-400 hover:bg-white hover:text-gray-700 transition-all cursor-pointer"
            title="Redo (Ctrl+Shift+Z)"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
          </button>
        </div>

        {/* Panel toggles */}
        <div className="flex items-center gap-0.5 pr-2 ltr:mr-1 rtl:ml-1 ltr:border-r rtl:border-l border-gray-200">
          {([
            { id: 'blocks', label: 'Blocks', icon: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></> },
            { id: 'layers', label: 'Layers', icon: <><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></> },
            { id: 'styles', label: 'Styles', icon: <><circle cx="13.5" cy="6.5" r=".5" /><circle cx="17.5" cy="10.5" r=".5" /><circle cx="8.5" cy="7.5" r=".5" /><circle cx="6.5" cy="12.5" r=".5" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" /></> },
            { id: 'sections', label: 'Saved', icon: <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /> },
          ] as const).map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setActivePanel(v => v === id ? null : id)}
              className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition-all cursor-pointer ${
                activePanel === id
                  ? 'bg-orange-100 text-orange-700 shadow-sm shadow-orange-100'
                  : 'text-gray-400 hover:bg-white hover:text-gray-600'
              }`}
              title={label}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {icon}
              </svg>
              <span className="hidden xl:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Device toggle */}
        <div className="flex items-center gap-0.5 pr-2 ltr:mr-1 rtl:ml-1 ltr:border-r rtl:border-l border-gray-200">
          {([
            { id: 'Desktop', icon: <><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></> },
            { id: 'Tablet', icon: <><rect x="4" y="2" width="16" height="20" rx="2" /><circle cx="12" cy="18" r="0.5" fill="currentColor" /></> },
            { id: 'Mobile', icon: <><rect x="5" y="2" width="14" height="20" rx="2" /><circle cx="12" cy="18" r="0.5" fill="currentColor" /></> },
          ] as const).map(({ id, icon }) => (
            <button
              key={id}
              onClick={() => switchDevice(id)}
              className={`rounded-md p-1.5 transition-all cursor-pointer ${
                device === id
                  ? 'bg-orange-100 text-orange-700 shadow-sm shadow-orange-100'
                  : 'text-gray-400 hover:bg-white hover:text-gray-600'
              }`}
              title={id}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {icon}
              </svg>
            </button>
          ))}
        </div>

        {/* Zoom */}
        <div className="flex items-center gap-0.5 pr-2 ltr:mr-1 rtl:ml-1 ltr:border-r rtl:border-l border-gray-200">
          <button
            onClick={zoomOut}
            className="rounded-md p-1.5 text-gray-400 hover:bg-white hover:text-gray-600 transition-all cursor-pointer"
            title="Zoom out (Ctrl+-)"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
          </button>
          <button
            onClick={zoomReset}
            className="text-[11px] font-mono font-semibold text-gray-500 min-w-[34px] text-center hover:text-orange-600 transition-colors cursor-pointer tabular-nums"
            title="Reset zoom (Ctrl+0)"
          >
            {zoom}%
          </button>
          <button
            onClick={zoomIn}
            className="rounded-md p-1.5 text-gray-400 hover:bg-white hover:text-gray-600 transition-all cursor-pointer"
            title="Zoom in (Ctrl+=)"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          </button>
        </div>

        {/* Tools */}
        <div className="flex items-center gap-0.5 pr-2 ltr:mr-1 rtl:ml-1 ltr:border-r rtl:border-l border-gray-200">
          <button
            onClick={() => setMediaPickerOpen(true)}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-[11px] font-medium text-gray-400 hover:bg-white hover:text-gray-600 transition-all cursor-pointer"
            title="Media Library"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
            </svg>
            <span className="hidden xl:inline">Media</span>
          </button>
          <button
            onClick={() => setJsModalOpen(true)}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-[11px] font-medium text-gray-400 hover:bg-white hover:text-purple-600 transition-all cursor-pointer"
            title="Custom JavaScript"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
            </svg>
            <span className="hidden xl:inline">JS</span>
          </button>
          <button
            onClick={handleOpenHistory}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-[11px] font-medium text-gray-400 hover:bg-white hover:text-blue-600 transition-all cursor-pointer"
            title="Version history"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="hidden xl:inline">History</span>
          </button>
        </div>

        {/* Shortcuts + Reset */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => setShowShortcuts(true)}
            className="rounded-md p-1.5 text-gray-300 hover:text-gray-500 hover:bg-white transition-all cursor-pointer"
            title="Keyboard shortcuts"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10Z" /><circle cx="12" cy="12" r=".5" /><path d="M12 8v4" /><path d="M12 16h0" />
            </svg>
          </button>
          <button
            onClick={() => setShowUnleashConfirm(true)}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-[11px] font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"
            title="Reset to default template"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
            <span className="hidden xl:inline">Reset</span>
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-1.5 ml-auto px-2.5 py-1 rounded-lg bg-red-50 border border-red-200 text-[11px] font-medium text-red-600">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
            <span className="max-w-[200px] truncate">{error}</span>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 ml-0.5 cursor-pointer">&times;</button>
          </div>
        )}
      </div>

      {/* Main editor area */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar panel — toggles between blocks/layers/styles/sections */}
        <div className={`${activePanel ? 'w-72' : 'w-0'} flex-shrink-0 flex flex-col min-h-0 ltr:border-r rtl:border-l border-gray-200 bg-white transition-[width] duration-200 ease-in-out overflow-hidden`}>
          <div className="flex-1 min-h-0 overflow-y-auto">
            {/* All pb-* containers rendered unconditionally for GrapesJS mount, hidden via CSS */}
            <div className={`${activePanel !== 'blocks' ? 'hidden' : ''} p-3`}>
              <div className="relative mb-3">
                <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  value={blockSearch}
                  onChange={e => setBlockSearch(e.target.value)}
                  placeholder="Search blocks..."
                  className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg ltr:pl-8 ltr:pr-7 rtl:pr-8 rtl:pl-7 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all placeholder:text-gray-300"
                />
                {blockSearch && (
                  <button
                    onClick={() => setBlockSearch('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors cursor-pointer"
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                )}
              </div>
              <div id="pb-blocks" />
            </div>

            <div className={`${activePanel !== 'layers' ? 'hidden' : ''} p-3`}>
              <div id="pb-layers" />
            </div>

            <div className={activePanel !== 'styles' ? 'hidden' : ''}>
              <div className="p-3">
                <ThemeCustomizer />
              </div>
              <div className="mx-3 border-t border-gray-100 pt-3 mb-3">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-0.5">Selectors</h4>
                <div id="pb-selectors" className="max-h-28 overflow-y-auto rounded-lg bg-gray-50" />
              </div>
              <div className="mx-3 border-t border-gray-100 pt-3 mb-3">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-0.5">Styles</h4>
                <div id="pb-styles" className="max-h-52 overflow-y-auto rounded-lg bg-gray-50" />
              </div>
              <div className="mx-3 pb-3">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-0.5">Properties</h4>
                <div id="pb-traits" className="max-h-52 overflow-y-auto rounded-lg bg-gray-50" />
              </div>
            </div>

            <div className={`${activePanel !== 'sections' ? 'hidden' : ''} p-3`}>
              <SavedSectionLibrary editor={editorInstanceRef.current} storeId={store.id} />
            </div>

            {!activePanel && (
              <div className="flex flex-col items-center justify-center h-40 text-gray-300 gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
                </svg>
                <span className="text-[11px] font-medium">Select a panel</span>
              </div>
            )}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 min-h-0 overflow-hidden flex items-center justify-center bg-gray-100">
          {contentReady ? (
            <div className="w-full h-full" ref={editorContainerRef} />
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 rounded-full border-2 border-orange-200" />
                <div className="absolute inset-0 rounded-full border-2 border-orange-600 border-t-transparent animate-spin" />
              </div>
              <span className="text-xs font-medium text-gray-400">Loading editor...</span>
            </div>
          )}
        </div>

        {/* Block preview popover — appears beside the block on hover */}
        {hoveredBlock && (
          <div
            className="fixed z-50 bg-white rounded-xl shadow-2xl border border-gray-200/80 overflow-hidden pointer-events-none"
            style={{
              left: hoveredBlock.x,
              top: hoveredBlock.y,
              width: 220,
              height: 150,
              animation: 'pb-popover-in 150ms ease-out',
            }}
          >
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-gray-800/80 to-gray-800/40 text-white text-[10px] font-semibold px-2.5 py-1 z-10 truncate backdrop-blur-sm">
              {hoveredBlock.label}
            </div>
            <div className="w-full h-full overflow-hidden pt-5" style={{ transform: 'scale(0.5)', transformOrigin: 'top left', width: `${100/0.5}%`, height: `${100/0.5}%` }}>
              <div
                className="w-full h-full"
                style={{ pointerEvents: 'none', userSelect: 'none' }}
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(hoveredBlock.html) }}
              />
            </div>
          </div>
        )}
      </div>

      {contentReady && (
        <GrapesEditor
          initialData={mergedData}
          editorRef={editorContainerRef}
          onSave={handleSave}
          onDirty={markDirty}
          onEditorReady={handleEditorReady}
          themeCss={themeCss}
          templateCss={dbTemplateCss}
          onRequestBgImage={(callback) => {
            pendingMediaCallback.current = callback
            setMediaPickerOpen(true)
          }}
        />
      )}

      <TemplateSelectorModal
        open={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
        onSelect={handleTemplateSelected}
      />

      <MediaPicker
        open={mediaPickerOpen}
        onClose={() => {
          setMediaPickerOpen(false)
          pendingMediaCallback.current = null
        }}
        onSelect={(url) => {
          pendingMediaCallback.current?.(url)
          pendingMediaCallback.current = null
          setMediaPickerOpen(false)
        }}
      />

      {/* Custom JS modal */}
      {jsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setJsModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Custom JavaScript</h3>
                  <p className="text-[11px] text-gray-400">Runs on every page load</p>
                </div>
              </div>
              <button onClick={() => setJsModalOpen(false)} className="rounded-lg p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <div className="p-6">
              <textarea
                value={customJs}
                onChange={e => { setCustomJs(e.target.value); setJsError(null) }}
                className="w-full h-64 text-xs font-mono border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 resize-y bg-gray-50 text-gray-800 transition-all placeholder:text-gray-300"
                placeholder={"// Add your custom JavaScript here\nconsole.log('Store page loaded!');"}
                spellCheck={false}
              />
              {jsError && (
                <div className="flex items-center gap-1.5 mt-2 text-red-500 text-xs font-medium">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                  {jsError}
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => { setCustomJs(''); setJsError(null) }}
                className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 hover:bg-white transition-colors cursor-pointer"
              >
                Clear
              </button>
              <button
                onClick={() => {
                  try {
                    new Function(customJs)
                    setJsModalOpen(false)
                    toast('JavaScript saved', 'success')
                  } catch {
                    setJsError('Invalid JavaScript syntax')
                  }
                }}
                className="rounded-lg bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-700 transition-colors shadow-sm shadow-purple-200 cursor-pointer"
              >
                Save JS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Version history modal */}
      {historyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setHistoryOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Version History</h3>
                  <p className="text-[11px] text-gray-400">Every saved edit is snapshotted — roll back anytime</p>
                </div>
              </div>
              <button onClick={() => setHistoryOpen(false)} className="rounded-lg p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <div className="p-4 max-h-80 overflow-y-auto">
              {versionsLoading ? (
                <div className="flex items-center justify-center py-10">
                  <div className="w-6 h-6 rounded-full border-2 border-blue-200 border-t-blue-600 animate-spin" />
                </div>
              ) : versions.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-10 text-gray-300">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span className="text-[11px] font-medium">No versions yet — save your page to create one</span>
                </div>
              ) : (
                <ul className="space-y-2">
                  {versions.map(v => (
                    <li key={v.id} className="flex items-center justify-between rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/40 transition-colors px-4 py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-800">Version {v.version}</p>
                          <p className="text-[10px] text-gray-400">{timeAgo(new Date(v.created_at))}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRestoreVersion(v.version)}
                        disabled={restoring !== null}
                        className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-sm shadow-blue-200 cursor-pointer"
                      >
                        {restoring === v.version ? (
                          <><svg className="animate-spin" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="32" /><path d="M12 2a10 10 0 0 1 10 10" /></svg> Restoring...</>
                        ) : (
                          <>Restore</>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reset to Default confirmation modal */}
      {showUnleashConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowUnleashConfirm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-6 pt-6 pb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg shadow-orange-200">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Reset to Default</h3>
                  <p className="text-[11px] text-gray-400">This cannot be undone</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                This removes all customizations and restores the original template layout. Your store will look like a fresh install.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => setShowUnleashConfirm(false)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 hover:bg-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowUnleashConfirm(false)
                  handleReset()
                }}
                className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 transition-colors shadow-sm shadow-red-200 cursor-pointer"
              >
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />

      {/* Popover animation keyframes */}
      <style>{`@keyframes pb-popover-in { from { opacity: 0; transform: translateX(-4px); } to { opacity: 1; transform: translateX(0); } }`}</style>

      {/* Shortcuts help modal */}
      {showShortcuts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowShortcuts(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">Keyboard Shortcuts</h3>
              <button onClick={() => setShowShortcuts(false)} className="rounded-lg p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <div className="px-5 py-3">
              {[
                ['Ctrl + S', 'Save Draft'],
                ['Ctrl + Shift + S', 'Publish'],
                ['Ctrl + Z', 'Undo'],
                ['Ctrl + Shift + Z', 'Redo'],
                ['Ctrl + Y', 'Redo'],
                ['Ctrl + =', 'Zoom In'],
                ['Ctrl + -', 'Zoom Out'],
                ['Ctrl + 0', 'Reset Zoom'],
              ].map(([keys, desc], i) => (
                <div key={keys} className={`flex items-center justify-between py-2 ${i < 7 ? 'border-b border-gray-50' : ''}`}>
                  <span className="text-[11px] text-gray-500">{desc}</span>
                  <kbd className="text-[10px] font-mono font-semibold bg-gray-100 text-gray-600 rounded-md px-2 py-0.5 border border-gray-200/80">{keys}</kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
