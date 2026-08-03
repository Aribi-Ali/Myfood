'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/auth'
import { useLanguage } from '@/contexts/language'
import { api } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { LogOut, Bike, PackageCheck, Clock, DollarSign, Power, PowerOff } from 'lucide-react'

interface DeliveryStats {
  pending_count: number
  completed_count: number
  earnings: number
  is_working?: boolean
}

export default function DeliveryLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const pathname = usePathname()
  const [stats, setStats] = useState<DeliveryStats | null>(null)
  const [isWorking, setIsWorking] = useState(false)

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get<{ data: DeliveryStats }>('/delivery/stats')
      setStats(res.data)
      setIsWorking(res.data.is_working ?? false)
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return
    fetchStats()
    const interval = setInterval(fetchStats, 10000)
    return () => clearInterval(interval)
  }, [user, fetchStats])

  async function toggleWorking() {
    try {
      const res = await api.post<{ data: { is_working: boolean } }>('/delivery/status')
      setIsWorking(res.data.is_working)
    } catch { /* ignore */ }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-600 border-t-transparent" />
      </div>
    )
  }

  if (!user) return null

  const navLinks = [
    { href: '/delivery', label: t('delivery_nav_available') },
    { href: '/delivery/active', label: t('delivery_nav_active') },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-slate-900">
      <header className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-slate-800">
        {/* Top bar */}
        <div className="flex h-14 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="/delivery" className="flex items-center gap-2 text-lg font-bold text-orange-600">
              <Image src="/logo.png" alt={t('delivery_layout_brand')} width={28} height={28} className="h-7 w-7 rounded-lg object-cover" />
              <span>{t('delivery_layout_brand')}</span>
            </Link>
            <nav className="hidden sm:flex items-center gap-1">
              {navLinks.map(({ href, label }) => {
                const active = pathname === href
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      active
                        ? 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
                    }`}
                  >
                    {label}
                  </Link>
                )
              })}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost" size="sm"
              onClick={toggleWorking}
              className={isWorking ? 'text-green-600' : 'text-red-500'}
              title={isWorking ? t('delivery_title_online') : t('delivery_title_offline')}
            >
              {isWorking ? <Power className="h-4 w-4" /> : <PowerOff className="h-4 w-4" />}
              <span className="hidden sm:inline ml-1 text-xs">{isWorking ? t('delivery_status_online') : t('delivery_status_offline')}</span>
            </Button>
            <span className="hidden sm:block text-sm text-gray-500 dark:text-gray-400">{user.name}</span>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {/* Mobile nav + stats */}
        <div className="sm:hidden flex items-center gap-1 px-4 pb-2 overflow-x-auto">
          {navLinks.map(({ href, label }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </div>
        {/* Stats bar */}
        {stats && (
          <div className="flex items-center gap-4 px-4 sm:px-6 pb-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-orange-500" />
              <span>{t('delivery_stats_pending', { count: stats.pending_count })}</span>
            </span>
            <span className="flex items-center gap-1">
              <PackageCheck className="h-3 w-3 text-green-500" />
              <span>{t('delivery_stats_completed', { count: stats.completed_count })}</span>
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="h-3 w-3 text-emerald-500" />
              <span>{stats.earnings?.toLocaleString()} {t('currency_da')}</span>
            </span>
          </div>
        )}
      </header>
      <main className="flex-1 p-4 sm:p-6">{children}</main>
    </div>
  )
}
