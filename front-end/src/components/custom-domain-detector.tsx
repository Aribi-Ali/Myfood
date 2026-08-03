'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { api } from '@/lib/api-client'

const MAIN_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN || 'localhost'

export function CustomDomainDetector({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const host = window.location.hostname
    if (host === MAIN_DOMAIN || host === 'localhost' || host === '127.0.0.1') return

    if (pathname.startsWith('/stores/')) return

    api.get<{ data: { store: { alias: string; name: string } } }>(`/resolve-domain?domain=${encodeURIComponent(host)}`)
      .then(res => {
        router.replace(`/stores/${res.data.store.alias}`)
      })
      .catch(() => {})
  }, [pathname, router])

  return <>{children}</>
}
