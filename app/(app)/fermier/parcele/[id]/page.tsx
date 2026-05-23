'use client'
import { use } from 'react'
import { useParcels, useSprayReports } from '@/lib/api/queries'
import { Spinner } from '@/components/feedback/Spinner'
import { ToxBadge, StatusBadge } from '@/components/ui/Badge'
import { LedgerChip } from '@/components/feedback/LedgerChip'
import { formatHa, formatDate } from '@/lib/format'
import { useRouter } from 'next/navigation'
import { ChevronLeft, MapPin, Layers, Calendar, FileText } from 'lucide-react'
import Link from 'next/link'

export default function ParcelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { data: parcelsData, isLoading: loadingParcels } = useParcels()
  const { data: reportsData, isLoading: loadingReports } = useSprayReports()

  if (loadingParcels) return <Spinner size="lg" className="py-12 mx-auto" />

  const parcel = parcelsData?.items.find(p => p.id === id)
  if (!parcel) return <p className="text-center py-12 text-ink-muted">Parcela nu a fost găsită.</p>

  const relatedReports = (reportsData?.items ?? []).filter(r => r.parcel_id === id)

  return (
    <div className="px-4 md:px-6 lg:px-8 py-4 space-y-4">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-purple text-[13px] font-semibold"
        aria-label="Înapoi la parcele"
      >
        <ChevronLeft size={16} /> Înapoi
      </button>

      {/* Parcel card */}
      <div className="bg-white rounded-[16px] p-4 border border-hair-soft">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0" style={{ background: 'rgba(238,167,39,0.12)' }}>
            <MapPin size={18} className="text-pollen" aria-hidden />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-[17px] font-bold text-ink leading-snug">{parcel.name}</h1>
            <p className="text-[13px] text-ink-muted mt-0.5">{parcel.locality} · {parcel.county}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-hair-soft rounded-xl p-3">
            <p className="text-ink-muted text-[11px]">Suprafață</p>
            <p className="font-semibold text-ink text-[14px] mt-0.5">{formatHa(parcel.surface_ha)}</p>
          </div>
          <div className="bg-hair-soft rounded-xl p-3">
            <p className="text-ink-muted text-[11px]">Cultură</p>
            <p className="font-semibold text-ink text-[14px] mt-0.5">{parcel.default_crop ?? '—'}</p>
          </div>
          <div className="bg-hair-soft rounded-xl p-3 col-span-2">
            <p className="text-ink-muted text-[11px]">Număr cadastral</p>
            <p className="font-mono font-semibold text-ink text-[13px] mt-0.5">{parcel.cadastral_number}</p>
          </div>
        </div>
      </div>

      {/* Spray reports for this parcel */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.06em] text-purple">Rapoarte stropire</h2>
          <Link href="/fermier/raport-nou" className="text-[12px] font-semibold text-purple hover:text-purple-soft transition-colors">
            + Nou
          </Link>
        </div>
        {loadingReports ? (
          <Spinner size="sm" className="py-4 mx-auto" />
        ) : relatedReports.length === 0 ? (
          <div className="bg-white rounded-[14px] p-5 border border-hair-soft text-center">
            <Layers size={24} className="text-ink-muted mx-auto mb-2 opacity-40" aria-hidden />
            <p className="text-[13px] text-ink-muted">Niciun raport pentru această parcelă.</p>
          </div>
        ) : (
          <ul className="space-y-3" role="list">
            {relatedReports.map(r => (
              <li key={r.id} role="listitem">
                <Link href={`/fermier/rapoarte/${r.id}`} className="flex bg-white rounded-[14px] p-3.5 border border-hair-soft hover:shadow-sm transition-shadow items-center gap-3">
                  <div className="w-9 h-9 rounded-[10px] bg-hair-soft flex items-center justify-center shrink-0">
                    <FileText size={16} className="text-purple-soft" aria-hidden />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-ink text-[13.5px] truncate">{r.substance} · {formatHa(r.surface_ha)}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Calendar size={10} className="text-ink-muted" aria-hidden />
                      <p className="text-[11.5px] text-ink-muted">{formatDate(r.scheduled_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <ToxBadge toxicity={r.toxicity} />
                    <StatusBadge status={r.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
