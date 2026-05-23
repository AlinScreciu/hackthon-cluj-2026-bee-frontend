'use client'
import { useAuth } from '@/lib/hooks/useAuth'
import { useInspectorMapData, useDamageClaims } from '@/lib/api/queries'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { formatDate } from '@/lib/format'

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

function InspectorMiniMap({ sprayCount, apiaryCount }: { sprayCount: number; apiaryCount: number }) {
  return (
    <div className="w-full rounded-[12px] overflow-hidden border border-hair-soft" style={{ height: 120 }}>
      <svg width="100%" height="120" viewBox="0 0 340 120" preserveAspectRatio="xMidYMid slice">
        {/* Background */}
        <rect width="340" height="120" fill="#e8f0e5" />

        {/* Road */}
        <path d="M0 78 Q80 72 170 70 Q250 68 340 64" stroke="#c8d5c4" strokeWidth="6" fill="none" strokeLinecap="round" />

        {/* Field polygons */}
        <polygon points="30,20 90,12 130,30 125,65 75,70 30,55" fill="#EEA727" fillOpacity="0.18" stroke="#EEA727" strokeWidth="1" strokeDasharray="4,3" />
        <polygon points="160,18 220,10 255,30 250,60 195,65 160,50" fill="#40288C" fillOpacity="0.10" stroke="#40288C" strokeWidth="1" strokeDasharray="4,3" />
        <polygon points="260,40 310,32 335,55 330,80 275,82 255,65" fill="#EEA727" fillOpacity="0.14" stroke="#EEA727" strokeWidth="1" strokeDasharray="4,3" />

        {/* Spray risk circles */}
        <circle cx="90" cy="40" r="28" fill="#DC2626" fillOpacity="0.10" stroke="#DC2626" strokeWidth="1" strokeDasharray="3,2" />
        <circle cx="190" cy="35" r="22" fill="#EEA727" fillOpacity="0.12" stroke="#EEA727" strokeWidth="1" strokeDasharray="3,2" />

        {/* Spray origins */}
        <circle cx="90" cy="40" r="5" fill="#DC2626" fillOpacity="0.85" />
        <circle cx="90" cy="40" r="2.5" fill="white" />
        <circle cx="190" cy="35" r="4" fill="#EEA727" fillOpacity="0.9" />
        <circle cx="190" cy="35" r="2" fill="white" />

        {/* Apiaries */}
        <circle cx="155" cy="55" r="7" fill="#FFEF5F" stroke="#40288C" strokeWidth="1.5" />
        <circle cx="155" cy="55" r="3" fill="#40288C" />
        <circle cx="270" cy="60" r="7" fill="#FFEF5F" stroke="#40288C" strokeWidth="1.5" />
        <circle cx="270" cy="60" r="3" fill="#40288C" />
        <circle cx="60" cy="80" r="7" fill="#FFEF5F" stroke="#16A34A" strokeWidth="1.5" />
        <circle cx="60" cy="80" r="3" fill="#16A34A" />

        {/* Wind indicator top-left */}
        <text x="12" y="18" fill="#40288C" fontSize="9" fontWeight="700" fontFamily="system-ui">NV · 12 km/h</text>
        <line x1="12" y1="22" x2="55" y2="22" stroke="#40288C" strokeWidth="0.8" strokeDasharray="2,2" strokeOpacity="0.4" />

        {/* Compass */}
        <text x="322" y="18" fill="#40288C" fontSize="9" fontWeight="700" textAnchor="middle" fontFamily="system-ui">N</text>
        <polygon points="322,8 319,17 325,17" fill="#40288C" />
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-4 px-3 py-2 bg-white border-t border-hair-soft">
        <span className="flex items-center gap-1.5 text-[10px] font-semibold text-ink-soft">
          <span className="w-2 h-2 rounded-full bg-pollen border border-ink/20 shrink-0" />
          Stupine
        </span>
        <span className="flex items-center gap-1.5 text-[10px] font-semibold text-ink-soft">
          <span className="w-2 h-2 rounded-full border-2 border-alert shrink-0" />
          Stropiri active
        </span>
        <span className="flex items-center gap-1.5 text-[10px] font-semibold text-ink-soft">
          <span className="w-2 h-2 rounded-full border border-ink-muted shrink-0" />
          Pagube
        </span>
      </div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function InspectorPage() {
  const { user } = useAuth()
  const { data: mapData } = useInspectorMapData()
  const { data: damagesData } = useDamageClaims()

  const activeApiaries = mapData?.apiaries?.length ?? 0
  const activeSprays = mapData?.active_sprays?.length ?? 0
  const damages = mapData?.damage_claims?.length ?? 0
  const damageClaims = damagesData?.items ?? []

  // Week number
  const weekNum = Math.ceil((new Date().getDate() + new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay()) / 7)

  return (
    <div className="px-4 py-5 space-y-7">

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
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white rounded-[16px] p-3 border border-hair-soft text-center">
          <p className="text-[26px] font-bold text-purple tracking-[-0.02em] leading-none">{activeApiaries}</p>
          <p className="text-[11px] font-semibold text-ink-soft mt-1">Stupine active</p>
          <p className="text-[10px] text-ink-muted">în județ</p>
        </div>
        <div className="bg-white rounded-[16px] p-3 border border-hair-soft text-center">
          <p className="text-[26px] font-bold text-honey tracking-[-0.02em] leading-none">{activeSprays}</p>
          <p className="text-[11px] font-semibold text-ink-soft mt-1">Stropiri</p>
          <p className="text-[10px] text-ink-muted">săpt. asta</p>
        </div>
        <div className="bg-white rounded-[16px] p-3 border border-hair-soft text-center">
          <p className="text-[26px] font-bold text-alert tracking-[-0.02em] leading-none">{damages}</p>
          <p className="text-[11px] font-semibold text-ink-soft mt-1">Pagube</p>
          <p className="text-[10px] text-ink-muted">raportate</p>
        </div>
      </div>

      {/* ── Mini map ── */}
      <section>
        <SectionHeader label="Hartă activitate" href="/inspector/harta" linkLabel="Hartă completă →" />
        <InspectorMiniMap sprayCount={activeSprays} apiaryCount={activeApiaries} />
      </section>

      {/* ── Damage claims preview ── */}
      <section>
        <SectionHeader
          label="Pagube de revizuit"
          href="/inspector/pagube"
          linkLabel={damages > 0 ? `Toate (${damages}) →` : 'Toate →'}
        />
        {damageClaims.length === 0 ? (
          <p className="text-center text-[13px] text-ink-muted py-4">Nicio cerere de pagubă.</p>
        ) : (
          <div className="space-y-3">
            {damageClaims.slice(0, 3).map(claim => (
              <Link key={claim.id} href="/inspector/pagube">
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
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
