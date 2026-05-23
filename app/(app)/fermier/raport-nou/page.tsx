'use client'
import { useCallback, useMemo, useState } from 'react'
import { RaportStropireForm, MOCK_AFFECTED, type RaportLiveValues } from '@/components/forms/RaportStropireForm'
import { RiskPreviewPanel } from '@/components/panels/RiskPreviewPanel'
import { useParcels } from '@/lib/api/queries'

export default function RaportNouPage() {
  const [live, setLive] = useState<RaportLiveValues>({ substance: '', parcel_id: '', toxicity: null })
  const { data: parcelsData } = useParcels()

  const onLiveValues = useCallback((v: RaportLiveValues) => setLive(v), [])

  const parcel = useMemo(() => {
    const p = parcelsData?.items.find(x => x.id === live.parcel_id)
    return p ? { name: p.name, lat: p.lat, lng: p.lng } : null
  }, [parcelsData, live.parcel_id])

  return (
    <div className="px-4 md:px-6 lg:px-8 py-4">
      <h1 className="text-xl font-bold text-ink mb-6">Raport stropire nouă</h1>
      <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-6 lg:items-start">
        <RaportStropireForm onLiveValues={onLiveValues} />
        <div className="hidden lg:block">
          <RiskPreviewPanel
            substance={live.substance}
            toxicity={live.toxicity}
            parcel={parcel}
            affected={MOCK_AFFECTED}
            disabled={!live.parcel_id}
          />
        </div>
      </div>
    </div>
  )
}
