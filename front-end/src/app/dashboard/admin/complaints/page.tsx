'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api-client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

interface Complaint {
  id: number
  subject: string
  description: string
  status: string
  store: { name: string }
  client: { name: string }
  created_at: string
}

interface PaginatedData<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

interface ComplaintsResponse {
  data: PaginatedData<Complaint>
}

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchComplaints = () => {
    api.get<ComplaintsResponse>('/admin/complaints')
      .then(res => setComplaints(res.data?.data || []))
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load complaints'))
  }

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const res = await api.get<ComplaintsResponse>('/admin/complaints')
        setComplaints(res.data?.data || [])
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load complaints')
      }
      setLoading(false)
    })()
  }, [])

  const handleResolve = async (id: number) => {
    try {
      await api.post(`/admin/complaints/${id}/resolve`)
      fetchComplaints()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Complaints</h1>
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Card key={i}><CardContent className="p-4"><Skeleton className="h-16 w-full" /></CardContent></Card>)}</div>
      </div>
    )
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>
  }

  const openComplaints = complaints.filter(c => c.status === 'open')
  const resolvedComplaints = complaints.filter(c => c.status === 'resolved')

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Complaints</h1>

      {complaints.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No complaints</div>
      ) : (
        <>
          <h2 className="text-lg font-semibold">Open ({openComplaints.length})</h2>
          {openComplaints.length === 0 ? (
            <p className="text-sm text-gray-500">No open complaints</p>
          ) : (
            <div className="space-y-3">
              {openComplaints.map(c => (
                <Card key={c.id}>
                  <CardContent className="p-4 flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{c.subject}</h3>
                      <p className="text-sm text-gray-600 mt-1">{c.description}</p>
                      <div className="flex gap-4 mt-2 text-xs text-gray-400">
                        <span>Store: {c.store?.name}</span>
                        <span>By: {c.client?.name}</span>
                        <span>{new Date(c.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => handleResolve(c.id)}>Resolve</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {resolvedComplaints.length > 0 && (
            <>
              <h2 className="text-lg font-semibold mt-6">Resolved ({resolvedComplaints.length})</h2>
              <div className="space-y-2">
                {resolvedComplaints.map(c => (
                  <Card key={c.id}>
                    <CardContent className="p-3 flex items-center justify-between">
                      <div>
                        <span className="font-medium">{c.subject}</span>
                        <span className="text-sm text-gray-500 ml-2">- {c.store?.name}</span>
                      </div>
                      <span className="text-xs text-green-600 font-medium">Resolved</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
