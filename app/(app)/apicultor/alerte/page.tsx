'use client'
import { useState } from 'react'
import { useAlerts } from '@/lib/api/queries'
import Link from 'next/link'
import { ToxBadge } from '@/components/ui/Badge'
import { Spinner } from '@/components/feedback/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatDate } from '@/lib/format'
import { ChevronRight } from 'lucide-react'

export default function AlertePage() {
  const [filter, setFilter] = useState<'active' | 'all'>('active')
  const { data, isLoading } = useAlerts(filter)
  const alerts = data?.items ?? []

  return (
    <div className="px-4 md:px-6 lg:px-8 py-5 lg:max-w-3xl">
      <h1 className="text-xl font-bold text-ink mb-5">Alertele mele</h1>
      <div className="flex gap-2 mb-4 lg:sticky lg:top-16 lg:bg-white/80 lg:backdrop-blur lg:z-10">
        <button onClick={() => setFilter('active')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === 'active' ? 'bg-purple/10 text-purple' : 'text-ink-muted hover:bg-hair-soft'}`}>Active</button>
        <button onClick={() => setFilter('all')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-purple/10 text-purple' : 'text-ink-muted hover:bg-hair-soft'}`}>Toate</button>
      </div>
      {isLoading ? <Spinner size="md" className="py-8 mx-auto" /> : alerts.length === 0 ? (
        <EmptyState
          align="left"
          message="Zero alerte. Zumzet liniștit."
          subtitle="Când un fermier anunță o stropire în apropiere, te anunțăm imediat. Tu vezi-ți de albine."
          action={{ label: "Sunt cu ochii pe 3 km în jurul stupinelor tale", href: "/apicultor/stupine" }}
          albiSize={72}
        />
      ) : (
        <ul role="list" className="space-y-3">
          {alerts.map(a => (
            <li key={a.alert_dispatch_id} role="listitem">
              <Link
                href={`/apicultor/alerte/${a.alert_dispatch_id}`}
                aria-label={`Alertă pentru ${a.apiary_name}, ${formatDate(a.scheduled_at)}, ${a.substance}`}
              >
                <div className="bg-white rounded-2xl p-4 mb-2 shadow-sm flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-ink truncate">{a.apiary_name}</p>
                    <p className="text-sm text-ink-muted">{formatDate(a.scheduled_at)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <ToxBadge toxicity={a.toxicity} />
                      <span className="text-xs text-ink-muted truncate">{a.substance}</span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-ink-muted shrink-0" aria-hidden />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
