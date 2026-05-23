'use client'
import { useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Circle, Polygon, Popup } from 'react-leaflet'
import L from 'leaflet'
import { useInspectorMapData } from '@/lib/api/queries'
import { sectorPolygon } from '@/lib/geo'

// Fix Leaflet default icon issue with bundlers
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })
}

const STATUS_COLORS: Record<string, string> = {
  safe: '#16A34A',
  warning: '#EEA727',
  danger: '#DC2626',
}

const TOX_COLORS: Record<string, string> = {
  'T+': '#DC2626',
  'T': '#EEA727',
  'T-': '#EEA727',
}

export default function MapView() {
  const { data } = useInspectorMapData()
  const center: [number, number] = [46.77, 23.59] // Cluj-Napoca area

  return (
    <MapContainer
      center={center}
      zoom={11}
      style={{ height: '100%', width: '100%' }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Apiaries */}
      {data?.apiaries.map(a => (
        <CircleMarker
          key={a.id}
          center={[a.lat, a.lng]}
          radius={8}
          pathOptions={{
            fillColor: STATUS_COLORS[a.status] ?? '#7A6F90',
            fillOpacity: 0.9,
            color: 'white',
            weight: 2,
          }}
        >
          <Popup>
            <strong>{a.hive_count} stupi</strong><br />
            Status: {a.status}
          </Popup>
        </CircleMarker>
      ))}

      {/* Active sprays: risk circle + wind cone */}
      {data?.active_sprays.map(spray => (
        <div key={spray.id}>
          <Circle
            center={[spray.lat, spray.lng]}
            radius={spray.radius_m}
            pathOptions={{
              color: TOX_COLORS[spray.toxicity] ?? '#EEA727',
              fillColor: TOX_COLORS[spray.toxicity] ?? '#EEA727',
              fillOpacity: 0.1,
              weight: 2,
              dashArray: '6 4',
            }}
          >
            <Popup>
              <strong>Stropire programată</strong><br />
              Toxicitate: {spray.toxicity}<br />
              Raza: {spray.radius_m}m
            </Popup>
          </Circle>
          {/* Wind cone sector (bearing 225° = SW) */}
          <Polygon
            positions={sectorPolygon(
              [spray.lat, spray.lng],
              225,
              spray.radius_m * 1.5,
              30,
            )}
            pathOptions={{
              color: TOX_COLORS[spray.toxicity] ?? '#EEA727',
              fillColor: TOX_COLORS[spray.toxicity] ?? '#EEA727',
              fillOpacity: 0.15,
              weight: 1,
            }}
          />
        </div>
      ))}
    </MapContainer>
  )
}
