'use client'

import { useState, useCallback } from 'react'
import { useApiQuery, useApiMutation } from '@/lib/use-api-query'
import { useQueryClient } from '@tanstack/react-query'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/contexts/language'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, ChevronLeft, ChevronRight, Phone, Mail, Users, CalendarClock, Clock, Settings, X, User, CheckCircle, XCircle } from 'lucide-react'
import type { ReservationData, ReservationStatus, ReservationSettingData, ReservationScheduleData } from '@/types/api'

const DAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

const STATUS_CONFIG: Record<ReservationStatus, { label: string; color: string; dot: string }> = {
  pending: { label: 'pending', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', dot: 'bg-yellow-500' },
  confirmed: { label: 'confirmed', color: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  cancelled: { label: 'cancelled', color: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500' },
  completed: { label: 'completed', color: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-500' },
}

const STATUS_TRANSITIONS: Record<ReservationStatus, { next: ReservationStatus; label: string; color: string }[]> = {
  pending: [
    { next: 'confirmed', label: 'confirm', color: 'bg-blue-600 hover:bg-blue-700 text-white' },
    { next: 'cancelled', label: 'cancel', color: 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200' },
  ],
  confirmed: [
    { next: 'completed', label: 'mark_completed', color: 'bg-green-600 hover:bg-green-700 text-white' },
    { next: 'cancelled', label: 'cancel', color: 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200' },
  ],
  cancelled: [],
  completed: [],
}

export default function ReservationsPage() {
  const { t } = useLanguage()
  const queryClient = useQueryClient()
  const [tab, setTab] = useState<'list' | 'settings'>('list')
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [detailReservation, setDetailReservation] = useState<ReservationData | null>(null)

  const params: Record<string, string> = { page: String(page) }
  if (statusFilter) params.status = statusFilter
  if (search) params.search = search
  if (dateFrom) params.date_from = dateFrom
  if (dateTo) params.date_to = dateTo

  const { data: reservationsRes, isLoading } = useApiQuery<any>(
    ['owner', 'reservations', statusFilter, search, page, dateFrom, dateTo],
    '/owner/reservations?' + new URLSearchParams(params).toString(),
    { refetchInterval: 10000 }
  )

  const reservations: ReservationData[] = reservationsRes?.data?.data ?? []
  const lastPage = reservationsRes?.data?.last_page ?? 1

  const { data: settingsData } = useApiQuery<any>(
    ['owner', 'reservations', 'settings'],
    '/owner/reservations/settings'
  )

  const settings: ReservationSettingData | null = settingsData?.data?.settings ?? null
  const schedules: ReservationScheduleData[] = settingsData?.data?.schedules ?? []

  const statusMutation = useApiMutation<any, any>(
    '/owner/reservations/{id}/status',
    'put',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['owner', 'reservations'] })
      },
    }
  )

  const updateSettingsMutation = useApiMutation<any, any>(
    '/owner/reservations/settings',
    'put',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['owner', 'reservations', 'settings'] })
      },
    }
  )

  const updateSchedulesMutation = useApiMutation<any, any>(
    '/owner/reservations/schedules',
    'put',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['owner', 'reservations', 'settings'] })
      },
    }
  )

  function handleSearch() {
    setSearch(searchInput)
    setPage(1)
  }

  async function updateStatus(reservationId: number, newStatus: ReservationStatus) {
    try {
      await statusMutation.mutateAsync({
        id: reservationId,
        status: newStatus,
      })
    } catch { /* ignore */ }
  }

  const [localSettings, setLocalSettings] = useState<ReservationSettingData | null>(null)
  const [localSchedules, setLocalSchedules] = useState<ReservationScheduleData[]>([])

  function openSettings() {
    if (settings) setLocalSettings({ ...settings })
    if (schedules.length) setLocalSchedules(schedules.map(s => ({ ...s })))
    setTab('settings')
  }

  function updateLocalSetting(key: keyof ReservationSettingData, value: any) {
    if (!localSettings) return
    setLocalSettings({ ...localSettings, [key]: value })
  }

  function updateLocalSchedule(dayOfWeek: number, key: string, value: any) {
    setLocalSchedules(prev => prev.map(s => s.day_of_week === dayOfWeek ? { ...s, [key]: value } : s))
  }

  async function saveSettings() {
    if (!localSettings) return
    try {
      await updateSettingsMutation.mutateAsync(localSettings)
    } catch { /* ignore */ }
  }

  async function saveSchedules() {
    try {
      await updateSchedulesMutation.mutateAsync({ schedules: localSchedules })
    } catch { /* ignore */ }
  }

  if (isLoading && reservations.length === 0 && tab === 'list') {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <Card key={i}><CardContent className="p-4"><Skeleton className="h-16 w-full" /></CardContent></Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('reservations')}</h1>
          <p className="text-gray-500">{t('manage_reservations')}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={tab === 'list' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setTab('list')}
            className={tab === 'list' ? 'bg-gray-900 text-white hover:bg-gray-800' : ''}
          >
            <CalendarClock className="h-4 w-4 mr-1" />
            {t('reservations')}
          </Button>
          <Button
            variant={tab === 'settings' ? 'primary' : 'outline'}
            size="sm"
            onClick={openSettings}
            className={tab === 'settings' ? 'bg-gray-900 text-white hover:bg-gray-800' : ''}
          >
            <Settings className="h-4 w-4 mr-1" />
            {t('settings')}
          </Button>
        </div>
      </div>

      {tab === 'settings' && localSettings ? (
        /* ── Settings Tab ── */
        <div className="space-y-6 max-w-2xl">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-bold text-gray-900">{t('reservation_settings')}</h2>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.enabled}
                  onChange={e => updateLocalSetting('enabled', e.target.checked)}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-sm font-medium text-gray-700">{t('enable_reservations')}</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.auto_confirm}
                  onChange={e => updateLocalSetting('auto_confirm', e.target.checked)}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-sm font-medium text-gray-700">{t('auto_confirm')}</span>
              </label>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: 'duration_minutes', label: t('duration_minutes') },
                  { key: 'slot_interval_minutes', label: t('slot_interval') },
                  { key: 'min_advance_hours', label: t('min_advance_hours') },
                  { key: 'max_booking_days', label: t('max_booking_days') },
                  { key: 'min_party_size', label: t('min_party_size') },
                  { key: 'max_party_size', label: t('max_party_size') },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
                    <Input
                      type="number"
                      value={(localSettings as any)[key] ?? ''}
                      onChange={e => updateLocalSetting(key as keyof ReservationSettingData, Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>

              <Button onClick={saveSettings} className="bg-orange-600 hover:bg-orange-700 text-white">
                {t('save_settings')}
              </Button>
            </CardContent>
          </Card>

          {/* Schedules */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-bold text-gray-900">{t('weekly_schedule')}</h2>
              {localSchedules.map(sched => (
                <div key={sched.day_of_week} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                  <label className="flex items-center gap-2 min-w-[120px] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sched.enabled}
                      onChange={e => updateLocalSchedule(sched.day_of_week, 'enabled', e.target.checked)}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm font-medium text-gray-700">{t(DAY_NAMES[sched.day_of_week] ?? '')}</span>
                  </label>
                  <Input
                    type="time"
                    value={sched.open_time}
                    onChange={e => updateLocalSchedule(sched.day_of_week, 'open_time', e.target.value)}
                    disabled={!sched.enabled}
                    className="w-32"
                  />
                  <span className="text-gray-400">—</span>
                  <Input
                    type="time"
                    value={sched.close_time}
                    onChange={e => updateLocalSchedule(sched.day_of_week, 'close_time', e.target.value)}
                    disabled={!sched.enabled}
                    className="w-32"
                  />
                </div>
              ))}
              <Button onClick={saveSchedules} className="bg-orange-600 hover:bg-orange-700 text-white">
                {t('save_schedules')}
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* ── List Tab ── */
        <>
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              <Button
                variant={statusFilter === '' ? 'primary' : 'outline'} size="sm"
                onClick={() => { setStatusFilter(''); setPage(1) }}
                className={statusFilter === '' ? 'bg-gray-900 text-white hover:bg-gray-800' : ''}
              >
                {t('all')}
              </Button>
              {(Object.entries(STATUS_CONFIG) as [ReservationStatus, typeof STATUS_CONFIG['pending']][]).map(([key, { label, dot }]) => (
                <Button
                  key={key}
                  variant={statusFilter === key ? 'primary' : 'outline'} size="sm"
                  onClick={() => { setStatusFilter(key); setPage(1) }}
                  className={statusFilter === key ? 'bg-gray-900 text-white hover:bg-gray-800' : ''}
                >
                  <span className={cn('w-1.5 h-1.5 rounded-full mr-1.5', dot)} />
                  {t(label)}
                </Button>
              ))}
            </div>
            <div className="flex gap-2 ml-auto">
              <Input
                type="date"
                value={dateFrom}
                onChange={e => { setDateFrom(e.target.value); setPage(1) }}
                className="w-36"
                title={t('date_from')}
              />
              <Input
                type="date"
                value={dateTo}
                onChange={e => { setDateTo(e.target.value); setPage(1) }}
                className="w-36"
                title={t('date_to')}
              />
              <Input
                placeholder={t('search_by_name_phone')}
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-48"
              />
              <Button variant="outline" onClick={handleSearch}><Search className="h-4 w-4" /></Button>
            </div>
          </div>

          {/* Reservation List */}
          {reservations.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center text-gray-500">
                <CalendarClock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium">{t('no_reservations')}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {reservations.map(r => {
                const statusCfg = STATUS_CONFIG[r.status]
                const transitions = STATUS_TRANSITIONS[r.status]
                return (
                  <Card key={r.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setDetailReservation(r)}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 text-orange-600 font-bold flex-shrink-0">
                            {r.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 truncate">
                              <span className="text-[10px] font-mono text-gray-400 font-bold ltr:mr-1.5 rtl:ml-1.5">#R-{r.store_reservation_number || r.id}</span>
                              {r.name}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {r.party_size} {t('guests')} · <Clock className="h-3 w-3" />
                              {r.reservation_date} {r.reservation_time}
                            </p>
                            {r.phone && (
                              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                <Phone className="h-3 w-3" />
                                {r.phone}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full border', statusCfg.color)}>
                            {t(statusCfg.label)}
                          </span>
                          {transitions.length > 0 && (
                            <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                              {transitions.map(tr => (
                                <Button
                                  key={tr.next}
                                  size="sm"
                                  className={cn('text-xs px-2 py-1 h-auto', tr.color)}
                                  onClick={() => updateStatus(r.id, tr.next)}
                                >
                                  {t(tr.label)}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Pagination */}
          {lastPage > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-600">{t('page')} {page} / {lastPage}</span>
              <Button variant="outline" size="sm" disabled={page >= lastPage} onClick={() => setPage(p => Math.min(lastPage, p + 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      {detailReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setDetailReservation(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">{t('reservation_detail')}</h3>
              <button onClick={() => setDetailReservation(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-600 font-bold text-lg">
                  {detailReservation.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{detailReservation.name}</p>
                  <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full border', STATUS_CONFIG[detailReservation.status].color)}>
                    {t(STATUS_CONFIG[detailReservation.status].label)}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500">{t('date')}</p>
                  <p className="font-medium text-gray-900">{detailReservation.reservation_date}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{t('time')}</p>
                  <p className="font-medium text-gray-900">{detailReservation.reservation_time}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{t('guests')}</p>
                  <p className="font-medium text-gray-900">{detailReservation.party_size}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{t('created_at')}</p>
                  <p className="font-medium text-gray-900">{detailReservation.created_at?.split('T')[0]}</p>
                </div>
              </div>
              {detailReservation.email && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  {detailReservation.email}
                </div>
              )}
              {detailReservation.phone && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4" />
                  {detailReservation.phone}
                </div>
              )}
              {detailReservation.notes && (
                <div>
                  <p className="text-xs text-gray-500">{t('notes')}</p>
                  <p className="text-gray-700 bg-gray-50 rounded-lg p-2 mt-1">{detailReservation.notes}</p>
                </div>
              )}
              {detailReservation.special_requests && (
                <div>
                  <p className="text-xs text-gray-500">{t('special_requests')}</p>
                  <p className="text-gray-700 bg-gray-50 rounded-lg p-2 mt-1">{detailReservation.special_requests}</p>
                </div>
              )}
              {detailReservation.cancellation_reason && (
                <div>
                  <p className="text-xs text-red-500">{t('cancellation_reason')}</p>
                  <p className="text-red-700 bg-red-50 rounded-lg p-2 mt-1">{detailReservation.cancellation_reason}</p>
                </div>
              )}
              {STATUS_TRANSITIONS[detailReservation.status].length > 0 && (
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  {STATUS_TRANSITIONS[detailReservation.status].map(tr => (
                    <Button
                      key={tr.next}
                      size="sm"
                      className={cn('flex-1', tr.color)}
                      onClick={() => {
                        updateStatus(detailReservation.id, tr.next)
                        setDetailReservation(null)
                      }}
                    >
                      {tr.next === 'confirmed' && <CheckCircle className="h-4 w-4 mr-1" />}
                      {tr.next === 'cancelled' && <XCircle className="h-4 w-4 mr-1" />}
                      {t(tr.label)}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
