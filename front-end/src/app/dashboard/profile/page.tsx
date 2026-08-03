'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth'
import { useLanguage } from '@/contexts/language'
import { api } from '@/lib/api-client'
import { getImageUrl } from '@/lib/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Camera, Loader2 } from 'lucide-react'
import { CitySearchSelect } from '@/components/city-search-select'

export default function ProfilePage() {
  const { user, loading, refreshUser } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const initRef = useRef(false)

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [cityLabel, setCityLabel] = useState('')
  const [cityMeta, setCityMeta] = useState<{ wilaya_id: number; daira_id: number; commune_id: number } | null>(null)
  const [address, setAddress] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  useEffect(() => {
    if (!loading && !user) { router.push('/login'); return }
  }, [user, loading, router])

  useEffect(() => {
    if (user && !initRef.current) {
      initRef.current = true
      setName(user.name || '')
      setPhone(user.phone || '')
      if (user.wilaya) setCityLabel(user.wilaya)
      if (user.address) setAddress(user.address)
    }
  }, [user])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')
    try {
      await api.put('/user', {
        name,
        phone,
        wilaya: cityLabel,
        wilaya_id: cityMeta?.wilaya_id,
        daira_id: cityMeta?.daira_id,
        commune_id: cityMeta?.commune_id,
        address,
      })
      await refreshUser()
      setMessage(t('profile_updated'))
    } catch (err) {
      setError(err instanceof Error ? err.message : t('failed_to_update_profile'))
    }
    setSaving(false)
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    setChangingPassword(true)
    setPasswordMessage('')
    setPasswordError('')
    try {
      await api.post('/user/password', {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: newPasswordConfirmation,
      })
      setPasswordMessage(t('password_updated'))
      setCurrentPassword('')
      setNewPassword('')
      setNewPasswordConfirmation('')
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : t('failed_to_change_password'))
    }
    setChangingPassword(false)
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingAvatar(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      await api.post('/user/avatar', formData)
      await refreshUser()
    } catch (err) {
      setError(err instanceof Error ? err.message : t('failed_to_upload_avatar'))
    }
    setUploadingAvatar(false)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Card><CardContent className="p-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('profile')}</h1>
        <p className="text-gray-500 dark:text-slate-400">{t('manage_profile')}</p>
      </div>

      {message && (
        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-300">{message}</div>
      )}
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">{error}</div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('personal_info')}</h3>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('full_name')}</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('email')}</label>
                  <Input value={user?.email || ''} disabled className="bg-gray-50 dark:bg-slate-700" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('phone')}</label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('city')}</label>
                  <CitySearchSelect
                    value={cityLabel}
                    onChange={(label, meta) => {
                      setCityLabel(label)
                      setCityMeta(meta)
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('address')}</label>
                  <Input value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t('save_changes')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('change_password')}</h3>
            </CardHeader>
            <CardContent>
              {passwordMessage && (
                <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-300">{passwordMessage}</div>
              )}
              {passwordError && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">{passwordError}</div>
              )}
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('current_password')}</label>
                  <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('new_password')}</label>
                  <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('confirm_password')}</label>
                  <Input type="password" value={newPasswordConfirmation} onChange={(e) => setNewPasswordConfirmation(e.target.value)} required />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={changingPassword}>
                    {changingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t('update_password')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('avatar')}</h3>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <div className="relative">
                {user?.profile_image ? (
                  <img
                    src={getImageUrl(user.profile_image) ?? ''}
                    alt={user.name}
                    className="h-32 w-32 rounded-full object-cover border-4 border-gray-100 dark:border-slate-700"
                  />
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center rounded-full bg-orange-100 text-4xl font-bold text-orange-600 dark:bg-orange-900 dark:text-orange-300 border-4 border-gray-100 dark:border-slate-700">
                    {user?.name?.charAt(0) || '?'}
                  </div>
                )}
                {uploadingAvatar && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploadingAvatar}>
                <Camera className="mr-2 h-4 w-4" />
                {t('change_photo')}
              </Button>
            </CardContent>
          </Card>

          {user?.store && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('store_info')}</h3>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-600 dark:text-slate-400">
                <p><span className="font-medium text-gray-900 dark:text-white">{t('name')}:</span> {user.store.name}</p>
                <p><span className="font-medium text-gray-900 dark:text-white">{t('alias')}:</span> {user.store.alias}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
