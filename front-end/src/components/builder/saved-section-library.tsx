'use client'

import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api-client'
import { toast } from '@/components/ui/toast'

interface SavedSectionData {
  id: number
  name: string
  html: string
  css: string | null
  thumbnail: string | null
  sort_order: number
}

interface Props {
  editor: Record<string, any> | null
  storeId: number
}

export function SavedSectionLibrary({ editor, storeId }: Props) {
  const [sections, setSections] = useState<SavedSectionData[]>([])
  const [loading, setLoading] = useState(true)
  const [sectionName, setSectionName] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchSections = useCallback(async () => {
    try {
      const res = await api.get<{ data: SavedSectionData[] }>('/owner/saved-sections')
      setSections(res.data ?? [])
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSections()
  }, [fetchSections])

  const getSelectedHtml = (): string | null => {
    if (!editor) return null
    const sel = editor.getSelected?.()
    if (!sel) return null
    if (typeof sel.toHTML === 'function') return sel.toHTML()
    if (typeof sel.getHTML === 'function') return sel.getHTML()
    return null
  }

  const handleSaveSelection = async () => {
    const html = getSelectedHtml()
    if (!html) {
      toast('Select a section in the canvas first', 'error')
      return
    }
    const name = sectionName.trim() || `Section ${sections.length + 1}`
    if (saving) return
    setSaving(true)
    try {
      const css = editor?.getCss?.({ avoidProtected: true }) || ''
      await api.post('/owner/saved-sections', { name, html, css })
      setSectionName('')
      toast('Section saved!', 'success')
      await fetchSections()
    } catch (e) {
      toast(`Save failed: ${(e as Error)?.message ?? e}`, 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleInsert = (html: string) => {
    if (!editor) return
    const selected = editor.getSelected?.()
    if (selected && typeof editor.addComponents === 'function') {
      editor.addComponents(html)
    } else if (typeof editor.setComponents === 'function') {
      const current = editor.getHtml?.() || ''
      editor.setComponents(current + html)
    }
    toast('Section inserted', 'success')
  }

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/owner/saved-sections/${id}`)
      setSections(prev => prev.filter(s => s.id !== id))
      toast('Section deleted', 'success')
    } catch (e) {
      toast(`Delete failed: ${(e as Error)?.message ?? e}`, 'error')
    }
  }

  return (
    <div className="space-y-4">
      {/* Save current selection */}
      <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
        <div className="flex items-center gap-1.5 mb-2">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Save Section</h5>
        </div>
        <div className="flex gap-1.5">
          <input
            type="text"
            value={sectionName}
            onChange={e => setSectionName(e.target.value)}
            placeholder="Section name..."
            className="flex-1 text-xs bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all placeholder:text-gray-300"
            onKeyDown={e => { if (e.key === 'Enter') handleSaveSelection() }}
          />
          <button
            onClick={handleSaveSelection}
            disabled={saving || !editor}
            className="text-[11px] font-semibold bg-orange-600 text-white rounded-lg px-3 py-1.5 hover:bg-orange-700 transition-colors disabled:opacity-50 shadow-sm shadow-orange-200 cursor-pointer"
          >
            {saving ? '...' : 'Save'}
          </button>
        </div>
        {!editor && (
          <p className="text-[10px] text-gray-300 mt-1.5 italic">Editor not ready yet</p>
        )}
      </div>

      {/* Saved sections list */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
            </svg>
            <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Saved ({sections.length})</h5>
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-6">
            <div className="relative w-5 h-5">
              <div className="absolute inset-0 rounded-full border-2 border-orange-200" />
              <div className="absolute inset-0 rounded-full border-2 border-orange-600 border-t-transparent animate-spin" />
            </div>
          </div>
        ) : sections.length === 0 ? (
          <div className="flex flex-col items-center py-6 text-gray-300 gap-1.5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            <p className="text-[10px] font-medium">No saved sections yet</p>
          </div>
        ) : (
          <div className="space-y-1">
            {sections.map(s => (
              <div key={s.id} className="flex items-center gap-1.5 p-2 bg-white border border-gray-100 rounded-lg hover:border-orange-200 hover:bg-orange-50/30 transition-all group cursor-default">
                <div className="w-1 h-6 rounded-full bg-orange-200 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-gray-600 truncate">{s.name}</p>
                </div>
                <button
                  onClick={() => handleInsert(s.html)}
                  disabled={!editor}
                  className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors disabled:opacity-50 opacity-0 group-hover:opacity-100 cursor-pointer"
                  title="Insert"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="inline-flex items-center justify-center w-6 h-6 rounded-md text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                  title="Delete"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
