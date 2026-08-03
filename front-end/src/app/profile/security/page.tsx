'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth'
import { useLanguage } from '@/contexts/language'
import { api } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'

export default function SecurityPage() {
  const { t } = useLanguage()
  const { logout } = useAuth()
  const router = useRouter()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)

  const [deletePassword, setDeletePassword] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handlePasswordChange(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (newPassword !== newPasswordConfirmation) {
      setError(t('security_password_mismatch'))
      return
    }
    setChangingPassword(true)
    try {
      await api.post('/profile/password', {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: newPasswordConfirmation,
      })
      setSuccess(t('password_updated'))
      setCurrentPassword('')
      setNewPassword('')
      setNewPasswordConfirmation('')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('security_password_error'))
    }
    setChangingPassword(false)
  }

  async function handleDeleteAccount() {
    setError('')
    setDeleting(true)
    try {
      await api.delete('/profile/account', { password: deletePassword })
      await logout()
      router.push('/register')
    } catch (err) {
      setError(err instanceof Error ? err.message : t('security_delete_error'))
    }
    setDeleting(false)
  }

  return (
    <div className="space-y-6">
      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">{error}</div>}
      {success && <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-400">{success}</div>}

      <Card>
        <CardHeader><h2 className="text-lg font-semibold">{t('security_change_password_title')}</h2></CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
            <Input id="currentPassword" label={t('current_password')} type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
            <Input id="newPassword" label={t('new_password')} type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            <Input id="confirmPassword" label={t('confirm_password')} type="password" value={newPasswordConfirmation} onChange={(e) => setNewPasswordConfirmation(e.target.value)} required />
            <Button type="submit" disabled={changingPassword}>{changingPassword ? t('security_change_loading') : t('update_password')}</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-red-200 dark:border-red-900/50">
        <CardHeader><h2 className="text-lg font-semibold text-red-600 dark:text-red-400">{t('security_delete_account_title')}</h2></CardHeader>
        <CardContent>
          {!showDeleteConfirm ? (
            <Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>
              <AlertTriangle className="mr-1 h-4 w-4" /> {t('security_delete_button')}
            </Button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-red-600 dark:text-red-400">{t('security_delete_warning')}</p>
              <Input id="deletePassword" label={t('security_delete_password_label')} type="password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} />
              <div className="flex gap-2">
                <Button variant="danger" onClick={handleDeleteAccount} disabled={deleting || !deletePassword}>
                  {deleting ? t('security_delete_deleting') : t('security_delete_confirm')}
                </Button>
                <Button variant="outline" onClick={() => { setShowDeleteConfirm(false); setDeletePassword('') }}>
                  {t('security_delete_cancel')}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
