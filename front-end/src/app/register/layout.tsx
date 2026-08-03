import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create an Account',
  description: 'Create your YallahKool account to order food from local restaurants or start your own online store.',
  robots: { index: false, follow: false },
}

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
