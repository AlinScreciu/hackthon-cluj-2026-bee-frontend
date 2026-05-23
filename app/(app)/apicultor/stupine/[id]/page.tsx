'use client'
import { use } from 'react'
import { useApiary } from '@/lib/api/queries'
import { Spinner } from '@/components/feedback/Spinner'
import { StatusBadge } from '@/components/ui/Badge'
import { LedgerChip } from '@/components/feedback/LedgerChip'
import { formatDate } from '@/lib/format'
import { useRouter } from 'next/navigation'
import { ChevronLeft, MapPin } from 'lucide-react'

export default function ApiaryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data, isLoading } = useApiary(id)
  const router = useRouter()

  if (isLoading) return <Spinner size="lg" className="py-12 mx-auto" />
  if (!data) return <p className="text-center text-ink-muted py-12">Stupina nu a fost găsită.</p>

  const { apiary } = data

  return (
    <div className="px-4 md:px-6 lg:px-8 py-4">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-purple text-sm font-medium mb-4"
        aria-label="Înapoi la lista de stupine"
      >
        <ChevronLeft size={18} /> Înapoi
      </button>

      <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold text-ink">{apiary.name}</h1>
            <p className="text-sm text-ink-muted flex items-center gap-1 mt-1">
              <MapPin size={14} /> {apiary.lat.toFixed(4)}, {apiary.lng.toFixed(4)}
            </p>
          </div>
          <StatusBadge status={apiary.status} />
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-hair-soft rounded-xl p-3" aria-label={`${apiary.hive_count} stupi`}>
            <p className="text-ink-muted">Stupi</p>
            <p className="font-bold text-ink text-lg">{apiary.hive_count}</p>
          </div>
          <div className="bg-hair-soft rounded-xl p-3">
            <p className="text-ink-muted">Tip</p>
            <p className="font-bold text-ink">{apiary.type === 'permanent' ? 'Permanent' : 'Pastoral'}</p>
          </div>
          <div className="bg-hair-soft rounded-xl p-3">
            <p className="text-ink-muted">Din data</p>
            <p className="font-semibold text-ink text-sm">{formatDate(apiary.start_date)}</p>
          </div>
          <div className="bg-hair-soft rounded-xl p-3" aria-label={`${apiary.current_risk.active_alerts} alerte active`}>
            <p className="text-ink-muted">Alerte active</p>
            <p className="font-bold text-ink text-lg">{apiary.current_risk.active_alerts}</p>
          </div>
        </div>

        {apiary.notes && (
          <p className="text-sm text-ink-muted mt-3 bg-cream rounded-xl p-3">{apiary.notes}</p>
        )}

        <div className="mt-4">
          <LedgerChip hash={apiary.last_ledger_hash} />
        </div>
      </div>
    </div>
  )
}
