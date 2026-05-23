import type { Toxicity } from '@/lib/api/types'

type ToxBadgeProps = { toxicity: Toxicity }

const TOX_STYLES: Record<Toxicity, string> = {
  'T+': 'bg-alert/10 text-alert border-alert/30',
  'T': 'bg-honey/20 text-amber-800 border-honey/40',
  'T-': 'bg-honey/10 text-amber-700 border-honey/30',
}

const TOX_SHORT: Record<Toxicity, string> = {
  'T+': 'mare',
  'T': 'medie',
  'T-': 'mică',
}

const TOX_LONG: Record<Toxicity, string> = {
  'T+': 'Toxicitate mare',
  'T': 'Toxicitate medie',
  'T-': 'Toxicitate mică',
}

export function ToxBadge({ toxicity }: ToxBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] text-[11px] font-bold border ${TOX_STYLES[toxicity]}`}>
      {toxicity}
      <span className="font-medium opacity-80 sm:hidden">{TOX_SHORT[toxicity]}</span>
      <span className="font-medium opacity-80 hidden sm:inline">{TOX_LONG[toxicity]}</span>
    </span>
  )
}

type StatusBadgeProps = {
  status: 'safe' | 'warning' | 'danger' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'filed' | 'under_review' | 'accepted' | 'rejected'
  label?: string
}

const STATUS_STYLES: Record<string, string> = {
  safe: 'bg-safe/10 text-safe border-safe/30',
  warning: 'bg-honey/20 text-amber-800 border-honey/40',
  danger: 'bg-alert/10 text-alert border-alert/30',
  scheduled: 'bg-purple/10 text-purple border-purple/30',
  in_progress: 'bg-honey/20 text-amber-800 border-honey/40',
  completed: 'bg-safe/10 text-safe border-safe/30',
  cancelled: 'bg-gray-100 text-gray-500 border-gray-200',
  filed: 'bg-purple/10 text-purple border-purple/30',
  under_review: 'bg-honey/20 text-amber-800 border-honey/40',
  accepted: 'bg-safe/10 text-safe border-safe/30',
  rejected: 'bg-alert/10 text-alert border-alert/30',
}

const STATUS_LABELS: Record<string, string> = {
  safe: 'Sigur', warning: 'Atenție', danger: 'Pericol',
  scheduled: 'Programat', in_progress: 'În curs', completed: 'Finalizat', cancelled: 'Anulat',
  filed: 'Depusă', under_review: 'În analiză', accepted: 'Acceptată', rejected: 'Respinsă',
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-500 border-gray-200'}`}>
      {label ?? STATUS_LABELS[status] ?? status}
    </span>
  )
}
