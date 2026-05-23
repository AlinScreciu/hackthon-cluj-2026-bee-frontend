/**
 * BeeLogo — the canonical Beelive bee mascot extracted from designs/Beelive.html
 *
 * The bee is wider than tall (≈1.55:1). Use the `size` prop to control height;
 * width scales automatically. Variants:
 *   "full"    — body + wings + head + antennae  (default)
 *   "compact" — same but wings slightly smaller, good for small sizes (≤ 32px)
 */

interface BeeLogoProps {
  /** Height in px. Width auto-scales at ~1.55× */
  size?: number
  className?: string
  'aria-hidden'?: boolean | 'true' | 'false'
}

// Viewbox: bee is centered on (0,0); full extent ≈ x[-150,250] y[-155,105]
// Width 400, height 260 → ratio 1.538:1
const VB = '-150 -155 400 260'
const W_RATIO = 400 / 260

export function BeeLogo({ size = 48, className = '', ...rest }: BeeLogoProps) {
  const h = size
  const w = Math.round(h * W_RATIO)

  return (
    <svg
      width={w}
      height={h}
      viewBox={VB}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Beelive bee logo"
      {...rest}
    >
      {/* Wings — behind body */}
      <ellipse cx="-60" cy="-100" rx="80" ry="38" fill="#85489D" fillOpacity="0.35" />
      <ellipse cx="40" cy="-100" rx="80" ry="38" fill="#85489D" fillOpacity="0.35" />

      {/* Body */}
      <ellipse cx="0" cy="0" rx="140" ry="100" fill="#FFEF5F" stroke="#40288C" strokeWidth="8" />

      {/* Stripes */}
      <path
        d="M-100 -60 L-100 60 M-30 -90 L-30 90 M40 -88 L40 88 M110 -50 L110 50"
        stroke="#40288C"
        strokeWidth="12"
        strokeLinecap="round"
      />

      {/* Head */}
      <circle cx="160" cy="0" r="50" fill="#40288C" />
      {/* Eye */}
      <circle cx="175" cy="-12" r="8" fill="#fff" />

      {/* Antennae */}
      <path
        d="M150 -40 Q170 -90 200 -85 M180 -32 Q210 -80 240 -65"
        stroke="#40288C"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  )
}
