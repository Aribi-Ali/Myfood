'use client'

import { useAuth } from '@/contexts/auth'
import { useLanguage } from '@/contexts/language'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LogOut, ChefHat } from 'lucide-react'

export default function KdsLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const pathname = usePathname()
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'f' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setFullscreen(v => !v)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="w-10 h-10 border-4 border-orange-500 rounded-full animate-spin border-t-transparent" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className={`min-h-screen bg-slate-900 text-white ${fullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Top bar */}
      <header className="flex items-center justify-between h-14 px-4 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <ChefHat className="h-6 w-6 text-orange-400" />
          <h1 className="text-lg font-bold tracking-tight">{t('kds_layout_title')}</h1>
          <span className="hidden text-sm text-slate-400 sm:inline">
            {user.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            {fullscreen ? t('kds_fullscreen_hint_active') : t('kds_fullscreen_hint_inactive')}
          </span>
          <button
            onClick={() => setFullscreen(v => !v)}
            className="rounded-lg px-2 py-1 text-xs text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            {fullscreen ? t('kds_fullscreen_exit') : t('kds_fullscreen_enter')}
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-red-400 hover:text-red-300 hover:bg-slate-700 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            {t('kds_layout_exit')}
          </button>
        </div>
      </header>
      {/* Content */}
      <main className="p-3 sm:p-4">
        {children}
      </main>
    </div>
  )
}
