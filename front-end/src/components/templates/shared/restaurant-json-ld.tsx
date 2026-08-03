'use client'

import type { TemplateStore } from '../types'
import { getImageUrl } from '@/lib/utils'

interface RestaurantJsonLdProps {
  store: TemplateStore
  servesCuisine?: string
}

export function RestaurantJsonLd({ store, servesCuisine }: RestaurantJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: store.name || 'Restaurant',
    description: store.description || '',
    telephone: store.phone || '',
    email: store.email || '',
    address: store.address ? { '@type': 'PostalAddress', streetAddress: store.address } : undefined,
    aggregateRating: (store.reviews_count ?? 0) > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: store.avg_rating || 5,
      reviewCount: store.reviews_count,
    } : undefined,
    servesCuisine: servesCuisine || 'Cuisine',
    image: getImageUrl(store.cover_image || store.cover),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
