'use client'

import { useEffect, useRef } from 'react'
import { sanitizeHtml } from '@/lib/sanitize'
import { normalizeImageUrls } from '@/lib/utils'

interface Props {
  html: string
  css: string
  themeVars?: Record<string, string> | null
}

export function StorefrontRenderer({ html, css, themeVars }: Props) {
  const styleRef = useRef<HTMLStyleElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!styleRef.current) return
    const varsCss = themeVars
      ? `:root {\n${Object.entries(themeVars).map(([k, v]) => `  ${k}: ${v};`).join('\n')}\n}`
      : ''
    styleRef.current.textContent = [varsCss, css].filter(Boolean).join('\n')
  }, [css, themeVars])

  useEffect(() => {
    if (!containerRef.current) return
    containerRef.current.innerHTML = sanitizeHtml(normalizeImageUrls(html))

    const links = containerRef.current.querySelectorAll('a[href]')
    for (const link of links) {
      link.addEventListener('click', (e) => {
        const href = (link as HTMLAnchorElement).getAttribute('href')
        if (href && (href.startsWith('/') || href.startsWith('#'))) return
        e.preventDefault()
      })
    }
  }, [html])

  return (
    <>
      <style ref={styleRef} />
      <div
        ref={containerRef}
        className="storefront-content"
        style={{ fontFamily: 'var(--font-body, system-ui, sans-serif)' }}
      />
    </>
  )
}

export function StorefrontStyles() {
  return (
    <style>{`
      .storefront-content {
        line-height: var(--line-height-base, 1.6);
        color: var(--color-text-primary, #1f2937);
      }
      .storefront-content img {
        max-width: 100%;
        height: auto;
      }
      .storefront-content .pb-btn-primary {
        background: var(--color-primary);
        color: #fff;
        transition: background var(--transition-speed, 0.2s) var(--transition-easing, ease);
      }
      .storefront-content .pb-btn-primary:hover {
        background: var(--color-primary-hover);
      }
      .storefront-content .pb-btn-outline {
        border: 2px solid var(--color-primary);
        color: var(--color-primary);
        background: transparent;
      }
      .storefront-content .pb-btn-outline:hover {
        background: var(--color-primary);
        color: #fff;
      }
      @media (max-width: 768px) {
        .storefront-content [style*="grid-template-columns"] {
          grid-template-columns: 1fr !important;
        }
        .storefront-content [style*="padding"] {
          padding-left: 20px !important;
          padding-right: 20px !important;
        }
      }
    `}</style>
  )
}
