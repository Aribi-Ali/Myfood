'use client'

import { useRef, useEffect, useState } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { BLOCK_RENDERER_MAP } from './index'
import { sanitizeHtml } from '@/lib/sanitize'
import type { Food } from '@/types/api'

interface StoreData {
  name: string
  foods: Food[]
  [key: string]: unknown
}

interface DynamicPageRendererProps {
  html: string
  css?: string | null
  /** @deprecated JS execution is disabled for security. Use static HTML/CSS only. */
  js?: string | null
  store: StoreData
  onAddToCart?: (food: Food) => void
  onSelectCategory?: (categoryId: number | null) => void
}

export function DynamicPageRenderer({ html, css, store, onAddToCart, onSelectCategory }: DynamicPageRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !containerRef.current) return

    const container = containerRef.current
    const blockElements = container.querySelectorAll<HTMLElement>('[data-pb-block]')
    const roots: Root[] = []

    blockElements.forEach((el) => {
      const blockType = el.dataset.pbBlock
      if (!blockType || !BLOCK_RENDERER_MAP[blockType]) return

      let config: Record<string, unknown> = {}
      try {
        config = JSON.parse(el.dataset.config || '{}')
      } catch { /* invalid JSON, use empty config */ }

      const root = createRoot(el)
      roots.push(root)

      const Component = BLOCK_RENDERER_MAP[blockType]
      const props = { config, store, foods: store.foods, storeName: store.name, onAddToCart, onSelectCategory }
      root.render(<Component {...props} />)
    })

    return () => {
      // Defer unmount to avoid "unmount while rendering" race in StrictMode
      queueMicrotask(() => {
        roots.forEach((root) => root.unmount())
      })
    }
  }, [html, store, onAddToCart, onSelectCategory, mounted])

  return (
    <div ref={containerRef} className="min-h-screen bg-white" style={{ colorScheme: 'light' }}>
      {css && <style>{css}</style>}
      <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }} />
      {/* SECURITY: JS execution is DISABLED. Script tags are not rendered to prevent XSS. */}
    </div>
  )
}
