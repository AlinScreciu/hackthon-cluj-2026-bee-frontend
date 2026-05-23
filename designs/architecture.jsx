// Architecture artboard — Mermaid-style annotated tree
// Plus the wow micro-moments

function Architecture() {
  return (
    <div style={{
      width: 920, height: 640, padding: 32, background: RA.cream, position: 'relative',
      fontFamily: RA.font, color: RA.ink, boxSizing: 'border-box', overflow: 'hidden',
    }}>
      <Honeycomb opacity={0.04} color={RA.purple} size={24}/>

      <div style={{ position: 'relative' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <BrandMark size={32}/>
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: RA.purpleSoft, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Diagramă navigație · v1
            </div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>
              Arhitectură aplicație — Radarul Albinelor
            </h1>
          </div>
        </div>

        {/* Auth boundary box */}
        <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
          {/* Auth column */}
          <div style={{
            background: RA.white, borderRadius: 14, padding: 16, width: 200,
            border: `1.5px dashed ${RA.honey}`,
          }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: RA.honey, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
              Înainte de autentificare
            </div>
            <ArchNode label="/login" sub="CNP + parolă"/>
            <ArchArrow/>
            <ArchNode label="2FA · ROeID" sub="6 cifre stagger 60ms"/>
            <ArchArrow/>
            <ArchNode label="/onboarding" sub="alege rol"/>
          </div>

          {/* Arrow */}
          <div style={{ marginTop: 100, display: 'flex', alignItems: 'center', color: RA.purpleSoft, fontWeight: 700 }}>
            <Icons.arrowRight size={28} color={RA.purpleSoft}/>
          </div>

          {/* App boundary */}
          <div style={{ flex: 1, background: RA.white, borderRadius: 14, padding: 16, border: `1.5px solid ${RA.purple}` }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: RA.purple, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
              După autentificare · cele trei roluri
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
              {/* Apicultor */}
              <RoleColumn
                title="Apicultor" pillColor={RA.pollen} pillFg={RA.ink}
                routes={[
                  { l: '/app/apicultor',         s: 'dashboard · Bzz Bzz card' },
                  { l: '/stupine',                s: 'listă + hartă' },
                  { l: '/stupine/nou',            s: 'formular înregistrare' },
                  { l: '/stupine/[id]',           s: 'detaliu + istoric ledger' },
                  { l: '/alerte',                 s: 'inbox + istoric' },
                ]}/>
              {/* Fermier */}
              <RoleColumn
                title="Fermier" pillColor={RA.purple} pillFg={RA.white}
                routes={[
                  { l: '/app/fermier',            s: 'dashboard · CTA primar' },
                  { l: '/raport-nou',             s: '★ formular stropire' },
                  { l: '/rapoarte',               s: 'istoric · ledger chips' },
                  { l: '/registru-anf',           s: 'export PDF 3 ani' },
                ]}/>
              {/* Inspector */}
              <RoleColumn
                title="Inspector ANF" pillColor={RA.purpleSoft} pillFg={RA.white}
                routes={[
                  { l: '/app/inspector',          s: 'dashboard · 3 statistici' },
                  { l: '/harta',                  s: 'hartă full-bleed · layere' },
                  { l: '/fermieri',               s: 'listă + filtre' },
                  { l: '/pagube',                 s: 'queue · chain-of-evidence' },
                ]}/>
            </div>

            <div style={{ marginTop: 14, padding: 10, borderRadius: 10, background: RA.cream,
              fontSize: 11.5, color: RA.inkSoft, display: 'flex', gap: 8, alignItems: 'center' }}>
              <Icons.user size={14} color={RA.purpleSoft}/>
              <span><b style={{ color: RA.purple }}>/app/setari</b> — comun tuturor rolurilor · profil, preferințe notificare, limbă</span>
            </div>
          </div>
        </div>

        {/* Hot path */}
        <div style={{ marginTop: 22, padding: 16, borderRadius: 14, background: RA.purple, color: RA.white, position: 'relative', overflow: 'hidden' }}>
          <Honeycomb opacity={0.08} color="#fff" size={14}/>
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.75, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Calea fierbinte · inima produsului
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
              <HotPathStep n="1" label="Fermier · Raport nou"/>
              <HotPathArrow/>
              <HotPathStep n="2" label="PDF + email primărie (auto)"/>
              <HotPathArrow/>
              <HotPathStep n="3" label="Cascadă: Push + Apel + SMS"/>
              <HotPathArrow/>
              <HotPathStep n="4" label="Apicultor confirmă (1 tap)"/>
              <HotPathArrow/>
              <HotPathStep n="5" label="Tot pe ledger"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArchNode({ label, sub }) {
  return (
    <div style={{
      padding: '8px 10px', borderRadius: 8, background: RA.cream,
      border: `1px solid ${RA.hairSoft}`,
    }}>
      <div style={{ fontSize: 12, fontWeight: 700, fontFamily: RA.mono, color: RA.purple }}>{label}</div>
      <div style={{ fontSize: 10.5, color: RA.inkMuted, marginTop: 1 }}>{sub}</div>
    </div>
  );
}

function ArchArrow() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0', color: RA.purpleSoft }}>
      <svg width="12" height="14" viewBox="0 0 12 14"><path d="M6 0 V11 M2 8 L6 12 L10 8" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round"/></svg>
    </div>
  );
}

function RoleColumn({ title, pillColor, pillFg, routes }) {
  return (
    <div>
      <div style={{
        display: 'inline-flex', padding: '4px 10px', borderRadius: 999, background: pillColor, color: pillFg,
        fontSize: 11.5, fontWeight: 700, marginBottom: 8,
      }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {routes.map((r) => (
          <div key={r.l} style={{
            padding: '6px 8px', borderRadius: 6, background: RA.cream, border: `1px solid ${RA.hairSoft}`,
          }}>
            <div style={{ fontSize: 11.5, fontFamily: RA.mono, color: RA.purple, fontWeight: 600 }}>{r.l}</div>
            <div style={{ fontSize: 10.5, color: RA.inkMuted }}>{r.s}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HotPathStep({ n, label }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '6px 10px', borderRadius: 999, background: 'rgba(255,255,255,0.12)',
      border: `1px solid rgba(255,255,255,0.18)`,
    }}>
      <span style={{
        width: 18, height: 18, borderRadius: 999, background: RA.pollen, color: RA.ink,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 10.5, fontWeight: 800,
      }}>{n}</span>
      <span style={{ fontSize: 12, fontWeight: 600 }}>{label}</span>
    </div>
  );
}

function HotPathArrow() {
  return <Icons.arrowRight size={16} color="rgba(255,255,255,0.55)"/>;
}

// ───────────────────────────── Wow moments ─────────────────────────────

function ConfettiBurst({ active }) {
  const dots = React.useMemo(() => Array.from({ length: 18 }, (_, i) => ({
    id: i,
    a: (i / 18) * Math.PI * 2 + Math.random() * 0.3,
    d: 70 + Math.random() * 50,
    s: 6 + Math.random() * 6,
    delay: Math.random() * 0.15,
    rot: Math.random() * 360,
  })), []);

  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {dots.map((d) => (
        <div key={d.id} style={{
          position: 'absolute', top: '50%', left: '50%',
          width: d.s, height: d.s, borderRadius: '20%',
          background: d.id % 3 === 0 ? RA.purple : d.id % 3 === 1 ? RA.honey : RA.pollen,
          transform: active
            ? `translate(${Math.cos(d.a) * d.d}px, ${Math.sin(d.a) * d.d}px) rotate(${d.rot}deg)`
            : 'translate(0,0) rotate(0)',
          opacity: active ? 0 : 1,
          transition: `transform 0.9s cubic-bezier(.15,.65,.25,1) ${d.delay}s, opacity 0.9s ease-out ${d.delay}s`,
        }}/>
      ))}
    </div>
  );
}

function FlybyBee({ active }) {
  return (
    <div aria-hidden="true" style={{
      position: 'absolute', top: 20, left: 0, right: 0, height: 40,
      pointerEvents: 'none', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: active ? '110%' : '-15%',
        transition: 'left 1.6s cubic-bezier(.5,0,.5,1)',
        animation: active ? 'beeFlutter 0.18s ease-in-out infinite' : 'none',
      }}>
        <svg width="36" height="32" viewBox="0 0 36 32" fill="none">
          <ellipse cx="20" cy="18" rx="9" ry="6" fill={RA.pollen} stroke={RA.purple} strokeWidth="1.4"/>
          <path d="M13 18h14M13 21h14" stroke={RA.purple} strokeWidth="1.4"/>
          <ellipse cx="14" cy="10" rx="5" ry="3" fill="rgba(133,64,157,0.3)"/>
          <ellipse cx="22" cy="10" rx="5" ry="3" fill="rgba(133,64,157,0.3)"/>
          <circle cx="29" cy="18" r="4" fill={RA.purple}/>
        </svg>
      </div>
    </div>
  );
}

function LedgerChainAnim() {
  // 4 blocks linking visibly, 500ms ease-out
  React.useEffect(() => {
    if (document.getElementById('ledger-kf')) return;
    const s = document.createElement('style');
    s.id = 'ledger-kf';
    s.textContent = `
      @keyframes ledgerBlock { 0% { opacity:0; transform: translateY(-6px) scale(.9); }
        60% { transform: translateY(0) scale(1); } 100% { opacity:1; transform: translateY(0) scale(1); } }
      @keyframes ledgerLink { 0% { transform: scaleX(0); } 100% { transform: scaleX(1); } }
      .lblk { animation: ledgerBlock .42s ease-out both; }
      .llnk { animation: ledgerLink .25s ease-out both; transform-origin: left center; }
    `;
    document.head.appendChild(s);
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, padding: '14px 8px' }}>
      {[0,1,2,3].map((i) => (
        <React.Fragment key={i}>
          <div className="lblk" style={{
            animationDelay: `${i * 110}ms`,
            width: 38, height: 38, borderRadius: 8,
            background: RA.purple, color: RA.white,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: RA.mono, fontSize: 10, fontWeight: 700,
            border: `2px solid ${RA.pollen}`,
            flex: '0 0 auto',
          }}>{['a7', 'f2', 'b3', '..'][i]}</div>
          {i < 3 && (
            <div className="llnk" style={{
              animationDelay: `${i * 110 + 100}ms`,
              height: 2, width: 18, background: RA.purpleSoft,
              flex: '0 0 auto',
            }}/>
          )}
        </React.Fragment>
      ))}
      <div style={{ marginLeft: 12, fontSize: 12, fontWeight: 600, color: RA.safe, display: 'flex', alignItems: 'center', gap: 4 }}>
        <Icons.check size={14} color={RA.safe}/> integritate verificată
      </div>
    </div>
  );
}

// ───────────────────────────── Success card after notify ─────────────────────────────
function NotifySuccess() {
  const [burst, setBurst] = React.useState(false);
  React.useEffect(() => { const t = setTimeout(() => setBurst(true), 200); return () => clearTimeout(t); }, []);

  return (
    <div style={{ position: 'relative', padding: '20px 16px', textAlign: 'center', overflow: 'hidden' }}>
      <ConfettiBurst active={burst}/>
      <div style={{ width: 64, height: 64, borderRadius: 999, background: RA.safe,
        margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 8px 24px rgba(22,163,74,0.3)',
      }}>
        <Icons.check size={36} color={RA.white}/>
      </div>
      <div style={{ fontSize: 19, fontWeight: 700, color: RA.ink, letterSpacing: '-0.02em' }}>
        Gata! Apicultorii știu.
      </div>
      <div style={{ fontSize: 13.5, color: RA.inkSoft, marginTop: 4, maxWidth: 280, margin: '4px auto 0', lineHeight: 1.4 }}>
        Primăria Apahida a primit PDF-ul oficial. 3 apicultori sunt notificați și pot confirma.
      </div>

      <div style={{ marginTop: 16, padding: 12, borderRadius: 12, background: RA.cream,
        border: `1px solid ${RA.hairSoft}`, textAlign: 'left' }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: RA.purpleSoft, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Înregistrat pe ledger
        </div>
        <LedgerChainAnim/>
        <LedgerChip hash="#a7f2…b3" time="2026-05-23 18:04"/>
      </div>
    </div>
  );
}

Object.assign(window, { Architecture, ConfettiBurst, FlybyBee, LedgerChainAnim, NotifySuccess });
