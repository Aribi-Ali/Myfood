'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/contexts/language'
import {
  Settings, Clock, Truck, Share2, Image, PauseCircle, Globe, Hash,
} from 'lucide-react'

const groups = [
  {
    labelKey: 'store_info',
    links: [
      { href: '/dashboard/settings', labelKey: 'general_info', icon: Settings },
      { href: '/dashboard/settings/logo', labelKey: 'logo_cover', icon: Image },
    ],
  },
  {
    labelKey: 'operations',
    links: [
      { href: '/dashboard/settings/hours', labelKey: 'opening_hours', icon: Clock },
      { href: '/dashboard/settings/delivery', labelKey: 'delivery', icon: Truck },
      { href: '/dashboard/settings/ordering', labelKey: 'order_numbering', icon: Hash },
      { href: '/dashboard/settings/breaks', labelKey: 'breaks_activity', icon: PauseCircle },
    ],
  },
  {
    labelKey: 'marketing',
    links: [
      { href: '/dashboard/settings/social', labelKey: 'social_links', icon: Share2 },
    ],
  },
  {
    labelKey: 'advanced',
    links: [
      { href: '/dashboard/settings/domain', labelKey: 'custom_domain', icon: Globe },
    ],
  },
]

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage()
  const pathname = usePathname()

  return (
    <div className="flex gap-6">
      <nav className="hidden lg:flex flex-col w-56 shrink-0 space-y-6">
        {groups.map((group) => (
          <div key={group.labelKey}>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-2 px-3">
              {t(group.labelKey)}
            </p>
            <div className="space-y-0.5">
              {group.links.map(({ href, labelKey, icon: Icon }) => {
                const active = pathname === href
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-orange-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-orange-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {t(labelKey)}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Mobile tab bar */}
      <div className="lg:hidden w-full overflow-x-auto pb-4">
        <div className="flex gap-1 min-w-max border-b border-gray-200 dark:border-slate-700 pb-1">
          {groups.flatMap((g) => g.links).map(({ href, labelKey, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-2 rounded-t-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-orange-50 text-orange-700 border-b-2 border-orange-600 dark:bg-orange-900/30 dark:text-orange-300'
                    : 'text-gray-500 hover:text-gray-700 dark:text-slate-400'
                }`}
              >
                <Icon className="h-4 w-4" />
                {t(labelKey)}
              </Link>
            )
          })}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  )
}
