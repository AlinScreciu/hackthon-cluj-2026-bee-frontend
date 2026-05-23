// Main composition — Design Canvas for Radarul Albinelor
// Lays out: Architecture · 3 Dashboards (mobile) · Bzz Bzz both states ·
// Farmer report form + live cascade · Spinner variants · Wow moments · Beekeeper post-confirm

// 2FA screen (ROeID simulation) — bonus screen referenced in the brief
function TwoFactorScreen() {
  const [digits, setDigits] = React.useState(['', '', '', '', '', '']);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
    // simulate digits arriving with 60ms stagger
    const target = ['8', '3', '2', '1', '0', '7'];
    target.forEach((d, i) => setTimeout(() => {
      setDigits((prev) => { const n = [...prev]; n[i] = d; return n; });
    }, 600 + i * 60));
  }, []);

  return (
    <div style={{ height: '100%', background: RA.white, paddingTop: 56, position: 'relative', overflow: 'hidden' }}>
      <Honeycomb opacity={0.05} color={RA.purple} size={28}/>
      <div style={{ position: 'relative', padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, height: '100%', boxSizing: 'border-box' }}>
        <BeeSpinner size="lg"/>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: RA.purpleSoft, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            ROeID · pasul 2
          </div>
          <h1 style={{ margin: '4px 0', fontSize: 22, fontWeight: 700, color: RA.ink, letterSpacing: '-0.02em' }}>
            Verificăm că ești tu
          </h1>
          <p style={{ margin: 0, fontSize: 13.5, color: RA.inkSoft, maxWidth: 280, lineHeight: 1.4 }}>
            Ți-am trimis un cod în notificarea push. Apare aici automat în câteva secunde.
          </p>
        </div>

        {/* OTP boxes */}
        <div style={{ display: 'flex', gap: 8 }}>
          {digits.map((d, i) => (
            <div key={i} style={{
              width: 42, height: 52, borderRadius: 10,
              background: d ? 'rgba(77,43,140,0.05)' : RA.white,
              border: `2px solid ${d ? RA.purple : RA.hair}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, fontWeight: 700, color: RA.purple, fontFamily: RA.mono,
              transition: 'all 0.2s ease-out',
              transform: d ? 'scale(1)' : 'scale(0.96)',
            }}>{d}</div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
          <button style={{ background: 'none', border: 'none', color: RA.purpleSoft, fontWeight: 600, cursor: 'pointer', fontFamily: RA.font }}>
            Trimite prin SMS
          </button>
          <button style={{ background: 'none', border: 'none', color: RA.purpleSoft, fontWeight: 600, cursor: 'pointer', fontFamily: RA.font }}>
            Trimite prin Email
          </button>
        </div>

        <div style={{ flex: 1 }}/>

        <div style={{ width: '100%', padding: 12, borderRadius: 12, background: RA.cream,
          fontSize: 11.5, color: RA.inkMuted, fontFamily: RA.mono, textAlign: 'center' }}>
          CNP <b style={{ color: RA.ink }}>1880523125478</b> · sesiune ROeID
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────── The main canvas ─────────────────────────────

function App() {
  // Mock beekeeper data for the cascade
  const cascadeBeekeepers = [
    { id: 'b1', name: 'Andrei Bodea', village: 'Apahida · 1.8 km', hives: 62,
      channels: { push: 'opened', call: 'confirmed', sms: undefined }, resolvedVia: 'apel' },
    { id: 'b2', name: 'Cristina Pop', village: 'Tureni · 2.3 km', hives: 48,
      channels: { push: 'received', call: 'unreached', sms: 'confirmed' }, resolvedVia: 'sms' },
    { id: 'b3', name: 'Vasile Olaru', village: 'Jucu · 2.7 km', hives: 35,
      channels: { push: 'sent', call: 'unreached', sms: 'sent' }, resolvedVia: null },
  ];

  const baseAlert = {
    id: 'alrt-001',
    farmer: 'Maria Popescu',
    parcel: 'Apahida · Parcela A12',
    distanceKm: 1.8,
    eta: 'mâine, 06:30',
    wind: 'NV · 12 km/h',
    tox: 'T+',
    substance: 'Confidor Energy',
    channels: { push: 'opened', call: 'unreached', sms: 'sent' },
    hash: '#a7f2…b3',
    hashTime: '2026-05-23 18:04',
  };

  const confirmedAlert = {
    ...baseAlert,
    channels: { push: 'opened', call: 'confirmed', sms: 'sent' },
  };

  return (
    <DesignCanvas>
      {/* ─────────── 1. Architecture ─────────── */}
      <DCSection id="arch" title="1 · Arhitectură" subtitle="Diagrama navigației + calea fierbinte de la fermier la apicultor">
        <DCArtboard id="arch-main" label="App tree + auth boundary + hot path" width={920} height={640}>
          <Architecture/>
        </DCArtboard>
      </DCSection>

      {/* ─────────── 2. Three role dashboards ─────────── */}
      <DCSection id="dashboards" title="2 · Cele trei dashboard-uri" subtitle="Mobile-first · stări implicită / cu alertă / inspector">
        <DCArtboard id="d-apicultor-safe" label="Apicultor · stare 'sigur'" width={402} height={874}>
          <IOSDevice width={402} height={874}><ApicultorDashboard/></IOSDevice>
        </DCArtboard>
        <DCArtboard id="d-apicultor-alert" label="Apicultor · cu alertă activă" width={402} height={874}>
          <IOSDevice width={402} height={874}><ApicultorDashboard withAlert/></IOSDevice>
        </DCArtboard>
        <DCArtboard id="d-fermier" label="Fermier · CTA primar" width={402} height={874}>
          <IOSDevice width={402} height={874}><FermierDashboard/></IOSDevice>
        </DCArtboard>
        <DCArtboard id="d-inspector" label="Inspector ANF · 3 statistici + hartă" width={402} height={874}>
          <IOSDevice width={402} height={874}><InspectorDashboard/></IOSDevice>
        </DCArtboard>
      </DCSection>

      {/* ─────────── 3. Bzz Bzz card — both states ─────────── */}
      <DCSection id="bzz" title="3 · Bzz Bzz — alerta urgentă" subtitle="Cele două stări: neconfirmat (border pulsează) și confirmat (border verde, badge proeminent)">
        <DCArtboard id="bzz-unconf" label="Stare 1 · neconfirmat" width={380} height={720}>
          <div style={{ padding: 16, background: RA.cream, height: '100%', boxSizing: 'border-box' }}>
            <BzzBzzAlert alert={baseAlert} confirmed={false}/>
          </div>
        </DCArtboard>
        <DCArtboard id="bzz-conf" label="Stare 2 · confirmat prin apel" width={380} height={720}>
          <div style={{ padding: 16, background: RA.cream, height: '100%', boxSizing: 'border-box' }}>
            <BzzBzzAlert alert={confirmedAlert} confirmed={true} confirmedVia="apel"/>
          </div>
        </DCArtboard>
      </DCSection>

      {/* ─────────── 4. Farmer Report Form + Cascade ─────────── */}
      <DCSection id="report" title="4 · Raport stropire + cascadă live" subtitle="Trei stadii: formular → în progres → succes (cu Albi & confetti)">
        <DCArtboard id="r-form" label="A · formular (mobil, sticky CTA)" width={402} height={874}>
          <IOSDevice width={402} height={874}>
            <ReportForm/>
          </IOSDevice>
        </DCArtboard>
        <DCArtboard id="r-cascade" label="B · cascadă live după 'Notifică toți'" width={440} height={780}>
          <div style={{ padding: 16, background: RA.cream, height: '100%', boxSizing: 'border-box', overflowY: 'auto' }}>
            <NotificationCascade
              beekeepers={cascadeBeekeepers}
              system={{ pdf: true, email: true, ledger: true }}
            />
          </div>
        </DCArtboard>
        <DCArtboard id="r-success" label="C · succes · confetti + ledger anim" width={380} height={520}>
          <div style={{ background: RA.white, height: '100%', boxSizing: 'border-box', overflow: 'hidden', position: 'relative' }}>
            <NotifySuccess/>
          </div>
        </DCArtboard>
      </DCSection>

      {/* ─────────── 5. Notification Cascade — additional variants ─────────── */}
      <DCSection id="cascade-states" title="5 · Cascada · variante de stare" subtitle="Cum arată fiecare canal (confirmat-apel, ratat-apel→SMS, în așteptare)">
        <DCArtboard id="c-by-call" label="Confirmat prin apel" width={420} height={220}>
          <CascadeStateCard
            name="Andrei Bodea" village="Apahida · 1.8 km" hives={62}
            channels={{ push: 'opened', call: 'confirmed' }} via="apel"
          />
        </DCArtboard>
        <DCArtboard id="c-by-sms" label="Apel ratat → SMS confirmat" width={420} height={220}>
          <CascadeStateCard
            name="Cristina Pop" village="Tureni · 2.3 km" hives={48}
            channels={{ push: 'received', call: 'unreached', sms: 'confirmed' }} via="sms"
          />
        </DCArtboard>
        <DCArtboard id="c-waiting" label="Necontactat · în așteptare" width={420} height={220}>
          <CascadeStateCard
            name="Vasile Olaru" village="Jucu · 2.7 km" hives={35}
            channels={{ push: 'sent', call: 'unreached', sms: 'sent' }} via={null}
          />
        </DCArtboard>
        <DCArtboard id="c-beekeeper-view" label="Apicultor · badge primit" width={420} height={220}>
          <div style={{ padding: 18, background: RA.cream, height: '100%', boxSizing: 'border-box' }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: RA.purpleSoft, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>
              Cum arată în aplicația apicultorului
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <ChannelReceivedBadge via="apel"/>
              <ChannelReceivedBadge via="sms"/>
              <ChannelReceivedBadge via="aplicatie"/>
            </div>
          </div>
        </DCArtboard>
      </DCSection>

      {/* ─────────── 6. Bee spinner variants ─────────── */}
      <DCSection id="spinner" title="6 · Spinner tematic" subtitle="Albina zboară pe o sinusoidă · respectă prefers-reduced-motion">
        <DCArtboard id="sp-vars" label="Variante mărime" width={420} height={220}>
          <div style={{ padding: 24, background: RA.white, height: '100%', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
            <div style={{ textAlign: 'center' }}>
              <BeeSpinner size="sm"/>
              <div style={{ fontSize: 11, color: RA.inkMuted, marginTop: 8, fontFamily: RA.mono }}>sm · 24</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <BeeSpinner size="md"/>
              <div style={{ fontSize: 11, color: RA.inkMuted, marginTop: 8, fontFamily: RA.mono }}>md · 32</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <BeeSpinner size="lg"/>
              <div style={{ fontSize: 11, color: RA.inkMuted, marginTop: 8, fontFamily: RA.mono }}>lg · 48</div>
            </div>
          </div>
        </DCArtboard>
        <DCArtboard id="sp-inline" label="Inline · cu label" width={420} height={220}>
          <div style={{ padding: 24, background: RA.white, height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 14, justifyContent: 'center' }}>
            <BeeSpinnerInline>Se generează PDF-ul…</BeeSpinnerInline>
            <BeeSpinnerInline>Se trimite la primărie…</BeeSpinnerInline>
            <BeeSpinnerInline>Se confirmă pe ledger…</BeeSpinnerInline>
          </div>
        </DCArtboard>
        <DCArtboard id="sp-overlay" label="Overlay · centrat" width={420} height={300}>
          <div style={{ position: 'relative', height: '100%', background: RA.cream, boxSizing: 'border-box' }}>
            <div style={{ padding: 24, opacity: 0.6 }}>
              <div style={{ height: 16, width: '70%', borderRadius: 4, background: RA.hair, marginBottom: 8 }}/>
              <div style={{ height: 12, width: '50%', borderRadius: 4, background: RA.hairSoft, marginBottom: 16 }}/>
              <div style={{ height: 80, borderRadius: 12, background: RA.hair }}/>
            </div>
            <BeeSpinnerOverlay label="Se încarcă harta…"/>
          </div>
        </DCArtboard>
      </DCSection>

      {/* ─────────── 7. ROeID 2FA ─────────── */}
      <DCSection id="auth" title="7 · ROeID 2FA" subtitle="Cele 6 cifre apar cu stagger 60ms · check ✓ animat înainte de routing">
        <DCArtboard id="auth-2fa" label="2FA · cifre stagger" width={402} height={874}>
          <IOSDevice width={402} height={874}><TwoFactorScreen/></IOSDevice>
        </DCArtboard>
      </DCSection>

      {/* ─────────── 8. Wow micro-moments ─────────── */}
      <DCSection id="wow" title="8 · Wow micro-momente" subtitle="Confetti după cascadă · Albi salută inbox-ul gol · animație lanț ledger · albina care zboară">
        <DCArtboard id="w-empty" label="Empty state · Albi salută" width={380} height={520}>
          <EmptyInbox/>
        </DCArtboard>
        <DCArtboard id="w-ledger" label="Animație lanț ledger · 'Verifică integritate'" width={420} height={220}>
          <div style={{ padding: 20, background: RA.cream, height: '100%', boxSizing: 'border-box' }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: RA.purpleSoft, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 4 }}>
              Verifică integritate · 500ms
            </div>
            <div style={{ fontSize: 13, color: RA.inkSoft, marginBottom: 8 }}>
              4 blocuri se leagă vizibil. Înregistrarea nu poate fi editată — doar înlocuită.
            </div>
            <LedgerChainAnim/>
            <LedgerChip hash="#a7f2…b3" time="2026-05-23 18:04"/>
          </div>
        </DCArtboard>
        <DCArtboard id="w-flyby" label="Albină zboară la sosirea alertei" width={420} height={220}>
          <FlybyDemo/>
        </DCArtboard>
        <DCArtboard id="w-superseded" label="'Înregistrare actualizată ←' · ledger" width={420} height={220}>
          <SupersededDemo/>
        </DCArtboard>
      </DCSection>

      {/* ─────────── 9. Tone of voice + palette ─────────── */}
      <DCSection id="vsys" title="9 · Sistemul vizual + tonul vocii" subtitle="Paletă, tipografie, motive · ce facem și ce nu facem">
        <DCArtboard id="palette" label="Paletă · roluri" width={620} height={260}>
          <PaletteCard/>
        </DCArtboard>
        <DCArtboard id="voice" label="Voce · Don't / Do" width={620} height={400}>
          <VoiceCard/>
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

// ───────────────────────────── Helper artboards ─────────────────────────────

function CascadeStateCard({ name, village, hives, channels, via }) {
  const bk = { id: 'x', name, village, hives, channels, resolvedVia: via };
  return (
    <div style={{ padding: 16, background: RA.cream, height: '100%', boxSizing: 'border-box' }}>
      <BeekeeperRow bk={bk} delay={0}/>
    </div>
  );
}

function EmptyInbox() {
  return (
    <div style={{ height: '100%', background: RA.white, boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 24, position: 'relative', overflow: 'hidden' }}>
      <Honeycomb opacity={0.05} color={RA.purple} size={20}/>
      <div style={{ position: 'relative', textAlign: 'center' }}>
        <Albi size={120} mood="wave"/>
        <div style={{ fontSize: 19, fontWeight: 700, color: RA.ink, letterSpacing: '-0.02em', marginTop: 8 }}>
          Zero alerte. Zumzet liniștit.
        </div>
        <div style={{ fontSize: 13.5, color: RA.inkSoft, marginTop: 6, maxWidth: 260, marginInline: 'auto', lineHeight: 1.4 }}>
          Când un fermier anunță o stropire în apropiere, te anunț imediat. Tu vezi-ți de albine.
        </div>
        <div style={{ marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '6px 10px', borderRadius: 999, background: RA.cream, color: RA.purpleSoft,
          fontSize: 11.5, fontWeight: 600, border: `1px solid ${RA.hairSoft}` }}>
          <Icons.shield size={12}/> Sunt cu ochii pe 3 km în jurul stupinelor tale
        </div>
      </div>
    </div>
  );
}

function FlybyDemo() {
  const [active, setActive] = React.useState(false);
  React.useEffect(() => {
    const cycle = () => {
      setActive(false);
      setTimeout(() => setActive(true), 100);
    };
    cycle();
    const id = setInterval(cycle, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ position: 'relative', height: '100%', background: RA.cream, padding: 16, boxSizing: 'border-box', overflow: 'hidden' }}>
      <FlybyBee active={active}/>
      <div style={{ paddingTop: 50 }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: RA.purpleSoft, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 4 }}>
          Sosire alertă
        </div>
        <div style={{ fontSize: 13, color: RA.inkSoft }}>
          O albină traversează ecranul când push-ul aterizează. Total ~1.6s. Dezactivat pentru reduced-motion.
        </div>
      </div>
    </div>
  );
}

function SupersededDemo() {
  return (
    <div style={{ padding: 16, background: RA.cream, height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ fontSize: 11.5, fontWeight: 700, color: RA.purpleSoft, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        Înregistrare imutabilă
      </div>
      <div style={{ padding: 10, borderRadius: 10, background: RA.white, border: `1px solid ${RA.hairSoft}`, opacity: 0.55 }}>
        <div style={{ fontSize: 12.5, color: RA.ink }}>Stropire · Decis Mega · A12</div>
        <div style={{ fontSize: 11, color: RA.inkMuted, marginTop: 2 }}>
          <span style={{ fontFamily: RA.mono }}>#83bc…1f</span> · 22 mai 16:30
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: RA.purpleSoft, fontWeight: 600 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 14 4 9l5-5"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>
        Înregistrare actualizată · referință în noua intrare
      </div>
      <div style={{ padding: 10, borderRadius: 10, background: RA.white, border: `1px solid ${RA.purple}` }}>
        <div style={{ fontSize: 12.5, color: RA.ink, fontWeight: 600 }}>Stropire · Decis Mega · A12 <span style={{ color: RA.purple, fontWeight: 500, fontSize: 11 }}>· corectat ora</span></div>
        <div style={{ fontSize: 11, color: RA.inkMuted, marginTop: 2 }}>
          <span style={{ fontFamily: RA.mono }}>#22d1…ab</span> · 22 mai 17:02 · referință <span style={{ fontFamily: RA.mono, color: RA.purpleSoft }}>#83bc…1f</span>
        </div>
      </div>
    </div>
  );
}

function PaletteCard() {
  const swatches = [
    { hex: RA.purple,     name: 'Royal Purple', role: 'Acțiuni principale, titluri' },
    { hex: RA.purpleSoft, name: 'Soft Purple',  role: 'Hover, info, gradient' },
    { hex: RA.honey,      name: 'Honey Orange', role: 'Avertisment, toxicitate' },
    { hex: RA.pollen,     name: 'Pollen Yellow',role: 'Mascot, accent · niciodată text' },
    { hex: RA.safe,       name: 'Safe Green',   role: 'Succes, "în siguranță"' },
    { hex: RA.alert,      name: 'Alert Red',    role: 'T+, pagube' },
  ];
  return (
    <div style={{ padding: 20, background: RA.white, height: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {swatches.map((s) => (
          <div key={s.hex} style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid ${RA.hairSoft}` }}>
            <div style={{ height: 56, background: s.hex }}/>
            <div style={{ padding: '8px 10px' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: RA.ink }}>{s.name}</div>
              <div style={{ fontSize: 10, color: RA.inkMuted }}>{s.role}</div>
              <div style={{ fontSize: 10.5, color: RA.purpleSoft, fontFamily: RA.mono, marginTop: 2 }}>{s.hex}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VoiceCard() {
  const rows = [
    ['Statusul colmenei dvs. este: SIGUR',          'Stupina ta e în siguranță'],
    ['Eroare 503. Operație eșuată.',                'N-am putut trimite emailul către primărie. Reîncerc în 30s.'],
    ['Confirmați acțiunea',                          'Mut stupii'],
    ['Vă mulțumim pentru utilizare',                 'Gata! Apicultorii din zonă știu.'],
  ];
  return (
    <div style={{ padding: 20, background: RA.white, height: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, marginBottom: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: RA.alert, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Nu facem</div>
        <div style={{ fontSize: 11, fontWeight: 700, color: RA.safe,  letterSpacing: '0.05em', textTransform: 'uppercase' }}>Facem</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {rows.map(([no, yes], i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14,
            padding: '12px 0', borderTop: `1px solid ${RA.hairSoft}`,
          }}>
            <div style={{ fontSize: 13.5, color: RA.inkSoft, textDecoration: 'line-through', textDecorationColor: 'rgba(220,38,38,0.4)' }}>{no}</div>
            <div style={{ fontSize: 13.5, color: RA.ink, fontWeight: 500 }}>{yes}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, padding: 10, borderRadius: 10, background: RA.cream, fontSize: 12, color: RA.inkSoft }}>
        Tu peste tot. <b style={{ color: RA.purple }}>Niciodată „dvs." în CTA</b>. Verbe imperative, scurte.
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
