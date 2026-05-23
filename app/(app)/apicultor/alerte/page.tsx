'use client'
import { useAlerts } from '@/lib/api/queries'
import Link from 'next/link'
import { ToxBadge } from '@/components/ui/Badge'
import { Spinner } from '@/components/feedback/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatDate } from '@/lib/format'
import { ChevronRight } from 'lucide-react'

export default function AlertePage() {
  const { data, isLoading } = useAlerts('all')
  const alerts = data?.items ?? []

  return (
    <div className="px-4 py-5">
      <h1 className="text-xl font-bold text-ink mb-5">Alertele mele</h1>
      {isLoading ? <Spinner size="md" className="py-8 mx-auto" /> : alerts.length === 0 ? (
        <EmptyState message="Nicio alertă. Stupii tăi sunt în siguranță!" albiSize={72} />
      ) : (
        <div className="space-y-3">
          {alerts.map(a => (
            <Link key={a.alert_dispatch_id} href={`/apicultor/alerte/${a.alert_dispatch_id}`}>
              <div className="bg-white rounded-2xl p-4 mb-2 shadow-sm flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-ink truncate">{a.apiary_name}</p>
                  <p className="text-sm text-ink-muted">{formatDate(a.scheduled_at)}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <ToxBadge toxicity={a.toxicity} />
                    <span className="text-xs text-ink-muted truncate">{a.substance}</span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-ink-muted shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
