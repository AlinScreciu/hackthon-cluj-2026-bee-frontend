'use client'
import { use } from 'react'
import { useSprayReport } from '@/lib/api/queries'
import { CascadeStatusList } from '@/components/alerts/CascadeStatusList'
import { Spinner } from '@/components/feedback/Spinner'
import { ToxBadge, StatusBadge } from '@/components/ui/Badge'
import { LedgerChip } from '@/components/feedback/LedgerChip'
import { formatDateTime, formatHa } from '@/lib/format'
import { useRouter } from 'next/navigation'
import { ChevronLeft, CheckCircle, FileText, Mail, Layers, PartyPopper, Download } from 'lucide-react'

// ── CascadeProgressSteps ───────────────────────────────────────────────────────

function CascadeProgressSteps({ localitate, affectedCount, isComplete }: {
  localitate: string
  affectedCount: number
  isComplete: boolean
}) {
  const steps = [
    { icon: CheckCircle, label: 'Trimis raportul...' },
    { icon: FileText, label: 'PDF generat' },
    { icon: Mail, label: `Email trimis la Primăria ${localitate}` },
    { icon: Layers, label: 'Înregistrat oficial' },
  ]

  return (
    <div className="bg-white rounded-[16px] border border-hair-soft overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-hair-soft">
        <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-purple">
          Cascada notificări
        </p>
        <span
          className="px-2 py-0.5 rounded-full text-[10px] font-bold"
          style={isComplete
            ? { background: 'rgba(22,163,74,0.12)', color: '#166534' }
            : { background: 'rgba(133,72,157,0.10)', color: '#85489D' }
          }
        >
          {isComplete ? 'Complet' : 'În progres'}
        </span>
      </div>

      {/* Steps */}
      <div className="px-4 py-3 space-y-2">
        {steps.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-full bg-safe/15 flex items-center justify-center shrink-0">
              <CheckCircle size={12} className="text-safe" />
            </div>
            <p className="text-[13px] text-ink-soft">{label}</p>
          </div>
        ))}
      </div>

      {/* Divider + affected count */}
      <div className="border-t border-hair-soft px-4 py-2.5">
        <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-purple">
          {affectedCount} apicultori în raza de risc
        </p>
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function RaportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data, isLoading } = useSprayReport(id)
  const router = useRouter()

  if (isLoading) return <Spinner size="lg" className="py-12 mx-auto" />
  if (!data) return <p className="text-center py-12 text-ink-muted">Raportul nu a fost găsit.</p>

  const { spray_report: spray, cascade } = data
  const isComplete = cascade?.overall_status === 'complete'

  const sprayCard = (
    <div className="bg-white rounded-[16px] p-4 border border-hair-soft lg:sticky lg:top-20">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h1 className="text-[16px] font-bold text-ink leading-snug">{spray.parcel.name}</h1>
          <p className="text-[12.5px] text-ink-muted mt-0.5">{spray.crop} · {formatHa(spray.surface_ha)}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <ToxBadge toxicity={spray.toxicity} />
          <StatusBadge status={spray.status} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <div className="bg-hair-soft rounded-xl p-3">
          <p className="text-ink-muted text-[11px]">Substanță</p>
          <p className="font-semibold text-ink text-[13px] mt-0.5">{spray.substance}</p>
        </div>
        <div className="bg-hair-soft rounded-xl p-3">
          <p className="text-ink-muted text-[11px]">Data stropire</p>
          <p className="font-semibold text-ink text-[13px] mt-0.5">{formatDateTime(spray.scheduled_at)}</p>
        </div>
      </div>

      <LedgerChip hash={spray.ledger_hash} />
    </div>
  )

  const successBanner = isComplete && (
    <div className="bg-safe/8 border border-safe/20 rounded-2xl p-4 text-center space-y-2">
      <PartyPopper size={24} className="text-safe mx-auto" />
      <p className="text-[15px] font-bold text-ink">Gata! Apicultorii știu.</p>
      <p className="text-[12px] text-ink-muted">
        Primăria {spray.parcel.name.split(' ').pop()} a primit PDF-ul oficial.
        {' '}{spray.affected_apiaries_count} apicultori sunt notificați și pot confirma.
      </p>
      <a
        href={`${process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080/api/v1'}/spray-reports/${id}/primarie-pdf`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-purple text-[13px] font-semibold mt-1 hover:text-purple-soft transition-colors"
      >
        <Download size={14} /> Descarcă PDF primărie
      </a>
    </div>
  )

  return (
    <div className="px-4 md:px-6 lg:px-8 py-4 space-y-4">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-purple text-[13px] font-semibold"
        aria-label="Înapoi la lista de rapoarte"
      >
        <ChevronLeft size={16} /> Înapoi
      </button>

      <div className="lg:grid lg:grid-cols-[420px_1fr] lg:gap-6 lg:items-start space-y-4 lg:space-y-0">
        {sprayCard}

        <div className="space-y-4">
          <CascadeProgressSteps
            localitate={spray.parcel.name.split(' ').pop() ?? 'Apahida'}
            affectedCount={spray.affected_apiaries_count}
            isComplete={isComplete}
          />

          {successBanner}

          <CascadeStatusList
            sprayId={id}
            initialDispatchCount={cascade?.dispatches?.length ?? 2}
          />
        </div>
      </div>
    </div>
  )
}
