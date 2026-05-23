'use client'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

const SIZES = { sm: 24, md: 32, lg: 48 } as const

// Detailed bee SVG — top-down view with anatomically correct proportions
function BeeSvg({ size, animated }: { size: number; animated?: boolean }) {
  const flutter = animated ? 'bee-flutter 0.15s linear infinite' : undefined
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      {/* Abdomen — amber body with rounded tip */}
      <ellipse cx="16" cy="21" rx="7" ry="8" fill="#EEA727" />
      {/* Abdomen stripes */}
      <ellipse cx="16" cy="18.5" rx="6.5" ry="1.6" fill="#1B0F2E" opacity="0.55" />
      <ellipse cx="16" cy="22.5" rx="6" ry="1.6" fill="#1B0F2E" opacity="0.55" />
      <ellipse cx="16" cy="26" rx="4.5" ry="1.2" fill="#1B0F2E" opacity="0.3" />
      {/* Stinger */}
      <path d="M16 28.5 L16 30.5" stroke="#1B0F2E" strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
      {/* Thorax — dark purple connector */}
      <ellipse cx="16" cy="13.5" rx="4" ry="3.5" fill="#40288C" />
      {/* Head */}
      <circle cx="16" cy="8.5" r="4" fill="#EEA727" />
      {/* Eyes */}
      <circle cx="14.2" cy="7.5" r="1.1" fill="#1B0F2E" />
      <circle cx="17.8" cy="7.5" r="1.1" fill="#1B0F2E" />
      {/* Eye shine */}
      <circle cx="14.6" cy="7.1" r="0.4" fill="white" opacity="0.7" />
      <circle cx="18.2" cy="7.1" r="0.4" fill="white" opacity="0.7" />
      {/* Antennae */}
      <line x1="14" y1="5" x2="11.5" y2="2.5" stroke="#1B0F2E" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="11" cy="2" r="1" fill="#1B0F2E" />
      <line x1="18" y1="5" x2="20.5" y2="2.5" stroke="#1B0F2E" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="21" cy="2" r="1" fill="#1B0F2E" />
      {/* Upper wings — large, translucent */}
      <ellipse
        cx="8" cy="13" rx="7" ry="3.5"
        fill="white" fillOpacity="0.82"
        transform="rotate(-18, 8, 13)"
        style={flutter ? { transformOrigin: '12px 13px', animation: flutter } : undefined}
      />
      <ellipse
        cx="24" cy="13" rx="7" ry="3.5"
        fill="white" fillOpacity="0.82"
        transform="rotate(18, 24, 13)"
        style={flutter ? { transformOrigin: '20px 13px', animation: flutter } : undefined}
      />
      {/* Lower wings — smaller */}
      <ellipse
        cx="9.5" cy="17.5" rx="5" ry="2.5"
        fill="white" fillOpacity="0.6"
        transform="rotate(-10, 9.5, 17.5)"
        style={flutter ? { transformOrigin: '12px 17px', animation: flutter } : undefined}
      />
      <ellipse
        cx="22.5" cy="17.5" rx="5" ry="2.5"
        fill="white" fillOpacity="0.6"
        transform="rotate(10, 22.5, 17.5)"
        style={flutter ? { transformOrigin: '20px 17px', animation: flutter } : undefined}
      />
    </svg>
  )
}

interface SpinnerProps {
  size?: keyof typeof SIZES
  label?: string
  className?: string
}

export function Spinner({ size = 'md', label, className = '' }: SpinnerProps) {
  const reduced = useReducedMotion()
  const px = SIZES[size]
  const trackW = px * 4
  const trackH = px * 1.5

  if (reduced) {
    return (
      <div className={`flex flex-col items-center gap-2 ${className}`} aria-label={label ?? 'Se încarcă'} role="status">
        <BeeSvg size={px} />
        {label && <span className="text-sm text-ink-muted">{label}</span>}
      </div>
    )
  }

  const sinePath = `M 0 ${trackH / 2} Q ${trackW * 0.25} 0 ${trackW * 0.5} ${trackH / 2} Q ${trackW * 0.75} ${trackH} ${trackW} ${trackH / 2}`

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`} role="status" aria-label={label ?? 'Se încarcă'}>
      <div style={{ width: trackW, height: trackH, position: 'relative' }}>
        <svg width={trackW} height={trackH} style={{ position: 'absolute', inset: 0, opacity: 0 }}>
          <path id={`bee-path-${size}`} d={sinePath} />
        </svg>
        <div
          className="bee-flier"
          style={{
            position: 'absolute',
            offsetPath: `path('${sinePath}')`,
            offsetRotate: '0deg',
            animation: `bee-fly 1.4s cubic-bezier(0.45,0,0.55,1) infinite`,
            width: px,
            height: px,
          }}
        >
          <BeeSvg size={px} animated />
        </div>
      </div>
      {label && <span className="text-sm text-ink-muted">{label}</span>}
    </div>
  )
}

export function SpinnerOverlay({ label }: { label?: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-10 rounded-inherit">
      <Spinner size="lg" label={label} />
    </div>
  )
}

export function SpinnerPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size="lg" label="Se încarcă..." />
    </div>
  )
}
