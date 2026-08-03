'use client'

import { useAuth } from '@/contexts/auth'
import dynamic from 'next/dynamic'

const OwnerDashboard = dynamic(() => import('./_owner-dashboard'), {
  loading: () => (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl bg-gray-100 dark:bg-slate-800" />
        ))}
      </div>
      <div className="h-48 animate-pulse rounded-xl bg-gray-100 dark:bg-slate-800" />
    </div>
  ),
})

const AdminDashboard = dynamic(() => import('./_admin-dashboard'), {
  loading: () => (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-28 animate-pulse rounded-xl bg-gray-100 dark:bg-slate-800" />
      ))}
    </div>
  ),
})

const DeliveryDashboard = dynamic(() => import('./_delivery-dashboard'), {
  loading: () => (
    <div className="grid gap-6 sm:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-28 animate-pulse rounded-xl bg-gray-100 dark:bg-slate-800" />
      ))}
    </div>
  ),
})

const ChefDashboard = dynamic(() => import('./_chef-dashboard'), {
  loading: () => <div className="h-40 animate-pulse rounded-xl bg-gray-100 dark:bg-slate-800" />,
})

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) return null
  if (user.role === 'client') return null

  switch (user.role) {
    case 'owner':
    case 'staff':
      return <OwnerDashboard />
    case 'admin':
      return <AdminDashboard />
    case 'delivery':
      return <DeliveryDashboard />
    case 'chef':
      return <ChefDashboard />
    default:
      return null
  }
}
