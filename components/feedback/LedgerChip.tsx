import { Link } from 'lucide-react'

interface LedgerChipProps {
  hash: string
  onVerify?: () => void
}

export function LedgerChip({ hash, onVerify }: LedgerChipProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-hair-soft border border-hair text-xs text-ink-soft">
      <Link size={12} className="shrink-0" />
      <span className="font-sans font-semibold shrink-0">Dovadă</span>
      <span className="truncate max-w-[110px] font-mono" title={hash}>#{hash}</span>
      {onVerify && (
        <button
          onClick={onVerify}
          className="ml-1 text-purple hover:text-purple-soft font-sans font-medium text-xs"
          aria-label="Verifică integritatea înregistrării"
        >
          Verifică
        </button>
      )}
    </div>
  )
}
