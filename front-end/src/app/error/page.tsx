'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/contexts/language'

export default function ErrorPage() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const message = searchParams.get('message') || t('error_default_message')

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 dark:bg-stone-950">
      <div className="text-center max-w-md">
        <div className="mb-4 text-5xl text-stone-300 dark:text-stone-600">!</div>
        <h1 className="mb-2 text-xl font-semibold text-stone-800 dark:text-stone-100">{t('error_default_message')}</h1>
        <p className="mb-6 text-sm text-stone-500 dark:text-stone-400">{message}</p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-lg bg-orange-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-700"
          >
            {t('error_go_home')}
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-stone-300 dark:border-stone-600 px-5 py-2 text-sm font-medium text-stone-700 dark:text-stone-300 transition-colors hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            {t('login')}
          </Link>
        </div>
      </div>
    </div>
  )
}
