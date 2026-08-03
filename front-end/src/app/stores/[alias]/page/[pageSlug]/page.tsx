'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { api } from '@/lib/api-client'
import { useCart } from '@/contexts/cart'
import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

const DynamicPageRenderer = dynamic(() => import('@/components/builder/blocks/renderers/dynamic-page-renderer').then(mod => mod.DynamicPageRenderer), {
  ssr: false,
  loading: () => <Skeleton className="min-h-[60vh] w-full" />,
})

const CartDrawer = dynamic(() => import('@/components/cart/cart-drawer').then(mod => mod.CartDrawer), {
  ssr: false,
  loading: () => <Skeleton className="h-16 w-16 fixed bottom-4 right-4 rounded-full" />,
})
import type { Food } from '@/types/api'

interface PageData {
  html: string
  css: string | null
  slug: string | null
}

interface StoreData {
  id: number
  name: string
  alias: string
  [key: string]: unknown
}

interface CustomPageResponse {
  data: {
    store: StoreData
    page: PageData
  }
}

export default function CustomStorePage() {
  const params = useParams<{ alias: string; pageSlug: string }>()
  const { alias, pageSlug } = params
  const { addToCart } = useCart()

  const [store, setStore] = useState<StoreData | null>(null)
  const [page, setPage] = useState<PageData | null>(null)
  const [foods, setFoods] = useState<Food[]>([])
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!alias || !pageSlug) return
    ;(async () => {
      setFetching(true)
      try {
        const res = await api.get<CustomPageResponse>(`/stores/${alias}/page/${pageSlug}`)
        setStore(res.data.store)
        setPage(res.data.page)
        const foodsRes = await api.get<{ data: Food[] }>(`/stores/${alias}/foods`).catch(() => null)
        setFoods(foodsRes?.data || [])
      } catch {
        setError('Page not found')
      }
      setFetching(false)
    })()
  }, [alias, pageSlug])

  const contentRef = useRef<HTMLDivElement>(null)

  // Event delegation for template Add to Cart buttons in static published HTML
  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const btn = target.closest('[data-add-to-cart]') as HTMLElement | null
      if (!btn) return
      const foodId = Number(btn.getAttribute('data-add-to-cart'))
      if (isNaN(foodId)) return
      const food = foods.find(f => f.id === foodId)
      if (food) addToCart(food)
    }
    el.addEventListener('click', handler)
    return () => el.removeEventListener('click', handler)
  }, [foods, addToCart])

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-8 h-8 border-4 border-orange-600 rounded-full animate-spin border-t-transparent" />
      </div>
    )
  }

  if (error || !page || !store) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-stone-50">
        <div className="text-center">
          <div className="text-5xl mb-4">📄</div>
          <p className="text-stone-600 font-medium">{error || 'Page not found'}</p>
        </div>
      </div>
    )
  }

  return (
    <div ref={contentRef} className="min-h-screen bg-stone-50 text-stone-800">
      <DynamicPageRenderer
        html={page.html}
        css={page.css}
        store={{ ...store, foods }}
        onAddToCart={addToCart}
      />
      <CartDrawer storeId={store.id} />
    </div>
  )
}
