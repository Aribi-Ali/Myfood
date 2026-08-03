'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth'
import { api } from '@/lib/api-client'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { CitySearchSelect } from '@/components/city-search-select'
import { Loader2, Bike, Car, Plus, Trash2, Sun, Moon } from 'lucide-react'

interface DeliveryAreaItem {
  id?: number
  wilaya_id: number
  daira_id: number | null
  commune_id: number | null
  day_price: number
  night_price: number
  label: string
}

const TRANSPORTERS = [
  { value: 'bike', label: 'Bike', icon: Bike },
  { value: 'motorcycle', label: 'Motorcycle', icon: Bike },
  { value: 'car', label: 'Car', icon: Car },
]

export default function DeliveryPage() {
  const { user, loading: authLoading, refreshUser } = useAuth()

  const [phone, setPhone] = useState('')
  const [transporterType, setTransporterType] = useState('bike')
  const [isWorking, setIsWorking] = useState(false)
  const [hasProfile, setHasProfile] = useState(false)
  const [dayPrice, setDayPrice] = useState('')
  const [nightPrice, setNightPrice] = useState('')

  const [selectedCity, setSelectedCity] = useState<{ wilaya_id: number; daira_id: number; commune_id: number; label: string } | null>(null)

  const [areas, setAreas] = useState<DeliveryAreaItem[]>([])
  const [existingAreas, setExistingAreas] = useState<DeliveryAreaItem[]>([])

  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      setPhone(user.phone || '')
      if (user.delivery_profile) {
        setHasProfile(true)
        setTransporterType(user.delivery_profile.transporter_type || 'bike')
        setIsWorking(user.delivery_profile.is_working)
        setDayPrice(user.delivery_profile.day_price?.toString() || '')
        setNightPrice(user.delivery_profile.night_price?.toString() || '')
        const loadedAreas: DeliveryAreaItem[] = (user.delivery_profile.areas || []).map((a: any) => ({
          id: a.id,
          wilaya_id: a.wilaya_id,
          daira_id: a.daira_id,
          commune_id: a.commune_id,
          day_price: a.day_price,
          night_price: a.night_price,
          label: a.commune?.name_fr || a.daira?.name_fr || a.wilaya?.name_fr || `#${a.commune_id}`,
        }))
        setExistingAreas(loadedAreas)
        setAreas(loadedAreas)
      }
      if (user.role === 'delivery') {
        setHasProfile(true)
      }
    }
  }, [user])

  function addCityArea() {
    if (!selectedCity) return
    const id = selectedCity.commune_id
    if (areas.some(a => a.commune_id === id)) return
    setAreas(prev => [...prev, {
      wilaya_id: selectedCity.wilaya_id,
      daira_id: selectedCity.daira_id,
      commune_id: id,
      day_price: parseFloat(dayPrice) || 0,
      night_price: parseFloat(nightPrice) || 0,
      label: selectedCity.label,
    }])
    setSelectedCity(null)
  }

  function removeArea(index: number) {
    setAreas((prev) => prev.filter((_, i) => i !== index))
  }

  function updateAreaPrice(index: number, field: 'day_price' | 'night_price', value: string) {
    setAreas((prev) =>
      prev.map((a, i) => (i === index ? { ...a, [field]: parseFloat(value) || 0 } : a))
    )
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')
    try {
      await api.put('/user', { phone })
      await refreshUser()
      setMessage('Delivery profile saved.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save delivery profile')
    }
    setSaving(false)
  }

  async function handleSaveAreas() {
    setSaving(true)
    setMessage('')
    setError('')
    try {
      await api.post('/delivery/areas', {
        areas: areas.map((a) => ({
          wilaya_id: a.wilaya_id,
          daira_id: a.daira_id,
          commune_id: a.commune_id,
          day_price: a.day_price,
          night_price: a.night_price,
        })),
      })
      await api.post('/delivery/pricing', {
        day_price: parseFloat(dayPrice) || 0,
        night_price: parseFloat(nightPrice) || 0,
      })
      await refreshUser()
      setMessage('Areas saved.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save areas')
    }
    setSaving(false)
  }

  async function toggleWorking() {
    try {
      await api.post('/delivery/status')
      setIsWorking((v) => !v)
      await refreshUser()
    } catch {
      setError('Failed to toggle status')
    }
  }

  if (authLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Card><CardContent className="p-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Become a Delivery Driver</h1>
        <p className="text-gray-500 dark:text-gray-400">Register as a delivery driver and start earning.</p>
      </div>

      {message && (
        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950/30 dark:text-green-400">{message}</div>
      )}
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-400">{error}</div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delivery Information</h3>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-stone-200">Phone</label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-stone-200">Transport Type</label>
                  <div className="grid grid-cols-3 gap-3">
                    {TRANSPORTERS.map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setTransporterType(value)}
                        className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 text-sm transition-colors ${
                          transporterType === value
                            ? 'border-orange-500 bg-orange-50 text-orange-700 dark:border-orange-500 dark:bg-orange-900/30 dark:text-orange-300'
                            : 'border-gray-200 text-gray-500 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-600'
                        }`}
                      >
                        <Icon className="h-6 w-6" />
                        <span className="font-medium">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Button type="submit" disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {hasProfile ? 'Save Profile' : 'Register as Delivery'}
                  </Button>
                  {hasProfile && (
                    <button
                      type="button"
                      onClick={toggleWorking}
                      className={`relative h-6 w-11 rounded-full transition-colors ${
                        isWorking ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                          isWorking ? 'translate-x-5' : ''
                        }`}
                      />
                    </button>
                  )}
                </div>
                {hasProfile && <p className="text-xs text-gray-500 dark:text-gray-400">{isWorking ? 'Available for deliveries' : 'Not available'}</p>}
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delivery Areas</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-stone-200">City</label>
                <CitySearchSelect
                  value={selectedCity?.label || ''}
                  onChange={(val, meta) => {
                    if (meta) {
                      setSelectedCity({ wilaya_id: meta.wilaya_id, daira_id: meta.daira_id, commune_id: meta.commune_id, label: val })
                    } else {
                      setSelectedCity(null)
                    }
                  }}
                />
              </div>
              {selectedCity && (
                <Button type="button" onClick={addCityArea}>
                  <Plus className="mr-1 h-4 w-4" />
                  Add Area
                </Button>
              )}

              {areas.length > 0 && (
                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 px-2 dark:text-gray-400">
                    <div className="col-span-6">City</div>
                    <div className="col-span-2 flex items-center gap-1"><Sun className="h-3 w-3" />Day</div>
                    <div className="col-span-2 flex items-center gap-1"><Moon className="h-3 w-3" />Night</div>
                    <div className="col-span-1" />
                    <div className="col-span-1" />
                  </div>
                  {areas.map((area, i) => (
                    <div key={i} className="grid grid-cols-12 gap-2 items-center rounded-lg border border-gray-100 p-2 text-sm dark:border-gray-700">
                      <span className="col-span-6 text-gray-900 truncate dark:text-white">{area.label || `#${area.commune_id}`}</span>
                      <div className="col-span-2">
                        <input
                          type="number"
                          min="0"
                          step="10"
                          value={area.day_price}
                          onChange={(e) => updateAreaPrice(i, 'day_price', e.target.value)}
                          className="w-full rounded border border-gray-200 px-2 py-1 text-xs dark:bg-stone-800 dark:border-gray-700 dark:text-stone-200"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          min="0"
                          step="10"
                          value={area.night_price}
                          onChange={(e) => updateAreaPrice(i, 'night_price', e.target.value)}
                          className="w-full rounded border border-gray-200 px-2 py-1 text-xs dark:bg-stone-800 dark:border-gray-700 dark:text-stone-200"
                        />
                      </div>
                      <div className="col-span-1">
                        <button onClick={() => removeArea(i)} className="text-red-400 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {hasProfile && areas.length > 0 && (
                <div className="flex justify-end pt-2">
                  <Button onClick={handleSaveAreas} disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Areas
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {hasProfile && (
            <>
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pricing</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1 dark:text-stone-200">
                      <Sun className="h-4 w-4 text-orange-500" />
                      Day Price
                    </label>
                    <Input type="number" min="0" step="10" value={dayPrice} onChange={(e) => setDayPrice(e.target.value)} placeholder="0" />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1 dark:text-stone-200">
                      <Moon className="h-4 w-4 text-blue-500" />
                      Night Price
                    </label>
                    <Input type="number" min="0" step="10" value={nightPrice} onChange={(e) => setNightPrice(e.target.value)} placeholder="0" />
                  </div>
                </CardContent>
              </Card>

              {existingAreas.length > 0 && (
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Saved Areas</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-stone-300">
                      {existingAreas.map((a, i) => (
                        <p key={i} className="flex items-center justify-between">
                          <span>{a.label || (a as any).commune?.name_fr || `#${a.commune_id}`}</span>
                          <span className="text-xs">{a.day_price} DA / {a.night_price} DA</span>
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
