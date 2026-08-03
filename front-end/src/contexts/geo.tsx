'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { api } from '@/lib/api-client'

export interface Wilaya { id: number; code: string; name_fr: string; name_ar: string }
export interface Daira { id: number; wilaya_id: number; name_fr: string; name_ar: string }
export interface Commune { id: number; daira_id: number; wilaya_id: number; name_fr: string; name_ar: string }

interface GeoCache {
  dairas: Record<number, Daira[]>
  communes: Record<number, Commune[]>
}

interface GeoContextType {
  wilayas: Wilaya[]
  loading: boolean
  getDairas: (wilayaId: number) => Promise<Daira[]>
  getCommunes: (dairaId: number) => Promise<Commune[]>
}

const GeoContext = createContext<GeoContextType | null>(null)

export function GeoProvider({ children }: { children: ReactNode }) {
  const [wilayas, setWilayas] = useState<Wilaya[]>([])
  const [loading, setLoading] = useState(true)
  const [cache, setCache] = useState<GeoCache>({ dairas: {}, communes: {} })

  useEffect(() => {
    api.get<{ data: Wilaya[] }>('/geo/wilayas')
      .then(res => setWilayas(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const getDairas = useCallback(async (wilayaId: number): Promise<Daira[]> => {
    if (cache.dairas[wilayaId]) return cache.dairas[wilayaId]
    try {
      const res = await api.get<{ data: Daira[] }>(`/geo/wilayas/${wilayaId}/dairas`)
      const data = res.data || []
      setCache(prev => ({ ...prev, dairas: { ...prev.dairas, [wilayaId]: data } }))
      return data
    } catch {
      return []
    }
  }, [cache.dairas])

  const getCommunes = useCallback(async (dairaId: number): Promise<Commune[]> => {
    if (cache.communes[dairaId]) return cache.communes[dairaId]
    try {
      const res = await api.get<{ data: Commune[] }>(`/geo/dairas/${dairaId}/communes`)
      const data = res.data || []
      setCache(prev => ({ ...prev, communes: { ...prev.communes, [dairaId]: data } }))
      return data
    } catch {
      return []
    }
  }, [cache.communes])

  return (
    <GeoContext.Provider value={{ wilayas, loading, getDairas, getCommunes }}>
      {children}
    </GeoContext.Provider>
  )
}

export function useGeo() {
  const ctx = useContext(GeoContext)
  if (!ctx) throw new Error('useGeo must be used within GeoProvider')
  return ctx
}
