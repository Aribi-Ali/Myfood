'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'

const STORAGE_KEY = 'selected_city'

interface CitySelection {
  wilayaId: number | null
  wilayaName: string | null
  commune?: string | null
}

interface CityContextType {
  city: CitySelection
  setCity: (city: CitySelection) => void
  clearCity: () => void
}

const CityContext = createContext<CityContextType | null>(null)

export function CityProvider({ children }: { children: ReactNode }) {
  const [city, setCityState] = useState<CitySelection>({ wilayaId: null, wilayaName: null })

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed && typeof parsed === 'object') {
          setCityState({ wilayaId: parsed.wilayaId ?? null, wilayaName: parsed.wilayaName ?? null })
        }
      }
    } catch {}
  }, [])

  const setCity = useCallback((c: CitySelection) => {
    setCityState(c)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(c)) } catch {}
  }, [])

  const clearCity = useCallback(() => {
    setCityState({ wilayaId: null, wilayaName: null })
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
  }, [])

  return (
    <CityContext.Provider value={{ city, setCity, clearCity }}>
      {children}
    </CityContext.Provider>
  )
}

export function useCity(): CityContextType {
  const ctx = useContext(CityContext)
  if (!ctx) throw new Error('useCity must be used within a CityProvider')
  return ctx
}
