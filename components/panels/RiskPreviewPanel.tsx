'use client'
import dynamic from 'next/dynamic'
import { Bell, MapPin, Navigation, Sparkles, TriangleAlert, ChevronDown, Info } from 'lucide-react'
import { useState } from 'react'
import { ToxBadge } from '@/components/ui/Badge'
import { useRiskPreview } from '@/lib/api/queries'
import type { Toxicity, RiskPreviewRequest } from '@/lib/api/types'

// react-leaflet wants window — load only on the client.
const RiskZonesMap = dynamic(() => import('./RiskZonesMap'), { ssr: false })

// Compass direction (8-point) from meteorological wind direction (FROM where wind blows)
const COMPASS = ['N', 'NE', 'E', 'SE', 'S', 'SV', 'V', 'NV']
function windCompass(deg: number) {
  return COMPASS[Math.round(deg / 45) % 8]
}

export interface RiskPreviewPanelProps {
  substance?: string
  toxicity?: Toxicity | null
  parcel?: { name: string; lat: number; lng: number } | null
  riskRequest?: RiskPreviewRequest | null
  onSubmit?: () => void
  submitting?: boolean
  disabled?: boolean
}

// Zone legend definitions — kept in sync with RiskZonesMap.ZONE_STYLE.
const ZONE_LEGEND: { id: string; fill: string; stroke: string; label: string }[] = [
  { id: 'A1', fill: '#E63946', stroke: '#9B1B26', label: 'baseline 7 km · alertă obligatorie' },
  { id: 'AW', fill: '#F4A261', stroke: '#B5621A', label: 'extensie vânt (downwind)' },
]

const SEVERITY_BG: Record<string, { bg: string; fg: string; label: string }> = {
  very_high: { bg: 'rgba(220,38,38,0.10)', fg: '#B91C1C', label: 'Risc foarte ridicat' },
  high: { bg: 'rgba(220,38,38,0.08)', fg: '#B91C1C', label: 'Risc ridicat' },
  medium: { bg: 'rgba(238,167,39,0.12)', fg: '#92400E', label: 'Risc moderat' },
  low: { bg: 'rgba(22,163,74,0.10)', fg: '#166534', label: 'Risc scăzut' },
}

export function RiskPreviewPanel({
  substance,
  toxicity,
  parcel,
  riskRequest,
  onSubmit,
  submitting,
  disabled,
}: RiskPreviewPanelProps) {
  const { data: preview, isFetching, error } = useRiskPreview(riskRequest ?? null)
  const [showWarnings, setShowWarnings] = useState(true)

  const severity = preview?.severity ?? null
  const severityStyle = severity ? SEVERITY_BG[severity] ?? SEVERITY_BG.medium : null

  return (
    <aside
      aria-label="Previzualizare risc AI"
      className="lg:sticky lg:top-20 bg-white rounded-[16px] border border-hair-soft p-4 space-y-4"
    >
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-purple">
          În raza alertei
        </p>
        {isFetching && (
          <span className="flex items-center gap-1 text-[10.5px] text-purple/70">
            <span className="w-2.5 h-2.5 rounded-full border border-purple/40 border-t-transparent animate-spin" aria-hidden />
            Calculează AI…
          </span>
        )}
      </div>

      {/* Leaflet map with A1 baseline circle + downwind cone, plus all nearby
          hives styled by in_zone status (bright = will notify, muted = safe). */}
      {parcel ? (
        <RiskZonesMap
          lat={parcel.lat}
          lng={parcel.lng}
          zones={preview?.zones ?? null}
          riskRadiusM={preview?.risk_radius_m ?? null}
          apiaries={preview?.nearby_apiaries ?? []}
          height={240}
        />
      ) : (
        <div
          className="w-full rounded-[10px] bg-hair-soft flex items-center justify-center text-ink-muted text-[12px]"
          style={{ height: 240 }}
        >
          <span className="flex items-center gap-1.5">
            <MapPin size={14} className="text-ink-muted" />
            Selectează o parcelă
          </span>
        </div>
      )}

      {/* Wind chip — moved OUT of the map so it doesn't compete with zones.
          Big Lucide Navigation arrow rotates to point downwind (drift). */}
      {preview && (
        <div className="flex items-center gap-3 rounded-[12px] px-3 py-2.5 bg-purple/[0.06] border border-purple/15">
          <div
            className="shrink-0 w-9 h-9 rounded-full bg-white border border-purple/25 flex items-center justify-center"
            style={{ transform: `rotate(${(preview.wind_direction_deg + 180) % 360}deg)` }}
            aria-hidden
          >
            <Navigation size={18} className="text-purple" fill="currentColor" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.06em] text-purple">Vânt</p>
            <p className="text-[13px] text-ink leading-tight">
              Dinspre <strong>{windCompass(preview.wind_direction_deg)}</strong>
              {' · '}<strong>{preview.wind_speed_kmh.toFixed(0)}</strong> km/h
            </p>
          </div>
          <span className="text-[10.5px] text-ink-muted leading-tight text-right">
            zonele marcate de AI<br />sunt aliniate<br />pe vânt
          </span>
        </div>
      )}

      {/* Zone legend — only shows the zones the AI actually returned for this
          scenario, plus the dashed notify-boundary outline (the practical
          alert radius, which may extend beyond the visible zones). */}
      {parcel && preview?.zones?.features?.length ? (() => {
        const present = new Set(
          preview.zones.features.map(f => String((f.properties as { zone?: string; id?: string }).zone ?? (f.properties as { id?: string }).id ?? ''))
        )
        const items = ZONE_LEGEND.filter(z => present.has(z.id))
        return (
          <div className="space-y-1">
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10.5px] text-ink-muted">
              {items.map(z => (
                <span key={z.id} className="flex items-center gap-1">
                  <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: z.fill, border: `1px solid ${z.stroke}` }} />
                  {z.id} · {z.label}
                </span>
              ))}
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-0 border-t-[1.5px] border-dashed border-purple" />
                Rază alertă · {(preview.risk_radius_m / 1000).toFixed(1)} km
              </span>
            </div>
            {!present.has('AW') && (
              <p className="text-[10.5px] text-ink-muted leading-snug">
                Vântul nu extinde semnificativ zona — alerta se rezumă la baseline-ul de 7 km.
              </p>
            )}
          </div>
        )
      })() : null}

      {/* Substance + toxicity */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[12.5px] text-ink-soft font-medium truncate">
          {substance || 'Substanță neselectată'}
        </span>
        {toxicity && <ToxBadge toxicity={toxicity} />}
      </div>

      {/* AI risk score + radius */}
      {preview && severityStyle && (
        <div
          className="rounded-xl px-3 py-2.5 text-[13px] font-medium flex items-center justify-between gap-2"
          style={{ background: severityStyle.bg, color: severityStyle.fg }}
        >
          <span className="flex items-center gap-1.5">
            <Sparkles size={14} aria-hidden />
            <strong>{severityStyle.label}</strong>
          </span>
          <span className="text-[12px]">
            Scor <strong>{preview.risk_score.toFixed(2)}</strong> · {(preview.risk_radius_m / 1000).toFixed(1)} km
          </span>
        </div>
      )}

      {/* AI explanation */}
      {preview?.explanation_ro && (
        <div className="rounded-xl bg-purple/[0.04] border border-purple/15 p-3 space-y-2">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.06em] text-purple flex items-center gap-1">
            <Sparkles size={11} /> Analiză AI
          </p>
          <p className="text-[12.5px] text-ink leading-relaxed">
            {preview.explanation_ro}
          </p>
          {preview.recommended_action && (
            <p className="text-[12px] text-ink-soft leading-relaxed pt-1 border-t border-purple/10">
              <strong className="text-purple">Recomandare:</strong> {preview.recommended_action}
            </p>
          )}
        </div>
      )}

      {/* AI warnings */}
      {preview?.warnings && preview.warnings.length > 0 && (
        <div className="rounded-xl bg-pollen/15 border border-honey/25 p-3 space-y-2">
          <button
            type="button"
            onClick={() => setShowWarnings(s => !s)}
            className="w-full flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.06em] text-honey-deep"
            aria-expanded={showWarnings}
          >
            <span className="flex items-center gap-1.5">
              <TriangleAlert size={12} /> {preview.warnings.length} avertismente
            </span>
            <ChevronDown size={14} className={`transition-transform ${showWarnings ? 'rotate-180' : ''}`} aria-hidden />
          </button>
          {showWarnings && (
            <ul className="text-[12px] text-honey-deep space-y-1.5 leading-snug list-disc pl-4">
              {preview.warnings.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          )}
        </div>
      )}

      {/* Affected count (only after AI computed it) */}
      {preview ? (
        <div className="rounded-xl bg-white border border-hair px-3 py-2.5 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-purple">Apicultori în raza</span>
          <span className="text-[18px] font-bold text-ink tabular-nums">{preview.affected_apiaries}</span>
        </div>
      ) : (
        <div className="space-y-1.5">
          <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-purple">
            Apicultori în raza
          </p>
          <p className="text-[12.5px] text-ink-muted leading-snug flex items-start gap-1.5">
            <Info size={12} className="mt-0.5 shrink-0" aria-hidden />
            {riskRequest ? 'Se calculează…' : 'Completează formularul pentru previzualizare AI.'}
          </p>
        </div>
      )}

      {error && (
        <p className="text-[11.5px] text-alert">
          Nu s-a putut calcula riscul AI. Verifică serviciul AI și reîncearcă.
        </p>
      )}

      {/* Submit — references the form by id so RHF handles validation */}
      <button
        type="submit"
        form="raport-stropire-form"
        onClick={onSubmit}
        disabled={submitting || disabled}
        className="w-full h-11 rounded-[12px] bg-purple text-white font-bold text-[14px] flex items-center justify-center gap-2 hover:bg-purple-soft transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <span
            className="w-4 h-4 rounded-full border-2 border-white border-t-transparent"
            style={{ animation: 'spin 0.7s linear infinite' }}
          />
        ) : (
          <>
            <Bell size={15} />
            Notifică toți
          </>
        )}
      </button>
    </aside>
  )
}
