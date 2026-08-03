'use client'

import { useEffect, useState, useCallback } from 'react'
import { api } from '@/lib/api-client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ChevronDown, ChevronUp, Check, X, Palette, Layers, Eye, EyeOff,
  Plus, Trash2, GripVertical, Save, Play, Globe,
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────

interface TemplateBlock {
  id: number
  template_id: number
  type: string
  label: string
  description: string | null
  category: string | null
  sort_order: number
  config_schema: Record<string, unknown> | null
  default_config: Record<string, unknown> | null
  is_required: boolean
  is_active: boolean
}

interface ThemePreset {
  id: number
  template_id: number
  name: string
  description: string | null
  css_vars: Record<string, string>
  colors: string[]
  is_default: boolean
}

interface Template {
  id: number
  name: string
  slug: string
  description: string | null
  category: string | null
  thumbnail: string | null
  component_path: string | null
  sort_order: number
  is_active: boolean
  status: 'draft' | 'testing' | 'active'
  blocks?: TemplateBlock[]
  theme_presets?: ThemePreset[]
  default_preset?: ThemePreset | null
  created_at: string
  updated_at: string
}

// ── Status helpers ─────────────────────────────────────────────────────────

const STATUS_LABELS: Record<string, string> = { draft: 'Draft', testing: 'Testing', active: 'Active' }
const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300',
  testing: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
}
const STATUS_ICONS: Record<string, typeof X> = { draft: X, testing: Play, active: Globe }

function StatusBadge({ status }: { status: string }) {
  const Icon = STATUS_ICONS[status] ?? X
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[status] ?? STATUS_COLORS.draft}`}>
      <Icon className="w-3 h-3" />
      {STATUS_LABELS[status] ?? status}
    </span>
  )
}

// ── Block type presets ─────────────────────────────────────────────────────

const BLOCK_TYPE_PRESETS = [
  { type: 'hero', label: 'Hero Section', category: 'header' },
  { type: 'about', label: 'About', category: 'content' },
  { type: 'menu', label: 'Menu / Food Grid', category: 'content' },
  { type: 'categories', label: 'Categories', category: 'content' },
  { type: 'offers', label: 'Offers / Promotions', category: 'content' },
  { type: 'gallery', label: 'Gallery', category: 'content' },
  { type: 'reviews', label: 'Reviews', category: 'social' },
  { type: 'team', label: 'Team / Staff', category: 'content' },
  { type: 'contact', label: 'Contact', category: 'footer' },
  { type: 'hours', label: 'Opening Hours', category: 'footer' },
  { type: 'reservation', label: 'Reservation Form', category: 'content' },
  { type: 'location', label: 'Location / Map', category: 'footer' },
  { type: 'footer', label: 'Footer', category: 'footer' },
  { type: 'header', label: 'Header / Navbar', category: 'header' },
  { type: 'custom', label: 'Custom HTML', category: 'other' },
]

// ── Page ───────────────────────────────────────────────────────────────────

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showCreate, setShowCreate] = useState(false)

  const fetchTemplates = useCallback(() => {
    const params = statusFilter !== 'all' ? { per_page: 50, status: statusFilter } : { per_page: 50 }
    api.get<{ data: Template[] }>('/admin/templates', params)
      .then(res => setTemplates(res.data ?? []))
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load templates'))
  }, [statusFilter])

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const params = statusFilter !== 'all' ? { per_page: 50, status: statusFilter } : { per_page: 50 }
        const res = await api.get<{ data: Template[] }>('/admin/templates', params)
        setTemplates(res.data ?? [])
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load templates')
      }
      setLoading(false)
    })()
  }, [statusFilter])

  const removeTemplate = (id: number) => setTemplates(prev => prev.filter(x => x.id !== id))
  const updateInList = (id: number, patch: Partial<Template>) =>
    setTemplates(prev => prev.map(x => x.id === id ? { ...x, ...patch } : x))

  const handleCreated = (t: Template) => {
    setTemplates(prev => [...prev, t])
    setShowCreate(false)
    setSelectedId(t.id)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Templates</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}><CardContent className="p-4"><Skeleton className="h-24 w-full" /></CardContent></Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Templates</h1>
          <p className="text-sm text-gray-500">{templates.length} templates</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Status filter */}
          <div className="flex rounded-lg border border-gray-300 dark:border-slate-600 overflow-hidden">
            {['all', 'draft', 'testing', 'active'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  statusFilter === s
                    ? 'bg-orange-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                }`}
              >
                {s === 'all' ? 'All' : STATUS_LABELS[s]}
              </button>
            ))}
          </div>
          <Button onClick={() => setShowCreate(true)}><Plus className="w-4 h-4 mr-1" /> New Template</Button>
        </div>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {/* Create form */}
      {showCreate && (
        <CreateTemplateForm
          onCreated={handleCreated}
          onCancel={() => setShowCreate(false)}
        />
      )}

      {templates.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No templates match the current filter</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map(t => (
            <Card key={t.id} className={`cursor-pointer transition-shadow hover:shadow-md ${selectedId === t.id ? 'ring-2 ring-orange-500' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between" onClick={() => setSelectedId(selectedId === t.id ? null : t.id)}>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex-shrink-0">
                      <Palette className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-slate-100 truncate">{t.name}</h3>
                      <p className="text-xs text-gray-400 dark:text-slate-500 truncate">/{t.slug}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <StatusBadge status={t.status} />
                    <button
                      onClick={e => { e.stopPropagation(); setSelectedId(selectedId === t.id ? null : t.id) }}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      {selectedId === t.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {t.description && (
                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-2 line-clamp-2">{t.description}</p>
                )}

                {t.category && (
                  <span className="inline-block mt-2 rounded-full bg-gray-100 dark:bg-slate-700 px-2 py-0.5 text-xs text-gray-600 dark:text-slate-300">
                    {t.category}
                  </span>
                )}

                <div className="flex gap-1 mt-3 flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={e => { e.stopPropagation(); handleDelete(t.id, removeTemplate) }}
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                  </Button>
                </div>

                {selectedId === t.id && (
                  <TemplateDetail
                    template={t}
                    onUpdate={(id, patch) => updateInList(id, patch)}
                    onDeleteBlock={(blockId) => {
                      setTemplates(prev => prev.map(tm => {
                        if (tm.id !== t.id) return tm
                        return { ...tm, blocks: tm.blocks?.filter(b => b.id !== blockId) }
                      }))
                    }}
                    onAddBlock={(block) => {
                      setTemplates(prev => prev.map(tm => {
                        if (tm.id !== t.id) return tm
                        return { ...tm, blocks: [...(tm.blocks ?? []), block] }
                      }))
                    }}
                    onUpdateBlock={(blockId, patch) => {
                      setTemplates(prev => prev.map(tm => {
                        if (tm.id !== t.id) return tm
                        return {
                          ...tm,
                          blocks: tm.blocks?.map(b => b.id === blockId ? { ...b, ...patch } : b),
                        }
                      }))
                    }}
                    onAddPreset={(preset) => {
                      setTemplates(prev => prev.map(tm => {
                        if (tm.id !== t.id) return tm
                        return { ...tm, theme_presets: [...(tm.theme_presets ?? []), preset] }
                      }))
                    }}
                    onUpdatePresets={(presets) => {
                      setTemplates(prev => prev.map(tm => {
                        if (tm.id !== t.id) return tm
                        return { ...tm, theme_presets: presets }
                      }))
                    }}
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

async function handleDelete(id: number, remove: (id: number) => void) {
  if (!confirm('Delete this template? This cannot be undone.')) return
  await api.delete(`/admin/templates/${id}`)
  remove(id)
}

// ── Create Form ────────────────────────────────────────────────────────────

function CreateTemplateForm({ onCreated, onCancel }: { onCreated: (t: Template) => void; onCancel: () => void }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [componentPath, setComponentPath] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!name.trim()) return
    setSaving(true)
    setError('')
    try {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      const res = await api.post<{ data: Template }>('/admin/templates', {
        name: name.trim(),
        description,
        category,
        component_path: componentPath || slug,
        status: 'draft',
      })
      onCreated(res.data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create')
    }
    setSaving(false)
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <h3 className="font-semibold text-gray-900 dark:text-slate-100">New Template</h3>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Input label="Name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Bold Italic" />
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">Description</label>
          <textarea
            className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            rows={2}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe the template's style and use case"
          />
        </div>
        <Input label="Category" value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Modern, Premium, Urban" />
        <Input label="Component Path (slug)" value={componentPath} onChange={e => setComponentPath(e.target.value)} placeholder="Auto-generated from name" />
        <p className="text-xs text-gray-400">The template will be created in <strong>Draft</strong> status. Add blocks and presets, then promote to Testing and Active.</p>
        <div className="flex gap-2">
          <Button onClick={handleSubmit} disabled={saving || !name.trim()}>{saving ? 'Creating...' : 'Create Template'}</Button>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ── Template Detail ────────────────────────────────────────────────────────

function TemplateDetail({
  template,
  onUpdate,
  onDeleteBlock,
  onAddBlock,
  onUpdateBlock,
  onAddPreset,
  onUpdatePresets,
}: {
  template: Template
  onUpdate: (id: number, patch: Partial<Template>) => void
  onDeleteBlock: (blockId: number) => void
  onAddBlock: (block: TemplateBlock) => void
  onUpdateBlock: (blockId: number, patch: Partial<TemplateBlock>) => void
  onAddPreset: (preset: ThemePreset) => void
  onUpdatePresets: (presets: ThemePreset[]) => void
}) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(template.name)
  const [description, setDescription] = useState(template.description ?? '')
  const [category, setCategory] = useState(template.category ?? '')
  const [savingMeta, setSavingMeta] = useState(false)

  const handleSaveMeta = async () => {
    setSavingMeta(true)
    try {
      const res = await api.put<{ data: Template }>(`/admin/templates/${template.id}`, { name, description, category })
      onUpdate(template.id, res.data)
      setEditing(false)
    } catch { /* ignore */ }
    setSavingMeta(false)
  }

  const handleStatusChange = async (status: string) => {
    try {
      const res = await api.put<{ data: Template }>(`/admin/templates/${template.id}`, { status })
      onUpdate(template.id, res.data)
    } catch { /* ignore */ }
  }

  return (
    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700 space-y-4">
      {/* Status controls */}
      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Status</h4>
        <div className="flex gap-2">
          {['draft', 'testing', 'active'].map(s => (
            <button
              key={s}
              onClick={() => handleStatusChange(s)}
              disabled={s === template.status}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                s === template.status
                  ? `${STATUS_COLORS[s]} ring-2 ring-offset-1 ring-orange-500`
                  : 'bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              {s === 'draft' && <X className="w-3.5 h-3.5" />}
              {s === 'testing' && <Play className="w-3.5 h-3.5" />}
              {s === 'active' && <Globe className="w-3.5 h-3.5" />}
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {template.status === 'draft' && 'Draft — only visible to admins. Add blocks and presets below.'}
          {template.status === 'testing' && 'Testing — admins can preview. Not available to store owners yet.'}
          {template.status === 'active' && 'Active — store owners can select this template.'}
        </p>
      </div>

      {/* Template metadata */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Template Info</h4>
          {!editing && <Button size="sm" variant="outline" onClick={() => setEditing(true)}>Edit</Button>}
        </div>
        {editing ? (
          <div className="space-y-2">
            <Input label="Name" value={name} onChange={e => setName(e.target.value)} />
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">Description</label>
              <textarea
                className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows={2}
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
            <Input label="Category" value={category} onChange={e => setCategory(e.target.value)} />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSaveMeta} disabled={savingMeta}>{savingMeta ? 'Saving...' : 'Save'}</Button>
              <Button size="sm" variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-1 text-sm text-gray-600 dark:text-slate-400">
            <p><span className="font-medium text-gray-700 dark:text-slate-300">Slug:</span> {template.slug}</p>
            <p><span className="font-medium text-gray-700 dark:text-slate-300">Component:</span> {template.component_path ?? '—'}</p>
            <p><span className="font-medium text-gray-700 dark:text-slate-300">Sort:</span> {template.sort_order}</p>
          </div>
        )}
      </div>

      {/* Blocks management */}
      <BlocksManager
        templateId={template.id}
        blocks={template.blocks ?? []}
        onDelete={onDeleteBlock}
        onAdd={onAddBlock}
        onUpdate={onUpdateBlock}
      />

      {/* Theme presets management */}
      <PresetsManager
        templateId={template.id}
        presets={template.theme_presets ?? []}
        onAdd={onAddPreset}
        onUpdate={onUpdatePresets}
      />
    </div>
  )
}

// ── Blocks Manager ─────────────────────────────────────────────────────────

function BlocksManager({
  templateId, blocks, onDelete, onAdd, onUpdate,
}: {
  templateId: number
  blocks: TemplateBlock[]
  onDelete: (id: number) => void
  onAdd: (block: TemplateBlock) => void
  onUpdate: (id: number, patch: Partial<TemplateBlock>) => void
}) {
  const [showAdd, setShowAdd] = useState(false)
  const [selectedType, setSelectedType] = useState(BLOCK_TYPE_PRESETS[0]!.type)
  const [customLabel, setCustomLabel] = useState('')
  const [saving, setSaving] = useState(false)

  const handleAdd = async () => {
    setSaving(true)
    try {
      const preset = BLOCK_TYPE_PRESETS.find(p => p.type === selectedType)!
      const res = await api.post<{ data: TemplateBlock }>(`/admin/templates/${templateId}/blocks`, {
        type: selectedType,
        label: customLabel || preset.label,
        category: preset.category,
        is_active: true,
      })
      onAdd(res.data)
      setShowAdd(false)
      setCustomLabel('')
    } catch { /* ignore */ }
    setSaving(false)
  }

  const handleToggleActive = async (block: TemplateBlock) => {
    try {
      await api.put(`/admin/blocks/${block.id}`, { is_active: !block.is_active })
      onUpdate(block.id, { is_active: !block.is_active })
    } catch { /* ignore */ }
  }

  const handleDelete = async (block: TemplateBlock) => {
    if (!confirm(`Delete block "${block.label}"?`)) return
    try {
      await api.delete(`/admin/blocks/${block.id}`)
      onDelete(block.id)
    } catch { /* ignore */ }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-gray-500" />
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Blocks ({blocks.length})</h4>
        </div>
        <Button size="sm" variant="outline" onClick={() => setShowAdd(true)}>
          <Plus className="w-3.5 h-3.5 mr-1" /> Add Block
        </Button>
      </div>

      {showAdd && (
        <div className="rounded-lg border border-gray-200 dark:border-slate-700 p-3 mb-2 space-y-2">
          <select
            value={selectedType}
            onChange={e => { setSelectedType(e.target.value); if (!customLabel) {
              const preset = BLOCK_TYPE_PRESETS.find(p => p.type === e.target.value)
              setCustomLabel(preset?.label ?? '')
            } }}
            className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {BLOCK_TYPE_PRESETS.map(p => (
              <option key={p.type} value={p.type}>{p.label} ({p.category})</option>
            ))}
          </select>
          <Input
            placeholder="Custom label (optional)"
            value={customLabel}
            onChange={e => setCustomLabel(e.target.value)}
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAdd} disabled={saving}>{saving ? 'Adding...' : 'Add'}</Button>
            <Button size="sm" variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {blocks.length === 0 ? (
        <p className="text-sm text-gray-400">No blocks yet. Add blocks to define this template&apos;s functionality contract.</p>
      ) : (
        <div className="space-y-1 max-h-60 overflow-y-auto">
          {blocks.map(block => (
            <div key={block.id} className="flex items-center justify-between rounded-lg bg-gray-50 dark:bg-slate-800 px-3 py-2 text-sm group">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${block.is_active ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="font-medium text-gray-700 dark:text-slate-300 truncate">{block.label}</span>
                <span className="text-xs text-gray-400 dark:text-slate-500 flex-shrink-0">({block.type})</span>
                {block.is_required && <span className="text-xs text-orange-500 font-medium flex-shrink-0">required</span>}
                {block.category && (
                  <span className="text-xs text-gray-400 dark:text-slate-500 hidden sm:inline flex-shrink-0">— {block.category}</span>
                )}
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button
                  onClick={() => handleToggleActive(block)}
                  className={`p-1 rounded transition-colors ${block.is_active ? 'text-gray-400 hover:text-green-600' : 'text-gray-300 hover:text-gray-500'}`}
                  title={block.is_active ? 'Deactivate' : 'Activate'}
                >
                  {block.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => handleDelete(block)}
                  className="p-1 rounded text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete block"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-gray-400 mt-1">These blocks define what the template can render. Hover to toggle or delete.</p>
    </div>
  )
}

// ── Presets Manager ────────────────────────────────────────────────────────

function PresetsManager({
  templateId, presets, onAdd, onUpdate,
}: {
  templateId: number
  presets: ThemePreset[]
  onAdd: (preset: ThemePreset) => void
  onUpdate: (presets: ThemePreset[]) => void
}) {
  const [showAdd, setShowAdd] = useState(false)
  const [presetName, setPresetName] = useState('')
  const [presetDesc, setPresetDesc] = useState('')
  const [colors, setColors] = useState(['#2563eb', '#f5f5f5', '#ffffff', '#333333'])
  const [saving, setSaving] = useState(false)

  const buildCssVars = (): Record<string, string> => ({
    '--color-primary': colors[0] ?? '#2563eb',
    '--color-secondary': colors[1] ?? '#f5f5f5',
    '--color-accent': colors[2] ?? '#ffffff',
    '--color-background': colors[3] ?? '#ffffff',
    '--font-display': 'Inter, sans-serif',
    '--font-body': 'Inter, sans-serif',
    '--radius-sm': '6px',
    '--radius-md': '12px',
    '--radius-lg': '20px',
    '--shadow-sm': '0 1px 2px rgba(0,0,0,0.05)',
    '--shadow-md': '0 4px 6px rgba(0,0,0,0.07)',
    '--shadow-lg': '0 10px 25px rgba(0,0,0,0.1)',
  })

  const handleAddPreset = async () => {
    if (!presetName.trim()) return
    setSaving(true)
    try {
      const res = await api.post<{ data: ThemePreset }>(`/admin/templates/${templateId}/theme-presets`, {
        name: presetName.trim(),
        description: presetDesc,
        css_vars: buildCssVars(),
        colors,
      })
      onAdd(res.data)
      setShowAdd(false)
      setPresetName('')
      setPresetDesc('')
    } catch { /* ignore */ }
    setSaving(false)
  }

  const handleDeletePreset = async (preset: ThemePreset) => {
    if (!confirm(`Delete preset "${preset.name}"?`)) return
    try {
      await api.delete(`/admin/theme-presets/${preset.id}`)
      onUpdate(presets.filter(p => p.id !== preset.id))
    } catch { /* ignore */ }
  }

  const handleSetDefault = async (preset: ThemePreset) => {
    try {
      await api.post(`/admin/theme-presets/${preset.id}/set-default`)
      onUpdate(presets.map(p => ({ ...p, is_default: p.id === preset.id })))
    } catch { /* ignore */ }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-gray-500" />
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Theme Presets ({presets.length})</h4>
        </div>
        <Button size="sm" variant="outline" onClick={() => setShowAdd(true)}>
          <Plus className="w-3.5 h-3.5 mr-1" /> Add Preset
        </Button>
      </div>

      {showAdd && (
        <div className="rounded-lg border border-gray-200 dark:border-slate-700 p-3 mb-2 space-y-2">
          <Input label="Preset Name" value={presetName} onChange={e => setPresetName(e.target.value)} placeholder="e.g. Ocean Blue" />
          <Input label="Description" value={presetDesc} onChange={e => setPresetDesc(e.target.value)} placeholder="e.g. Deep blue with coral accents" />
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">Colors (4 swatches)</label>
            <div className="flex gap-2">
              {colors.map((c, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <input
                    type="color"
                    value={c}
                    onChange={e => setColors(prev => prev.map((x, j) => j === i ? e.target.value : x))}
                    className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer"
                  />
                  <span className="text-[10px] text-gray-400">{['Primary', 'Secondary', 'Accent', 'BG'][i]}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAddPreset} disabled={saving || !presetName.trim()}>{saving ? 'Adding...' : 'Add Preset'}</Button>
            <Button size="sm" variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {presets.length === 0 ? (
        <p className="text-sm text-gray-400">No presets yet. Add at least one preset with the template&apos;s color scheme.</p>
      ) : (
        <div className="space-y-2 max-h-72 overflow-y-auto">
          {presets.map(preset => (
            <div key={preset.id} className="rounded-lg border border-gray-200 dark:border-slate-700 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  {preset.colors && preset.colors.length > 0 && (
                    <div className="flex -space-x-1 flex-shrink-0">
                      {preset.colors.slice(0, 4).map((color, ci) => (
                        <div key={ci} className="w-5 h-5 rounded-full border-2 border-white dark:border-slate-800" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-700 dark:text-slate-300 truncate">{preset.name}</p>
                    {preset.description && <p className="text-xs text-gray-400 truncate">{preset.description}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {preset.is_default ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
                      <Check className="w-3 h-3" /> Default
                    </span>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => handleSetDefault(preset)}>Set Default</Button>
                  )}
                  <button
                    onClick={() => handleDeletePreset(preset)}
                    className="p-1 rounded text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete preset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-gray-400 mt-1">Each template needs at least one preset. The default preset is used when store owners select this template.</p>
    </div>
  )
}
