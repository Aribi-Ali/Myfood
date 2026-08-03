'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api-client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

interface ChefProfile {
  id: number
  user: { id: number; name: string; email: string }
  bio: string
  specialization: string
  years_of_experience: number
  cuisines_expertise: string | null
  verification_document: string | null
  is_verified: boolean
}

interface PaginatedData<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

interface ChefsResponse {
  data: PaginatedData<ChefProfile>
}

export default function AdminChefsPage() {
  const [chefs, setChefs] = useState<ChefProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchChefs = () => {
    api.get<ChefsResponse>('/admin/chefs')
      .then(res => setChefs(res.data?.data || []))
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load chefs'))
  }

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const res = await api.get<ChefsResponse>('/admin/chefs')
        setChefs(res.data?.data || [])
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load chefs')
      }
      setLoading(false)
    })()
  }, [])

  const handleApprove = async (id: number) => {
    try {
      await api.post(`/admin/chefs/${id}/approve`)
      fetchChefs()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Chef Approvals</h1>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}><CardContent className="p-4"><Skeleton className="h-20 w-full" /></CardContent></Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>
  }

  const unverified = chefs.filter(c => !c.is_verified)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Chef Approvals</h1>

      {unverified.length === 0 ? (
        <div className="text-center py-12 text-gray-500">All chefs verified</div>
      ) : (
        <div className="space-y-3">
          {unverified.map(chef => (
            <Card key={chef.id}>
              <CardContent className="p-4 flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{chef.user?.name}</h3>
                  <p className="text-sm text-gray-500">{chef.user?.email}</p>
                  <p className="text-sm mt-1">{chef.bio}</p>
                  <div className="flex gap-4 mt-2 text-sm text-gray-600">
                    <span>Specialization: {chef.specialization}</span>
                    <span>Experience: {chef.years_of_experience}y</span>
                    <span>Cuisines: {chef.cuisines_expertise || 'N/A'}</span>
                  </div>
                  {chef.verification_document && (
                    <a href={chef.verification_document} target="_blank" className="text-xs text-blue-600 hover:underline mt-1 inline-block">
                      View Document
                    </a>
                  )}
                </div>
                <Button size="sm" onClick={() => handleApprove(chef.id)}>Approve</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {chefs.filter(c => c.is_verified).length > 0 && (
        <>
          <h2 className="text-lg font-semibold mt-8">Verified Chefs ({chefs.filter(c => c.is_verified).length})</h2>
          <div className="space-y-2">
            {chefs.filter(c => c.is_verified).map(chef => (
              <Card key={chef.id}>
                <CardContent className="p-3 flex items-center justify-between">
                  <div>
                    <span className="font-medium">{chef.user?.name}</span>
                    <span className="text-sm text-gray-500 ml-2">- {chef.specialization}</span>
                  </div>
                  <span className="text-xs text-green-600 font-medium">Verified</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
