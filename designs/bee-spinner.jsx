// BeeSpinner — thematic loading spinner
// A bee silhouette flying along a horizontal sinus curve.
// Respects prefers-reduced-motion (degrades to opacity pulse).

/**
 * @param {object} props
 * @param {'sm'|'md'|'lg'} [props.size] - 24 / 32 / 48
 * @param {string} [props.color] - stroke/fill color override
 * @param {string} [props.label] - aria-label for screen readers
 */
function BeeSpinner({ size = 'md', color = RA.purple, label = 'Se încarcă' }) {
  const px = size === 'sm' ? 24 : size === 'lg' ? 48 : 32;
  const id = React.useId();

  // inject keyframes once
  React.useEffect(() => {
    if (document.getElementById('bee-spinner-kf')) return;
    const s = document.createElement('style');
    s.id = 'bee-spinner-kf';
    s.textContent = `
      @keyframes beeFly { 0% { offset-distance: 0%; } 100% { offset-distance: 100%; } }
      @keyframes beeFlutter { 0%,100% { transform: scaleY(1); } 50% { transform: scaleY(0.5); } }
      @keyframes beePulse { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
      @media (prefers-reduced-motion: reduce) {
        .bee-flier { animation: beePulse 1.2s ease-in-out infinite !important; offset-path: none !important; }
        .bee-wing { animation: none !important; }
      }
    `;
    document.head.appendChild(s);
  }, []);

  const path = `M 4 ${px*0.55} Q ${px*0.3} ${px*0.15}, ${px*0.5} ${px*0.55} T ${px - 4} ${px*0.55}`;

  return (
    <div role="status" aria-label={label} aria-live="polite" style={{
      width: px, height: px * 0.85, position: 'relative', display: 'inline-block',
    }}>
      <svg width={px} height={px * 0.85} viewBox={`0 0 ${px} ${px * 0.85}`} aria-hidden="true">
        {/* sinus trail */}
        <path d={path} stroke={color} strokeOpacity="0.18" strokeWidth="1" strokeDasharray="1.5 2.5" fill="none"/>
      </svg>
      <div className="bee-flier" style={{
        position: 'absolute', top: 0, left: 0, width: px * 0.32, height: px * 0.32,
        offsetPath: `path('${path}')`, offsetRotate: '0deg',
        animation: 'beeFly 1.4s cubic-bezier(0.4,0,0.6,1) infinite',
        transform: `translate(-50%, -50%)`,
      }}>
        <svg width="100%" height="100%" viewBox="0 0 24 24" aria-hidden="true">
          {/* wings */}
          <g className="bee-wing" style={{ transformOrigin: '12px 8px', animation: 'beeFlutter 0.18s ease-in-out infinite' }}>
            <ellipse cx="9" cy="8" rx="3.5" ry="2.2" fill={color} fillOpacity="0.35"/>
            <ellipse cx="15" cy="8" rx="3.5" ry="2.2" fill={color} fillOpacity="0.35"/>
          </g>
          {/* body */}
          <ellipse cx="12" cy="14" rx="4.2" ry="5" fill={RA.pollen} stroke={color} strokeWidth="1.2"/>
          <path d="M8.2 12.5h7.6M8.2 15h7.6" stroke={color} strokeWidth="1.4"/>
          <circle cx="12" cy="9.5" r="1.4" fill={color}/>
        </svg>
      </div>
    </div>
  );
}

// Centered overlay variant
function BeeSpinnerOverlay({ label = 'Se încarcă' }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 12,
      background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(4px)',
    }}>
      <BeeSpinner size="lg" label={label}/>
      <div style={{ fontSize: 13, fontWeight: 500, color: RA.inkSoft }}>{label}</div>
    </div>
  );
}

// Inline w/ label
function BeeSpinnerInline({ children = 'Se încarcă' }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <BeeSpinner size="sm"/>
      <span style={{ fontSize: 13, color: RA.inkSoft, fontWeight: 500 }}>{children}</span>
    </div>
  );
}

Object.assign(window, { BeeSpinner, BeeSpinnerOverlay, BeeSpinnerInline });
