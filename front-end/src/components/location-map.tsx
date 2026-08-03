'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'

// Fix default marker icon (webpack/next issue with leaflet assets)
// @ts-expect-error - leaflet types are incomplete for icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

import 'leaflet/dist/leaflet.css'

interface LocationMapProps {
  position: [number, number] | null
  onPositionChange: (pos: [number, number]) => void
  dragging?: boolean
}

function MapController({ position, onPositionChange, dragging }: LocationMapProps) {
  const map = useMap()

  useEffect(() => {
    if (dragging || !position) return
    map.flyTo(position, 13, { duration: 1.5 })
  }, [position, dragging, map])

  useMapEvents({
    click(e) {
      onPositionChange([e.latlng.lat, e.latlng.lng])
    },
  })

  return null
}

export default function LocationMap({ position, onPositionChange, dragging }: LocationMapProps) {
  const defaultCenter: [number, number] = [28.0339, 1.6596] // Algeria center

  return (
    <div className="h-64 w-full rounded-xl overflow-hidden border border-gray-200">
      <MapContainer
        center={position || defaultCenter}
        zoom={position ? 13 : 5}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {position && (
          <Marker position={position}>
            <Popup>Your location</Popup>
          </Marker>
        )}
        <MapController position={position} onPositionChange={onPositionChange} dragging={dragging} />
      </MapContainer>
    </div>
  )
}
