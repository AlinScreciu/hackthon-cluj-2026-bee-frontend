'use client'
import { useSprayReports, useParcels } from '@/lib/api/queries'
import { useAuth } from '@/lib/hooks/useAuth'
import Link from 'next/link'
import { Plus, FileText } from 'lucide-react'
import { LuTriangleAlert } from 'react-icons/lu'
import { ToxBadge, StatusBadge } from '@/components/ui/Badge'
import { Spinner } from '@/components/feedback/Spinner'
import { formatDate, formatDateTime } from '@/lib/format'

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

// ── ParcelIcon ────────────────────────────────────────────────────────────────

function ParcelIcon() {
  return (
    <div
      className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0"
      style={{ background: 'rgba(238,167,39,0.12)' }}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <rect x="2" y="4" width="16" height="13" rx="2" fill="#EEA727" fillOpacity="0.8" />
        <path d="M2 9 L8 6 L12 10 L18 7" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.7" />
        <path d="M2 13 L18 13" stroke="white" strokeWidth="0.8" strokeOpacity="0.4" strokeDasharray="2,2" />
      </svg>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function FermierPage() {
  const { user } = useAuth()
  const { data: reportsData, isLoading: loadingReports } = useSprayReports()
  const { data: parcelsData, isLoading: loadingParcels } = useParcels()

  const reports = reportsData?.items ?? []
  const parcels = parcelsData?.items ?? []

  const firstName = user?.full_name?.split(' ')[0] ?? user?.name ?? 'Fermier'
  const currentYear = new Date().getFullYear()
  const totalHa = parcels.reduce((s, p) => s + p.surface_ha, 0)

  const hour = new Date().getHours()
  const timeGreeting = hour < 12 ? 'dimineața' : hour < 18 ? 'ziua' : 'seara'

  const pastReports = reports.filter(r => r.status === 'completed' || r.status === 'cancelled')
  const totalNotified = reports.reduce((s, r) => s + (r.affected_apiaries_count ?? 0), 0)
  const latestReport = reports[0]

  return (
    <div className="px-4 md:px-6 lg:px-8 py-5 space-y-7 lg:space-y-0 lg:max-w-none lg:grid lg:grid-cols-12 lg:gap-6">

      {/* ── Hero ── */}
      <div className="honeycomb-bg rounded-[20px] p-5 relative overflow-hidden lg:col-span-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-white/80 mb-1">
          Bună {timeGreeting}, {firstName}
        </p>
        <h1 className="text-[22px] font-bold text-white tracking-[-0.02em] leading-tight mb-1">
          Anunți o stropire?
        </h1>
        <p className="text-[13px] text-white/70 mb-4 leading-snug">
          Noi vorbim cu primăria și cu apicultorii. Tu doar completezi formularul.
        </p>
        <Link
          href="/fermier/raport-nou"
          className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-[12px] bg-pollen text-ink font-bold text-[15px] hover:brightness-105 transition-all active:scale-[0.98]"
        >
          <Plus size={18} /> Raport stropire nouă
        </Link>
      </div>

      {/* ── Activitate recentă (desktop only) ── */}
      <aside className="hidden lg:flex lg:col-span-4 bg-white rounded-[16px] border border-hair-soft p-4 flex-col">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.06em] text-purple mb-3">Activitate recentă</h2>
        {loadingReports ? (
          <Spinner size="sm" className="py-4 mx-auto" />
        ) : !latestReport ? (
          <p className="text-[13px] text-ink-muted">Niciun raport încă</p>
        ) : (
          <>
            <p className="text-[12px] text-ink-soft mb-3">
              <span className="font-semibold text-ink">{reports.length}</span> rapoarte în total
            </p>
            <Link
              href={`/fermier/rapoarte/${latestReport.id}`}
              className="block rounded-[12px] border border-hair-soft p-3 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="text-[13px] font-semibold text-ink truncate">{latestReport.parcel.name}</p>
                <ToxBadge toxicity={latestReport.toxicity} />
              </div>
              <p className="text-[11.5px] text-ink-muted">{formatDate(latestReport.scheduled_at)}</p>
            </Link>
          </>
        )}
      </aside>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 gap-3 lg:col-span-12 lg:grid-cols-4">
        <div className="bg-white rounded-[16px] p-4 border border-hair-soft" aria-label={`${parcels.length} parcele active, ${totalHa.toFixed(1)} hectare total`}>
          <p className="text-[28px] font-bold text-purple tracking-[-0.02em] leading-none">{loadingParcels ? '—' : parcels.length}</p>
          <p className="text-[12px] font-semibold text-ink-soft mt-1">Parcele active</p>
          <p className="text-[11px] text-ink-muted">{totalHa.toFixed(1)} ha total</p>
        </div>
        <div className="bg-white rounded-[16px] p-4 border border-hair-soft" aria-label={`${reports.length} rapoarte în ${currentYear}`}>
          <p className="text-[28px] font-bold text-safe tracking-[-0.02em] leading-none">{loadingReports ? '—' : reports.length}</p>
          <p className="text-[12px] font-semibold text-ink-soft mt-1">Rapoarte {currentYear}</p>
          <p className="text-[11px] text-ink-muted">toate în registru</p>
        </div>
        <div className="hidden lg:block bg-white rounded-[16px] p-4 border border-hair-soft">
          <p className="text-[28px] font-bold text-honey-deep tracking-[-0.02em] leading-none">{loadingReports ? '—' : totalNotified}</p>
          <p className="text-[12px] font-semibold text-ink-soft mt-1">Apicultori notificați</p>
          <p className="text-[11px] text-ink-muted">cumulat</p>
        </div>
        <div className="hidden lg:block bg-white rounded-[16px] p-4 border border-hair-soft">
          <p className="text-[28px] font-bold text-purple tracking-[-0.02em] leading-none">{loadingReports ? '—' : pastReports.length}</p>
          <p className="text-[12px] font-semibold text-ink-soft mt-1">Procese încheiate</p>
          <p className="text-[11px] text-ink-muted">din {reports.length} totale</p>
        </div>
      </div>

      {/* ── Parcels + Recent reports (side-by-side on lg) ── */}
      <div className="space-y-7 lg:space-y-0 lg:col-span-12 lg:grid lg:grid-cols-2 lg:gap-6">

      {/* ── Parcels ── */}
      <section>
        <SectionHeader label="Parcelele tale" href="/fermier/parcele" linkLabel="Vezi toate" />
        {loadingParcels ? (
          <Spinner size="sm" className="py-4 mx-auto" />
        ) : parcels.length === 0 ? (
          <p className="text-center text-[13px] text-ink-muted py-4">Nicio parcelă înregistrată.</p>
        ) : (
          <div className="space-y-3" role="list">
            {parcels.slice(0, 5).map(parcel => {
              const nextSpray = reports.find(r => r.parcel_id === parcel.id && r.status === 'scheduled')
              return (
                <Link
                  key={parcel.id}
                  href={`/fermier/parcele/${parcel.id}`}
                  role="listitem"
                  aria-label={`${parcel.name}, ${parcel.locality}, ${parcel.surface_ha} hectare${nextSpray ? `, stropire programată: ${nextSpray.substance}` : ''}`}
                >
                  <div className="bg-white rounded-[14px] p-3.5 mb-2 flex items-start gap-3 hover:shadow-sm transition-shadow border border-hair-soft">
                    <ParcelIcon />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-ink text-[14px] truncate leading-snug">
                          {parcel.name} · {parcel.locality}
                        </p>
                        <StatusBadge
                          status={nextSpray ? 'scheduled' : 'safe'}
                          label={nextSpray ? 'Programat' : 'Liber'}
                        />
                      </div>
                      <p className="text-[12px] text-ink-muted mt-0.5">
                        {parcel.surface_ha} ha{parcel.default_crop ? ` · ${parcel.default_crop}` : ''}
                      </p>
                      {nextSpray && (
                        <div className="inline-flex items-center gap-1 mt-1.5 px-2 py-[3px] rounded-[6px] bg-pollen/15">
                          <LuTriangleAlert size={11} className="text-honey-deep shrink-0" aria-hidden />
                          <span className="text-[11px] text-honey-deep font-semibold">
                            Următoarea: {formatDateTime(nextSpray.scheduled_at)} · {nextSpray.substance}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      {/* ── Recent reports ── */}
      <section>
        <SectionHeader label="Rapoarte recente" href="/fermier/rapoarte" linkLabel="Toate →" />
        {loadingReports ? (
          <Spinner size="sm" className="py-4 mx-auto" />
        ) : reports.length === 0 ? (
          <p className="text-center text-[13px] text-ink-muted py-4">Niciun raport încă.</p>
        ) : (
          <div className="space-y-3" role="list">
            {reports.slice(0, 5).map(r => (
              <Link
                key={r.id}
                href={`/fermier/rapoarte/${r.id}`}
                role="listitem"
                aria-label={`Raport stropire ${r.parcel.name}, ${formatDate(r.scheduled_at)}`}
              >
                <div className="bg-white rounded-[14px] p-3.5 mb-2 flex items-center gap-3 hover:shadow-sm transition-shadow border border-hair-soft">
                  <div className="w-9 h-9 rounded-[10px] bg-hair-soft flex items-center justify-center shrink-0">
                    <FileText size={18} className="text-purple-soft" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-ink text-[13.5px] truncate leading-snug">
                      {r.parcel.name} · {r.substance} · {r.surface_ha} ha
                    </p>
                    <p className="text-[11.5px] text-ink-muted mt-0.5">{formatDate(r.scheduled_at)}</p>
                  </div>
                  <ToxBadge toxicity={r.toxicity} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
      </div>
    </div>
  )
}
