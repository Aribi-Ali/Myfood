'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { api } from '@/lib/api-client'

interface FeatureContextValue {
  features: string[]
  can: (code: string) => boolean
  loading: boolean
}

const FeatureContext = createContext<FeatureContextValue>({
  features: [],
  can: () => false,
  loading: true,
})

export function FeatureProvider({ children, storeId }: { children: ReactNode; storeId?: number }) {
  const [features, setFeatures] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!storeId) {
      // Try to fetch the owner's subscription to get features
      api.get<{ data: { features: string[] } }>('/owner/subscription')
        .then(res => setFeatures(res.data?.features ?? []))
        .catch(() => setFeatures([]))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [storeId])

  const can = (code: string): boolean => {
    if (loading) return false
    return features.includes(code)
  }

  return (
    <FeatureContext.Provider value={{ features, can, loading }}>
      {children}
    </FeatureContext.Provider>
  )
}

export function useFeatures() {
  return useContext(FeatureContext)
}
