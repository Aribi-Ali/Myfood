'use client'

import { createContext, useContext, useCallback, useEffect, useState, type ReactNode } from 'react'
import { THEME_PRESETS, buildThemeCss, type ThemePreset, type ThemeVariables } from '@/lib/themes'

interface ThemeContextValue {
  preset: ThemePreset
  customVars: Partial<ThemeVariables> | null
  applyPreset: (id: string) => void
  setCustomVars: (vars: Partial<ThemeVariables>) => void
  resetToPreset: () => void
  resolvedVars: ThemeVariables
  cssText: string
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const STYLE_ID = 'pb-theme-style'
const ALL_PROPERTIES = (Object.keys(THEME_PRESETS[0]?.vars ?? {}) as (keyof ThemeVariables)[])

function mergeVars(preset: ThemeVariables, custom: Partial<ThemeVariables> | null): ThemeVariables {
  if (!custom) return preset
  const result = { ...preset }
  for (const key of ALL_PROPERTIES) {
    if (custom[key] !== undefined) {
      (result as Record<string, string>)[key] = custom[key] as string
    }
  }
  return result
}

function injectStyleTag(css: string) {
  if (typeof document === 'undefined') return
  const existing = document.getElementById(STYLE_ID)
  if (existing) {
    existing.textContent = css
    return
  }
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = css
  document.head.appendChild(style)
}

export function ThemeProvider({
  children,
  initialPresetId,
  initialCustomVars,
}: {
  children: ReactNode
  initialPresetId?: string
  initialCustomVars?: Partial<ThemeVariables> | null
}) {
  const [preset, setPreset] = useState<ThemePreset>(
    THEME_PRESETS.find(t => t.id === initialPresetId) ?? THEME_PRESETS[0] ?? (() => { throw new Error('No theme presets available') })()
  )
  const [customVars, setCustomVarsState] = useState<Partial<ThemeVariables> | null>(initialCustomVars ?? null)

  const resolvedVars = mergeVars(preset.vars, customVars)

  useEffect(() => {
    injectStyleTag(buildThemeCss(resolvedVars))
  }, [resolvedVars])

  const applyPreset = useCallback((id: string) => {
    const found = THEME_PRESETS.find(t => t.id === id)
    if (found) {
      setPreset(found)
      setCustomVarsState(null)
    }
  }, [])

  const setCustomVars = useCallback((vars: Partial<ThemeVariables>) => {
    setCustomVarsState(prev => ({ ...(prev || {}), ...vars }))
  }, [])

  const resetToPreset = useCallback(() => {
    setCustomVarsState(null)
  }, [])

  const value: ThemeContextValue = {
    preset,
    customVars,
    applyPreset,
    setCustomVars,
    resetToPreset,
    resolvedVars,
    cssText: buildThemeCss(resolvedVars),
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
