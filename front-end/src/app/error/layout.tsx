import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Error',
  description: 'Something went wrong.',
  robots: { index: false, follow: false },
}

export default function ErrorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
