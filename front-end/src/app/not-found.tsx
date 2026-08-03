'use client'

import Link from 'next/link'
import { useLanguage } from '@/contexts/language'

export default function NotFound() {
  const { t } = useLanguage()
  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 dark:bg-stone-950">
      <div className="text-center">
        <div className="mb-4 text-6xl font-bold text-stone-300 dark:text-stone-600">404</div>
        <h1 className="mb-2 text-xl font-semibold text-stone-800 dark:text-stone-100">{t('page_not_found')}</h1>
        <p className="mb-6 text-sm text-stone-500 dark:text-stone-400">{t('page_not_found_desc')}</p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-orange-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-700"
        >
          {t('go_home')}
        </Link>
      </div>
    </div>
  )
}
