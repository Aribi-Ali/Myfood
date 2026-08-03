'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/auth'
import { useLanguage } from '@/contexts/language'
import { useApiQuery } from '@/lib/use-api-query'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, UtensilsCrossed, Palette, ExternalLink, TrendingUp, ShoppingCart, Clock, CalendarClock, Star, ChefHat } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

interface OwnerDashboardData {
  stats: {
    total_revenue: number
    total_orders: number
    pending_order_count: number
    pending_reservation_count: number
  }
  weekly_revenue: { date: string; revenue: number }[]
  top_foods: { id: number; name: string; image: string | null; total_sold: number }[]
  store: {
    id: number
    name: string
    alias: string
    phone: string | null
    email: string | null
    address: string | null
    logo_path: string | null
    cover_image: string | null
    is_active: boolean
    average_rating: number | null
    staff_count: number
    reviews_count: number
    badges: { id: number; name: string; color?: string; icon?: string }[]
  }
}

export default function OwnerDashboard() {
  const { user } = useAuth()
  const { t } = useLanguage()

  const { data: dashRes, isLoading: dashLoading } = useApiQuery<any>(['owner', 'dashboard'], '/owner/dashboard')
  const { data: pageRes } = useApiQuery<any>(['owner', 'page'], '/owner/page')
  const { data: foodRes } = useApiQuery<any>(['owner', 'foods'], '/owner/foods')

  const store = user?.store
  const dash: OwnerDashboardData | null = dashRes?.data || dashRes
  const hasCustom = pageRes?.page?.has_customization ?? false

  const maxRevenue = dash?.weekly_revenue
    ? Math.max(...dash.weekly_revenue.map(d => d.revenue), 1)
    : 1

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {t('welcome')}{store ? `, ${store.name}` : ''}
        </h1>
        <p className="text-gray-500">{t('store_overview')}</p>
      </div>

      {/* Stat Cards */}
      {dashLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}><CardContent className="p-5 space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-6 w-24" /></CardContent></Card>
          ))}
        </div>
      ) : dash ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="rounded-lg bg-orange-100 p-3 text-orange-600"><TrendingUp className="h-6 w-6" /></div>
              <div>
                <p className="text-sm text-gray-500">{t('total_revenue')}</p>
                <p className="text-xl font-bold text-gray-900">{Math.round(dash.stats.total_revenue).toLocaleString()} DA</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="rounded-lg bg-blue-100 p-3 text-blue-600"><ShoppingCart className="h-6 w-6" /></div>
              <div>
                <p className="text-sm text-gray-500">{t('total_orders')}</p>
                <p className="text-xl font-bold text-gray-900">{dash.stats.total_orders}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="rounded-lg bg-amber-100 p-3 text-amber-600"><Clock className="h-6 w-6" /></div>
              <div>
                <p className="text-sm text-gray-500">{t('pending_orders')}</p>
                <p className="text-xl font-bold text-gray-900">{dash.stats.pending_order_count}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="rounded-lg bg-purple-100 p-3 text-purple-600"><CalendarClock className="h-6 w-6" /></div>
              <div>
                <p className="text-sm text-gray-500">{t('pending_reservations')}</p>
                <p className="text-xl font-bold text-gray-900">{dash.stats.pending_reservation_count}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {/* Weekly Revenue Chart + Top Foods */}
      {dash && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">{t('weekly_revenue')}</h2>
            </CardHeader>
            <CardContent>
              {dash.weekly_revenue.length === 0 ? (
                <p className="text-sm text-gray-500 py-4 text-center">{t('no_data_yet')}</p>
              ) : (
                <div className="flex items-end gap-2 h-40">
                  {dash.weekly_revenue.map((day) => (
                    <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] font-semibold text-gray-500">
                        {Math.round(day.revenue)} DA
                      </span>
                      <div
                        className="w-full rounded-t-md bg-gradient-to-t from-orange-500 to-orange-300 transition-all duration-500 hover:from-orange-600 hover:to-orange-400 relative group cursor-pointer"
                        style={{ height: `${Math.max(4, (day.revenue / maxRevenue) * 100)}%` }}
                      >
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                          {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}: {Math.round(day.revenue)} DA
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400">
                        {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">{t('top_selling')}</h2>
            </CardHeader>
            <CardContent>
              {dash.top_foods.length === 0 ? (
                <p className="text-sm text-gray-500 py-4 text-center">{t('no_data_yet')}</p>
              ) : (
                <div className="space-y-3">
                  {dash.top_foods.map((food, i) => (
                    <div key={food.id} className="flex items-center gap-3">
                      <span className="text-xs font-bold text-gray-400 w-5">{i + 1}.</span>
                      {food.image ? (
                        <img src={food.image} alt={food.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                          <ChefHat className="h-5 w-5 text-orange-500" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{food.name}</p>
                        <p className="text-xs text-gray-500">{food.total_sold} {t('sold')}</p>
                      </div>
                      <Star className="h-4 w-4 text-amber-400 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Navigation */}
      <div className="grid gap-6 sm:grid-cols-3">
        <Link href="/dashboard/page-builder">
          <Card className="transition-shadow hover:shadow-md cursor-pointer">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="rounded-lg bg-orange-100 p-3 text-orange-600">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('page_builder')}</p>
                <p className="text-xl font-bold text-gray-900">
                  {hasCustom ? t('custom') : t('template')}
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/menu">
          <Card className="transition-shadow hover:shadow-md cursor-pointer">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="rounded-lg bg-green-100 p-3 text-green-600">
                <UtensilsCrossed className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('menu_items')}</p>
                <p className="text-xl font-bold text-gray-900">{foodRes?.data?.length ?? '-'}</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/sales">
          <Card className="transition-shadow hover:shadow-md cursor-pointer">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('sales')}</p>
                <p className="text-xl font-bold text-gray-900">{t('view_reports')}</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Store Info */}
      {dash?.store ? (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">{t('store_info')}</h2>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              {dash.store.average_rating != null && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  {dash.store.average_rating.toFixed(1)}
                </span>
              )}
              <span className="text-xs text-gray-400">{dash.store.reviews_count} {t('reviews')}</span>
              <span className="text-xs text-gray-400">·</span>
              <span className="text-xs text-gray-400">{dash.store.staff_count} {t('staff')}</span>
            </div>
            <p><strong>{t('name')}:</strong> {dash.store.name}</p>
            <p><strong>{t('alias')}:</strong> {dash.store.alias}</p>
            <p><strong>{t('phone')}:</strong> {dash.store.phone || t('n_a')}</p>
            <p><strong>{t('address')}:</strong> {dash.store.address || t('n_a')}</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-5 text-center text-sm text-gray-500">
            {t('no_store_config')}
          </CardContent>
        </Card>
      )}

      {store?.alias && (
        <Link href={`/stores/${store.alias}`} target="_blank">
          <Button variant="outline" className="gap-2">
            {t('view_my_store')} <ExternalLink className="h-4 w-4" />
          </Button>
        </Link>
      )}
    </div>
  )
}