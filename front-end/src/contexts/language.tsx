'use client'

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'

export type Locale = 'en' | 'fr' | 'ar'

interface LanguageContextValue {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: string, params?: Record<string, string | number>) => string
  dir: 'ltr' | 'rtl'
  messages: Record<string, string>
}

const DEFAULT_LOCALE: Locale = 'en'

import enMessages from '@/locales/en.json'

async function loadMessages(locale: Locale): Promise<Record<string, string>> {
  try {
    if (locale === 'en') return enMessages
    const mod = await import(`@/locales/${locale}.json`)
    return mod.default || mod
  } catch {
    return {}
  }
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: (k) => k,
  dir: 'ltr',
  messages: {},
})

export function LanguageProvider({ children, initialLocale }: { children: ReactNode; initialLocale?: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale || DEFAULT_LOCALE)
  const [messages, setMessages] = useState<Record<string, string>>(enMessages)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('locale') as Locale | null
    if (!hydrated && stored && ['en', 'fr', 'ar'].includes(stored) && stored !== locale) {
      setLocaleState(stored)
    }
    setHydrated(true)
  }, [hydrated, locale])

  useEffect(() => {
    if (locale === 'en') {
      setMessages(enMessages)
      document.documentElement.lang = locale
      document.documentElement.dir = 'ltr'
      return
    }
    loadMessages(locale).then(setMessages)
    document.documentElement.lang = locale
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
    localStorage.setItem('locale', locale)
    document.cookie = `locale=${locale};path=/;max-age=31536000;SameSite=Lax`
  }, [locale])

  const setLocale = useCallback((l: Locale) => setLocaleState(l), [])

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      let msg = messages[key] || key
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          msg = msg.replace(`:${k}`, String(v))
        }
      }
      return msg
    },
    [messages],
  )

  const dir: 'ltr' | 'rtl' = locale === 'ar' ? 'rtl' : 'ltr'

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, dir, messages }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
