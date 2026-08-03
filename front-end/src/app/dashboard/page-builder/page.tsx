'use client'

import { PageBuilder } from '@/components/page-builder'
import { useAuth } from '@/contexts/auth'
import { api } from '@/lib/api-client'
import type { OwnerPageResponse, StoreData } from '@/types/api'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'

export default function PageBuilderPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [data, setData] = useState<OwnerPageResponse | null>(null)
  const [templateSlug, setTemplateSlug] = useState<string | null>(null)
  const [pageSlug, setPageSlug] = useState<string | null>(null)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [entityType, setEntityType] = useState<'store' | 'branch'>('store')
  const [entityId, setEntityId] = useState<number | null>(null)

  const fetchBuilderData = useCallback(async (targetTemplateSlug?: string, targetPageSlug?: string) => {
    setFetching(true)
    setError(null)
    try {
      const branchParam = searchParams.get('branch_id')
      let template: string | null = targetTemplateSlug ?? null

      if (branchParam) {
        // Branch page builder mode
        const branchId = parseInt(branchParam, 10)
        setEntityType('branch')
        setEntityId(branchId)

        const pageEndpoint = targetPageSlug
          ? `/branches/${branchId}/pages/${targetPageSlug}`
          : `/branches/${branchId}/page`
        const pageRes = await api.get<OwnerPageResponse>(pageEndpoint)

        if (!template) {
          template = (pageRes as any).template_slug ?? null
        }
        if (!template) {
          template = (pageRes as any).store?.template_slug ?? null
        }

        setData(pageRes)
        setTemplateSlug(template || 'velvet-noir')
        setPageSlug(targetPageSlug ?? null)
        setFetching(false)
        return
      }

      // Store page builder mode (original)
      const storeRes = await api.get<{ store: StoreData }>('/owner/store')
      if (!template) {
        template = (storeRes.store as unknown as Record<string, unknown>).template_slug as string ?? null
      }

      if (!template) {
        template = 'velvet-noir'
      }

      // Fetch page data — either custom page or main page
      const pageEndpoint = targetPageSlug
        ? `/owner/pages/${targetPageSlug}`
        : '/owner/page'
      const pageRes = await api.get<OwnerPageResponse>(pageEndpoint)

      setData(pageRes)
      setTemplateSlug(template)
      setPageSlug(targetPageSlug ?? null)
    } catch {
      setError('Failed to load page builder data.')
    }
    setFetching(false)
  }, [searchParams])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }
    if (!user) return

    const templateParam = searchParams.get('template_slug')
    const pageParam = searchParams.get('page')

    if (templateParam) {
      fetchBuilderData(templateParam, pageParam ?? undefined)
      return
    }
    fetchBuilderData(undefined, pageParam ?? undefined)
  }, [user, loading, router, searchParams, fetchBuilderData])

  if (loading || fetching) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-orange-600 rounded-full animate-spin border-t-transparent" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <p className="text-gray-500">{error}</p>
          <button onClick={() => fetchBuilderData()} className="text-orange-600 hover:underline text-sm">
            Try again
          </button>
        </div>
      </div>
    )
  }

  if (!data || !templateSlug) return null

  return (
    <PageBuilder
      key={templateSlug + (entityId ?? '')}
      initialData={data}
      templateSlug={templateSlug}
      pageSlug={pageSlug}
      entityType={entityType}
      entityId={entityId}
    />
  )
}
