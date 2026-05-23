'use client'
import { useSprayReports } from '@/lib/api/queries'
import Link from 'next/link'
import { ToxBadge, StatusBadge } from '@/components/ui/Badge'
import { Spinner } from '@/components/feedback/Spinner'
import { formatDate } from '@/lib/format'
import { ChevronRight, FileText } from 'lucide-react'

export default function RapoartePage() {
  const { data, isLoading } = useSprayReports()
  const reports = data?.items ?? []

  return (
    <div className="px-4 py-5">
      <h1 className="text-xl font-bold text-ink mb-5">Rapoartele mele</h1>
      {isLoading ? <Spinner size="md" className="py-8 mx-auto" /> : reports.length === 0 ? (
        <p className="text-center text-ink-muted py-8">Niciun raport încă.</p>
      ) : (
        <div className="space-y-3">
          {reports.map(r => (
            <Link key={r.id} href={`/fermier/rapoarte/${r.id}`}>
              <div className="bg-white rounded-2xl p-4 mb-2 shadow-sm flex items-center gap-3">
                <FileText size={20} className="text-ink-muted shrink-0" />
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
          ))}
        </div>
      )}
    </div>
  )
}
