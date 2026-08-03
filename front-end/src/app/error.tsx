'use client'

import Link from 'next/link'
import { useLanguage } from '@/contexts/language'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { t } = useLanguage()
  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 dark:bg-stone-950">
      <div className="text-center max-w-md">
        <div className="mb-4 text-5xl text-stone-300 dark:text-stone-600">!</div>
        <h1 className="mb-2 text-xl font-semibold text-stone-800 dark:text-stone-100">{t('something_went_wrong')}</h1>
        <p className="mb-6 text-sm text-stone-500 dark:text-stone-400">
          {error.message || t('something_went_wrong')}
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-lg bg-orange-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-700"
          >
            {t('try_again')}
          </button>
          <Link
            href="/"
            className="rounded-lg border border-stone-300 dark:border-stone-600 px-5 py-2 text-sm font-medium text-stone-700 dark:text-stone-300 transition-colors hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            {t('go_home')}
          </Link>
        </div>
      </div>
    </div>
  )
}
