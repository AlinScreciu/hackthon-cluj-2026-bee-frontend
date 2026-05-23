'use client'
import { Bell, MapPin } from 'lucide-react'
import { ToxBadge } from '@/components/ui/Badge'
import { RiskMapPreview } from '@/components/alerts/BzzBzzCard'
import { RISK_RADIUS } from '@/components/forms/RaportStropireForm'
import type { Toxicity } from '@/lib/api/types'

export interface RiskPreviewPanelProps {
  substance?: string
  toxicity?: Toxicity | null
  parcel?: { name: string; lat: number; lng: number } | null
  affected: string[]
  onSubmit?: () => void
  submitting?: boolean
  disabled?: boolean
}

export function RiskPreviewPanel({
  substance,
  toxicity,
  parcel,
  affected,
  onSubmit,
  submitting,
  disabled,
}: RiskPreviewPanelProps) {
  return (
    <aside
      aria-label="Previzualizare risc"
      className="lg:sticky lg:top-20 bg-white rounded-[16px] border border-hair-soft p-4 space-y-4"
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-purple">
        În raza alertei
      </p>

      {/* Map preview */}
      {parcel ? (
        <RiskMapPreview
          apiaryLat={parcel.lat}
          apiaryLng={parcel.lng}
          sprayLat={parcel.lat}
          sprayLng={parcel.lng}
        />
      ) : (
        <div
          className="w-full rounded-[10px] bg-hair-soft flex items-center justify-center text-ink-muted text-[12px]"
          style={{ height: 110 }}
        >
          <span className="flex items-center gap-1.5">
            <MapPin size={14} className="text-ink-muted" />
            Selectează o parcelă
          </span>
        </div>
      )}

      {/* Toxicity + radius */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[12px] text-ink-soft font-medium truncate">
            {substance || 'Substanță neselectată'}
          </span>
          {toxicity && <ToxBadge toxicity={toxicity} />}
        </div>
        {toxicity && (
          <div
            className="rounded-xl px-3 py-2 text-[13px] font-medium"
            style={
              toxicity === 'T+' ? { background: 'rgba(220,38,38,0.08)', color: '#B91C1C' } :
                toxicity === 'T' ? { background: 'rgba(238,167,39,0.10)', color: '#92400E' } :
                  { background: 'rgba(22,163,74,0.08)', color: '#166534' }
            }
          >
            Raza de risc: <strong>{RISK_RADIUS[toxicity]}</strong>
          </div>
        )}
      </div>

      {/* Affected list */}
      <div className="space-y-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-purple">
          Apicultori în raza · {affected.length}
        </p>
        {affected.length === 0 &&
          <p className="text-[12.5px] text-ink-muted">Niciun apicultor în raza estimată.</p>
        }
      </div>

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
