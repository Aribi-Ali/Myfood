import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Make a Reservation',
  description: 'Book a table at your favorite restaurant. Reserve online and skip the wait.',
  robots: { index: false, follow: true },
}

export default function ReservationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
