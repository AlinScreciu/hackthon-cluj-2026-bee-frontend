import type { ReactNode } from 'react'

interface ChipProps {
  icon?: ReactNode
  children: ReactNode
  className?: string
}

export function Chip({ icon, children, className = '' }: ChipProps) {
  return (
    <span
      className={`inline-flex items-center gap-[5px] px-2 py-1 rounded-[6px] bg-hair-soft text-[11.5px] font-semibold text-ink-soft ${className}`}
    >
      {icon}
      {children}
    </span>
  )
}
