'use client'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost'
  loading?: boolean
  icon?: ReactNode
  fullWidth?: boolean
}

export function Button({
  variant = 'primary',
  loading = false,
  icon,
  fullWidth = false,
  disabled,
  children,
  className = '',
  ...rest
}: ButtonProps) {
  const base =
    'flex items-center justify-center gap-2 font-bold rounded-[12px] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100'

  const variants = {
    primary:
      'h-12 bg-purple text-white text-[15px] tracking-[-0.01em] hover:bg-purple-soft',
    ghost:
      'h-11 bg-white text-purple border-[1.5px] border-hair text-sm font-semibold hover:bg-hair-soft',
  }

  return (
    <button
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {loading ? (
        <span
          className="w-4 h-4 rounded-full border-2 border-current border-t-transparent"
          style={{ animation: 'spin 0.7s linear infinite' }}
          aria-label="Se încarcă…"
        />
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  )
}
