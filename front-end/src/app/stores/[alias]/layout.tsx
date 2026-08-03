import type { Metadata } from 'next'
import { FloatingStoreLogo } from '@/components/floating-store-logo'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

async function getStore(alias: string) {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)
    const res = await fetch(`${API_URL}/stores/${alias}`, {
      next: { revalidate: 3600 },
      signal: controller.signal,
    })
    clearTimeout(timeout)
    if (!res.ok) return null
    const json = await res.json()
    return json.store ?? json.data ?? null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ alias: string }> }): Promise<Metadata> {
  const { alias } = await params
  const store = await getStore(alias)

  if (!store) {
    return {
      title: 'Restaurant',
      description: 'Browse our restaurant menu and order online.',
    }
  }

  const title = store.name
  const description = store.description || `Order from ${store.name} — fresh food delivered to your door.`
  const canonical = `${APP_URL}/stores/${alias}`
  const image = store.logo
    ? (store.logo.startsWith('http') ? store.logo : `${APP_URL}/storage/${store.logo}`)
    : undefined

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${title} — YallahKool`,
      description,
      type: 'website',
      url: canonical,
      ...(image && { images: [{ url: image, width: 400, height: 400 }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} — YallahKool`,
      description,
      ...(image && { images: [image] }),
    },
  }
}

export default function StoreAliasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <FloatingStoreLogo />
    </>
  )
}
