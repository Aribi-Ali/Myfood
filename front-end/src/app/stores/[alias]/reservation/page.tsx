'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth'
import { useLanguage } from '@/contexts/language'
import { api } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Navbar } from '@/components/navbar'
import { cn } from '@/lib/utils'
import { CalendarDays, Clock, Users, CheckCircle, XCircle } from 'lucide-react'

interface ReservationSettings {
  enabled: boolean
  max_guests_per_reservation: number
  min_guests_per_reservation: number
  advance_notice_hours: number
  max_days_in_advance: number
  time_slot_interval: number
  available_days: string[]
  available_times: { from: string; to: string }
}

interface AvailabilitySlot {
  time: string
  available: boolean
}

export default function ReservationPage() {
  const params = useParams<{ alias: string }>()
  const alias = params.alias
  const router = useRouter()
  const { user } = useAuth()
  const { t } = useLanguage()

  const [settings, setSettings] = useState<ReservationSettings | null>(null)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')

  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [guests, setGuests] = useState(2)
  const [availabilities, setAvailabilities] = useState<AvailabilitySlot[]>([])
  const [checking, setChecking] = useState(false)
  const [availabilityChecked, setAvailabilityChecked] = useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState('')

  async function fetchSettings() {
    setFetching(true)
    setError('')
    try {
      const res = await api.get<{ data: ReservationSettings }>(`/stores/${alias}/reservations/settings`)
      setSettings(res.data)
      if (res.data.enabled === false) {
        setError(t('reservation_disabled'))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('reservation_error_load'))
    }
    setFetching(false)
  }

  useEffect(() => {
    if (!alias) return
    ;(async () => {
      setFetching(true)
      setError('')
      try {
        const res = await api.get<{ data: ReservationSettings }>(`/stores/${alias}/reservations/settings`)
        setSettings(res.data)
        if (res.data.enabled === false) {
          setError(t('reservation_disabled'))
        }
      } catch (err) {
      setError(err instanceof Error ? err.message : t('reservation_error_generic'))
      }
      setFetching(false)
    })()
  }, [alias])

  async function checkAvailability() {
    if (!date || !time || !guests) return
    setChecking(true)
    setError('')
    setAvailabilityChecked(false)
    try {
      const res = await api.post<{ slots: AvailabilitySlot[] }>(`/stores/${alias}/reservations/check`, {
        date,
        time,
        guests,
      })
      setAvailabilities(res.slots || [])
      setAvailabilityChecked(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('reservation_error_load'))
    }
    setChecking(false)
  }

  async function createReservation(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!user) { router.push('/login'); return }
    setSubmitting(true)
    try {
      await api.post(`/stores/${alias}/reservations`, {
        date,
        time,
        guests,
      })
      setSuccess(t('reservation_success'))
    } catch (err) {
      setError(err instanceof Error ? err.message : t('reservation_error_generic'))
    }
    setSubmitting(false)
  }

  if (fetching) {
    return (
      <>
        <Navbar />
        <main className="flex-1 mx-auto max-w-lg px-4 py-12 space-y-4">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-64 w-full" />
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 mx-auto max-w-lg px-4 py-12">
        <Card>
          <CardHeader>
            <h1 className="text-xl font-bold text-gray-900 text-center">{t('reservation_heading')}</h1>
            <p className="text-sm text-gray-500 text-center">{t('reservation_subtitle')}</p>
          </CardHeader>
          <CardContent>
            {success && (
              <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">{success}</div>
            )}
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
            )}

            {!settings || !settings.enabled ? (
              <p className="text-center text-gray-500 py-4">{t('reservation_not_available')}</p>
            ) : (
              <form onSubmit={createReservation} className="space-y-4">
                <Input
                  id="date"
                  label={t('reservation_date_label')}
                  type="date"
                  value={date}
                  onChange={(e) => { setDate(e.target.value); setAvailabilityChecked(false) }}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />

                <Input
                  id="time"
                  label={t('reservation_time_label')}
                  type="time"
                  value={time}
                  onChange={(e) => { setTime(e.target.value); setAvailabilityChecked(false) }}
                  required
                />

                <div>
                  <label htmlFor="guests" className="block text-sm font-medium text-gray-700">{t('reservation_guests_label')}</label>
                  <input
                    id="guests"
                    type="number"
                    value={guests}
                    onChange={(e) => { setGuests(Number(e.target.value)); setAvailabilityChecked(false) }}
                    min={settings.min_guests_per_reservation || 1}
                    max={settings.max_guests_per_reservation || 20}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>

                <Button type="button" variant="outline" className="w-full" onClick={checkAvailability} disabled={checking || !date || !time}>
                  {checking ? t('reservation_check_loading') : t('reservation_check_button')}
                </Button>

                {availabilityChecked && availabilities.length > 0 && (
                  <div className="rounded-lg border p-3 space-y-2">
                    <p className="text-sm font-medium text-gray-700">{t('reservation_available_slots_title')}</p>
                    <div className="flex flex-wrap gap-2">
                      {availabilities.map((slot) => (
                        <button
                          key={slot.time}
                          type="button"
                          onClick={() => setTime(slot.time)}
                          disabled={!slot.available}
                          className={cn(
                            'rounded-lg border px-3 py-1.5 text-sm transition-colors',
                            slot.available
                              ? time === slot.time
                                ? 'border-orange-500 bg-orange-50 text-orange-700'
                                : 'border-green-200 text-green-700 hover:bg-green-50'
                              : 'border-red-200 text-red-400 cursor-not-allowed'
                          )}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {availabilityChecked && availabilities.length === 0 && (
                  <div className="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-700">
                    {t('reservation_no_slots')}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={submitting || !date || !time || !guests}>
                  {submitting ? t('reservation_submit_loading') : t('reservation_submit')}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  )
}
