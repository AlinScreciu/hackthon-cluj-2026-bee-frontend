export const RA = {
  purple: '#40288C',
  purpleSoft: '#85489D',
  honey: '#EEA727',
  pollen: '#FFEF5F',
  safe: '#16A34A',
  alert: '#DC2626',
  white: '#FFFFFF',
  cream: '#FFFBEB',
  ink: '#1B0F2E',
  inkSoft: '#4A3B66',
  inkMuted: '#7A6F90',
  hair: 'rgba(77,43,140,0.10)',
  hairSoft: 'rgba(77,43,140,0.06)',
} as const

export const RISK_RADIUS: Record<string, number> = {
  'T-': 750,
  'T': 1500,
  'T+': 3000,
}

export const spring = { type: 'spring', stiffness: 260, damping: 22 } as const
export const pageTransition = { duration: 0.15, ease: 'easeOut' } as const
