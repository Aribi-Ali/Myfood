'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth'
import { useLanguage } from '@/contexts/language'
import { api } from '@/lib/api-client'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus } from 'lucide-react'

interface Staff {
  id: number
  name: string
  store_role: string
  display_on_profile: boolean
  created_at: string
}

const ROLES = ['manager', 'cook', 'cashier', 'delivery', 'kds'] as const

export default function StaffPage() {
  const { user, loading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [staff, setStaff] = useState<Staff[]>([])
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Staff | null>(null)
  const [userId, setUserId] = useState('')
  const [role, setRole] = useState<string>('manager')
  const [displayOnProfile, setDisplayOnProfile] = useState(true)
  const [saving, setSaving] = useState(false)

  async function fetchStaff() {
    setFetching(true)
    setError('')
    try {
      const res = await api.get<{ data: Staff[] }>('/owner/staff')
      setStaff(res.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('failed_to_load_staff'))
    }
    setFetching(false)
  }

  function resetForm() {
    setUserId('')
    setRole('manager')
    setDisplayOnProfile(true)
    setEditing(null)
    setShowForm(false)
  }

  function editStaff(s: Staff) {
    setEditing(s)
    setUserId(String(s.id))
    setRole(s.store_role)
    setDisplayOnProfile(s.display_on_profile)
    setShowForm(true)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = { user_id: parseInt(userId), store_role: role, display_on_profile: displayOnProfile }
      let saved: Staff
      if (editing) {
        const res = await api.put<{ data: Staff }>(`/owner/staff/${editing.id}`, payload)
        saved = res.data
      } else {
        const res = await api.post<{ data: Staff }>('/owner/staff', payload)
        saved = res.data
      }
      setStaff((prev) => {
        const idx = prev.findIndex((s) => s.id === saved.id)
        if (idx >= 0) {
          const next = [...prev]
          next[idx] = saved
          return next
        }
        return [...prev, saved]
      })
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : t('failed_to_save_staff'))
    }
    setSaving(false)
  }

  async function deleteStaff(id: number) {
    if (!confirm(t('remove_staff_confirm'))) return
    try {
      await api.delete(`/owner/staff/${id}`)
      setStaff((prev) => prev.filter((s) => s.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : t('failed_to_delete_staff'))
    }
  }

  useEffect(() => {
    if (!loading && !user) { router.push('/login'); return }
    if (!user) return
    ;(async () => {
      setFetching(true)
      setError('')
      try {
        const res = await api.get<{ data: Staff[] }>('/owner/staff')
        setStaff(res.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : t('failed_to_load_staff'))
      }
      setFetching(false)
    })()
  }, [user, loading, router])

  if (loading || fetching) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}><CardContent className="p-4"><Skeleton className="h-12 w-full" /></CardContent></Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('staff')}</h1>
          <p className="text-gray-500">{t('manage_staff')}</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true) }}>
          <Plus className="mr-1 h-4 w-4" /> {t('add_staff')}
        </Button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">{editing ? t('edit_staff_member') : t('add_staff_member')}</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
              <Input id="userId" label={t('user_id')} type="number" value={userId} onChange={(e) => setUserId(e.target.value)} required />
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">{t('role')}</label>
                <select id="role" value={role} onChange={(e) => setRole(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {ROLES.map((r) => <option key={r} value={r}>{t(r)}</option>)}
                </select>
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={displayOnProfile} onChange={(e) => setDisplayOnProfile(e.target.checked)}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-sm font-medium text-gray-700">{t('display_on_profile')}</span>
              </label>
              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>{saving ? t('saving') : t('save')}</Button>
                <Button type="button" variant="outline" onClick={resetForm}>{t('cancel')}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {staff.map((s) => (
          <Card key={s.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{s.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
                      {t(s.store_role)}
                    </span>
                    <span className={`text-xs ${s.display_on_profile ? 'text-green-600' : 'text-gray-500'}`}>
                      {s.display_on_profile ? t('displayed') : t('hidden')}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => editStaff(s)}>{t('edit')}</Button>
                  <Button variant="danger" size="sm" onClick={() => deleteStaff(s.id)}>{t('remove')}</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {staff.length === 0 && !error && (
        <Card>
          <CardContent className="p-6 text-center text-gray-500">{t('no_staff')}</CardContent>
        </Card>
      )}
    </div>
  )
}
