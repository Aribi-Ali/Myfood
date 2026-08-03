'use client'

import { useLanguage, type Locale } from '@/contexts/language'
import { Languages } from 'lucide-react'

const locales: { value: Locale; label: string }[] = [
  { value: 'en', label: 'EN' },
  { value: 'fr', label: 'FR' },
  { value: 'ar', label: 'AR' },
]

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage()

  return (
    <div className="flex items-center gap-1">
      <Languages className="h-4 w-4 text-gray-400" />
      {locales.map((l) => (
        <button
          key={l.value}
          onClick={() => setLocale(l.value)}
          className={`rounded px-1.5 py-0.5 text-xs font-medium transition-colors ${
            locale === l.value
              ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}
