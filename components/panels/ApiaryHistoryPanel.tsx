import { CheckCircle, Pencil, Circle, Bell, FileText, Mail, AlertOctagon, AlertTriangle, Layers, type LucideIcon } from 'lucide-react'
import { formatDateTime } from '@/lib/format'
import type { LedgerEventSummary } from '@/lib/api/types'

interface ApiaryHistoryPanelProps {
  events: LedgerEventSummary[]
}

const TYPE_ICON: Record<string, LucideIcon> = {
  'apiary.registered': CheckCircle,
  'apiary.updated': Pencil,
  'alert.dispatched': Bell,
  'alert.urgent': AlertTriangle,
  'alert.confirmed': CheckCircle,
  'spray.created': Layers,
  'pdf.generated': FileText,
  'email.sent': Mail,
  'damage.filed': AlertOctagon,
}

const TYPE_LABEL: Record<string, string> = {
  'apiary.registered': 'Înregistrare',
  'apiary.updated': 'Actualizare',
  'alert.dispatched': 'Alertă trimisă',
  'alert.urgent': 'Alertă urgentă',
  'alert.confirmed': 'Alertă confirmată',
  'spray.created': 'Stropire anunțată',
  'pdf.generated': 'PDF generat',
  'email.sent': 'Email trimis',
  'damage.filed': 'Daună raportată',
}

const TYPE_TINT: Record<string, { bg: string; fg: string }> = {
  'alert.urgent': { bg: 'bg-alert/10', fg: 'text-alert' },
}

export function ApiaryHistoryPanel({ events }: ApiaryHistoryPanelProps) {
  return (
    <div className="bg-white rounded-[16px] border border-hair-soft p-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-purple mb-3">
        Istoric oficial
      </p>
      {events.length === 0 ? (
        <p className="text-[13px] text-ink-muted">Niciun eveniment înregistrat încă.</p>
      ) : (
        <ul role="list" className="space-y-3">
          {events.map(e => {
            const Icon = TYPE_ICON[e.type] ?? Circle
            const label = TYPE_LABEL[e.type] ?? e.type
            const shortHash = e.hash.slice(-6)
            const tint = TYPE_TINT[e.type]
            return (
              <li key={e.hash} role="listitem" className="flex items-start gap-3">
                <div className={`w-7 h-7 rounded-[8px] flex items-center justify-center shrink-0 mt-0.5 ${tint?.bg ?? 'bg-hair-soft'}`}>
                  <Icon size={14} className={tint?.fg ?? 'text-purple'} aria-hidden />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-semibold text-ink leading-tight">{label}</p>
                  <p className="text-[12px] text-ink-muted mt-0.5">{formatDateTime(e.created_at)}</p>
                </div>
                <span
                  className="text-[11px] font-mono text-ink-soft bg-hair-soft rounded-[6px] px-2 py-0.5 shrink-0 mt-1"
                  title={e.hash}
                >
                  {shortHash}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
