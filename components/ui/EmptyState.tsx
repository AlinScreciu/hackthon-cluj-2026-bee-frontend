import Link from 'next/link'
import { BeeLogo } from '@/components/ui/BeeLogo'

interface EmptyStateProps {
  message?: string
  subtitle?: string
  action?: { label: string; href: string }
  albiSize?: number
  align?: 'center' | 'left'
}

export function EmptyState({
  message = 'Nicio înregistrare găsită.',
  subtitle,
  action,
  albiSize = 64,
  align = 'center',
}: EmptyStateProps) {
  const isLeft = align === 'left'
  return (
    <div className={`py-10 px-4 ${isLeft ? 'flex items-center gap-5 text-left' : 'text-center'}`}>
      <BeeLogo
        size={albiSize}
        aria-hidden
        className={isLeft ? 'shrink-0' : 'mx-auto mb-4'}
      />
      <div className={isLeft ? 'flex-1 min-w-0' : ''}>
        <p className="text-ink-muted text-[13.5px]">{message}</p>
        {subtitle && (
          <p className={`text-ink-muted text-xs mt-1.5 ${isLeft ? 'max-w-[420px]' : 'max-w-[280px] mx-auto'}`}>
            {subtitle}
          </p>
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
    </div>
  )
}
