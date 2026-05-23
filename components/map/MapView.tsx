'use client'
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

export type LayerKey = 'apiaries' | 'sprays' | 'damage'

interface MapViewProps {
  visibleLayers?: Set<LayerKey>
}

export default function MapView({ visibleLayers }: MapViewProps) {
  const { data } = useInspectorMapData()
  const center: [number, number] = [46.77, 23.59] // Cluj-Napoca area

  const showApiaries = !visibleLayers || visibleLayers.has('apiaries')
  const showSprays = !visibleLayers || visibleLayers.has('sprays')
  const showDamage = !visibleLayers || visibleLayers.has('damage')

  return (
    <div
      role="application"
      aria-label="Hartă interactivă cu stupine și zone de stropire"
      aria-describedby="map-keyboard-help"
      style={{ height: '100%', width: '100%' }}
    >
      <p id="map-keyboard-help" className="sr-only">
        Folosește săgețile pentru a deplasa harta, plus și minus pentru a mări sau micșora. Apasă Tab pentru a naviga între markeri.
      </p>
      <MapContainer
        center={center}
        zoom={11}
        keyboard
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Apiaries — large colored circles */}
        {showApiaries && data?.apiaries.map(a => (
          <CircleMarker
            key={a.id}
            center={[a.lat, a.lng]}
            radius={16}
            pathOptions={{
              fillColor: STATUS_COLORS[a.status] ?? '#7A6F90',
              fillOpacity: 0.85,
              color: 'white',
              weight: 3,
            }}
          >
            <Popup>
              <div style={{ minWidth: 140 }}>
                <p style={{ fontWeight: 700, marginBottom: 4 }}>🐝 Stupină</p>
                <p style={{ margin: '2px 0' }}><strong>{a.hive_count} stupi</strong></p>
                <p style={{ margin: '2px 0', color: STATUS_COLORS[a.status], fontWeight: 600, textTransform: 'capitalize' }}>
                  {a.status === 'safe' ? 'Sigur' : a.status === 'warning' ? 'Atenție' : 'Pericol'}
                </p>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* Damage claims — red markers */}
        {showDamage && data?.damage_claims?.map(claim => (
          <CircleMarker
            key={claim.id}
            center={[claim.lat, claim.lng]}
            radius={10}
            pathOptions={{
              fillColor: '#DC2626',
              fillOpacity: 0.85,
              color: 'white',
              weight: 2.5,
            }}
          >
            <Popup>
              <div style={{ minWidth: 140 }}>
                <p style={{ fontWeight: 700, marginBottom: 4 }}>⚠️ Cerere pagubă</p>
                <p style={{ margin: '2px 0', color: '#666', textTransform: 'capitalize' }}>{claim.status}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* Active sprays: risk circle + wind cone */}
        {showSprays && data?.active_sprays.map(spray => (
          <div key={spray.id}>
            <Circle
              center={[spray.lat, spray.lng]}
              radius={spray.radius_m}
              pathOptions={{
                color: TOX_COLORS[spray.toxicity] ?? '#EEA727',
                fillColor: TOX_COLORS[spray.toxicity] ?? '#EEA727',
                fillOpacity: 0.12,
                weight: 2,
                dashArray: '6 4',
              }}
            >
              <Popup>
                <div style={{ minWidth: 140 }}>
                  <p style={{ fontWeight: 700, marginBottom: 4 }}>Stropire activă</p>
                  <p style={{ margin: '2px 0' }}>Toxicitate: <strong>{spray.toxicity}</strong></p>
                  <p style={{ margin: '2px 0' }}>Raza: {spray.radius_m}m</p>
                </div>
              </Popup>
            </Circle>
            {/* Wind cone sector */}
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
                fillOpacity: 0.18,
                weight: 1,
              }}
            />
          </div>
        ))}
      </MapContainer>
    </div>
  )
}
