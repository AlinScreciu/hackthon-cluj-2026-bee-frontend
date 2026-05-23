// Three role dashboards: Apicultor, Fermier, Inspector
// Each rendered inside an IOSDevice frame (mobile-first).

// ─────────────────────────────────────────────────────────────
// APICULTOR (Beekeeper) DASHBOARD
// ─────────────────────────────────────────────────────────────
function ApicultorDashboard({ withAlert = false, confirmed = false }) {
  const tabs = [
    { label: 'Acasă',  icon: Icons.home },
    { label: 'Stupine',icon: Icons.hive },
    { label: 'Alerte', icon: Icons.bell },
    { label: 'Profil', icon: Icons.user },
  ];

  const alert = {
    id: 'alrt-001',
    farmer: 'Maria Popescu',
    parcel: 'Apahida · Parcela A12',
    distanceKm: 1.8,
    eta: 'mâine, 06:30',
    wind: 'NV · 12 km/h',
    tox: 'T+',
    substance: 'Confidor Energy',
    channels: { push: 'opened', call: confirmed ? 'confirmed' : 'unreached', sms: 'sent' },
    hash: '#a7f2…b3',
    hashTime: '2026-05-23 18:04',
  };

  return (
    <div style={{ height: '100%', background: RA.cream, paddingTop: 108, paddingBottom: 78, position: 'relative' }}>
      <PhoneTop role="apicultor" unread={withAlert ? 2 : 0}/>

      <div style={{ padding: '14px 16px', overflowY: 'auto', height: '100%', boxSizing: 'border-box' }}>
        {/* Hero */}
        {withAlert ? (
          <HeroBanner kind="warn"
            eyebrow="Atenție"
            title="2 alerte active"
            subtitle="Stropire la 1.8 km de Stupina Apahida"
          />
        ) : (
          <HeroBanner kind="safe"
            eyebrow="Bună dimineața, Andrei"
            title="Stupinele tale sunt în siguranță"
            subtitle="3 stupine · 184 stupi · 0 alerte"
          />
        )}

        {/* Active alert card if needed */}
        {withAlert && (
          <div style={{ marginTop: 14 }}>
            <BzzBzzAlert alert={alert} confirmed={confirmed} confirmedVia="apel"/>
          </div>
        )}

        {/* Apiaries list */}
        <SectionTitle>Stupinele tale</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <ApiaryCard name="Stupina Apahida"  village="Apahida"  hives={62} status={withAlert ? 'danger' : 'safe'} distanceTo={withAlert ? '1.8 km de stropire' : null} wind="NV · 12 km/h"/>
          <ApiaryCard name="Stupina Florești" village="Florești" hives={48} status="safe"   distanceTo={null} wind="V · 6 km/h"/>
          <ApiaryCard name="Stupina Gilău"    village="Gilău"    hives={74} status="watch"  distanceTo="4.2 km de stropire Mospilan" wind="N · 9 km/h"/>
        </div>

        {/* Recent activity */}
        <SectionTitle>Activitate recentă</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <ActivityRow when="ieri, 14:02" text="Maria Popescu a anunțat stropire cu Decis Mega" tox="T-" hash="#83bc…1f"/>
          <ActivityRow when="luni, 09:30" text="Confirmat prin SMS · Ion Mureșan · Karate Zeon" tox="T" hash="#22d1…ab"/>
          <ActivityRow when="duminică"    text="Stupina Florești · raport săptămânal generat" hash="#0934…fc"/>
        </div>
      </div>

      <PhoneTabs tabs={tabs} active={withAlert ? 2 : 0}/>
    </div>
  );
}

function HeroBanner({ kind, eyebrow, title, subtitle }) {
  const isSafe = kind === 'safe';
  const ink   = isSafe ? RA.safe : RA.honey;
  const bg    = isSafe ? 'linear-gradient(135deg, #f1faf3 0%, #e7f5ec 100%)' : 'linear-gradient(135deg, #fff7e0 0%, #fdebc1 100%)';
  return (
    <div style={{
      position: 'relative', overflow: 'hidden', borderRadius: 16,
      background: bg, padding: 16, border: `1px solid ${isSafe ? 'rgba(22,163,74,0.18)' : 'rgba(238,167,39,0.25)'}`,
    }}>
      <Honeycomb opacity={0.05} color={ink} size={16}/>
      {/* Mascot tucked in corner */}
      <div style={{ position: 'absolute', right: -10, bottom: -8, opacity: 0.35 }}>
        <Albi size={84}/>
      </div>
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: ink, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          {isSafe ? <Icons.shield size={12} color={ink}/> : <Icons.warn size={12} color={ink}/>}
          {eyebrow}
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, color: RA.ink, letterSpacing: '-0.02em', marginTop: 4, lineHeight: 1.15, textWrap: 'pretty' }}>
          {title}
        </div>
        <div style={{ fontSize: 13, color: RA.inkSoft, marginTop: 4, maxWidth: '85%' }}>
          {subtitle}
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '18px 0 8px' }}>
      <h2 style={{ fontSize: 13, fontWeight: 700, color: RA.purple, letterSpacing: '0.02em', margin: 0, textTransform: 'uppercase' }}>{children}</h2>
      {action && <span style={{ fontSize: 12, color: RA.purpleSoft, fontWeight: 600 }}>{action}</span>}
    </div>
  );
}

function ApiaryCard({ name, village, hives, status, distanceTo, wind }) {
  const kind = status;
  const label = { safe: 'Sigur', watch: 'Atenție', danger: 'Pericol' }[status];

  return (
    <div style={{
      background: RA.white, borderRadius: 14, padding: 12,
      border: `1px solid ${RA.hairSoft}`,
      boxShadow: '0 1px 0 rgba(77,43,140,0.04)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: kind === 'safe' ? 'rgba(22,163,74,0.10)' : kind === 'watch' ? 'rgba(238,167,39,0.14)' : 'rgba(220,38,38,0.10)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto',
        }}>
          <Icons.hive size={20} color={kind === 'safe' ? RA.safe : kind === 'watch' ? RA.honey : RA.alert}/>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ fontSize: 14.5, fontWeight: 700, color: RA.ink, letterSpacing: '-0.01em' }}>{name}</div>
            <StatusPill kind={kind}>{label}</StatusPill>
          </div>
          <div style={{ fontSize: 12, color: RA.inkMuted, marginTop: 2 }}>
            {village} · <span style={{ fontFamily: RA.mono }}>{hives} stupi</span>
          </div>
          {distanceTo && (
            <div style={{
              marginTop: 8, padding: '6px 8px', borderRadius: 8,
              background: kind === 'danger' ? 'rgba(220,38,38,0.06)' : 'rgba(238,167,39,0.08)',
              fontSize: 12, color: kind === 'danger' ? RA.alert : '#8a5800', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <Icons.pin size={12} color={kind === 'danger' ? RA.alert : RA.honey}/> {distanceTo}
            </div>
          )}
          <div style={{ display: 'flex', gap: 6, marginTop: 8, alignItems: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: RA.inkSoft }}>
              <Icons.wind size={11} color={RA.purpleSoft}/> {wind}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityRow({ when, text, tox, hash }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
      background: RA.white, borderRadius: 12, border: `1px solid ${RA.hairSoft}`,
    }}>
      <div style={{ width: 6, height: 6, borderRadius: 99, background: RA.purpleSoft, flex: '0 0 auto' }}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: RA.ink, fontWeight: 500, lineHeight: 1.35 }}>{text}</div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 4, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, color: RA.inkMuted, fontFamily: RA.mono }}>{when}</span>
          {tox && <ToxBadge tox={tox}/>}
          <span style={{ fontSize: 10.5, fontFamily: RA.mono, color: RA.purpleSoft, fontWeight: 500 }}>{hash}</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// FERMIER (Farmer) DASHBOARD
// ─────────────────────────────────────────────────────────────
function FermierDashboard() {
  const tabs = [
    { label: 'Acasă',    icon: Icons.home },
    { label: 'Parcele',  icon: Icons.map  },
    { label: 'Rapoarte', icon: Icons.list },
    { label: 'Profil',   icon: Icons.user },
  ];

  return (
    <div style={{ height: '100%', background: RA.cream, paddingTop: 108, paddingBottom: 78, position: 'relative' }}>
      <PhoneTop role="fermier" unread={0}/>

      <div style={{ padding: '14px 16px', overflowY: 'auto', height: '100%', boxSizing: 'border-box' }}>
        {/* Hero CTA */}
        <div style={{
          position: 'relative', overflow: 'hidden', borderRadius: 18,
          background: `linear-gradient(135deg, ${RA.purple} 0%, ${RA.purpleSoft} 100%)`,
          padding: 18, color: RA.white,
        }}>
          <Honeycomb opacity={0.06} color="#fff" size={18}/>
          <div style={{ position: 'absolute', right: -20, top: -20,
            width: 120, height: 120, borderRadius: 999, background: 'rgba(255,239,95,0.18)', filter: 'blur(20px)' }}/>
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, opacity: 0.8, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Bună dimineața, Maria
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
              Anunți o stropire?
            </div>
            <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>
              Noi vorbim cu primăria și cu apicultorii. Tu doar completezi formularul.
            </div>
            <button style={{
              marginTop: 14, width: '100%', height: 52, borderRadius: 14, border: 'none',
              background: RA.pollen, color: RA.ink,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: RA.font,
              boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
            }}>
              <Icons.plus size={20} color={RA.ink}/> Raport stropire nouă
            </button>
          </div>
        </div>

        {/* Quick stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
          <StatTile big="3" label="Parcele active" sub="13.5 ha total" />
          <StatTile big="12" label="Rapoarte 2026" sub="toate pe ledger"/>
        </div>

        {/* Parcels */}
        <SectionTitle action="Vezi toate">Parcelele tale</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <ParcelRow name="Parcela A12 · Apahida"  surface="4.2 ha" crop="rapiță"            status="liber"     next={null}/>
          <ParcelRow name="Parcela B07 · Jucu"     surface="2.8 ha" crop="porumb"            status="programat" next="mâine 06:30 · Confidor"/>
          <ParcelRow name="Parcela C03 · Bonțida"  surface="6.5 ha" crop="floarea-soarelui"  status="liber"     next={null}/>
        </div>

        {/* Rapoarte recente */}
        <SectionTitle action="Toate →">Rapoarte recente</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <ReportRow when="22 mai 2026, 06:00" parcel="A12" sub="Decis Mega · 4.2 ha"   tox="T-" hash="#83bc…1f"/>
          <ReportRow when="15 mai 2026, 19:30" parcel="B07" sub="Mospilan · 2.8 ha"     tox="T"  hash="#22d1…ab"/>
        </div>

        {/* ANF Export — ghost */}
        <button style={{
          marginTop: 14, width: '100%', height: 48, borderRadius: 12,
          background: RA.white, color: RA.purple, border: `1.5px solid ${RA.hair}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: RA.font,
        }}>
          <Icons.file size={16} color={RA.purple}/> Export Registru ANF · 3 ani
        </button>
      </div>

      <PhoneTabs tabs={tabs} active={0}/>
    </div>
  );
}

function StatTile({ big, label, sub }) {
  return (
    <div style={{
      background: RA.white, borderRadius: 14, padding: 14,
      border: `1px solid ${RA.hairSoft}`,
    }}>
      <div style={{ fontSize: 26, fontWeight: 700, color: RA.purple, fontFamily: RA.font, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>{big}</div>
      <div style={{ fontSize: 12, fontWeight: 600, color: RA.ink, marginTop: 2 }}>{label}</div>
      <div style={{ fontSize: 10.5, color: RA.inkMuted, marginTop: 1 }}>{sub}</div>
    </div>
  );
}

function ParcelRow({ name, surface, crop, status, next }) {
  const map = {
    liber:     { kind: 'safe',  label: 'Liber' },
    programat: { kind: 'watch', label: 'Programat' },
    progress:  { kind: 'danger',label: 'În progres' },
  };
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 6,
      padding: 12, borderRadius: 12, background: RA.white,
      border: `1px solid ${RA.hairSoft}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(238,167,39,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
          <Icons.map size={18} color={RA.honey}/>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: RA.ink, letterSpacing: '-0.01em' }}>{name}</div>
          <div style={{ fontSize: 12, color: RA.inkMuted }}>{surface} · {crop}</div>
        </div>
        <StatusPill kind={map[status].kind}>{map[status].label}</StatusPill>
      </div>
      {next && (
        <div style={{
          marginLeft: 44, padding: '6px 8px', borderRadius: 8,
          background: 'rgba(238,167,39,0.10)', color: '#8a5800',
          fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <Icons.bell size={11} color={RA.honey}/> Următoarea: {next}
        </div>
      )}
    </div>
  );
}

function ReportRow({ when, parcel, sub, tox, hash }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: 12, borderRadius: 12, background: RA.white,
      border: `1px solid ${RA.hairSoft}`,
    }}>
      <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(77,43,140,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
        <Icons.file size={15} color={RA.purple}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, color: RA.ink, fontWeight: 600 }}>Parcela {parcel} · <span style={{ color: RA.inkSoft, fontWeight: 500 }}>{sub}</span></div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 4, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, color: RA.inkMuted, fontFamily: RA.mono }}>{when}</span>
          <ToxBadge tox={tox}/>
          <span style={{ fontSize: 10.5, fontFamily: RA.mono, color: RA.purpleSoft, fontWeight: 500 }}>{hash}</span>
        </div>
      </div>
      <Icons.chevR size={16} color={RA.inkMuted}/>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// INSPECTOR (ANF) DASHBOARD
// ─────────────────────────────────────────────────────────────
function InspectorDashboard() {
  const tabs = [
    { label: 'Acasă',  icon: Icons.home },
    { label: 'Hartă',  icon: Icons.map  },
    { label: 'Pagube', icon: Icons.warn },
    { label: 'Profil', icon: Icons.user },
  ];

  return (
    <div style={{ height: '100%', background: RA.cream, paddingTop: 108, paddingBottom: 78, position: 'relative' }}>
      <PhoneTop role="inspector" unread={4}/>

      <div style={{ padding: '14px 16px', overflowY: 'auto', height: '100%', boxSizing: 'border-box' }}>
        {/* Greeting */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: RA.purpleSoft, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Inspector Vlad Sîrbu
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: RA.ink, margin: '4px 0 4px', letterSpacing: '-0.02em' }}>
            Județul Cluj · Săptămâna 21
          </h1>
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          <BigStat big="247" label="Stupine active"  sub="în județ" tone="purple"/>
          <BigStat big="18"  label="Stropiri"        sub="săpt. asta" tone="honey"/>
          <BigStat big="3"   label="Pagube"          sub="raportate" tone="alert"/>
        </div>

        {/* Map */}
        <SectionTitle action="Hartă completă →">Hartă activitate</SectionTitle>
        <div style={{ position: 'relative' }}>
          <RiskMap height={170} withCone={true} withApiaries={true}/>
          {/* legend */}
          <div style={{
            position: 'absolute', bottom: 8, left: 8, right: 8, display: 'flex', gap: 8,
            padding: 8, borderRadius: 10, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(4px)',
            fontSize: 10.5, fontWeight: 600,
          }}>
            <LegendDot color={RA.pollen} border={RA.purple} label="Stupine"/>
            <LegendDot color={RA.alert} label="Stropiri active"/>
            <LegendDot color={RA.alert} label="Pagube" outline/>
          </div>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 6, marginTop: 12, overflowX: 'auto', paddingBottom: 4 }}>
          {['Toate', 'Apahida', 'Florești', 'Jucu', 'Tureni', 'Gilău'].map((f, i) => (
            <button key={f} style={{
              padding: '6px 12px', borderRadius: 999, whiteSpace: 'nowrap',
              background: i === 0 ? RA.purple : RA.white, color: i === 0 ? RA.white : RA.inkSoft,
              border: `1px solid ${i === 0 ? RA.purple : RA.hair}`,
              fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: RA.font,
            }}>{f}</button>
          ))}
        </div>

        {/* Pagube queue */}
        <SectionTitle action="Toate (3) →">Pagube de revizuit</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <ClaimRow
            beekeeper="Cristina Pop" location="Tureni" hives="22 stupi morți"
            when="acum 4h" tox="T+" hash="#fa31…0c"
          />
          <ClaimRow
            beekeeper="Andrei Bodea" location="Apahida" hives="reginele afectate"
            when="ieri 11:20" tox="T" hash="#88c4…d2"
          />
        </div>
      </div>

      <PhoneTabs tabs={tabs} active={0}/>
    </div>
  );
}

function BigStat({ big, label, sub, tone }) {
  const colorMap = { purple: RA.purple, honey: RA.honey, alert: RA.alert };
  const c = colorMap[tone];
  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      background: RA.white, borderRadius: 14, padding: 12,
      border: `1px solid ${RA.hairSoft}`,
    }}>
      <div style={{ position: 'absolute', top: -8, right: -8, width: 40, height: 40, borderRadius: 999,
        background: c, opacity: 0.10, filter: 'blur(8px)' }}/>
      <div style={{ position: 'relative' }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: c, fontFamily: RA.font, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>{big}</div>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: RA.ink, marginTop: 2, letterSpacing: '-0.01em' }}>{label}</div>
        <div style={{ fontSize: 10, color: RA.inkMuted, marginTop: 1 }}>{sub}</div>
      </div>
    </div>
  );
}

function LegendDot({ color, border, label, outline }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <span style={{
        width: 8, height: 8, borderRadius: 99, background: outline ? 'transparent' : color,
        border: outline ? `1.5px solid ${color}` : border ? `1.2px solid ${border}` : 'none',
      }}/>
      <span style={{ color: RA.inkSoft }}>{label}</span>
    </div>
  );
}

function ClaimRow({ beekeeper, location, hives, when, tox, hash }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      padding: 12, borderRadius: 12, background: RA.white,
      border: `1px solid ${RA.hairSoft}`, borderLeft: `3px solid ${RA.alert}`,
    }}>
      {/* Photo placeholder */}
      <div style={{
        width: 48, height: 48, borderRadius: 10, flex: '0 0 auto',
        background: `repeating-linear-gradient(45deg, #f4eede 0 6px, #ebe1c7 6px 12px)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: `1px solid ${RA.hairSoft}`,
      }}>
        <Icons.camera size={18} color={RA.inkMuted}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: RA.ink, letterSpacing: '-0.01em' }}>{beekeeper}</div>
        <div style={{ fontSize: 12.5, color: RA.inkSoft }}>{location} · {hives}</div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, color: RA.inkMuted, fontFamily: RA.mono }}>{when}</span>
          <ToxBadge tox={tox}/>
          <span style={{ fontSize: 10.5, fontFamily: RA.mono, color: RA.purpleSoft, fontWeight: 500 }}>{hash}</span>
        </div>
      </div>
      <Icons.chevR size={16} color={RA.inkMuted}/>
    </div>
  );
}

Object.assign(window, {
  ApicultorDashboard, FermierDashboard, InspectorDashboard,
  HeroBanner, SectionTitle, ApiaryCard, ActivityRow,
  StatTile, ParcelRow, ReportRow, BigStat, ClaimRow,
});
