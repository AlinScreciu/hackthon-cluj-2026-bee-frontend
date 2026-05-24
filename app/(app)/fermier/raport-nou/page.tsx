'use client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { RaportStropireForm, type RaportLiveValues } from '@/components/forms/RaportStropireForm'
import { RiskPreviewPanel } from '@/components/panels/RiskPreviewPanel'
import { useParcels } from '@/lib/api/queries'
import type { RiskPreviewRequest } from '@/lib/api/types'

const INITIAL_LIVE: RaportLiveValues = {
  substance: '', parcel_id: '', toxicity: null,
  surface_ha: null, dose_kg_ha: null, crop: '',
  scheduled_at: '', duration_hours: null,
}

export default function RaportNouPage() {
  const [live, setLive] = useState<RaportLiveValues>(INITIAL_LIVE)
  const { data: parcelsData } = useParcels()

  const onLiveValues = useCallback((v: RaportLiveValues) => setLive(v), [])

  const parcel = useMemo(() => {
    const p = parcelsData?.items.find(x => x.id === live.parcel_id)
    return p ? { name: p.name, lat: p.lat, lng: p.lng } : null
  }, [parcelsData, live.parcel_id])

  // Debounce the risk-preview trigger by 400ms so we don't hit the AI on
  // every keystroke. Only fire when the form has the minimum viable fields.
  const [debouncedReq, setDebouncedReq] = useState<RiskPreviewRequest | null>(null)
  useEffect(() => {
    const ready =
      !!live.parcel_id &&
      !!live.substance &&
      !!live.crop &&
      typeof live.surface_ha === 'number' && live.surface_ha > 0 &&
      typeof live.dose_kg_ha === 'number' && live.dose_kg_ha > 0 &&
      typeof live.duration_hours === 'number' && live.duration_hours > 0 &&
      !!live.scheduled_at
    if (!ready) { setDebouncedReq(null); return }
    const t = setTimeout(() => {
      setDebouncedReq({
        parcel_id: live.parcel_id,
        surface_ha: live.surface_ha!,
        dose_kg_ha: live.dose_kg_ha!,
        crop: live.crop,
        substance: live.substance,
        scheduled_at: new Date(live.scheduled_at).toISOString(),
        duration_hours: live.duration_hours!,
      })
    }, 400)
    return () => clearTimeout(t)
  }, [live])

  return (
    <div className="px-4 md:px-6 lg:px-8 py-4">
      <h1 className="text-xl font-bold text-ink mb-6">Raport stropire nouă</h1>
      <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-6 lg:items-start">
        <RaportStropireForm onLiveValues={onLiveValues} />
        <div className="mt-6 lg:mt-0">
          <RiskPreviewPanel
            substance={live.substance}
            toxicity={live.toxicity}
            parcel={parcel}
            riskRequest={debouncedReq}
            disabled={!live.parcel_id}
          />
        </div>
      </div>
    </div>
  )
}
