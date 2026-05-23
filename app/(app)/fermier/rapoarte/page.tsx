'use client'
import { useSprayReports } from '@/lib/api/queries'
import Link from 'next/link'
import { ToxBadge, StatusBadge } from '@/components/ui/Badge'
import { Spinner } from '@/components/feedback/Spinner'
import { BeeLogo } from '@/components/ui/BeeLogo'
import { formatDate } from '@/lib/format'
import { ChevronRight, FileText } from 'lucide-react'

export default function RapoartePage() {
  const { data, isLoading } = useSprayReports()
  const reports = data?.items ?? []

  return (
    <div className="px-4 md:px-6 lg:px-8 py-5">
      <h1 className="text-xl font-bold text-ink mb-5">Rapoartele mele</h1>
      {isLoading ? <Spinner size="md" className="py-8 mx-auto" /> : reports.length === 0 ? (
        <div className="text-center py-12">
          <BeeLogo size={48} aria-hidden className="mx-auto mb-4 opacity-60" />
          <p className="text-ink-muted">Niciun raport încă.</p>
          <Link href="/fermier/raport-nou" className="text-purple text-sm font-medium mt-2 inline-block">
            Creează primul raport
          </Link>
        </div>
      ) : (
        <ul className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0" role="list">
          {reports.map(r => (
            <li key={r.id} role="listitem">
              <Link
                href={`/fermier/rapoarte/${r.id}`}
                aria-label={`Raport ${r.parcel.name}, ${formatDate(r.scheduled_at)}, cultură ${r.crop}`}
              >
                <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
                  <FileText size={20} className="text-ink-muted shrink-0" aria-hidden />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-ink truncate">{r.parcel.name}</p>
                    <p className="text-sm text-ink-muted">{formatDate(r.scheduled_at)} · {r.crop}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <ToxBadge toxicity={r.toxicity} />
                    <StatusBadge status={r.status} />
                    <ChevronRight size={14} className="text-ink-muted" aria-hidden />
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
