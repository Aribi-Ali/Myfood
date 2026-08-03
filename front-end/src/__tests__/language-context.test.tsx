import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LanguageProvider, useLanguage, type Locale } from '@/contexts/language'

// Component that consumes the context
function TestComponent() {
  const { locale, setLocale, t, dir } = useLanguage()
  return (
    <div>
      <span data-testid="locale">{locale}</span>
      <span data-testid="dir">{dir}</span>
      <span data-testid="t-hello">{t('hello')}</span>
      <span data-testid="t-with-param">{t('welcome_name', { name: 'Ali' })}</span>
      <button data-testid="set-fr" onClick={() => setLocale('fr')}>FR</button>
      <button data-testid="set-ar" onClick={() => setLocale('ar')}>AR</button>
    </div>
  )
}

function renderWithProvider() {
  return render(
    <LanguageProvider>
      <TestComponent />
    </LanguageProvider>
  )
}

describe('LanguageProvider', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.lang = ''
    document.documentElement.dir = ''
  })

  it('defaults to English', () => {
    renderWithProvider()
    expect(screen.getByTestId('locale').textContent).toBe('en')
    expect(screen.getByTestId('dir').textContent).toBe('ltr')
  })

  it('restores locale from localStorage', () => {
    localStorage.setItem('locale', 'fr')
    renderWithProvider()
    expect(screen.getByTestId('locale').textContent).toBe('fr')
    expect(screen.getByTestId('dir').textContent).toBe('ltr')
  })

  it('returns key as fallback when message not found', () => {
    renderWithProvider()
    expect(screen.getByTestId('t-hello').textContent).toBe('hello')
  })

  it('switches locale to French', async () => {
    renderWithProvider()
    await userEvent.click(screen.getByTestId('set-fr'))
    expect(screen.getByTestId('locale').textContent).toBe('fr')
    expect(localStorage.getItem('locale')).toBe('fr')
  })

  it('switches locale to Arabic and sets rtl', async () => {
    renderWithProvider()
    await userEvent.click(screen.getByTestId('set-ar'))
    expect(screen.getByTestId('locale').textContent).toBe('ar')
    expect(screen.getByTestId('dir').textContent).toBe('rtl')
    expect(document.documentElement.dir).toBe('rtl')
  })

  it('sets document.documentElement attributes on locale change', async () => {
    renderWithProvider()
    await userEvent.click(screen.getByTestId('set-fr'))
    expect(document.documentElement.lang).toBe('fr')
    expect(document.documentElement.dir).toBe('ltr')
  })
})
