'use client'
import { useAuth } from '@/lib/hooks/useAuth'
import { useInspectorMapData, useDamageClaims } from '@/lib/api/queries'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { formatDate } from '@/lib/format'
import { Spinner } from '@/components/feedback/Spinner'

// ── SectionHeader ─────────────────────────────────────────────────────────────

function SectionHeader({ label, href, linkLabel }: { label: string; href?: string; linkLabel?: string }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.06em] text-purple">{label}</h2>
      {href && (
        <Link href={href} className="text-[12px] font-semibold text-purple hover:text-purple-soft transition-colors">
          {linkLabel ?? 'Toate →'}
        </Link>
      )}
    </div>
  )
}

// ── InspectorMiniMap ──────────────────────────────────────────────────────────
// Real OSM tile grid with accurately-positioned markers.

const STATUS_DOT: Record<string, string> = { safe: '#16A34A', warning: '#EEA727', danger: '#DC2626' }

function latLngToFloat(lat: number, lng: number, z: number) {
  const scale = Math.pow(2, z)
  const xF = (lng + 180) / 360 * scale
  const latRad = lat * Math.PI / 180
  const yF = (1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * scale
  return { xF, yF }
}

interface MiniMapMarker { lat: number; lng: number; color: string; size: number; border?: string }

function InspectorMiniMap({
  apiaries, sprays, damages,
}: {
  apiaries: { id: string; lat: number; lng: number; status: string }[]
  sprays:   { id: string; lat: number; lng: number }[]
  damages:  { id: string; lat: number; lng: number }[]
}) {
  const zoom = 12
  const centerLat = 46.77; const centerLng = 23.59
  const cF = latLngToFloat(centerLat, centerLng, zoom)
  const cTx = Math.floor(cF.xF); const cTy = Math.floor(cF.yF)
  const cOx = (cF.xF % 1) * 256; const cOy = (cF.yF % 1) * 256

  const tiles: { x: number; y: number; left: number; top: number }[] = []
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      tiles.push({ x: cTx + dx, y: cTy + dy, left: (dx + 1) * 256, top: (dy + 1) * 256 })
    }
  }

  function markerStyle(lat: number, lng: number): { left: string; top: string } {
    const mF = latLngToFloat(lat, lng, zoom)
    const px = Math.round((mF.xF - cF.xF) * 256)
    const py = Math.round((mF.yF - cF.yF) * 256)
    return { left: `calc(50% + ${px}px)`, top: `calc(50% + ${py}px)` }
  }

  return (
    <div className="w-full rounded-[12px] overflow-hidden border border-hair-soft" style={{ height: 130 }}>
      <div className="relative bg-[#aad3df] overflow-hidden" style={{ height: 100, pointerEvents: 'none', userSelect: 'none' }}>
        {/* Tile grid — entire container pointer-events:none so scroll passes through */}
        <div style={{
          position: 'absolute', width: 768, height: 768,
          left: `calc(50% - ${Math.round(256 + cOx)}px)`,
          top: `calc(50% - ${Math.round(256 + cOy)}px)`,
        }}>
          {tiles.map(t => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={`${t.x},${t.y}`}
              src={`https://tile.openstreetmap.org/${zoom}/${t.x}/${t.y}.png`}
              alt="" width={256} height={256}
              style={{ position: 'absolute', left: t.left, top: t.top }}
            />
          ))}
        </div>

        {/* Apiary markers */}
        {apiaries.map(a => (
          <div key={a.id} aria-hidden style={{
            position: 'absolute', ...markerStyle(a.lat, a.lng),
            transform: 'translate(-50%, -50%)',
            width: 14, height: 14, borderRadius: '50%',
            background: STATUS_DOT[a.status] ?? '#7A6F90',
            border: '2.5px solid white',
            boxShadow: '0 1px 4px rgba(0,0,0,0.35)',
          }} />
        ))}

        {/* Spray markers */}
        {sprays.map(s => (
          <div key={s.id} aria-hidden style={{
            position: 'absolute', ...markerStyle(s.lat, s.lng),
            transform: 'translate(-50%, -50%)',
            width: 10, height: 10, borderRadius: '50%',
            background: '#DC2626', border: '2px solid white',
            boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
          }} />
        ))}

        {/* Damage markers */}
        {damages.map(d => (
          <div key={d.id} aria-hidden style={{
            position: 'absolute', ...markerStyle(d.lat, d.lng),
            transform: 'translate(-50%, -50%)',
            width: 8, height: 8, borderRadius: '50%',
            background: '#7A6F90', border: '1.5px solid white',
          }} />
        ))}
      </div>

      {/* Legend strip */}
      <div className="flex items-center gap-4 px-3 py-2 bg-white border-t border-hair-soft">
        <span className="flex items-center gap-1.5 text-[10px] font-semibold text-ink-soft">
          <span className="w-2.5 h-2.5 rounded-full bg-safe border-2 border-white shrink-0" style={{ boxShadow: '0 0 0 1px #16A34A' }} />
          Stupine
        </span>
        <span className="flex items-center gap-1.5 text-[10px] font-semibold text-ink-soft">
          <span className="w-2.5 h-2.5 rounded-full bg-alert border-2 border-white shrink-0" style={{ boxShadow: '0 0 0 1px #DC2626' }} />
          Stropiri
        </span>
        <span className="flex items-center gap-1.5 text-[10px] font-semibold text-ink-soft">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: '#7A6F90', boxShadow: '0 0 0 1px #7A6F90' }} />
          Pagube
        </span>
      </div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function InspectorPage() {
  const { user } = useAuth()
  const { data: mapData, isLoading: isLoadingMap } = useInspectorMapData()
  const { data: damagesData, isLoading: isLoadingDamages } = useDamageClaims()

  const activeApiaries = mapData?.apiaries?.length ?? 0
  const activeSprays = mapData?.active_sprays?.length ?? 0
  const damages = mapData?.damage_claims?.length ?? 0
  const damageClaims = damagesData?.items ?? []

  // Week number
  const weekNum = Math.ceil((new Date().getDate() + new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay()) / 7)

  return (
    <div className="px-4 md:px-6 lg:px-8 py-5 space-y-7">

      {/* ── Header ── */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-purple mb-1">
          Inspector {user?.full_name}
        </p>
        <h1 className="text-[22px] font-bold text-ink tracking-[-0.02em] leading-tight">
          Județul {user?.county} · Săptămâna {weekNum}
        </h1>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <div className="bg-white rounded-[16px] p-3 border border-hair-soft text-center" aria-label={`${isLoadingMap ? '—' : activeApiaries} stupine active în județ`}>
          <p className="text-[26px] font-bold text-purple tracking-[-0.02em] leading-none">{isLoadingMap ? '—' : activeApiaries}</p>
          <p className="text-[11px] font-semibold text-ink-soft mt-1">Stupine active</p>
          <p className="text-[10px] text-ink-muted">în județ</p>
        </div>
        <div className="bg-white rounded-[16px] p-3 border border-hair-soft text-center" aria-label={`${isLoadingMap ? '—' : activeSprays} stropiri săptămâna asta`}>
          <p className="text-[26px] font-bold text-honey tracking-[-0.02em] leading-none">{isLoadingMap ? '—' : activeSprays}</p>
          <p className="text-[11px] font-semibold text-ink-soft mt-1">Stropiri</p>
          <p className="text-[10px] text-ink-muted">săpt. asta</p>
        </div>
        <div className="bg-white rounded-[16px] p-3 border border-hair-soft text-center" aria-label={`${isLoadingMap ? '—' : damages} pagube raportate`}>
          <p className="text-[26px] font-bold text-alert tracking-[-0.02em] leading-none">{isLoadingMap ? '—' : damages}</p>
          <p className="text-[11px] font-semibold text-ink-soft mt-1">Pagube</p>
          <p className="text-[10px] text-ink-muted">raportate</p>
        </div>
      </div>

      {/* ── Mini map ── */}
      <section>
        <SectionHeader label="Hartă activitate" href="/inspector/harta" linkLabel="Hartă completă →" />
        <InspectorMiniMap
          apiaries={mapData?.apiaries ?? []}
          sprays={mapData?.active_sprays ?? []}
          damages={mapData?.damage_claims ?? []}
        />
      </section>

      {/* ── Damage claims preview ── */}
      <section>
        <SectionHeader
          label="Pagube de revizuit"
          href="/inspector/pagube"
          linkLabel={damages > 0 ? `Toate (${damages}) →` : 'Toate →'}
        />
        {isLoadingDamages ? (
          <div className="flex justify-center py-6">
            <Spinner size="sm" label="Se încarcă pagubele..." />
          </div>
        ) : damageClaims.length === 0 ? (
          <p className="text-center text-[13px] text-ink-muted py-4">Nicio cerere de pagubă.</p>
        ) : (
          <ul role="list" className="space-y-3">
            {damageClaims.slice(0, 3).map(claim => (
              <li key={claim.id} role="listitem">
                <Link href="/inspector/pagube" aria-label={`Vezi paguba: ${claim.description || 'Pagubă raportată'} — ${claim.hive_loss_count} stupi morți`}>
                  <div className="bg-white rounded-[14px] p-3.5 mb-2 flex items-center gap-3 hover:shadow-sm transition-shadow border border-hair-soft">
                    {/* Photo placeholder */}
                    <div className="w-11 h-11 rounded-[10px] bg-hair-soft flex items-center justify-center shrink-0">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                        <rect x="2" y="4" width="16" height="13" rx="2" fill="#7A6F90" fillOpacity="0.3" />
                        <circle cx="10" cy="10" r="3" fill="#7A6F90" fillOpacity="0.4" />
                        <path d="M2 8 L6 6 L10 9 L14 6 L18 8" stroke="#7A6F90" strokeWidth="0.8" strokeOpacity="0.4" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-ink text-[13.5px] truncate leading-snug">
                        {claim.description || 'Pagubă raportată'}
                      </p>
                      <p className="text-[11.5px] text-ink-muted mt-0.5">
                        {claim.hive_loss_count} stupi morți · {formatDate(claim.created_at)}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] font-mono text-ink-muted bg-hair-soft px-1.5 py-0.5 rounded">
                          #{claim.ledger_hash.slice(0, 7)}
                        </span>
                        <span
                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                          style={{ background: 'rgba(238,167,39,0.15)', color: '#92400E' }}
                        >
                          Toxicitate medie
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-ink-muted shrink-0" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
