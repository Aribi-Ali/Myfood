import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Browse Restaurants',
  description: 'Discover local restaurants near you. Browse menus, read reviews, and order your favorite food online.',
  openGraph: {
    title: 'Browse Restaurants — YallahKool',
    description: 'Discover local restaurants near you.',
  },
}

export default function StoresLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
