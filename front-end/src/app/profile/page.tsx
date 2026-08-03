'use client'

import { useEffect, useState, useRef, type FormEvent } from 'react'
import { useAuth } from '@/contexts/auth'
import { useLanguage } from '@/contexts/language'
import { api } from '@/lib/api-client'
import { getImageUrl } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { CitySearchSelect } from '@/components/city-search-select'

interface UserProfile {
  name: string
  email: string
  phone: string | null
  address: string | null
  wilaya: string | null
  profile_image: string | null
}

export default function ProfileInfoPage() {
  const { t } = useLanguage()
  const { user, loading: authLoading } = useAuth()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [cityLabel, setCityLabel] = useState('')
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)

  const [fetching, setFetching] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const photoRef = useRef<HTMLInputElement>(null)

  async function loadProfile() {
    const res = await api.get<{ data: UserProfile }>('/user')
    const p = res.data
    setName(p.name)
    setPhone(p.phone || '')
    setAddress(p.address || '')
    if (p.wilaya) setCityLabel(p.wilaya)
    setProfilePhoto(getImageUrl(p.profile_image))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSaving(true)
    try {
      await api.put('/user', {
        name,
        phone: phone || null,
        address: address || null,
        wilaya: cityLabel || null,
      })
      setSuccess(t('profile_save_success'))
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('profile_error_update'))
    }
    setSaving(false)
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    setSuccess('')
    try {
      const res = await api.upload<{ data: UserProfile }>('/user/avatar', file, 'avatar')
      setProfilePhoto(getImageUrl(res.data.profile_image))
      setSuccess(t('profile_avatar_success'))
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('profile_avatar_error'))
    }
  }

  useEffect(() => {
    if (!authLoading && !user) return
    if (!user) return
    ;(async () => {
      try { await loadProfile() } catch { /* ignore */ }
      setFetching(false)
    })()
  }, [user, authLoading])

  if (fetching) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">{error}</div>}
      {success && <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-400">{success}</div>}

      <Card className="overflow-visible">
        <CardHeader><h2 className="text-lg font-semibold">{t('profile_personal_info_title')}</h2></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <Input id="name" label={t('name')} value={name} onChange={(e) => setName(e.target.value)} required />
            <Input id="phone" label={t('phone')} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <Input id="address" label={t('address')} value={address} onChange={(e) => setAddress(e.target.value)} />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('wilaya')}</label>
              <CitySearchSelect value={cityLabel} onChange={(val) => setCityLabel(val)} />
            </div>

            <Button type="submit" disabled={saving}>{saving ? t('profile_save_loading') : t('profile_save')}</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><h2 className="text-lg font-semibold">{t('profile_avatar_title')}</h2></CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            {profilePhoto ? (
              <img src={profilePhoto} alt="" className="h-20 w-20 rounded-full object-cover" />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-2xl font-bold text-orange-600">
                {name.charAt(0)}
              </div>
            )}
            <div>
              <input ref={photoRef} type="file" accept="image/*" onChange={handleAvatarUpload}
                className="block text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:rounded-lg file:border-0 file:bg-orange-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-orange-700 hover:file:bg-orange-100 dark:file:bg-orange-900/30 dark:file:text-orange-300"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
