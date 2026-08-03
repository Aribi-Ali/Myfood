'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function KdsRedirect() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/kds')
  }, [router])
  return null
}
