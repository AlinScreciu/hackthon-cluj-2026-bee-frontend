'use client'
import { MapContainer, TileLayer, Marker, GeoJSON, Circle, useMap, Tooltip } from 'react-leaflet'
import L from 'leaflet'
import { useEffect, useMemo } from 'react'
import type { GeoJSONFeatureCollection, NearbyApiary } from '@/lib/api/types'

// Fix Leaflet default icon issue with bundlers
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })
}

// Our simplified product model returns two zone types:
//   A1 = 7km baseline (always notify) — solid red
//   AW = downwind cone (wind extension) — orange, slightly transparent
const ZONE_STYLE: Record<string, { fillColor: string; color: string; weight: number; fillOpacity: number }> = {
  AW: { fillColor: '#F4A261', color: '#B5621A', weight: 1.4, fillOpacity: 0.35 },
  A1: { fillColor: '#E63946', color: '#9B1B26', weight: 1.6, fillOpacity: 0.45 },
}

export interface RiskZonesMapProps {
  lat: number
  lng: number
  zones: GeoJSONFeatureCollection | null
  height?: number
  riskRadiusM?: number | null
  apiaries?: NearbyApiary[]
}

// Refits the map to the outermost zone (or a fallback frame while waiting).
function FitBounds({ zones, lat, lng, fallbackRadiusM }: { zones: GeoJSONFeatureCollection | null; lat: number; lng: number; fallbackRadiusM: number }) {
  const map = useMap()
  useEffect(() => {
    if (zones?.features?.length) {
      const layer = L.geoJSON(zones as unknown as GeoJSON.FeatureCollection)
      const bounds = layer.getBounds()
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [16, 16] })
        return
      }
    }
    const fb = L.latLng(lat, lng).toBounds(fallbackRadiusM * 2.2)
    map.fitBounds(fb, { padding: [16, 16] })
  }, [map, zones, lat, lng, fallbackRadiusM])
  return null
}

// Clean parcel center marker — small purple dot with a white ring.
function buildParcelDot(): L.DivIcon {
  const html = `
    <div style="
      width: 12px; height: 12px; border-radius: 50%;
      background: #40288C;
      border: 2px solid white;
      box-shadow: 0 0 0 1.5px rgba(64,40,140,0.5), 0 1px 3px rgba(0,0,0,0.25);
      transform: translate(-50%, -50%);
    "></div>
  `
  return L.divIcon({
    html,
    className: 'risk-parcel-dot',
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  })
}

// Brand-aligned hive marker. Two variants:
//   inZone=true  → bright honey-yellow (will be notified)
//   inZone=false → muted gray (nearby but safe due to wind)
function buildHiveIcon(inZone: boolean): L.DivIcon {
  const fill   = inZone ? '#FFEF5F' : '#E5E7EB'
  const stripe = inZone ? '#EEA727' : '#9CA3AF'
  const stroke = inZone ? '#40288C' : '#6B7280'
  const hole   = inZone ? '#40288C' : '#6B7280'
  const opacity = inZone ? '1' : '0.7'

  const html = `
    <div style="
      position: relative;
      width: 28px; height: 32px;
      transform: translate(-50%, -100%);
      filter: drop-shadow(0 1px 2px rgba(27,15,46,${inZone ? '0.35' : '0.15'}));
      opacity: ${opacity};
    ">
      <svg viewBox="0 0 28 32" width="28" height="32" xmlns="http://www.w3.org/2000/svg">
        <polygon points="14,1 26,8 26,22 14,29 14,32 12,28 2,22 2,8"
                 fill="${fill}" stroke="${stroke}" stroke-width="1.5" stroke-linejoin="round" />
        <line x1="5" y1="12" x2="23" y2="12" stroke="${stripe}" stroke-width="1.2" opacity="0.55" />
        <line x1="5" y1="17" x2="23" y2="17" stroke="${stripe}" stroke-width="1.2" opacity="0.55" />
        <line x1="5" y1="22" x2="23" y2="22" stroke="${stripe}" stroke-width="1.2" opacity="0.55" />
        <ellipse cx="14" cy="22.5" rx="2" ry="1.3" fill="${hole}" />
      </svg>
    </div>
  `
  return L.divIcon({
    html,
    className: 'risk-hive-icon',
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  })
}

export default function RiskZonesMap({ lat, lng, zones, height = 240, riskRadiusM, apiaries }: RiskZonesMapProps) {
  // Paint outer zones first (A4) so the inner A1 sits on top — matches the
  // AI's matplotlib output where you see all rings clearly.
  const orderedFeatures = useMemo(() => {
    if (!zones?.features) return []
    const order: Record<string, number> = { A4: 0, A3: 1, A2: 2, A1: 3 }
    return [...zones.features].sort((a, b) => {
      const ak = String((a.properties as { zone?: string; id?: string }).zone ?? (a.properties as { id?: string }).id ?? '')
      const bk = String((b.properties as { zone?: string; id?: string }).zone ?? (b.properties as { id?: string }).id ?? '')
      return (order[ak] ?? 99) - (order[bk] ?? 99)
    })
  }, [zones])

  const fallbackRadius = Math.max(riskRadiusM ?? 0, 7000)

  const parcelDot = useMemo(() => buildParcelDot(), [])
  const hiveBright = useMemo(() => buildHiveIcon(true), [])
  const hiveMuted = useMemo(() => buildHiveIcon(false), [])

  return (
    <div className="w-full rounded-[10px] overflow-hidden border border-hair" style={{ height }}>
      <MapContainer
        center={[lat, lng]}
        zoom={13}
        keyboard
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        {/* CartoDB Positron: minimal pale-gray base, lets the zone colors pop
            and matches the app's soft purple/honey palette. */}
        <TileLayer
          attribution='&copy; OpenStreetMap contributors &copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={19}
        />

        {/* AI risk zones — shape already encodes wind direction (ellipses for A2–A4). */}
        {orderedFeatures.map((feat, i) => {
          const zone = String((feat.properties as { zone?: string; id?: string }).zone ?? (feat.properties as { id?: string }).id ?? '')
          const style = ZONE_STYLE[zone] ?? ZONE_STYLE.A2
          return (
            <GeoJSON
              key={`${zone}-${i}`}
              data={feat as unknown as GeoJSON.Feature}
              style={() => style}
            />
          )
        })}

        {/* Notify boundary — the AI's risk_radius_m. Drawn as a dashed
            outline so apiaries between A1 and this boundary are seen as
            "still in the alert range" instead of looking orphaned. */}
        {typeof riskRadiusM === 'number' && riskRadiusM > 0 && (
          <Circle
            center={[lat, lng]}
            radius={riskRadiusM}
            pathOptions={{
              color: '#40288C',
              weight: 1.5,
              dashArray: '6 4',
              fill: false,
              opacity: 0.7,
            }}
          />
        )}

        {/* Hive markers: bright honey for "in zone" (will be notified),
            muted gray for "nearby but safe" (wind carries the cloud away). */}
        {apiaries?.map(a => (
          <Marker key={a.id} position={[a.lat, a.lng]} icon={a.in_zone ? hiveBright : hiveMuted}>
            <Tooltip direction="top" offset={[0, -28]} className="!bg-white !text-ink !text-[11px] !rounded-md !border !border-purple/20 !shadow !px-2 !py-1">
              <strong>{a.name}</strong> · {a.hive_count} stupi · {(a.distance_m / 1000).toFixed(1)} km
              {!a.in_zone && <div className="text-[10px] text-ink-muted mt-0.5">În afara direcției vântului</div>}
            </Tooltip>
          </Marker>
        ))}

        {/* Parcel center — clean purple dot. Wind chip lives below the map. */}
        <Marker position={[lat, lng]} icon={parcelDot} />

        <FitBounds zones={zones} lat={lat} lng={lng} fallbackRadiusM={fallbackRadius} />
      </MapContainer>
    </div>
  )
}
