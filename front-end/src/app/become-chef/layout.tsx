import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Become a Chef',
  description: 'Join YallahKool as a chef. Get hired by local restaurants, showcase your skills, and grow your culinary career.',
  openGraph: {
    title: 'Become a Chef — YallahKool',
    description: 'Join YallahKool as a chef and get hired by local restaurants.',
  },
}

export default function BecomeChefLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
