'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth'
import { useLanguage } from '@/contexts/language'
import { api } from '@/lib/api-client'
import {
  Plus, Pencil, Trash2, Users, Loader2, Store, X, Check, FileText,
} from 'lucide-react'
import Link from 'next/link'

// ── Types ────────────────────────────────────────────────────────────────────

interface BranchUser {
  id: number
  name: string
  email: string
  pivot: {
    role: string
    permissions: string | null
  }
}

interface Branch {
  id: number
  name: string
  alias: string
  description: string | null
  email: string | null
  phone: string | null
  address: string | null
  wilaya: string | null
  daira: string | null
  commune: string | null
  is_active: boolean
  created_at: string
  assigned_users?: BranchUser[]
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const emptyForm = {
  name: '',
  alias: '',
  description: '',
  email: '',
  phone: '',
  address: '',
  wilaya: '',
  daira: '',
  commune: '',
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-DZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

// ── Component ────────────────────────────────────────────────────────────────

export default function BranchesPage() {
  const { user, loading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const storeId = user?.store?.id

  const [branches, setBranches] = useState<Branch[]>([])
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // ── Branch form modal ──────────────────────────────────────────────────────
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  // ── Manage Users modal ─────────────────────────────────────────────────────
  const [showUsersModal, setShowUsersModal] = useState(false)
  const [usersBranch, setUsersBranch] = useState<Branch | null>(null)
  const [assignUserId, setAssignUserId] = useState('')
  const [assignUserRole, setAssignUserRole] = useState('staff')
  const [assigning, setAssigning] = useState(false)

  // ── Redirect / guard ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!loading && !user) { router.push('/login'); return }
    if (!loading && user && user.role !== 'owner') {
      router.replace('/error?message=Unauthorized')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (storeId) fetchBranches()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeId])

  // ── Data fetching ──────────────────────────────────────────────────────────

  async function fetchBranches() {
    if (!storeId) return
    setFetching(true)
    setError('')
    try {
      const res = await api.get<{ data: Branch[] }>(`/stores/${storeId}/branches`)
      setBranches(res.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load branches')
    }
    setFetching(false)
  }

  function flashSuccess(msg: string) {
    setSuccess(msg)
    setTimeout(() => setSuccess(''), 3000)
  }

  // ── Form handlers ──────────────────────────────────────────────────────────

  function openCreateForm() {
    setEditingId(null)
    setForm({ ...emptyForm })
    setFormError('')
    setShowForm(true)
  }

  function openEditForm(b: Branch) {
    setEditingId(b.id)
    setForm({
      name: b.name,
      alias: b.alias,
      description: b.description || '',
      email: b.email || '',
      phone: b.phone || '',
      address: b.address || '',
      wilaya: b.wilaya || '',
      daira: b.daira || '',
      commune: b.commune || '',
    })
    setFormError('')
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditingId(null)
    setForm({ ...emptyForm })
    setFormError('')
  }

  function updateForm(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!storeId) return
    setSaving(true)
    setFormError('')
    try {
      let saved: Branch
      if (editingId) {
        const res = await api.put<{ data: Branch }>(`/branches/${editingId}`, form)
        saved = res.data
      } else {
        const res = await api.post<{ data: Branch }>(`/stores/${storeId}/branches`, form)
        saved = res.data
      }
      setBranches((prev) => {
        const idx = prev.findIndex((b) => b.id === saved.id)
        if (idx >= 0) {
          const next = [...prev]
          next[idx] = saved
          return next
        }
        return [...prev, saved]
      })
      flashSuccess(editingId ? 'Branch updated.' : 'Branch created.')
      closeForm()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save branch')
    }
    setSaving(false)
  }

  async function handleDelete(b: Branch) {
    if (branches.length <= 1) {
      alert('Cannot delete the last branch. You must have at least one branch.')
      return
    }
    if (!confirm(`Are you sure you want to delete "${b.name}"? This action cannot be undone.`)) return
    try {
      await api.delete(`/branches/${b.id}`)
      setBranches((prev) => prev.filter((x) => x.id !== b.id))
      flashSuccess('Branch deleted.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete branch')
    }
  }

  // ── Manage Users handlers ──────────────────────────────────────────────────

  async function openUsersModal(b: Branch) {
    // Fetch fresh data with assigned_users
    setUsersBranch(null)
    setShowUsersModal(true)
    try {
      const res = await api.get<{ data: Branch }>(`/branches/${b.id}`)
      setUsersBranch(res.data)
    } catch {
      setUsersBranch(b)
    }
    setAssignUserId('')
    setAssignUserRole('staff')
  }

  function closeUsersModal() {
    setShowUsersModal(false)
    setUsersBranch(null)
    setAssignUserId('')
    setAssignUserRole('staff')
  }

  async function handleAssignUser() {
    if (!usersBranch || !assignUserId.trim()) return
    setAssigning(true)
    try {
      await api.post(`/branches/${usersBranch.id}/assign-user`, {
        user_id: parseInt(assignUserId, 10),
        role: assignUserRole,
      })
      // Re-fetch to get updated list
      const res = await api.get<{ data: Branch }>(`/branches/${usersBranch.id}`)
      setUsersBranch(res.data)
      setAssignUserId('')
      setAssignUserRole('staff')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to assign user')
    }
    setAssigning(false)
  }

  async function handleRemoveUser(userId: number) {
    if (!usersBranch) return
    if (!confirm('Remove this user from the branch?')) return
    try {
      await api.delete(`/branches/${usersBranch.id}/users/${userId}`)
      const res = await api.get<{ data: Branch }>(`/branches/${usersBranch.id}`)
      setUsersBranch(res.data)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to remove user')
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    )
  }

  if (!user || user.role !== 'owner') return null
  if (!storeId) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Branches</h1>
        <div className="rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center dark:border-gray-700">
          <Store className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
          <p className="mt-4 text-sm font-bold text-gray-500 dark:text-gray-400">No store found.</p>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">Complete your store setup first.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Branches</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
            Manage your store branches and assign staff members.
          </p>
        </div>
        <button
          onClick={openCreateForm}
          className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-orange-600"
        >
          <Plus className="h-4 w-4" />
          Add Branch
        </button>
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

      {/* ── Branch list ── */}
      {fetching ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      ) : branches.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center dark:border-gray-700">
          <Store className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
          <p className="mt-4 text-sm font-bold text-gray-500 dark:text-gray-400">No branches yet</p>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">Create your first branch to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {branches.map((b) => (
            <div
              key={b.id}
              className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
            >
              {/* Top accent */}
              <div
                className={`h-1.5 ${b.is_active ? 'bg-gradient-to-r from-orange-400 to-amber-400' : 'bg-gray-300 dark:bg-gray-600'}`}
              />

              <div className="space-y-3 p-5">
                {/* Name + status */}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100">{b.name}</h3>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      b.is_active
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                    }`}
                  >
                    {b.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Alias */}
                <Link
                  href={`/branches/${b.alias}`}
                  className="block text-xs font-mono text-orange-600 hover:underline dark:text-orange-400"
                >
                  /{b.alias}
                </Link>

                {/* Details */}
                <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                  {b.email && (
                    <p className="truncate">
                      <span className="font-medium text-gray-600 dark:text-gray-300">Email:</span> {b.email}
                    </p>
                  )}
                  {b.phone && (
                    <p>
                      <span className="font-medium text-gray-600 dark:text-gray-300">Phone:</span> {b.phone}
                    </p>
                  )}
                  {b.address && (
                    <p className="truncate" title={b.address}>
                      <span className="font-medium text-gray-600 dark:text-gray-300">Address:</span> {b.address}
                    </p>
                  )}
                  {(b.wilaya || b.daira || b.commune) && (
                    <p className="truncate">
                      {[b.wilaya, b.daira, b.commune].filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>

                {/* Created date */}
                <p className="text-[10px] text-gray-400 dark:text-gray-500">
                  Created {formatDate(b.created_at)}
                </p>

                {/* Action buttons */}
                <div className="flex gap-2 pt-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => openEditForm(b)}
                    className="flex-1 rounded-lg bg-orange-50 px-2.5 py-1.5 text-xs font-semibold text-orange-600 transition-colors hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-900/30"
                  >
                    <Pencil className="mr-1 inline-block h-3 w-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => router.push(`/dashboard/page-builder?branch_id=${b.id}`)}
                    className="flex-1 rounded-lg bg-purple-50 px-2.5 py-1.5 text-xs font-semibold text-purple-600 transition-colors hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:hover:bg-purple-900/30"
                  >
                    <FileText className="mr-1 inline-block h-3 w-3" />
                    Pages
                  </button>
                  <button
                    onClick={() => openUsersModal(b)}
                    className="flex-1 rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                  >
                    <Users className="mr-1 inline-block h-3 w-3" />
                    Users
                  </button>
                  <button
                    onClick={() => handleDelete(b)}
                    className="flex-1 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                  >
                    <Trash2 className="mr-1 inline-block h-3 w-3" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Branch Form Modal ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-900">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                  {editingId ? <Pencil className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {editingId ? 'Edit Branch' : 'Add Branch'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {editingId ? 'Update branch details' : 'Create a new branch for your store'}
                  </p>
                </div>
              </div>
              <button
                onClick={closeForm}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Name */}
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Branch Name *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => updateForm('name', e.target.value)}
                    placeholder="e.g. Downtown Branch"
                    className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-orange-500 dark:focus:ring-orange-800"
                    required
                  />
                </div>

                {/* Alias */}
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Alias (URL slug) *
                  </label>
                  <input
                    type="text"
                    value={form.alias}
                    onChange={(e) => updateForm('alias', e.target.value)}
                    placeholder="e.g. downtown-branch"
                    className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-orange-500 dark:focus:ring-orange-800"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateForm('email', e.target.value)}
                    placeholder="branch@example.com"
                    className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-orange-500 dark:focus:ring-orange-800"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => updateForm('phone', e.target.value)}
                    placeholder="+213 5XX XX XX XX"
                    className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-orange-500 dark:focus:ring-orange-800"
                  />
                </div>

                {/* Wilaya */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Wilaya
                  </label>
                  <input
                    type="text"
                    value={form.wilaya}
                    onChange={(e) => updateForm('wilaya', e.target.value)}
                    placeholder="e.g. Alger"
                    className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-orange-500 dark:focus:ring-orange-800"
                  />
                </div>

                {/* Daira */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Daira
                  </label>
                  <input
                    type="text"
                    value={form.daira}
                    onChange={(e) => updateForm('daira', e.target.value)}
                    placeholder="e.g. Sidi M'Hamed"
                    className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-orange-500 dark:focus:ring-orange-800"
                  />
                </div>

                {/* Commune */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Commune
                  </label>
                  <input
                    type="text"
                    value={form.commune}
                    onChange={(e) => updateForm('commune', e.target.value)}
                    placeholder="e.g. Hydra"
                    className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-orange-500 dark:focus:ring-orange-800"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Address
                </label>
                <textarea
                  value={form.address}
                  onChange={(e) => updateForm('address', e.target.value)}
                  rows={2}
                  placeholder="Street address, building, etc."
                  className="w-full resize-none rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-orange-500 dark:focus:ring-orange-800"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateForm('description', e.target.value)}
                  rows={2}
                  placeholder="Brief description of this branch"
                  className="w-full resize-none rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-orange-500 dark:focus:ring-orange-800"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-orange-600 disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : editingId ? (
                    <Pencil className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  {saving ? 'Saving...' : editingId ? 'Update Branch' : 'Create Branch'}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-xl border border-gray-300 bg-white px-6 py-2.5 text-sm font-bold text-gray-600 transition-all hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Manage Users Modal ── */}
      {showUsersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-900">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Manage Users — {usersBranch?.name || '...'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Assign staff to this branch
                  </p>
                </div>
              </div>
              <button
                onClick={closeUsersModal}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Assigned users list */}
            <div className="mb-6">
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Assigned Users ({usersBranch?.assigned_users?.length ?? 0})
              </h4>
              {(!usersBranch?.assigned_users || usersBranch.assigned_users.length === 0) ? (
                <p className="rounded-xl border-2 border-dashed border-gray-200 px-4 py-6 text-center text-sm text-gray-400 dark:border-gray-700 dark:text-gray-500">
                  No users assigned yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {usersBranch!.assigned_users!.map((u) => (
                    <div
                      key={u.id}
                      className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {u.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {u.email}
                          <span className="mx-1.5">&middot;</span>
                          <span className="rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                            {u.pivot.role}
                          </span>
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveUser(u.id)}
                        className="shrink-0 rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30"
                        title="Remove user"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add user form */}
            <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Assign New User
              </h4>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="number"
                  value={assignUserId}
                  onChange={(e) => setAssignUserId(e.target.value)}
                  placeholder="User ID"
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-orange-500 dark:focus:ring-orange-800 sm:w-1/3"
                />
                <select
                  value={assignUserRole}
                  onChange={(e) => setAssignUserRole(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-orange-500 dark:focus:ring-orange-800 sm:w-1/3"
                >
                  <option value="staff">Staff</option>
                  <option value="manager">Manager</option>
                  <option value="cashier">Cashier</option>
                  <option value="cook">Cook</option>
                  <option value="kds">KDS</option>
                </select>
                <button
                  onClick={handleAssignUser}
                  disabled={assigning || !assignUserId.trim()}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-600 disabled:opacity-50"
                >
                  {assigning ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  Assign
                </button>
              </div>
              <p className="mt-2 text-[10px] text-gray-400">
                Enter the numeric user ID of the staff member to assign.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
