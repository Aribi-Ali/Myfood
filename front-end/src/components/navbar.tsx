'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth'
import { useCity } from '@/contexts/city'
import { useCurrency, type Currency } from '@/contexts/currency'
import { useLanguage } from '@/contexts/language'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Button } from '@/components/ui/button'
import { CitySelector } from '@/components/city-selector'
import { MapPin, User, LayoutDashboard, LogOut, ChevronDown, ShoppingBag, DollarSign, Menu, X, Store } from 'lucide-react'

const CURRENCIES: { value: Currency; label: string }[] = [
  { value: 'DA', label: 'DA' },
  { value: 'USD', label: '$ USD' },
  { value: 'EUR', label: '€ EUR' },
]

export function Navbar() {
  const { user, loading, logout } = useAuth()
  const { city } = useCity()
  const { currency, setCurrency } = useCurrency()
  const { t } = useLanguage()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cityOpen, setCityOpen] = useState(false)
  const [currencyOpen, setCurrencyOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const currencyRef = useRef<HTMLDivElement>(null)
  const mobilePanelRef = useRef<HTMLDivElement>(null)

  // Click-outside for dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
      if (currencyRef.current && !currencyRef.current.contains(e.target as Node)) {
        setCurrencyOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  // Close mobile menu on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false)
        setUserMenuOpen(false)
        setCurrencyOpen(false)
      }
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [])

  function closeAll() {
    setMobileMenuOpen(false)
    setUserMenuOpen(false)
    setCurrencyOpen(false)
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/20 bg-white/75 shadow-[0_1px_4px_0_rgba(0,0,0,0.05)] backdrop-blur-2xl supports-[backdrop-filter]:bg-white/65">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* ── Brand Logo ── */}
          <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label={t('app_name')}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-sm shadow-orange-200/50 transition-all duration-300 group-hover:shadow-md group-hover:shadow-orange-300/40">
              <span className="text-base font-bold tracking-tight text-white">Y</span>
            </div>
            <span className="hidden text-lg font-extrabold tracking-tight text-gray-900 sm:inline-block">
              {t('app_name')}
            </span>
          </Link>

          {/* ── Desktop Navigation ── */}
          <nav className="hidden items-center gap-0.5 lg:flex">
            {/* City Selector */}
            <button
              onClick={() => setCityOpen(true)}
              className="group flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-orange-50 hover:text-orange-700"
            >
              <MapPin className="h-4 w-4 text-gray-400 transition-colors duration-200 group-hover:text-orange-500" />
              <span className="max-w-24 truncate">{city.wilayaName || t('navbar_city_placeholder')}</span>
            </button>

            {/* Stores Link */}
            <Link
              href="/stores"
              className="group flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-orange-50 hover:text-orange-700"
            >
              <Store className="h-4 w-4 text-gray-400 transition-colors duration-200 group-hover:text-orange-500" />
              <span>{t('stores')}</span>
            </Link>

            {/* Divider */}
            <div className="mx-1.5 h-5 w-px bg-gray-200" />

            {/* Language Switcher */}
            <div className="rounded-lg bg-gray-50/80 px-2 py-1">
              <LanguageSwitcher />
            </div>

            {/* Currency Selector */}
            <div ref={currencyRef} className="relative">
              <button
                onClick={() => setCurrencyOpen(v => !v)}
                className="group flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-orange-50 hover:text-orange-700"
                aria-expanded={currencyOpen}
                aria-haspopup="true"
              >
                <DollarSign className="h-4 w-4 text-gray-400 transition-colors duration-200 group-hover:text-orange-500" />
                <span>{currency}</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-gray-400 transition-all duration-200 ${
                    currencyOpen ? 'rotate-180 text-orange-500' : ''
                  }`}
                />
              </button>

              <div
                className={`absolute right-0 z-50 mt-2 w-32 origin-top-right overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg shadow-gray-200/50 ring-1 ring-black/5 transition-all duration-200 ${
                  currencyOpen
                    ? 'visible translate-y-0 scale-100 opacity-100'
                    : 'invisible -translate-y-2 scale-95 opacity-0'
                }`}
                role="menu"
              >
                <div className="py-1">
                  {CURRENCIES.map(c => (
                    <button
                      key={c.value}
                      onClick={() => { setCurrency(c.value); setCurrencyOpen(false) }}
                      className={`flex w-full items-center px-4 py-2.5 text-sm transition-colors duration-150 ${
                        currency === c.value
                          ? 'bg-orange-50 font-semibold text-orange-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                      role="menuitem"
                    >
                      <span
                        className={`mr-2 inline-block h-2 w-2 rounded-full ${
                          currency === c.value ? 'bg-orange-500' : 'bg-gray-300'
                        }`}
                      />
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="mx-2 h-5 w-px bg-gray-200" />

            {/* Auth Section */}
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-9 w-20 animate-pulse rounded-xl bg-gray-100" />
                <div className="h-9 w-28 animate-pulse rounded-xl bg-gray-100" />
              </div>
            ) : user ? (
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setUserMenuOpen(v => !v)}
                  className="group flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-orange-50 hover:text-orange-700"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  {user.profile_image ? (
                    <div className="relative shrink-0">
                      <img
                        src={user.profile_image}
                        alt=""
                        className="h-8 w-8 rounded-full object-cover ring-2 ring-white shadow-sm transition-all duration-200 group-hover:ring-orange-200"
                      />
                      <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-black/5" />
                    </div>
                  ) : (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-sm font-bold text-white shadow-sm ring-2 ring-white transition-all duration-200 group-hover:ring-orange-200 group-hover:shadow-md">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden xl:inline max-w-28 truncate">{user.name}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-gray-400 transition-all duration-200 ${
                      userMenuOpen ? 'rotate-180 text-orange-500' : ''
                    }`}
                  />
                </button>

                <div
                  className={`absolute right-0 z-50 mt-2 w-64 origin-top-right overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg shadow-gray-200/50 ring-1 ring-black/5 transition-all duration-200 ${
                    userMenuOpen
                      ? 'visible translate-y-0 scale-100 opacity-100'
                      : 'invisible -translate-y-2 scale-95 opacity-0'
                  }`}
                  role="menu"
                >
                  {/* User Info Header */}
                  <div className="border-b border-gray-100 bg-gradient-to-r from-orange-50/60 via-orange-50/20 to-transparent px-4 py-3.5">
                    <p className="truncate text-sm font-semibold text-gray-900">{user.name}</p>
                    <p className="truncate text-xs text-gray-500">{user.email}</p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <Link
                      href="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors duration-150 hover:bg-orange-50 hover:text-orange-700"
                      role="menuitem"
                    >
                      <User className="h-4 w-4 shrink-0" />
                      <span>{t('profile')}</span>
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors duration-150 hover:bg-orange-50 hover:text-orange-700"
                      role="menuitem"
                    >
                      <ShoppingBag className="h-4 w-4 shrink-0" />
                      <span>{t('navbar_user_menu_orders')}</span>
                    </Link>
                    {user.role !== 'client' && (
                      <Link
                        href="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors duration-150 hover:bg-orange-50 hover:text-orange-700"
                        role="menuitem"
                      >
                        <LayoutDashboard className="h-4 w-4 shrink-0" />
                        <span>{t('dashboard')}</span>
                      </Link>
                    )}
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-100 py-1">
                    <button
                      onClick={() => { setUserMenuOpen(false); logout() }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition-colors duration-150 hover:bg-red-50"
                      role="menuitem"
                    >
                      <LogOut className="h-4 w-4 shrink-0" />
                      <span>{t('logout')}</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">{t('navbar_sign_in')}</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">{t('navbar_get_started')}</Button>
                </Link>
              </div>
            )}
          </nav>

          {/* ── Mobile: Icon Row ── */}
          <div className="flex items-center gap-1.5 lg:hidden">
            {/* Quick-access city button on mobile */}
            <button
              onClick={() => setCityOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition-colors duration-200 hover:bg-orange-50 hover:text-orange-600"
              aria-label="Select city"
            >
              <MapPin className="h-5 w-5" />
            </button>

            {/* Mobile user avatar (logged in) or sign-in (guest) */}
            {loading ? (
              <div className="h-9 w-9 animate-pulse rounded-full bg-gray-100" />
            ) : user ? (
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="relative shrink-0"
                aria-label="Open menu"
              >
                {user.profile_image ? (
                  <img
                    src={user.profile_image}
                    alt=""
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-white shadow-sm transition-all duration-200 hover:ring-orange-200"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-sm font-bold text-white shadow-sm ring-2 ring-white transition-all duration-200 hover:ring-orange-200">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </button>
            ) : (
              <Link href="/login" className="hidden sm:inline-block">
                <Button variant="ghost" size="sm">{t('navbar_sign_in')}</Button>
              </Link>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition-colors duration-200 hover:bg-gray-100"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Menu Overlay (slide-in from right) ── */}
      <div
        className={`fixed inset-0 z-[60] transition-all duration-300 lg:hidden ${
          mobileMenuOpen ? 'visible' : 'invisible'
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Panel */}
        <div
          ref={mobilePanelRef}
          className={`absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-white shadow-2xl transition-all duration-300 ease-out ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Panel Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 shadow-sm">
                <span className="text-sm font-bold text-white">Y</span>
              </div>
              <span className="text-base font-extrabold tracking-tight text-gray-900">
                {t('app_name')}
              </span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-700"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Panel Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-5 py-6">
            {/* User Info Section (when logged in) */}
            {!loading && user && (
              <div className="mb-6 rounded-2xl bg-gradient-to-br from-orange-50/80 to-white border border-orange-100/50 p-4">
                <div className="flex items-center gap-3">
                  {user.profile_image ? (
                    <img
                      src={user.profile_image}
                      alt={user.name}
                      className="h-12 w-12 rounded-full object-cover ring-2 ring-white shadow-sm"
                    />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-base font-bold text-white shadow-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">{user.name}</p>
                    <p className="truncate text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Group */}
            <div className="mb-6 space-y-1">
              <p className="px-1 pb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Navigation
              </p>

              {/* City Selector */}
              <button
                onClick={() => { setCityOpen(true); setMobileMenuOpen(false) }}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition-colors duration-150 hover:bg-orange-50 hover:text-orange-700"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">City</span>
                  <span className="text-xs text-gray-500">{city.wilayaName || t('navbar_city_placeholder')}</span>
                </div>
              </button>

              {/* Stores Link */}
              <Link
                href="/stores"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition-colors duration-150 hover:bg-orange-50 hover:text-orange-700"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                  <Store className="h-4 w-4" />
                </div>
                <span>{t('stores')}</span>
              </Link>
            </div>

            {/* Preferences Group */}
            <div className="mb-6 space-y-3">
              <p className="px-1 pb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Preferences
              </p>

              {/* Language */}
              <div className="rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Language</span>
                  <LanguageSwitcher />
                </div>
              </div>

              {/* Currency */}
              <div className="rounded-xl border border-gray-100 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Currency</span>
                  <div className="flex gap-1">
                    {CURRENCIES.map(c => (
                      <button
                        key={c.value}
                        onClick={() => setCurrency(c.value)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
                          currency === c.value
                            ? 'bg-orange-500 text-white shadow-sm'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* User Menu (when logged in) */}
            {!loading && user && (
              <div className="mb-6 space-y-1">
                <p className="px-1 pb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Account
                </p>

                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition-colors duration-150 hover:bg-orange-50 hover:text-orange-700"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                    <User className="h-4 w-4" />
                  </div>
                  <span>{t('profile')}</span>
                </Link>

                <Link
                  href="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition-colors duration-150 hover:bg-orange-50 hover:text-orange-700"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                    <ShoppingBag className="h-4 w-4" />
                  </div>
                  <span>{t('navbar_user_menu_orders')}</span>
                </Link>

                {user.role !== 'client' && (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition-colors duration-150 hover:bg-orange-50 hover:text-orange-700"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                      <LayoutDashboard className="h-4 w-4" />
                    </div>
                    <span>{t('dashboard')}</span>
                  </Link>
                )}

                <div className="mt-3 border-t border-gray-100 pt-3">
                  <button
                    onClick={() => { setMobileMenuOpen(false); logout() }}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition-colors duration-150 hover:bg-red-50"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                      <LogOut className="h-4 w-4" />
                    </div>
                    <span>{t('logout')}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Guest Auth Buttons */}
            {!loading && !user && (
              <div className="space-y-3">
                <p className="px-1 pb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Account
                </p>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-center">
                    {t('navbar_sign_in')}
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full justify-center">
                    {t('navbar_get_started')}
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Panel Footer */}
          <div className="border-t border-gray-100 px-5 py-4">
            <p className="text-center text-xs text-gray-400">
              &copy; {new Date().getFullYear()} {t('app_name')}
            </p>
          </div>
        </div>
      </div>

      <CitySelector open={cityOpen} onClose={() => setCityOpen(false)} />
    </>
  )
}
