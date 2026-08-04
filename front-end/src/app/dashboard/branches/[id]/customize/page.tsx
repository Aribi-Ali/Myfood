'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/contexts/auth'
import { useLanguage } from '@/contexts/language'
import { useRouter, useSearchParams } from 'next/navigation'
import { api } from '@/lib/api-client'
import { branchService, type BranchCustomizationStatus, type BranchTemplate } from '@/lib/branch-service'
import {
  Loader2, ArrowLeft, Paintbrush, Code, Palette, RotateCcw,
  LinkIcon, Unlink, Check, X,
} from 'lucide-react'

interface Branch {
  id: number
  name: string
  alias: string
}

export default function BranchCustomizationPage() {
  const { user, loading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()
  const branchId = searchParams.get('branch_id')

  const [branch, setBranch] = useState<Branch | null>(null)
  const [status, setStatus] = useState<BranchCustomizationStatus | null>(null)
  const [template, setTemplate] = useState<BranchTemplate | null>(null)
  const [fetching, setFetching] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [activeTab, setActiveTab] = useState<'blocks' | 'theme' | 'content'>('blocks')
  const [themeVars, setThemeVars] = useState<Record<string, string>>({})
  const [htmlContent, setHtmlContent] = useState('')
  const [cssContent, setCssContent] = useState('')

  const loadData = useCallback(async () => {
    if (!branchId) return
    const id = parseInt(branchId, 10)
    setFetching(true)
    setError('')
    try {
      const [branchRes, statusRes, templateRes] = await Promise.all([
        api.get<{ data: Branch }>(`/branches/${id}`),
        branchService.getCustomizationStatus(id),
        branchService.getTemplate(id),
      ])
      setBranch(branchRes.data)
      setStatus(statusRes)
      setTemplate(templateRes)
      if (templateRes?.theme_variables) setThemeVars(templateRes.theme_variables)
      if (templateRes?.html_content) setHtmlContent(templateRes.html_content)
      if (templateRes?.css_content) setCssContent(templateRes.css_content)
    } catch {
      setError('Failed to load branch data.')
    }
    setFetching(false)
  }, [branchId])

  useEffect(() => {
    if (!loading && !user) { router.push('/login'); return }
    if (!loading && user && user.role !== 'owner') {
      router.replace('/error?message=Unauthorized')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (branchId) loadData()
  }, [branchId, loadData])

  function flashSuccess(msg: string) {
    setSuccess(msg)
    setTimeout(() => setSuccess(''), 3000)
  }

  async function handleToggleSync() {
    if (!branchId || !status) return
    setSaving(true)
    try {
      await branchService.toggleSync(parseInt(branchId, 10), !status.is_synced)
      flashSuccess(status.is_synced ? 'Switched to independent mode.' : 'Now synced with source template.')
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle sync')
    }
    setSaving(false)
  }

  async function handleResetToSource() {
    if (!branchId) return
    if (!confirm('Reset this branch template to match its source? All customizations will be lost.')) return
    setSaving(true)
    try {
      await branchService.resetToSource(parseInt(branchId, 10))
      flashSuccess('Branch template reset to source.')
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset')
    }
    setSaving(false)
  }

  async function handleSaveTheme() {
    if (!branchId) return
    setSaving(true)
    try {
      await branchService.updateThemeVariables(parseInt(branchId, 10), themeVars)
      flashSuccess('Theme variables saved.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save theme')
    }
    setSaving(false)
  }

  async function handleSaveContent() {
    if (!branchId) return
    setSaving(true)
    try {
      await branchService.updateTemplateContent(parseInt(branchId, 10), {
        html_content: htmlContent,
        css_content: cssContent,
      })
      flashSuccess('Content saved.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save content')
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    )
  }

  if (!user || user.role !== 'owner') return null

  if (!branchId) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Branch Customization</h1>
        <div className="rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center dark:border-gray-700">
          <Paintbrush className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
          <p className="mt-4 text-sm font-bold text-gray-500 dark:text-gray-400">No branch selected.</p>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">Select a branch from the branches page to customize it.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/dashboard/branches')}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Customize: {branch?.name || '...'}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
              Customize this branch's appearance independently from the main store.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/dashboard/page-builder?branch_id=${branchId}`)}
            className="inline-flex items-center gap-2 rounded-xl bg-purple-500 px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-purple-600"
          >
            Open Page Builder
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
          {success}
        </div>
      )}

      {fetching ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      ) : (
        <>
          {/* Sync Status Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {status?.is_synced ? (
                  <LinkIcon className="h-5 w-5 text-blue-500" />
                ) : (
                  <Unlink className="h-5 w-5 text-orange-500" />
                )}
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-100">
                    {status?.is_synced ? 'Synced with Source' : 'Independent Mode'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {status?.is_synced
                      ? 'Changes to the source template will automatically apply here.'
                      : 'This branch has its own independent template customizations.'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleToggleSync}
                  disabled={saving}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold shadow-sm transition-all disabled:opacity-50 ${
                    status?.is_synced
                      ? 'bg-orange-500 text-white hover:bg-orange-600'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : status?.is_synced ? (
                    <Unlink className="h-4 w-4" />
                  ) : (
                    <LinkIcon className="h-4 w-4" />
                  )}
                  {status?.is_synced ? 'Switch to Independent' : 'Re-sync with Source'}
                </button>
                {status?.is_synced && (
                  <button
                    onClick={handleResetToSource}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-600 transition-all hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset to Source
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex gap-6">
              {([
                { key: 'blocks', label: 'Blocks', icon: Code },
                { key: 'theme', label: 'Theme Colors', icon: Palette },
                { key: 'content', label: 'HTML/CSS', icon: Paintbrush },
              ] as const).map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-2 border-b-2 py-3 text-sm font-semibold transition-colors ${
                    activeTab === key
                      ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            {activeTab === 'blocks' && (
              <div className="space-y-4">
                <h3 className="font-bold text-gray-900 dark:text-gray-100">Template Blocks</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Use the page builder to customize individual blocks for this branch.
                </p>
                <button
                  onClick={() => router.push(`/dashboard/page-builder?branch_id=${branchId}`)}
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-orange-600"
                >
                  Open Page Builder
                </button>
              </div>
            )}

            {activeTab === 'theme' && (
              <div className="space-y-4">
                <h3 className="font-bold text-gray-900 dark:text-gray-100">Theme Variables</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {Object.entries(themeVars).map(([key, value]) => (
                    <div key={key}>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        {key}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={value}
                          onChange={(e) => setThemeVars(prev => ({ ...prev, [key]: e.target.value }))}
                          className="h-10 w-10 rounded-lg border border-gray-300 dark:border-gray-600"
                        />
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => setThemeVars(prev => ({ ...prev, [key]: e.target.value }))}
                          className="flex-1 rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-orange-500 dark:focus:ring-orange-800"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleSaveTheme}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-orange-600 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  Save Theme
                </button>
              </div>
            )}

            {activeTab === 'content' && (
              <div className="space-y-4">
                <h3 className="font-bold text-gray-900 dark:text-gray-100">HTML/CSS Content</h3>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    HTML Content
                  </label>
                  <textarea
                    value={htmlContent}
                    onChange={(e) => setHtmlContent(e.target.value)}
                    rows={10}
                    className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 font-mono text-sm text-gray-900 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-orange-500 dark:focus:ring-orange-800"
                    placeholder="<div>Custom HTML content for this branch...</div>"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    CSS Content
                  </label>
                  <textarea
                    value={cssContent}
                    onChange={(e) => setCssContent(e.target.value)}
                    rows={8}
                    className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 font-mono text-sm text-gray-900 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-orange-500 dark:focus:ring-orange-800"
                    placeholder=".custom-class { color: red; }"
                  />
                </div>
                <button
                  onClick={handleSaveContent}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-orange-600 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  Save Content
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
