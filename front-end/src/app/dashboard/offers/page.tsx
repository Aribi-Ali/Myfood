'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function OffersRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/dashboard/menu?tab=offers')
  }, [router])

  return (
    <div className="flex h-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-600 border-t-transparent" />
    </div>
  )
}
