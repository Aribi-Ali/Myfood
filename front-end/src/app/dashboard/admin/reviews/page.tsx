'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api-client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

interface ReviewFlag {
  id: number
  review: {
    id: number
    rating: number
    comment: string
    client: { name: string }
    store: { name: string }
  }
  reason: string
  created_at: string
}

interface PaginatedData<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

interface ReviewFlagsResponse {
  data: PaginatedData<ReviewFlag>
}

export default function AdminReviewsPage() {
  const [flags, setFlags] = useState<ReviewFlag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchFlags = () => {
    api.get<ReviewFlagsResponse>('/admin/reviews/flags')
      .then(res => setFlags(res.data?.data || []))
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load flags'))
  }

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const res = await api.get<ReviewFlagsResponse>('/admin/reviews/flags')
        setFlags(res.data?.data || [])
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load flags')
      }
      setLoading(false)
    })()
  }, [])

  const handleDismiss = async (id: number) => {
    try {
      await api.post(`/admin/reviews/flags/${id}/dismiss`)
      fetchFlags()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this review and its flag?')) return
    try {
      await api.delete(`/admin/reviews/flags/${id}`)
      fetchFlags()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Review Moderation</h1>
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Card key={i}><CardContent className="p-4"><Skeleton className="h-16 w-full" /></CardContent></Card>)}</div>
      </div>
    )
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Review Moderation</h1>

      {flags.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No flagged reviews</div>
      ) : (
        <div className="space-y-3">
          {flags.map(flag => (
            <Card key={flag.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{flag.review?.client?.name}</span>
                      <span className="text-yellow-500 text-sm">{'★'.repeat(flag.review?.rating || 0)}</span>
                      <span className="text-xs text-gray-400">on {flag.review?.store?.name}</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{flag.review?.comment}</p>
                    <div className="bg-red-50 border border-red-200 rounded p-2 text-sm">
                      <span className="font-medium text-red-700">Flagged: </span>
                      <span className="text-red-600">{flag.reason}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{new Date(flag.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button size="sm" variant="outline" onClick={() => handleDismiss(flag.id)}>Dismiss</Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(flag.id)}>Delete</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
