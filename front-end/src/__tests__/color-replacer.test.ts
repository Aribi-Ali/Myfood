import { describe, it, expect } from 'vitest'
import { replaceColorsWithCssVars } from '@/lib/color-replacer'

describe('replaceColorsWithCssVars', () => {
  const vars: Record<string, string> = {
    '--color-primary': '#c2410c',
    '--color-secondary': '#d97706',
  }

  it('replaces Tailwind arbitrary values', () => {
    const html = '<div class="text-[#c2410c] bg-[#d97706]">hello</div>'
    const result = replaceColorsWithCssVars(html, vars)
    expect(result).toContain('text-[var(--color-primary)]')
    expect(result).toContain('bg-[var(--color-secondary)]')
  })

  it('replaces inline style colors', () => {
    const html = '<div style="color: #c2410c; background: #d97706">hello</div>'
    const result = replaceColorsWithCssVars(html, vars)
    expect(result).toContain('color: var(--color-primary)')
    expect(result).toContain('background: var(--color-secondary)')
  })

  it('returns html unchanged when no matching colors', () => {
    const html = '<div class="text-[#111111]">hello</div>'
    expect(replaceColorsWithCssVars(html, vars)).toBe(html)
  })

  it('returns html unchanged when vars is empty', () => {
    const html = '<div class="text-[#c2410c]">hello</div>'
    expect(replaceColorsWithCssVars(html, {})).toBe(html)
  })

  it('handles case-insensitive hex values', () => {
    const html = '<div class="text-[#C2410C]">hello</div>'
    const result = replaceColorsWithCssVars(html, vars)
    expect(result).toContain('var(--color-primary)')
  })

  it('handles multiple replacements in same class string', () => {
    const html = '<div class="text-[#c2410c] border-[#c2410c]">hello</div>'
    const result = replaceColorsWithCssVars(html, vars)
    expect(result.match(/var\(--color-primary\)/g)).toHaveLength(2)
  })
})
