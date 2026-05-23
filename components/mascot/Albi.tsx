export function Albi({ size = 48, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      {/* Body */}
      <ellipse cx="24" cy="28" rx="12" ry="14" fill="#EEA727" />
      {/* Stripes */}
      <rect x="13" y="24" width="22" height="4" rx="2" fill="#1B0F2E" opacity="0.7" />
      <rect x="13" y="31" width="22" height="3" rx="1.5" fill="#1B0F2E" opacity="0.5" />
      {/* Head */}
      <circle cx="24" cy="14" r="9" fill="#FFEF5F" />
      {/* Eyes */}
      <circle cx="21" cy="13" r="2" fill="#1B0F2E" />
      <circle cx="27" cy="13" r="2" fill="#1B0F2E" />
      <circle cx="21.8" cy="12.2" r="0.6" fill="white" />
      <circle cx="27.8" cy="12.2" r="0.6" fill="white" />
      {/* Smile */}
      <path d="M21 17 Q24 20 27 17" stroke="#1B0F2E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Antennae */}
      <line x1="21" y1="6" x2="18" y2="2" stroke="#1B0F2E" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="18" cy="2" r="1.5" fill="#40288C" />
      <line x1="27" y1="6" x2="30" y2="2" stroke="#1B0F2E" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="30" cy="2" r="1.5" fill="#40288C" />
      {/* Wings */}
      <ellipse cx="13" cy="20" rx="7" ry="4" fill="white" fillOpacity="0.85" transform="rotate(-20 13 20)" />
      <ellipse cx="35" cy="20" rx="7" ry="4" fill="white" fillOpacity="0.85" transform="rotate(20 35 20)" />
      {/* Stinger */}
      <path d="M24 42 L22 47 L24 45 L26 47 Z" fill="#1B0F2E" opacity="0.6" />
    </svg>
  )
}
