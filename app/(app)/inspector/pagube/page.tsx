'use client'
import { useDamageClaims } from '@/lib/api/queries'
import { Spinner } from '@/components/feedback/Spinner'
import { BeeLogo } from '@/components/ui/BeeLogo'
import { StatusBadge } from '@/components/ui/Badge'
import { LedgerChip } from '@/components/feedback/LedgerChip'
import { formatDate } from '@/lib/format'
import { AlertTriangle, Layers } from 'lucide-react'

const STATUS_LABEL: Record<string, string> = {
  filed: 'Depusă',
  under_review: 'În analiză',
  accepted: 'Acceptată',
  rejected: 'Respinsă',
}

const STATUS_COLORS: Record<string, string> = {
  filed: 'scheduled',
  under_review: 'warning',
  accepted: 'safe',
  rejected: 'danger',
}

const APIARY_NAMES: Record<string, string> = {
  'apiary-1': 'Stupina Apahida Nord',
  'apiary-2': 'Stupina Florești',
  'apiary-3': 'Stupina Pastorală Turda',
}

export default function PagubePage() {
  const { data, isLoading } = useDamageClaims()
  const claims = data?.items ?? []

  return (
    <div className="px-4 md:px-6 lg:px-8 py-5">
      <h1 className="text-xl font-bold text-ink mb-5">Cereri de pagubă</h1>

      {isLoading ? (
        <Spinner size="md" className="py-8 mx-auto" />
      ) : claims.length === 0 ? (
        <div className="text-center py-12">
          <BeeLogo size={56} aria-hidden className="mx-auto mb-4 opacity-60" />
          <p className="text-ink-muted">Nicio cerere depusă momentan.</p>
        </div>
      ) : (
        <ul className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0" role="list">
          {claims.map(claim => (
            <li key={claim.id} role="listitem">
              <div className="bg-white rounded-[16px] p-4 border border-hair-soft">
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-start gap-2.5">
                    <div
                      className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: 'rgba(220,38,38,0.10)' }}
                    >
                      <AlertTriangle size={16} className="text-alert" aria-hidden />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-ink text-[14px] leading-snug line-clamp-2">
                        {claim.description}
                      </p>
                      <p className="text-[12px] text-ink-muted mt-0.5">
                        {APIARY_NAMES[claim.apiary_id] ?? claim.apiary_id}
                      </p>
                    </div>
                  </div>
                  <StatusBadge
                    status={STATUS_COLORS[claim.status] as 'safe' | 'warning' | 'danger' | 'scheduled'}
                    label={STATUS_LABEL[claim.status] ?? claim.status}
                  />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-hair-soft rounded-xl p-2.5">
                    <p className="text-[10px] text-ink-muted uppercase tracking-[0.04em]">Familii pierdute</p>
                    <p className="font-bold text-alert text-[16px] mt-0.5">{claim.hive_loss_count}</p>
                  </div>
                  <div className="bg-hair-soft rounded-xl p-2.5">
                    <p className="text-[10px] text-ink-muted uppercase tracking-[0.04em]">Data depunerii</p>
                    <p className="font-semibold text-ink text-[13px] mt-0.5">{formatDate(claim.created_at)}</p>
                  </div>
                </div>

                {/* Linked spray */}
                {claim.related_spray_id && (
                  <div className="flex items-center gap-1.5 mb-3">
                    <Layers size={12} className="text-ink-muted shrink-0" aria-hidden />
                    <p className="text-[11.5px] text-ink-muted">
                      Legat de raport: <span className="font-mono text-purple">{claim.related_spray_id}</span>
                    </p>
                  </div>
                )}

                <LedgerChip hash={claim.ledger_hash} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
