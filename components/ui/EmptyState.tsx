import Link from 'next/link'
import { BeeLogo } from '@/components/ui/BeeLogo'

interface EmptyStateProps {
  message?: string
  subtitle?: string
  action?: { label: string; href: string }
  albiSize?: number
}

export function EmptyState({
  message = 'Nicio înregistrare găsită.',
  subtitle,
  action,
  albiSize = 64,
}: EmptyStateProps) {
  return (
    <div className="text-center py-10 px-4">
      <BeeLogo size={albiSize} aria-hidden className="mx-auto mb-4" />
      <p className="text-ink-muted text-[13.5px]">{message}</p>
      {subtitle && (
        <p className="text-ink-muted/70 text-xs mt-1.5 max-w-[280px] mx-auto">{subtitle}</p>
      )}
      {action && (
        <Link
          href={action.href}
          className="inline-block mt-3 text-purple text-sm font-semibold hover:text-purple-soft transition-colors"
        >
          {action.label} →
        </Link>
      )}
    </div>
  )
}
