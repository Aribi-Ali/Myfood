'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api-client'
import { useLanguage } from '@/contexts/language'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function VerifyEmailPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleResend = async () => {
    setSending(true)
    setMessage('')
    setError('')
    try {
      await api.post('/email/verification-notification')
      setMessage(t('verify_email_success'))
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('verify_email_error_generic')
      setError(message)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-xl font-semibold text-center">{t('verify_email_title')}</h2>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            {t('verify_email_description')}
          </p>

          {message && <p className="text-green-600 dark:text-green-400 text-sm">{message}</p>}
          {error && <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>}

          <Button onClick={handleResend} disabled={sending} className="w-full">
            {sending ? t('verify_email_resend_loading') : t('verify_email_resend')}
          </Button>

          <div className="pt-4 border-t">
            <Link href="/login" className="text-sm text-red-600 dark:text-red-400 hover:underline">
              {t('verify_email_back_to_login')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
