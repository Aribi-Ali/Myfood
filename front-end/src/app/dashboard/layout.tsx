'use client'

import { LanguageSwitcher } from '@/components/language-switcher'
import { ThemeToggle } from '@/components/theme-toggle'
import { useAuth } from '@/contexts/auth'
import { useLanguage } from '@/contexts/language'
import {
  Award,
  CalendarClock,
  Camera,
  ChefHat,
  ChevronDown,
  ClipboardList,
  Clock,
  CreditCard,
  DollarSign,
  Files,
  FileText,
  Flag,
  Globe,
  Image,
  LayoutDashboard,
  LogOut, Menu,
  MessageSquare,
  Monitor,
  Palette,
  PauseCircle,
  Phone,
  Percent,
  Hash,
  Settings,
  Share2,
  Shield,
  Star,
  Store,
  Tag,
  TrendingUp,
  Truck,
  User,
  Users,
  UtensilsCrossed,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

interface SidebarLink {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  roles: string[]
}

const routePermissions: Record<string, string[]> = {
  '/dashboard': ['owner', 'staff', 'chef', 'admin'],
  '/dashboard/page-builder': ['owner'],
  '/dashboard/pages': ['owner'],
  '/dashboard/media': ['owner'],
  '/dashboard/menu': ['owner'],
  '/dashboard/offers': ['owner'],
  '/dashboard/reservations': ['owner'],
  '/dashboard/clients': ['owner'],
  '/dashboard/orders': ['owner', 'staff', 'delivery', 'chef'],
  '/dashboard/sales': ['owner'],
  '/dashboard/staff': ['owner'],
  '/dashboard/gallery': ['owner'],
  '/dashboard/chefs': ['owner'],
  '/dashboard/themes': ['owner'],
  '/dashboard/kds': ['owner', 'staff', 'chef'],
  '/dashboard/settings': ['owner', 'staff'],
  '/dashboard/settings/hours': ['owner'],
  '/dashboard/settings/delivery': ['owner'],
  '/dashboard/settings/social': ['owner'],
  '/dashboard/settings/logo': ['owner'],
  '/dashboard/settings/breaks': ['owner'],
  '/dashboard/settings/ordering': ['owner'],
  '/dashboard/settings/domain': ['owner'],
  '/dashboard/profile': ['owner', 'staff', 'delivery', 'chef', 'admin'],
  '/dashboard/phones': ['owner'],
  '/dashboard/branches': ['owner'],
  '/dashboard/subscription': ['owner'],
  '/dashboard/earnings': ['delivery'],
  '/dashboard/admin': ['admin'],
  '/dashboard/admin/templates': ['admin'],
  '/dashboard/admin/plans': ['admin'],
  '/dashboard/admin/delivery-pricing': ['admin'],
  '/dashboard/admin/billing': ['admin'],
  '/dashboard/admin/payment-gateways': ['admin'],
}

function isRouteAuthorized(pathname: string, role: string): boolean {
  // Allow /dashboard/profile/* sub-routes for the same roles as /dashboard/profile
  if (pathname.startsWith('/dashboard/profile')) {
    return (routePermissions['/dashboard/profile'] ?? []).includes(role)
  }
  // Match exact or prefix
  for (const [prefix, roles] of Object.entries(routePermissions)) {
    if (pathname === prefix || pathname.startsWith(prefix + '/')) {
      return roles.includes(role)
    }
  }
  // If no match found, deny
  return false
}

const allLinks: SidebarLink[] = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, roles: ['owner', 'staff'] },
  { href: '/dashboard/page-builder', label: 'Page Builder', icon: FileText, roles: ['owner'] },
  { href: '/dashboard/pages', label: 'Pages', icon: Files, roles: ['owner'] },
  { href: '/dashboard/media', label: 'Media', icon: Camera, roles: ['owner'] },
  { href: '/dashboard/menu', label: 'Menu', icon: UtensilsCrossed, roles: ['owner'] },
  { href: '/dashboard/offers', label: 'Offers', icon: Tag, roles: ['owner'] },
  { href: '/dashboard/reservations', label: 'Reservations', icon: CalendarClock, roles: ['owner'] },
  { href: '/dashboard/clients', label: 'Clients', icon: Users, roles: ['owner'] },
  { href: '/dashboard/orders', label: 'Orders', icon: ClipboardList, roles: ['owner', 'staff', 'delivery'] },
  { href: '/dashboard/sales', label: 'Sales', icon: TrendingUp, roles: ['owner'  ] },
  { href: '/dashboard/staff', label: 'Staff', icon: Users, roles: ['owner'] },
  { href: '/dashboard/kds', label: 'Kitchen', icon: Monitor, roles: ['owner', 'staff'] },
  { href: '/dashboard/gallery', label: 'Gallery', icon: Image, roles: ['owner'] },
  { href: '/dashboard/chefs', label: 'Chefs', icon: ChefHat, roles: ['owner'] },
  { href: '/dashboard/themes', label: 'Themes', icon: Palette, roles: ['owner'] },
  { href: '/dashboard/settings', label: 'General', icon: Settings, roles: ['owner', 'staff'] },
  { href: '/dashboard/settings/hours', label: 'Opening Hours', icon: Clock, roles: ['owner'] },
  { href: '/dashboard/settings/delivery', label: 'Delivery', icon: Truck, roles: ['owner'] },
  { href: '/dashboard/settings/ordering', label: 'Order Numbering', icon: Hash, roles: ['owner'] },
  { href: '/dashboard/settings/social', label: 'Social Links', icon: Share2, roles: ['owner'] },
  { href: '/dashboard/settings/logo', label: 'Logo Cover', icon: Image, roles: ['owner'] },
  { href: '/dashboard/settings/breaks', label: 'Breaks', icon: PauseCircle, roles: ['owner'] },
  { href: '/dashboard/settings/domain', label: 'Domain', icon: Globe, roles: ['owner'] },
  // ── Owner subscription ──
  { href: '/dashboard/subscription', label: 'Subscription', icon: CreditCard, roles: ['owner'] },
  // ── Phone Numbers ──
  { href: '/dashboard/phones', label: 'Phone Numbers', icon: Phone, roles: ['owner'] },
  // ── Branches ──
  { href: '/dashboard/branches', label: 'Branches', icon: Store, roles: ['owner'] },
  // ── Chef links ──
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, roles: ['chef'] },
  { href: '/dashboard/kds', label: 'Kitchen', icon: Monitor, roles: ['chef'] },
  { href: '/dashboard/orders', label: 'Orders', icon: ClipboardList, roles: ['chef'] },
  // ── Delivery links ──
  { href: '/dashboard/earnings', label: 'Earnings', icon: TrendingUp, roles: ['delivery'] },
  // ── Admin links ──
  { href: '/dashboard/admin', label: 'Overview', icon: LayoutDashboard, roles: ['admin'] },
  { href: '/dashboard/admin/stores', label: 'Restaurants', icon: Store, roles: ['admin'] },
  { href: '/dashboard/admin/categories', label: 'Categories', icon: Tag, roles: ['admin'] },
  { href: '/dashboard/admin/badges', label: 'Badges', icon: Award, roles: ['admin'] },
  { href: '/dashboard/admin/store-types', label: 'Store Types', icon: Tag, roles: ['admin'] },
  { href: '/dashboard/admin/chefs', label: 'Chefs', icon: ChefHat, roles: ['admin'] },
  { href: '/dashboard/admin/templates', label: 'Templates', icon: Palette, roles: ['admin'] },
  { href: '/dashboard/admin/reviews', label: 'Reviews', icon: Star, roles: ['admin'] },
  { href: '/dashboard/admin/complaints', label: 'Complaints', icon: MessageSquare, roles: ['admin'] },
  { href: '/dashboard/admin/reports', label: 'Reports', icon: Flag, roles: ['admin'] },
  { href: '/dashboard/admin/users', label: 'Users', icon: Users, roles: ['admin'] },
  { href: '/dashboard/admin/payouts', label: 'Payouts', icon: DollarSign, roles: ['admin'] },
  { href: '/dashboard/admin/promo-codes', label: 'Promo Codes', icon: Percent, roles: ['admin'] },
  { href: '/dashboard/admin/banners', label: 'Banners', icon: Image, roles: ['admin'] },
  { href: '/dashboard/admin/reservations', label: 'Reservations', icon: CalendarClock, roles: ['admin'] },
  { href: '/dashboard/admin/foods', label: 'Foods', icon: UtensilsCrossed, roles: ['admin'] },
  { href: '/dashboard/admin/domains', label: 'Domains', icon: Globe, roles: ['admin'] },
  { href: '/dashboard/admin/settings', label: 'Settings', icon: Settings, roles: ['admin'] },
  { href: '/dashboard/admin/plans', label: 'Plans', icon: CreditCard, roles: ['admin'] },
  { href: '/dashboard/admin/delivery-pricing', label: 'Delivery Pricing', icon: Truck, roles: ['admin'] },
  { href: '/dashboard/admin/billing', label: 'Billing', icon: DollarSign, roles: ['admin'] },
  { href: '/dashboard/admin/payment-gateways', label: 'Payment', icon: CreditCard, roles: ['admin'] },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
      setUserMenuOpen(false)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [handleClickOutside])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }
    if (!loading && user) {
      if (user.role === 'client') {
        router.replace('/error?message=You are not authorized to access this page.')
        return
      }
      // Owner must complete store setup AND be approved before accessing dashboard
      if (user.role === 'owner') {
        const store = user.store
        if (!store || !store.is_approved) {
          router.replace('/profile/store')
          return
        }
      }
      if (pathname.startsWith('/dashboard') && !isRouteAuthorized(pathname, user.role)) {
        router.replace('/error?message=You are not authorized to access this page.')
      }
    }
  }, [user, loading, pathname, router])

  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  const handleMouseEnter = () => {
    if (!sidebarCollapsed) return
    clearTimeout(hoverTimeout.current)
    setHovered(true)
  }

  const handleMouseLeave = () => {
    if (!sidebarCollapsed) return
    hoverTimeout.current = setTimeout(() => setHovered(false), 300)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="w-8 h-8 border-4 border-orange-600 rounded-full animate-spin border-t-transparent" />
      </div>
    )
  }

  if (!user || user.role === 'client') return null

  const collapsed = sidebarCollapsed && !hovered

  const sidebar = (
    <>
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100 dark:border-slate-700">
        <Link href="/" className={`font-extrabold text-orange-600 ${collapsed ? 'text-base' : 'text-lg'}`}>
          {collapsed ? 'YK' : t('app_name')}
        </Link>
        <button
          onClick={() => setSidebarOpen(false)}
          className="p-1 text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 lg:hidden"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {allLinks.filter(l => l.roles.includes(user.role)).map((link, idx, arr) => {
          const { href, label, icon: Icon } = link
          const active = pathname === href
          const isAdminSection = href.startsWith('/dashboard/admin')
          const prevNotAdmin = idx === 0 || !arr[idx - 1]?.href.startsWith('/dashboard/admin')
          return (
            <div key={href}>
              {isAdminSection && prevNotAdmin && idx > 0 && (
                <div className="my-2 border-t border-gray-100 dark:border-slate-700" />
              )}
              <Link
                href={href}
                prefetch={['/dashboard', '/dashboard/orders', '/dashboard/menu', '/dashboard/settings'].includes(href)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                    : 'text-gray-600 hover:bg-orange-50 hover:text-orange-700 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-orange-300'
                } ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? t(label.toLowerCase().replace(/\s+/g, '_')) : undefined}
              >
                <Icon className="flex-shrink-0 w-5 h-5" />
                {!collapsed && t(label.toLowerCase().replace(/\s+/g, '_'))}
              </Link>
            </div>
          )
        })}
      </nav>
      <div className="p-3 border-t border-gray-100 dark:border-slate-700">
        <Link
          href="/dashboard/profile"
          className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-50 dark:hover:bg-slate-700`}
          title={user.name}
        >
{user.profile_image ? (
  <img src={user.profile_image} alt={user.name} className="object-cover w-8 h-8 rounded-full" />
) : (
            <div className="flex items-center justify-center w-8 h-8 text-sm font-bold text-orange-600 bg-orange-100 rounded-full dark:bg-orange-900 dark:text-orange-300">
              {user.name.charAt(0)}
            </div>
          )}
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate dark:text-slate-100">{user.name}</p>
              <p className="text-xs text-gray-500 truncate dark:text-slate-400">{user.email}</p>
            </div>
          )}
        </Link>
        <button
          onClick={logout}
          className={`mt-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? t('logout') : undefined}
        >
          <LogOut className="flex-shrink-0 w-4 h-4" /> {!collapsed && t('logout')}
        </button>
      </div>
    </>
  )

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900">
      <aside
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`hidden flex-shrink-0 ltr:border-r rtl:border-l border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800 transition-all duration-200 lg:flex lg:flex-col ${collapsed ? 'w-16' : 'w-64'}`}
      >
        {sidebar}
      </aside>

      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 ltr:left-0 rtl:right-0 z-50 w-64 bg-white ltr:border-r rtl:border-l border-gray-200 dark:border-slate-700 dark:bg-slate-800 lg:hidden">
            {sidebar}
          </aside>
        </>
      )}

      <div className="flex flex-col flex-1">
        <header className="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 dark:border-slate-700 dark:bg-slate-800 lg:px-6">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={() => setSidebarCollapsed(v => !v)}
              className="hidden rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 lg:block dark:hover:bg-slate-700"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {sidebarCollapsed
                  ? <><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="15" y1="3" x2="15" y2="21" /><line x1="9" y1="3" x2="9" y2="21" /></>
                  : <><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="15" y1="3" x2="15" y2="21" /></>
                }
              </svg>
            </button>
          </div>
          <Link href="/" className="text-lg font-extrabold text-orange-600 lg:hidden">
            {t('app_name')}
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
              >
                {user.profile_image ? (
                  <img src={user.profile_image} alt={user.name} className="hidden object-cover rounded-full sm:block h-7 w-7" />
                ) : (
                  <div className="items-center justify-center hidden text-xs font-bold text-orange-600 bg-orange-100 rounded-full sm:flex h-7 w-7 dark:bg-orange-900 dark:text-orange-300">
                    {user.name.charAt(0)}
                  </div>
                )}
                <span className="hidden sm:block">{user.name}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 z-50 w-56 py-1 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg top-full dark:border-slate-700 dark:bg-slate-800">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700">
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate dark:text-slate-400">{user.email}</p>
                  </div>
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    <User className="w-4 h-4" />
                    {t('profile')}
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    <Settings className="w-4 h-4" />
                    {t('settings')}
                  </Link>
                  <div className="pt-1 mt-1 border-t border-gray-100 dark:border-slate-700">
                    <button
                      onClick={() => { setUserMenuOpen(false); logout() }}
                      className="flex items-center w-full gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
                    >
                      <LogOut className="w-4 h-4" />
                      {t('logout')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 flex flex-col min-h-0 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}
