'use client'

import { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useGeo, type Wilaya } from '@/contexts/geo'
import { useCity } from '@/contexts/city'
import { useLanguage } from '@/contexts/language'
import { Modal } from '@/components/modal'
import { MapPin, Search, Crosshair, Navigation } from 'lucide-react'

const LocationMap = dynamic(() => import('@/components/location-map'), { ssr: false })

interface CitySelectorProps {
  open: boolean
  onClose: () => void
}

export function CitySelector({ open, onClose }: CitySelectorProps) {
  const { t } = useLanguage()
  const { wilayas } = useGeo()
  const { city, setCity, clearCity } = useCity()
  const [tab, setTab] = useState<'gps' | 'city'>('city')
  const [search, setSearch] = useState('')
  const [detecting, setDetecting] = useState(false)
  const [detectError, setDetectError] = useState('')
  const [gpsPosition, setGpsPosition] = useState<[number, number] | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [mapKey, setMapKey] = useState(0)

  useEffect(() => {
    if (open) {
      setSearch('')
      setDetectError('')
      setGpsPosition(null)
      setTab('city')
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [open])

  // Force fresh map instance each time GPS tab opens
  useEffect(() => {
    if (tab === 'gps') setMapKey(k => k + 1)
  }, [tab])

  async function setCityFromCoords(lat: number, lng: number) {
    setDetectError('')
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=fr`,
        { headers: { 'User-Agent': 'YallahKool/1.0' } }
      )
      if (!res.ok) throw new Error('Geocoding failed')
      const data = await res.json()
      const addr = data?.address
      const stateName = addr?.state || ''
      const commune = addr?.city || addr?.town || addr?.village || addr?.municipality || null

      // Match the state name to a wilaya (case-insensitive, trimmed)
      const matched = wilayas.find(w =>
        w.name_fr.toLowerCase().trim() === stateName.toLowerCase().trim()
      )
      if (matched) {
        setCity({ wilayaId: matched.id, wilayaName: matched.name_fr, commune })
        onClose()
        return
      }

      // Fallback: try partial match
      const partial = wilayas.find(w =>
        stateName.toLowerCase().includes(w.name_fr.toLowerCase()) ||
        w.name_fr.toLowerCase().includes(stateName.toLowerCase())
      )
      if (partial) {
        setCity({ wilayaId: partial.id, wilayaName: partial.name_fr, commune })
        onClose()
        return
      }

      setDetectError(`Unknown wilaya: "${stateName}"`)
    } catch {
      setDetectError('Could not determine your location. Try selecting a city from the list.')
    }
  }

  function handleMapClick(pos: [number, number]) {
    setGpsPosition(pos)
    setCityFromCoords(pos[0], pos[1])
  }

  const filtered = search
    ? wilayas.filter(w => w.name_fr.toLowerCase().includes(search.toLowerCase()) || w.name_ar?.includes(search))
    : wilayas

  function select(w: Wilaya) {
    setCity({ wilayaId: w.id, wilayaName: w.name_fr })
    onClose()
  }

  async function detectLocation() {
    if (!navigator.geolocation) {
      setDetectError('GPS not available')
      return
    }
    setDetecting(true)
    setDetectError('')
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 })
      )
      await setCityFromCoords(pos.coords.latitude, pos.coords.longitude)
    } catch {
      setDetectError('Location access denied or unavailable')
    }
    setDetecting(false)
  }

  return (
    <Modal open={open} onClose={onClose} title="Choose your city" className="max-h-[85vh]">
      {/* Tabs */}
      <div className="flex border-b border-gray-100 dark:border-gray-700">
        <button
          onClick={() => setTab('gps')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
            tab === 'gps'
              ? 'text-orange-600 border-b-2 border-orange-500'
              : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
          }`}
        >
          <Navigation className="h-4 w-4" />
          GPS Location
        </button>
        <button
          onClick={() => setTab('city')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
            tab === 'city'
              ? 'text-orange-600 border-b-2 border-orange-500'
              : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
          }`}
        >
          <MapPin className="h-4 w-4" />
          City
        </button>
      </div>

      {/* GPS Tab */}
      <div className={`px-5 py-5 flex flex-col gap-4 ${tab !== 'gps' ? 'hidden' : ''}`}>
        <LocationMap
          key={mapKey}
          position={gpsPosition}
          onPositionChange={handleMapClick}
          dragging={detecting}
        />
        <div className="flex flex-col items-center gap-3">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Click on the map or use GPS detection to set your city.
          </p>
          <button
            onClick={detectLocation}
            disabled={detecting}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 transition-colors disabled:opacity-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            <Crosshair className={`h-5 w-5 ${detecting ? 'animate-spin' : ''}`} />
            {detecting ? 'Detecting...' : 'Detect my location'}
          </button>
          {detectError && <p className="text-xs text-red-500 text-center">{detectError}</p>}
        </div>
      </div>

      {/* City Tab */}
      {tab === 'city' && (
        <>
          <div className="px-5 py-3">
            <div className="relative">
              <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search for a city..."
                className="w-full rounded-lg border border-gray-200 dark:border-gray-700 py-2.5 ltr:pl-10 ltr:pr-3 rtl:pr-10 rtl:pl-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto border-t border-gray-100 dark:border-gray-700">
            {city.wilayaName && (
              <button
                onClick={() => { clearCity(); onClose() }}
                className="w-full flex items-center gap-3 px-5 py-3 text-sm text-gray-500 hover:bg-gray-50 border-b border-gray-50 transition-colors dark:text-gray-400 dark:hover:bg-gray-800 dark:border-gray-800"
              >
                <MapPin className="h-4 w-4" />
                <span>{t('all_cities')}</span>
              </button>
            )}
            {filtered.length === 0 ? (
              <p className="px-5 py-8 text-sm text-gray-400 dark:text-gray-500 text-center">{t('no_cities')}</p>
            ) : (
              filtered.map(w => (
                <button
                  key={w.id}
                  onClick={() => select(w)}
                  className={`w-full flex items-center gap-3 px-5 py-3 text-sm transition-colors hover:bg-orange-50 dark:hover:bg-orange-900/30 ${
                    city.wilayaId === w.id ? 'bg-orange-50 text-orange-700 font-semibold dark:bg-orange-900/30 dark:text-orange-300' : 'text-gray-700 dark:text-gray-200'
                  }`}
                >
                  <MapPin className={`h-4 w-4 shrink-0 ${city.wilayaId === w.id ? 'text-orange-500' : 'text-gray-400 dark:text-gray-500'}`} />
                  <span>{w.name_fr}</span>
                  {city.wilayaId === w.id && (
                    <span className="ml-auto text-orange-500">✓</span>
                  )}
                </button>
              ))
            )}
          </div>
        </>
      )}
    </Modal>
  )
}
