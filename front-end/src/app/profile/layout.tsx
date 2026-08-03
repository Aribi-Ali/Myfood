'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/auth'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { User, Package, Lock, ChefHat, Truck, Store } from 'lucide-react'

const tabs = [
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/profile/orders', label: 'Orders', icon: Package },
  { href: '/profile/security', label: 'Security', icon: Lock },
  { href: '/profile/chef', label: 'Become Chef', icon: ChefHat },
  { href: '/profile/delivery', label: 'Become Delivery', icon: Truck },
  { href: '/profile/store', label: 'My Store', icon: Store },
]

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  if (loading || !user) return null

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>

        <div className="flex flex-wrap gap-1 border-b border-gray-200 dark:border-gray-700 pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const active = pathname === tab.href
            return (
              <button
                key={tab.href}
                onClick={() => router.push(tab.href)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  active
                    ? 'bg-orange-50 text-orange-700 border-b-2 border-orange-600 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-500'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {children}
      </main>
    </>
  )
}
