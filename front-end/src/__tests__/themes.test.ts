import { describe, it, expect } from 'vitest'
import { THEME_PRESETS, buildThemeCss, getThemePreset, varsToRecord, type ThemeVariables } from '@/lib/themes'

describe('THEME_PRESETS', () => {
  it('has at least 10 presets', () => {
    expect(THEME_PRESETS.length).toBeGreaterThanOrEqual(10)
  })

  it('each preset has required fields', () => {
    for (const preset of THEME_PRESETS) {
      expect(preset.id).toBeTruthy()
      expect(preset.name).toBeTruthy()
      expect(preset.category).toBeTruthy()
      expect(preset.vars).toBeTruthy()
      expect(preset.vars['--color-primary']).toBeTruthy()
    }
  })

  it('all preset IDs are unique', () => {
    const ids = THEME_PRESETS.map(p => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('buildThemeCss', () => {
  it('builds valid CSS with custom properties', () => {
    const css = buildThemeCss({ '--color-primary': '#000' })
    expect(css).toContain(':root {')
    expect(css).toContain('--color-primary: #000;')
    expect(css).toContain('}')
  })

  it('handles multiple variables', () => {
    const css = buildThemeCss({ '--a': '1', '--b': '2' } as unknown as Partial<ThemeVariables>)
    expect(css).toContain('--a: 1;')
    expect(css).toContain('--b: 2;')
  })
})

describe('getThemePreset', () => {
  it('returns preset by ID', () => {
    const preset = getThemePreset('amber-glow')
    expect(preset).toBeTruthy()
    expect(preset.name).toBe('Amber Glow')
  })

  it('returns first preset for unknown ID', () => {
    const preset = getThemePreset('nonexistent')!
    expect(preset.id).toBe(THEME_PRESETS[0]!.id)
  })
})

describe('varsToRecord', () => {
  it('converts ThemeVariables to Record', () => {
    const preset = THEME_PRESETS[0]!
    const record = varsToRecord(preset.vars)
    expect(record['--color-primary']).toBe(preset.vars['--color-primary']!)
    expect(record['--font-body']).toBe(preset.vars['--font-body']!)
  })
})
