'use client'

import { useMemo } from 'react'
import { sanitizeHtml } from '@/lib/sanitize'

interface StorefrontRendererProps {
  html: string
  css: string | null
  /** @deprecated JS execution is disabled for security. Use static HTML/CSS only. */
  js?: string | null
}

const DEFAULT_CSS = `
  .storefront-renderer {
    color-scheme: light;
    --color-foreground: #1c1917;
    --color-surface: #fafaf9;
    --color-border: #e5e7eb;
    --color-muted: #78716c;
  }
  .storefront-renderer img { max-width: 100%; height: auto; }
  .storefront-renderer a { color: inherit; text-decoration: none; }
`

export function StorefrontRenderer({ html, css, js }: StorefrontRendererProps) {
  const combinedCss = useMemo(() => {
    return [DEFAULT_CSS, css].filter(Boolean).join('\n')
  }, [css])

  return (
    <>
      <div
        className="storefront-renderer"
        dangerouslySetInnerHTML={{
          __html: `<style>${combinedCss}</style>${sanitizeHtml(html)}`,
        }}
      />
      {/* SECURITY: JS execution is DISABLED. Script tags are not rendered to prevent XSS.
          If sandboxed iframe rendering is needed in the future, implement it here. */}
    </>
  )
}
