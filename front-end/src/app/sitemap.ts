import type { MetadataRoute } from 'next'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: APP_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${APP_URL}/stores`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${APP_URL}/become-chef`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  let storePages: MetadataRoute.Sitemap = []

  try {
    const res = await fetch(`${API_URL}/stores?per_page=1000`, {
      next: { revalidate: 86400 },
    })
    if (res.ok) {
      const json = await res.json()
      const stores = json.data?.data ?? []
      storePages = stores.map((store: any) => ({
        url: `${APP_URL}/stores/${store.alias}`,
        lastModified: new Date(store.updated_at || store.created_at),
        changeFrequency: 'daily' as const,
        priority: 0.8,
      }))
    }
  } catch {
    // API unavailable — return only static pages
  }

  return [...staticPages, ...storePages]
}
