'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/auth'
import { useLanguage } from '@/contexts/language'
import { Button } from '@/components/ui/button'
import { User, ChefHat, Truck, Store, AlertTriangle, X } from 'lucide-react'

const profileTabs = [
  { href: '/dashboard/profile', label: 'profile', icon: User, role: null },
  { href: '/dashboard/profile/chef', label: 'become_chef', icon: ChefHat, role: 'chef' },
  { href: '/dashboard/profile/delivery', label: 'become_delivery', icon: Truck, role: 'delivery' },
  { href: '/dashboard/profile/store', label: 'my_store', icon: Store, role: 'owner' },
] as const

const ROLE_LABELS: Record<string, string> = {
  owner: 'owner',
  chef: 'chef',
  delivery: 'delivery',
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [warnTarget, setWarnTarget] = useState<string | null>(null)

  function handleTabClick(href: string, targetRole: string | null) {
    if (!targetRole || !user || user.role === 'client') {
      router.push(href)
      return
    }
    if (user.role !== targetRole) {
      setWarnTarget(href)
    } else {
      router.push(href)
    }
  }

  const warnRole = profileTabs.find(t => t.href === warnTarget)?.role
  const warnHref = warnTarget

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-slate-700 pb-2">
        {profileTabs.map(({ href, label, icon: Icon, role: tabRole }) => {
          const active = pathname === href
          return (
            <button
              key={href}
              onClick={() => handleTabClick(href, tabRole)}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="h-4 w-4" />
              {t(label)}
            </button>
          )
        })}
      </div>

      {/* Role-switch warning modal */}
      {warnHref && warnRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-800">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('switch_role_title')}
                </h3>
              </div>
              <button
                onClick={() => setWarnTarget(null)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-slate-300">
              <p>
                {t('switch_role_warning')
                  .replace('{current}', t(ROLE_LABELS[user?.role || ''] || user?.role || ''))
                  .replace('{target}', t(ROLE_LABELS[warnRole] || warnRole))}
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>{t('switch_role_lose_access')}</li>
                <li>{t('switch_role_disable_features')}</li>
              </ul>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setWarnTarget(null)}>
                {t('cancel')}
              </Button>
              <Button
                onClick={() => {
                  setWarnTarget(null)
                  router.push(warnHref)
                }}
              >
                {t('switch_anyway')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {children}
    </div>
  )
}
