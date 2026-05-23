'use client'
import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { Search, Maximize2, X, MapPin, Loader2 } from 'lucide-react'

if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })
}

interface LocationPickerProps {
  lat: number
  lng: number
  onChange: (lat: number, lng: number) => void
  fill?: boolean
}

function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()
  const first = useRef(true)
  useEffect(() => {
    if (first.current) { first.current = false; return }
    map.setView([lat, lng], map.getZoom())
  }, [lat, lng, map])
  return null
}

function ClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) { onPick(e.latlng.lat, e.latlng.lng) },
  })
  return null
}

function InvalidateOnMount() {
  const map = useMap()
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 50)
    return () => clearTimeout(t)
  }, [map])
  return null
}

function PickerMap({
  lat, lng, onPick, className,
}: {
  lat: number; lng: number; onPick: (lat: number, lng: number) => void; className: string
}) {
  return (
    <div className={`rounded-[12px] overflow-hidden border border-hair-soft ${className}`}>
      <MapContainer center={[lat, lng]} zoom={13} style={{ height: '100%', width: '100%' }} className="z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Recenter lat={lat} lng={lng} />
        <InvalidateOnMount />
        <ClickHandler onPick={onPick} />
        <Marker
          position={[lat, lng]}
          draggable
          eventHandlers={{
            dragend: (e) => {
              const p = (e.target as L.Marker).getLatLng()
              onPick(p.lat, p.lng)
            },
          }}
        />
      </MapContainer>
    </div>
  )
}

export default function LocationPicker({ lat, lng, onChange, fill = false }: LocationPickerProps) {
  const [address, setAddress] = useState('')
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState(false)

  async function searchAddress() {
    const q = address.trim()
    if (!q) return
    setSearching(true)
    setError('')
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&countrycodes=ro&limit=1`,
        { headers: { 'Accept-Language': 'ro' } },
      )
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        onChange(parseFloat(data[0].lat), parseFloat(data[0].lon))
      } else {
        setError('Adresa nu a fost găsită')
      }
    } catch {
      setError('Eroare la căutare')
    } finally {
      setSearching(false)
    }
  }

  async function reverseGeocode(newLat: number, newLng: number) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLat}&lon=${newLng}`,
        { headers: { 'Accept-Language': 'ro' } },
      )
      const data = await res.json()
      if (data?.display_name) setAddress(data.display_name)
    } catch { /* ignore */ }
  }

  function handlePick(newLat: number, newLng: number) {
    onChange(newLat, newLng)
    reverseGeocode(newLat, newLng)
  }

  function onAddressKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      searchAddress()
    }
  }

  return (
    <div className={fill ? 'flex flex-col h-full min-h-0' : ''}>
      <div className="flex gap-2 mb-3">
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyDown={onAddressKeyDown}
          placeholder="Caută adresă (ex: Apahida, Cluj)"
          aria-label="Caută adresă"
          className="flex-1 h-10 px-3 rounded-xl border border-hair bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-purple"
        />
        <button
          type="button"
          onClick={searchAddress}
          disabled={searching || !address.trim()}
          aria-label="Caută adresa"
          className="h-10 w-10 flex items-center justify-center rounded-xl bg-purple text-white disabled:opacity-50 hover:bg-purple/90 transition"
        >
          {searching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
        </button>
      </div>
      {error && <p role="alert" className="text-[12px] text-alert mb-2">{error}</p>}

      <div className={`relative ${fill ? 'flex-1 min-h-0' : ''}`}>
        <PickerMap
          lat={lat}
          lng={lng}
          onPick={handlePick}
          className={fill ? 'h-full' : 'h-[220px] sm:h-[280px]'}
        />
        <button
          type="button"
          onClick={() => setExpanded(true)}
          aria-label="Extinde harta"
          className="absolute top-2 right-2 z-[400] bg-white shadow rounded-lg p-2 hover:bg-hair-soft transition"
        >
          <Maximize2 size={14} />
        </button>
      </div>

      <p className="mt-2 text-[12px] text-ink-soft flex items-center gap-1">
        <MapPin size={12} className="text-purple" />
        {lat.toFixed(5)}°N, {lng.toFixed(5)}°E
      </p>
      <p className="mt-1 text-[11px] text-ink-muted">Trage marcatorul sau apasă pe hartă pentru a alege locația.</p>

      {expanded && (
        <div
          className="fixed inset-0 z-[9999] bg-ink/60 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Alege locația pe hartă"
        >
          <div className="bg-white rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-hair-soft">
              <p className="font-semibold text-ink">Alege locația pe hartă</p>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                aria-label="Închide"
                className="p-2 rounded-lg hover:bg-hair-soft transition"
              >
                <X size={18} />
              </button>
            </div>
            <div className="px-4 py-3 border-b border-hair-soft flex gap-2">
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyDown={onAddressKeyDown}
                placeholder="Caută adresă"
                aria-label="Caută adresă"
                className="flex-1 h-10 px-3 rounded-xl border border-hair bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-purple"
              />
              <button
                type="button"
                onClick={searchAddress}
                disabled={searching || !address.trim()}
                className="h-10 px-4 rounded-xl bg-purple text-white text-sm font-semibold disabled:opacity-50 flex items-center gap-2"
              >
                {searching ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                Caută
              </button>
            </div>
            <div className="flex-1 p-3">
              <PickerMap lat={lat} lng={lng} onPick={handlePick} className="h-full" />
            </div>
            <div className="flex items-center justify-between px-4 py-3 border-t border-hair-soft">
              <p className="text-[12px] text-ink-soft flex items-center gap-1">
                <MapPin size={12} className="text-purple" />
                {lat.toFixed(5)}°N, {lng.toFixed(5)}°E
              </p>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="h-10 px-5 rounded-xl bg-purple text-white font-semibold hover:bg-purple/90 transition"
              >
                Confirmă locația
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
