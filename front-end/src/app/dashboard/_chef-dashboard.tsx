'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/language'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api-client'
import { ExternalLink, Store, ChefHat, Star, Utensils } from 'lucide-react'

interface ChefStore {
  id: number
  name: string
  alias: string
  description?: string
  logo_path?: string
  cover_image?: string
  template_slug?: string
  reviews_avg_rating?: number
  reviews_count?: number
  badges?: { id: number; name: string; color: string }[]
}

export default function ChefDashboard() {
  const { t } = useLanguage()
  const [stores, setStores] = useState<ChefStore[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<{ data: ChefStore[] }>('/client/chef/stores')
      .then(res => setStores(res.data ?? []))
      .catch(() => setStores([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('chef_dashboard')}</h1>
        <p className="text-gray-500">{t('chef_dashboard_desc')}</p>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 animate-pulse rounded-xl bg-gray-100 dark:bg-slate-800" />
          ))}
        </div>
      ) : stores.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Store className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">{t('chef_no_stores')}</p>
            <Link href="/dashboard/profile">
              <Button className="mt-4">{t('go_to_profile')}</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stores.map(store => (
            <Card key={store.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div
                className="h-24 bg-gradient-to-br from-orange-400 to-orange-600 flex items-end p-3"
                style={store.cover_image ? {
                  backgroundImage: `url(${store.cover_image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                } : undefined}
              >
                {store.logo_path ? (
                  <img
                    src={store.logo_path}
                    alt={store.name}
                    className="w-10 h-10 rounded-full border-2 border-white object-cover shadow"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                    <Store className="w-5 h-5 text-orange-600" />
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 truncate">{store.name}</h3>
                {store.description && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{store.description}</p>
                )}
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  {store.reviews_count != null && (
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      {store.reviews_avg_rating?.toFixed(1) ?? '—'} ({store.reviews_count})
                    </span>
                  )}
                </div>
                <Link
                  href={`/stores/${store.alias}`}
                  target="_blank"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  {t('view_store_page')}
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardContent className="p-6 flex items-center gap-4">
          <ChefHat className="w-8 h-8 text-orange-500" />
          <div className="flex-1">
            <p className="font-medium text-gray-900">{t('manage_chef_profile')}</p>
            <p className="text-sm text-gray-500">{t('manage_chef_profile_desc')}</p>
          </div>
          <Link href="/dashboard/profile">
            <Button variant="outline">{t('go_to_profile')}</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
