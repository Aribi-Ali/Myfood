'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLanguage } from '@/contexts/language'

import { AuthBackground } from '@/components/auth-background'

export default function RegisterPage() {
  const { user, register } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.replace('/dashboard')
    }
  }, [user, router])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError(t('register_error_mismatch'))
      return
    }
    setLoading(true)
    try {
      await register(name, email, password, confirmPassword, phone)
      router.push('/dashboard')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('register_error_failed')
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthBackground>
      <div>
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-white">
            {t('app_name')}
          </Link>
          <p className="mt-1.5 text-sm text-white/50">{t('register_subtitle')}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-950/50 p-3 text-sm text-red-400 border border-red-800/30">{error}</div>
          )}
          <Input id="name" placeholder={t('name')} value={name} onChange={(e) => setName(e.target.value)} required className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-orange-500 focus:ring-orange-500" />
          <Input id="email" placeholder={t('email')} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-orange-500 focus:ring-orange-500" />
          <Input id="phone" placeholder={t('phone')} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-orange-500 focus:ring-orange-500" />
          <Input id="password" placeholder={t('password')} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-orange-500 focus:ring-orange-500" />
          <Input id="confirm" placeholder={t('register_confirm_placeholder')} type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-orange-500 focus:ring-orange-500" />
          <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-500 text-white" disabled={loading}>
            {loading ? t('register_submit_loading') : t('register_submit')}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-white/40">
          {t('register_has_account')}{' '}
          <Link href="/login" className="font-medium text-orange-400 hover:text-orange-300">
            {t('register_sign_in_link')}
          </Link>
        </p>
      </div>
    </AuthBackground>
  )
}
