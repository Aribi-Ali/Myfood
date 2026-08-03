'use client'

import { useEffect, useRef, useCallback } from 'react'
import grapesjs from 'grapesjs'
import type { Editor, UndoManagerConfig } from 'grapesjs'
import 'grapesjs/dist/css/grapes.min.css'
import { api } from '@/lib/api-client'
import { getBlockProperties } from '@/components/builder/blocks/blocks'
import type { PageBuilderResponse } from '@/types/api'

const AUTOSAVE_MS = 3000
const SAVE_EVENTS = ['component:update', 'component:add', 'component:remove', 'style:update', 'canvas:update']

interface Props {
  initialData: PageBuilderResponse
  editorRef: React.RefObject<HTMLDivElement | null>
  onSave?: (payload: { html: string; css: string; grapesData: string }) => Promise<void>
  onDirty?: () => void
  onEditorReady?: (editor: Editor) => void
  themeCss?: string
  templateCss?: string
  onRequestBgImage?: (callback: (url: string) => void) => void
}

function getCanvasDoc(ed: Editor): Document | null {
  try {
    return ed.Canvas.getDocument()
  } catch { return null }
}

function injectCssToCanvas(ed: Editor, id: string, css: string) {
  if (!css) return
  const doc = getCanvasDoc(ed)
  if (!doc) return
  let styleEl = doc.getElementById(id) as HTMLStyleElement | null
  if (!styleEl) {
    styleEl = doc.createElement('style')
    styleEl.id = id
    doc.head.appendChild(styleEl)
  }
  styleEl.textContent = css
}

function injectThemeToCanvas(ed: Editor, css: string) {
  injectCssToCanvas(ed, 'pb-theme-canvas-style', css)
}

function injectCanvasBaseStyles(ed: Editor) {
  injectCssToCanvas(ed, 'pb-base-styles', `
    [data-pb-block] {
      outline: 2px dashed #f97316 !important;
      outline-offset: 2px !important;
      position: relative !important;
    }
    [data-pb-block]::before {
      content: "⚡ Dynamic";
      position: absolute;
      top: 4px;
      right: 4px;
      background: #f97316;
      color: #fff;
      font-size: 10px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;
      z-index: 10;
      letter-spacing: .5px;
      text-transform: uppercase;
    }
  `)
}

export function GrapesEditor({ initialData, editorRef, onSave, onDirty, onEditorReady, themeCss, templateCss, onRequestBgImage }: Props) {
  const editorInstance = useRef<Editor | null>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isSaving = useRef(false)
  const dirty = useRef(false)
  const store = initialData.store
  const onRequestBgImageRef = useRef(onRequestBgImage)
  onRequestBgImageRef.current = onRequestBgImage

  const scheduleSave = useCallback(() => {
    dirty.current = true
    onDirty?.()
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      const ed = editorInstance.current
      if (!ed || !onSave || isSaving.current || !dirty.current) return
      isSaving.current = true
      dirty.current = false
      onSave({
        html: ed.getHtml(),
        css: ed.getCss({ avoidProtected: true }) ?? '',
        grapesData: JSON.stringify(ed.getProjectData()),
      }).finally(() => { isSaving.current = false })
    }, AUTOSAVE_MS)
  }, [onSave])

  useEffect(() => {
    if (editorInstance.current || !editorRef.current) return

    let ed: Editor
    try {
      const blocks = getBlockProperties(store)
      ed = grapesjs.init({
      container: editorRef.current,
      fromElement: false,
      height: '100%',
      width: '100%',
      storageManager: false,
      panels: { defaults: [] },
      blockManager: { appendTo: '#pb-blocks', blocks },
      layerManager: { appendTo: '#pb-layers' },
      selectorManager: { appendTo: '#pb-selectors', componentFirst: true },
      styleManager: {
        appendTo: '#pb-styles',
        sectors: [
          { name: 'Layout', open: false, buildProps: ['display', 'width', 'height', 'min-height', 'max-width'] },
          { name: 'Typography', open: false, buildProps: ['font-family', 'font-size', 'font-weight', 'color', 'text-align', 'line-height', 'letter-spacing'] },
          { name: 'Background', open: false, buildProps: ['background-color', 'background-image', 'background-size', 'background-repeat'] },
          { name: 'Border', open: false, buildProps: ['border', 'border-radius', 'border-color', 'border-style'] },
          { name: 'Spacing', open: false, buildProps: ['margin', 'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left'] },
          { name: 'Effects', open: false, buildProps: ['box-shadow', 'opacity', 'transform'] },
        ],
      },
      traitManager: { appendTo: '#pb-traits' },
      deviceManager: {
        devices: [
          { name: 'Desktop', width: '' },
          { name: 'Tablet', width: '768px' },
          { name: 'Mobile', width: '375px' },
        ],
      },
      canvas: {
        styles: [
          'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@700;900&family=DM+Serif+Display:ital@0;1&family=Dancing+Script:wght@400;700&family=Caveat:wght@400;700&family=Bebas+Neue&family=Fredoka+One&display=swap',
        ],
        scripts: [
          'https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4',
        ],
      },
      undoManager: { track: true } as UndoManagerConfig,
      })

      editorInstance.current = ed
      onEditorReady?.(ed)
      ;(window as unknown as Record<string, unknown>).__pb_editor = ed

      // ── Ensure all <a> tags expose href/target/rel as editable traits ──
      // The Traits panel lets users change anchor URLs without touching code.
      ed.DomComponents.addType('link', {
        model: {
          defaults: {
            traits: [
              { type: 'text', name: 'href', label: 'Link URL', placeholder: 'https://... or #section-id' },
              { type: 'select', name: 'target', label: 'Open in', options: [
                { id: '', name: 'Same tab' },
                { id: '_blank', name: 'New tab' },
                { id: '_self', name: 'Same frame' },
              ]},
              { type: 'text', name: 'rel', label: 'Rel attribute', placeholder: 'noopener noreferrer' },
            ],
          },
        },
      })

      // Inject 📷 browse button into background-image property field after each render
      ed.on('style:property:render', (propertyView: any) => {
        if (propertyView.model?.get?.('property') !== 'background-image') return
        const el = propertyView.el as HTMLElement | undefined
        if (!el || el.querySelector('.pb-bg-picker-btn')) return

        const input = el.querySelector('input') as HTMLInputElement | undefined
        const wrapper = (el.querySelector('.gjs-field') || el) as HTMLElement
        if (!input) return

        wrapper.style.cssText = 'display:flex;gap:4px;width:100%;'

        const btn = document.createElement('button')
        btn.className = 'pb-bg-picker-btn'
        btn.textContent = '📷'
        btn.style.cssText = 'padding:2px 10px;cursor:pointer;font-size:15px;line-height:1;border-radius:3px;flex-shrink:0;'
        btn.title = 'Browse media library'
        btn.onclick = (e) => {
          e.stopPropagation()
          onRequestBgImageRef.current?.((url: string) => {
            const val = url.startsWith('url(') ? url : `url(${url})`
            input.value = val
            input.dispatchEvent(new Event('change', { bubbles: true }))
          })
        }

        wrapper.appendChild(btn)
      })

      ed.on('load', () => {
        // Override GrapesJS internal CSS vars — canvas width subtracts --gjs-left-width for
        // internal panels we don't use (styles/traits appended externally), and top offset
        // subtracts --gjs-canvas-top for a toolbar we don't have.
        const editorEl = editorRef.current?.querySelector('.gjs-editor') as HTMLElement | null
        if (editorEl) {
          editorEl.style.setProperty('--gjs-left-width', '0px')
          editorEl.style.setProperty('--gjs-canvas-top', '0px')
        }
        injectThemeToCanvas(ed, themeCss ?? '')
        injectCanvasBaseStyles(ed)

        const { grapesData } = initialData.page
        if (grapesData && typeof grapesData === 'object' && Object.keys(grapesData).length) {
          ed.loadProjectData(grapesData)
        } else if (initialData.page.html) {
          ed.setComponents(initialData.page.html)
          if (initialData.page.css) ed.setStyle(initialData.page.css)
        }

        // Fit content to canvas width after a short delay to let rendering settle
        setTimeout(() => {
          try { (ed.Canvas as any).autofit?.() } catch {}
        }, 300)
      })

      // Reload blocks + theme after Tailwind script finishes
      ed.on('canvas:frame:load:head', () => {
        setTimeout(() => {
          try {
        injectThemeToCanvas(ed, themeCss ?? '')
        // Inject DB template CSS (if any) into the canvas
        injectCssToCanvas(ed, 'pb-template-css', templateCss ?? '')
            injectCanvasBaseStyles(ed)
          } catch { /* frame methods not ready */ }
        }, 100)
      })

      for (const evt of SAVE_EVENTS) {
        ed.on(evt, scheduleSave)
      }

      return () => {
        ed.destroy()
        editorInstance.current = null
        delete (window as unknown as Record<string, unknown>).__pb_editor
        if (saveTimer.current) clearTimeout(saveTimer.current)
      }
    } catch (initError) {
      console.error('GrapesJS init failed:', initError)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store])

  const prevThemeCss = useRef<string | undefined>(undefined)

  useEffect(() => {
    if (themeCss === prevThemeCss.current) return
    prevThemeCss.current = themeCss
    const ed = editorInstance.current
      if (ed) {
        injectThemeToCanvas(ed, themeCss ?? '')
        injectCanvasBaseStyles(ed)
        // Also refresh DB template CSS when theme changes (template CSS may reference vars)
        injectCssToCanvas(ed, 'pb-template-css', templateCss ?? '')
      }
  }, [themeCss])

  return null
}
