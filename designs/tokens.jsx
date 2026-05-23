// Shared tokens for Radarul Albinelor
// Palette, typography, basic primitives, mini icon set (Lucide-style strokes)

const RA = {
  // Brand
  purple:      '#4D2B8C',
  purpleSoft:  '#85409D',
  honey:       '#EEA727',
  pollen:      '#FFEF5F',
  // Surfaces
  white:       '#FFFFFF',
  cream:       '#FFFBEB',
  // Semantic
  safe:        '#16A34A',
  alert:       '#DC2626',
  // Ink
  ink:         '#1B0F2E',
  inkSoft:     '#4A3B66',
  inkMuted:    '#7A6F90',
  hair:        'rgba(77,43,140,0.10)',
  hairSoft:    'rgba(77,43,140,0.06)',
  // Type
  font: 'Inter, "Inter Placeholder", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
  mono: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
};

// Toxicity → color
const toxColor = (t) => {
  if (t === 'T+') return RA.alert;
  if (t === 'T')  return RA.honey;
  if (t === 'T-') return RA.honey;
  return RA.inkMuted;
};

// ───────────────────────────── Icons (Lucide-style, 1.6 stroke) ─────────────────────────────
const Ico = ({ d, size = 18, color = 'currentColor', sw = 1.6, fill = 'none', children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto' }}>
    {d ? <path d={d} /> : children}
  </svg>
);

const Icons = {
  bee: ({ size = 18, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="13" rx="4" ry="5.2" />
      <path d="M8 11h8M8 14h8" />
      <path d="M12 7.8c-1.5-1.5-3.6-1.5-4.2 0-.6 1.5 1 2.6 2.4 2.4" />
      <path d="M12 7.8c1.5-1.5 3.6-1.5 4.2 0 .6 1.5-1 2.6-2.4 2.4" />
      <path d="M11 4.5l1-1 1 1" />
    </svg>
  ),
  bell: ({ size = 18, color = 'currentColor' }) => (
    <Ico size={size} color={color}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></Ico>
  ),
  phone: ({ size = 18, color = 'currentColor' }) => (
    <Ico size={size} color={color}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z"/></Ico>
  ),
  msg: ({ size = 18, color = 'currentColor' }) => (
    <Ico size={size} color={color}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></Ico>
  ),
  push: ({ size = 18, color = 'currentColor' }) => (
    <Ico size={size} color={color}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></Ico>
  ),
  check: ({ size = 18, color = 'currentColor' }) => (
    <Ico size={size} color={color} sw={2.2}><path d="M20 6 9 17l-5-5"/></Ico>
  ),
  x: ({ size = 18, color = 'currentColor' }) => (
    <Ico size={size} color={color}><path d="M18 6 6 18M6 6l12 12"/></Ico>
  ),
  arrowRight: ({ size = 18, color = 'currentColor' }) => (
    <Ico size={size} color={color}><path d="M5 12h14M13 5l7 7-7 7"/></Ico>
  ),
  arrowUp: ({ size = 18, color = 'currentColor' }) => (
    <Ico size={size} color={color}><path d="M12 19V5M5 12l7-7 7 7"/></Ico>
  ),
  wind: ({ size = 18, color = 'currentColor' }) => (
    <Ico size={size} color={color}><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></Ico>
  ),
  pin: ({ size = 18, color = 'currentColor' }) => (
    <Ico size={size} color={color}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></Ico>
  ),
  shield: ({ size = 18, color = 'currentColor' }) => (
    <Ico size={size} color={color}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></Ico>
  ),
  warn: ({ size = 18, color = 'currentColor' }) => (
    <Ico size={size} color={color}><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/></Ico>
  ),
  plus: ({ size = 18, color = 'currentColor' }) => (
    <Ico size={size} color={color} sw={2}><path d="M12 5v14M5 12h14"/></Ico>
  ),
  file: ({ size = 18, color = 'currentColor' }) => (
    <Ico size={size} color={color}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></Ico>
  ),
  link: ({ size = 18, color = 'currentColor' }) => (
    <Ico size={size} color={color}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></Ico>
  ),
  map: ({ size = 18, color = 'currentColor' }) => (
    <Ico size={size} color={color}><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15M15 6v15"/></Ico>
  ),
  user: ({ size = 18, color = 'currentColor' }) => (
    <Ico size={size} color={color}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></Ico>
  ),
  home: ({ size = 18, color = 'currentColor' }) => (
    <Ico size={size} color={color}><path d="M3 12 12 3l9 9"/><path d="M5 10v10h14V10"/></Ico>
  ),
  list: ({ size = 18, color = 'currentColor' }) => (
    <Ico size={size} color={color}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></Ico>
  ),
  search: ({ size = 18, color = 'currentColor' }) => (
    <Ico size={size} color={color}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></Ico>
  ),
  camera: ({ size = 18, color = 'currentColor' }) => (
    <Ico size={size} color={color}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></Ico>
  ),
  chevR: ({ size = 18, color = 'currentColor' }) => (
    <Ico size={size} color={color}><path d="m9 18 6-6-6-6"/></Ico>
  ),
  hive: ({ size = 18, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20h16M5 16h14M6 12h12M7 8h10M8 4h8" />
      <circle cx="12" cy="13" r="0.9" fill={color} stroke="none"/>
    </svg>
  ),
};

// ───────────────────────────── Honeycomb background ─────────────────────────────
const Honeycomb = ({ opacity = 0.04, color = RA.purple, size = 22 }) => (
  <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity }} aria-hidden="true">
    <defs>
      <pattern id="hc" x="0" y="0" width={size * 1.732} height={size * 3} patternUnits="userSpaceOnUse">
        <path d={`M${size * 0.866} 0 L${size * 1.732} ${size * 0.5} L${size * 1.732} ${size * 1.5} L${size * 0.866} ${size * 2} L0 ${size * 1.5} L0 ${size * 0.5} Z`} fill="none" stroke={color} strokeWidth="0.9"/>
        <path d={`M0 ${size * 1.5} L0 ${size * 2.5} L${size * 0.866} ${size * 3} L${size * 1.732} ${size * 2.5} L${size * 1.732} ${size * 1.5}`} fill="none" stroke={color} strokeWidth="0.9"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#hc)" />
  </svg>
);

// ───────────────────────────── Bee mascot (Albi) ─────────────────────────────
const Albi = ({ size = 80, mood = 'idle' }) => {
  // single-line-art bee
  return (
    <svg width={size} height={size * 0.85} viewBox="0 0 120 100" fill="none" stroke={RA.purple} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* flight path dashed */}
      <path d="M6 80 Q 25 60, 40 78 T 75 70" stroke={RA.purple} strokeDasharray="2 4" strokeOpacity="0.35"/>
      {/* body */}
      <ellipse cx="78" cy="55" rx="22" ry="17" fill={RA.pollen}/>
      <path d="M68 40 L68 70 M78 38 L78 72 M88 41 L88 69" stroke={RA.purple} strokeWidth="2.2"/>
      {/* wings */}
      <ellipse cx="72" cy="38" rx="11" ry="7" fill="rgba(133,64,157,0.18)"/>
      <ellipse cx="86" cy="38" rx="11" ry="7" fill="rgba(133,64,157,0.18)"/>
      {/* head */}
      <circle cx="100" cy="55" r="9" fill={RA.purple}/>
      <circle cx="103" cy="52" r="1.6" fill={RA.white} stroke="none"/>
      {/* antennae */}
      <path d="M98 47 Q 102 38, 108 40 M104 47 Q 108 40, 114 44" stroke={RA.purple}/>
      {mood === 'wave' && <path d="M58 55 Q 50 50, 48 42" stroke={RA.purple} strokeWidth="2.2"/>}
    </svg>
  );
};

// ───────────────────────────── Phone-frame helpers ─────────────────────────────
// Top bar inside iOS frame for our app
const PhoneTop = ({ role, title, unread = 0, onCream = false }) => (
  <div style={{
    position: 'absolute', top: 56, left: 0, right: 0, height: 52,
    display: 'flex', alignItems: 'center', gap: 10, padding: '0 18px',
    background: onCream ? RA.cream : RA.white, zIndex: 5,
    borderBottom: `1px solid ${RA.hairSoft}`,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <BrandMark size={26}/>
      <div style={{ fontWeight: 700, fontSize: 15, color: RA.ink, letterSpacing: '-0.01em' }}>Radarul Albinelor</div>
    </div>
    <div style={{ flex: 1 }}/>
    <div style={{ position: 'relative' }}>
      <Icons.bell color={RA.ink} size={20}/>
      {unread > 0 && (
        <div style={{
          position: 'absolute', top: -4, right: -4, minWidth: 16, height: 16, padding: '0 4px',
          borderRadius: 999, background: RA.alert, color: RA.white, fontSize: 10, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: RA.mono,
        }}>{unread}</div>
      )}
    </div>
    <RolePill role={role}/>
  </div>
);

const RolePill = ({ role }) => {
  const map = {
    apicultor: { label: 'Apicultor', bg: RA.pollen, fg: RA.ink },
    fermier:   { label: 'Fermier',   bg: RA.purple, fg: RA.white },
    inspector: { label: 'ANF',       bg: RA.purpleSoft, fg: RA.white },
  };
  const m = map[role] || map.apicultor;
  return (
    <div style={{
      height: 26, padding: '0 10px', borderRadius: 999, background: m.bg, color: m.fg,
      fontSize: 12, fontWeight: 700, letterSpacing: '-0.01em',
      display: 'flex', alignItems: 'center',
    }}>{m.label}</div>
  );
};

const BrandMark = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 511.999 511.999" fill="none" aria-hidden="true">
    <path d="M426.122,121.819c-7.144,0-16.977,1.971-30.061,6.023c-4.206,1.304-6.56,5.77-5.257,9.978c1.304,4.205,5.766,6.56,9.978,5.257c14.164-4.388,21.598-5.309,25.341-5.309c33.125,0,60.075,26.95,60.075,60.075s-26.95,60.075-60.075,60.075c-26.038,0-108.854-38.445-152.38-60.059c19.031-9.43,54.338-26.493,87.129-40.011c4.071-1.678,6.012-6.339,4.333-10.411c-1.677-4.072-6.336-6.013-10.411-4.333c-8.925,3.679-18.03,7.615-26.947,11.59c2.75-7.936,4.178-16.322,4.178-24.9c0-24.448-11.613-46.222-29.598-60.139l17.752-42.857c3.656-8.826,14.076-13.158,22.923-9.495c8.937,3.702,13.196,13.985,9.495,22.923c-1.686,4.069,0.246,8.734,4.316,10.419c4.067,1.69,8.734-0.246,10.419-4.316c7.066-17.062-1.063-36.693-18.125-43.76c-8.263-3.424-17.367-3.425-25.634-0.001c-8.265,3.424-14.702,9.861-18.125,18.127l-16.765,40.471c-9.906-4.737-20.988-7.395-32.68-7.395c-11.693,0-22.774,2.658-32.68,7.395l-16.763-40.47c-3.424-8.265-9.861-14.703-18.127-18.127c-8.266-3.424-17.368-3.423-25.634,0.001s-14.703,9.86-18.127,18.125c-3.424,8.265-3.424,17.37,0,25.634c1.685,4.069,6.351,6,10.419,4.316c4.069-1.685,6.001-6.35,4.316-10.419c-3.665-8.847,0.67-19.267,9.495-22.923c8.846-3.666,19.267,0.671,22.922,9.495l17.751,42.857c-17.985,13.916-29.597,35.691-29.597,60.138c0,8.528,1.412,16.876,4.136,24.78c-37.498-16.691-78.668-32.755-98.235-32.755c-41.919,0-76.024,34.104-76.024,76.024c0,41.919,34.104,76.023,76.024,76.023c15.2,0,43.442-9.698,72.87-21.85c-13.556,22.66-21.301,48.812-21.301,73.419c0,15.409,6.258,34.975,18.602,58.154c2.204,4.138,7.675,5.479,11.548,2.829c3.417-2.337,4.358-6.88,2.45-10.48h171.926c-5.724,10.759-12.889,22.484-21.46,35.088H191.496c-1.002-1.474-1.999-2.951-2.982-4.432c-2.437-3.669-7.385-4.668-11.055-2.231c-3.668,2.437-4.667,7.385-2.23,11.054c32.217,48.501,74.538,93.657,74.961,94.108c3.103,3.298,8.515,3.299,11.617,0c4.604-4.894,112.746-120.59,112.746-184.093c0-24.62-7.742-50.759-21.298-73.416c29.426,12.151,57.666,21.848,72.867,21.848c41.919,0,76.024-34.104,76.024-76.024C502.145,155.921,468.04,121.819,426.122,121.819zM304.988,432.761c-19.627,26.297-39.464,48.929-48.988,59.49c-10.195-11.309-32.223-36.471-53.255-65.275h106.507C307.855,428.889,306.441,430.813,304.988,432.761zM325.35,239.979c0.314,0.784,0.752,1.533,1.33,2.213c4.205,4.932,8.049,10.208,11.506,15.726h-164.37c3.398-5.427,7.17-10.619,11.293-15.479c0.62-0.73,1.076-1.543,1.39-2.392c30.71-13.747,58.565-27.692,69.501-33.249C266.918,212.345,294.699,226.254,325.35,239.979zM255.999,69.719c33.125,0,60.075,26.95,60.075,60.075c0,12.441-3.768,24.375-10.895,34.512c-0.23,0.326-0.421,0.666-0.594,1.011c-22.391,10.453-40.998,19.75-48.574,23.577c-8.397-4.267-26.789-13.49-48.793-23.771c-0.196-0.433-0.425-0.856-0.705-1.26c-6.926-10.038-10.587-21.819-10.587-34.068C195.924,96.668,222.874,69.719,255.999,69.719zM85.877,257.917c-33.126,0-60.075-26.95-60.075-60.075s26.95-60.075,60.075-60.075c26.046,0,108.896,38.465,152.412,60.075C194.775,219.453,111.929,257.917,85.877,257.917zM358.604,325.434c0.001,9.351-3.013,20.962-8.898,34.563c-0.047,0-0.091-0.006-0.138-0.006H162.432c-0.038,0-0.074,0.005-0.112,0.005c-5.92-13.667-8.926-25.256-8.926-34.562c0-0.176,0.006-0.354,0.006-0.532h205.197C358.599,325.08,358.604,325.258,358.604,325.434zM357.346,308.954H154.654c1.774-11.83,5.381-23.75,10.565-35.088h181.564C351.968,285.201,355.573,297.121,357.346,308.954z" fill={RA.pollen}/>
    <path d="M282.581,87.794h-1.063c-4.405,0-7.974,3.569-7.974,7.975c0,4.405,3.569,7.974,7.974,7.974h1.063c4.405,0,7.974-3.569,7.974-7.974C290.556,91.364,286.986,87.794,282.581,87.794z" fill={RA.purple}/>
    <path d="M231.545,87.794h-1.063c-4.404,0-7.974,3.569-7.974,7.975c0,4.405,3.57,7.974,7.974,7.974h1.063c4.404,0,7.974-3.569,7.974-7.974C239.519,91.364,235.949,87.794,231.545,87.794z" fill={RA.purple}/>
  </svg>
);

// Bottom tab bar
const PhoneTabs = ({ tabs, active }) => (
  <div style={{
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 78,
    paddingBottom: 22, paddingTop: 8, background: RA.white,
    borderTop: `1px solid ${RA.hairSoft}`, zIndex: 5,
    display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end',
  }}>
    {tabs.map((t, i) => {
      const on = i === active;
      const Ic = t.icon;
      return (
        <div key={t.label} style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
          color: on ? RA.purple : RA.inkMuted, position: 'relative',
        }}>
          {on && <div style={{ position: 'absolute', top: -8, width: 28, height: 3, borderRadius: 99, background: RA.purple }}/>}
          <Ic size={22} color={on ? RA.purple : RA.inkMuted}/>
          <div style={{ fontSize: 10.5, fontWeight: on ? 700 : 500 }}>{t.label}</div>
        </div>
      );
    })}
  </div>
);

// ───────────────────────────── Ledger hash chip ─────────────────────────────
const LedgerChip = ({ hash = '#a7f2…b3', time = '2026-05-23 18:04', state = 'verified' }) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '4px 8px', borderRadius: 6,
    background: state === 'verified' ? 'rgba(22,163,74,0.08)' : RA.hairSoft,
    color: state === 'verified' ? RA.safe : RA.inkSoft,
    fontFamily: RA.mono, fontSize: 11, fontWeight: 500,
  }}>
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
    <span>{hash}</span>
    <span style={{ opacity: 0.5 }}>·</span>
    <span style={{ opacity: 0.75 }}>{time}</span>
    {state === 'verified' && (
      <>
        <span style={{ opacity: 0.5 }}>·</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
          <Icons.check size={10}/> verificat
        </span>
      </>
    )}
  </div>
);

// ───────────────────────────── Toxicity badge ─────────────────────────────
const ToxBadge = ({ tox = 'T' }) => {
  const map = {
    'T+': { label: 'Toxicitate mare', dot: RA.alert,   bg: 'rgba(220,38,38,0.10)', fg: RA.alert },
    'T':  { label: 'Toxicitate medie', dot: RA.honey,   bg: 'rgba(238,167,39,0.16)', fg: '#8a5800' },
    'T-': { label: 'Toxicitate mică',  dot: RA.honey,   bg: 'rgba(238,167,39,0.10)', fg: '#8a5800' },
  };
  const m = map[tox];
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 8px', borderRadius: 6, background: m.bg, color: m.fg,
      fontSize: 11.5, fontWeight: 600,
    }}>
      <span style={{ width: 7, height: 7, borderRadius: 99, background: m.dot, display: 'inline-block' }}/>
      <span style={{ fontFamily: RA.mono, fontWeight: 700 }}>{tox}</span>
      <span style={{ opacity: 0.85 }}>{m.label}</span>
    </div>
  );
};

// ───────────────────────────── Status pill ─────────────────────────────
const StatusPill = ({ kind = 'safe', children }) => {
  const map = {
    safe:    { bg: 'rgba(22,163,74,0.12)',  fg: RA.safe,   dot: RA.safe },
    watch:   { bg: 'rgba(238,167,39,0.18)', fg: '#8a5800', dot: RA.honey },
    danger:  { bg: 'rgba(220,38,38,0.12)',  fg: RA.alert,  dot: RA.alert },
    info:    { bg: 'rgba(77,43,140,0.10)',  fg: RA.purple, dot: RA.purple },
  };
  const m = map[kind];
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 9px', borderRadius: 999, background: m.bg, color: m.fg,
      fontSize: 12, fontWeight: 700, letterSpacing: '-0.01em',
    }}>
      <span style={{ width: 7, height: 7, borderRadius: 99, background: m.dot }}/>
      {children}
    </div>
  );
};

// ───────────────────────────── Map preview (illustrative, not Leaflet) ─────────────────────────────
// Stylized map with risk cone, apiary markers, parcel
const RiskMap = ({ height = 130, withCone = true, withApiaries = true }) => (
  <div style={{
    height, borderRadius: 12, overflow: 'hidden', position: 'relative',
    background: 'linear-gradient(135deg, #f4eede 0%, #efe6c5 50%, #e9dcb3 100%)',
    border: `1px solid ${RA.hairSoft}`,
  }}>
    {/* fields */}
    <svg viewBox="0 0 240 130" width="100%" height="100%" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
      {/* parcels */}
      <polygon points="20,18 110,12 130,52 60,70" fill="rgba(238,167,39,0.35)" stroke="rgba(238,167,39,0.7)" strokeWidth="0.8"/>
      <polygon points="135,55 220,40 235,98 150,115" fill="rgba(133,64,157,0.10)" stroke="rgba(133,64,157,0.35)" strokeWidth="0.8" strokeDasharray="2 2"/>
      <polygon points="10,80 75,75 90,125 5,120" fill="rgba(22,163,74,0.10)" stroke="rgba(22,163,74,0.35)" strokeWidth="0.8" strokeDasharray="2 2"/>
      {/* river */}
      <path d="M0 90 Q 60 70, 120 95 T 240 80" stroke="#88aacb" strokeWidth="2.2" fill="none" opacity="0.5"/>
      {/* road */}
      <path d="M0 30 Q 80 50, 160 28 T 240 55" stroke="rgba(0,0,0,0.18)" strokeWidth="1" fill="none"/>
      {withCone && (
        <>
          {/* spray center */}
          <polygon points="70,40 160,5 200,75" fill="rgba(220,38,38,0.18)" stroke="rgba(220,38,38,0.5)" strokeWidth="0.7" strokeDasharray="3 2"/>
          <circle cx="70" cy="40" r="3" fill={RA.alert}/>
          <circle cx="70" cy="40" r="9" fill="rgba(220,38,38,0.18)"/>
        </>
      )}
      {withApiaries && (
        <>
          <g transform="translate(170,90)">
            <circle r="5" fill={RA.pollen} stroke={RA.purple} strokeWidth="1.4"/>
            <circle r="1.5" fill={RA.purple}/>
          </g>
          <g transform="translate(40,100)">
            <circle r="4" fill={RA.pollen} stroke={RA.purple} strokeWidth="1.2"/>
          </g>
        </>
      )}
    </svg>
    {/* compass */}
    <div style={{
      position: 'absolute', top: 8, right: 8, width: 22, height: 22, borderRadius: 999,
      background: 'rgba(255,255,255,0.85)', border: `1px solid ${RA.hairSoft}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: RA.purple,
    }}>N</div>
    {withCone && (
      <div style={{
        position: 'absolute', top: 8, left: 8, display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '3px 7px', borderRadius: 999, background: 'rgba(255,255,255,0.92)',
        fontSize: 10.5, fontWeight: 600, color: RA.ink,
      }}>
        <Icons.wind size={11} color={RA.purple}/> NV · 12 km/h
      </div>
    )}
  </div>
);

Object.assign(window, {
  RA, toxColor, Icons, Honeycomb, Albi, PhoneTop, PhoneTabs, RolePill, BrandMark,
  LedgerChip, ToxBadge, StatusPill, RiskMap,
});
