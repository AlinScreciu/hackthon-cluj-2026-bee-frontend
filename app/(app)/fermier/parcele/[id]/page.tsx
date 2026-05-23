'use client'
import { use } from 'react'
import { useParcels, useSprayReports } from '@/lib/api/queries'
import { Spinner } from '@/components/feedback/Spinner'
import { ToxBadge, StatusBadge } from '@/components/ui/Badge'
import { formatHa, formatDate } from '@/lib/format'
import Link from 'next/link'
import { ChevronLeft, MapPin, FileText, ChevronRight } from 'lucide-react'

export default function ParcelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: parcelsData, isLoading: loadingParcels } = useParcels()
  const { data: reportsData, isLoading: loadingReports } = useSprayReports()

  if (loadingParcels) return <Spinner size="lg" className="py-12 mx-auto" />

  const parcel = parcelsData?.items.find(p => p.id === id)
  if (!parcel) return <p className="text-center py-12 text-ink-muted">Parcela nu a fost găsită.</p>

  const relatedReports = (reportsData?.items ?? []).filter(r => r.parcel_id === id)

  return (
    <div className="px-4 md:px-6 lg:px-8 py-4">
      <Link
        href="/fermier/parcele"
        className="inline-flex items-center gap-1 text-purple text-sm font-medium mb-4"
        aria-label="Înapoi la parcele"
      >
        <ChevronLeft size={18} /> Înapoi la parcele
      </Link>

      <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-6 lg:items-start">
        <div className="bg-white rounded-[16px] border border-hair-soft p-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-hair-soft flex items-center justify-center shrink-0" aria-hidden>
              <MapPin size={18} className="text-purple" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-[17px] font-bold text-ink leading-snug">{parcel.name}</h1>
              <p className="text-[13px] text-ink-muted mt-0.5">{parcel.locality} · {parcel.county}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
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

        <div className="mt-4 lg:mt-0 lg:sticky lg:top-20">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.06em] text-purple">Rapoarte stropire</h2>
            <Link href="/fermier/raport-nou" className="text-[12px] font-semibold text-purple hover:text-purple-soft transition-colors">
              + Nou
            </Link>
          </div>
          {loadingReports ? (
            <Spinner size="sm" className="py-4 mx-auto" />
          ) : relatedReports.length === 0 ? (
            <div className="bg-white rounded-[16px] border border-hair-soft p-5 text-center">
              <FileText size={24} className="text-ink-muted mx-auto mb-2 opacity-40" aria-hidden />
              <p className="text-[13px] text-ink-muted">Nicio stropire pe această parcelă încă.</p>
              <Link
                href="/fermier/raport-nou"
                className="text-purple text-[13px] font-semibold mt-2 inline-block hover:text-purple-soft transition-colors"
              >
                Anunță o stropire
              </Link>
            </div>
          ) : (
            <ul className="space-y-3" role="list">
              {relatedReports.map(r => (
                <li key={r.id} role="listitem">
                  <Link href={`/fermier/rapoarte/${r.id}`}>
                    <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
                      <FileText size={20} className="text-ink-muted shrink-0" aria-hidden />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-ink truncate">{r.parcel.name}</p>
                        <p className="text-sm text-ink-muted">{formatDate(r.scheduled_at)} · {r.crop}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <ToxBadge toxicity={r.toxicity} />
                        <StatusBadge status={r.status} />
                        <ChevronRight size={14} className="text-ink-muted" />
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
