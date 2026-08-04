'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/contexts/language'
import {
  Settings,
  Clock,
  Truck,
  Hash,
  Share2,
  Image,
  PauseCircle,
  Globe,
  CreditCard,
  Phone,
} from 'lucide-react'

const settingsLinks = [
  { href: '/dashboard/settings', label: 'General', icon: Settings },
  { href: '/dashboard/settings/hours', label: 'Opening Hours', icon: Clock },
  { href: '/dashboard/settings/delivery', label: 'Delivery', icon: Truck },
  { href: '/dashboard/settings/ordering', label: 'Order Numbering', icon: Hash },
  { href: '/dashboard/settings/social', label: 'Social Links', icon: Share2 },
  { href: '/dashboard/settings/logo', label: 'Logo Cover', icon: Image },
  { href: '/dashboard/settings/breaks', label: 'Breaks', icon: PauseCircle },
  { href: '/dashboard/settings/domain', label: 'Domain', icon: Globe },
  { href: '/dashboard/subscription', label: 'Subscription', icon: CreditCard },
  { href: '/dashboard/phones', label: 'Phone Numbers', icon: Phone },
]

export function SettingsNav() {
  const pathname = usePathname()
  const { t } = useLanguage()

  return (
    <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible lg:w-52 flex-shrink-0 pb-2 lg:pb-0">
      {settingsLinks.map(({ href, label, icon: Icon }) => {
        const active = href === '/dashboard/settings'
          ? pathname === href
          : pathname === href || pathname.startsWith(href + '/')
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
              active
                ? 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                : 'text-gray-600 hover:bg-orange-50 hover:text-orange-700 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-orange-300'
            }`}
          >
            <Icon className="flex-shrink-0 w-4 h-4" />
            {t(label.toLowerCase().replace(/\s+/g, '_'))}
          </Link>
        )
      })}
    </nav>
  )
}
