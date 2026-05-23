// ReportForm — Farmer's "Raport stropire" form
// One screen, mobile-first, sticky bottom CTA, smart defaults, inline validation.

const PARCELS = [
  { id: 'A12', label: 'Parcela A12 · Apahida', surface: 4.2, crop: 'rapiță', cadastru: '256713-A12' },
  { id: 'B07', label: 'Parcela B07 · Jucu',     surface: 2.8, crop: 'porumb', cadastru: '256889-B07' },
  { id: 'C03', label: 'Parcela C03 · Bonțida',  surface: 6.5, crop: 'floarea-soarelui', cadastru: '257012-C03' },
];

const SUBSTANCES = [
  { name: 'Confidor Energy',  tox: 'T+', interval: '7 zile' },
  { name: 'Mospilan 20 SG',   tox: 'T',  interval: '5 zile' },
  { name: 'Karate Zeon',      tox: 'T',  interval: '3 zile' },
  { name: 'Decis Mega',       tox: 'T-', interval: '2 zile' },
];

const CROPS = ['rapiță', 'floarea-soarelui', 'porumb', 'grâu', 'lucernă'];

function ReportForm({ onSubmit }) {
  const [parcel, setParcel]       = React.useState(PARCELS[0]);
  const [substance, setSubstance] = React.useState(SUBSTANCES[0]);
  const [crop, setCrop]           = React.useState(PARCELS[0].crop);
  const [surface, setSurface]     = React.useState(PARCELS[0].surface);
  const [date, setDate]           = React.useState('2026-05-24');
  const [time, setTime]           = React.useState('06:30');
  const [notes, setNotes]         = React.useState('');

  return (
    <div style={{ background: RA.cream, padding: '18px 16px 100px', minHeight: '100%' }}>
      {/* Heading */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: RA.purpleSoft, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Pasul 1 din 1</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: RA.ink, margin: '4px 0 4px', letterSpacing: '-0.02em' }}>Raport stropire nouă</h1>
        <p style={{ fontSize: 13, color: RA.inkSoft, margin: 0, lineHeight: 1.45 }}>
          Notificăm automat primăria și apicultorii în raza de risc. <b style={{ color: RA.purple }}>Tu nu trimiți emailuri.</b>
        </p>
      </div>

      {/* Parcel combobox */}
      <Field label="Parcelă" hint="Autofill din cadastru">
        <ComboCard
          icon={<Icons.map size={16} color={RA.purple}/>}
          title={parcel.label}
          subtitle={`${parcel.surface} ha · cadastru ${parcel.cadastru}`}
        />
      </Field>

      {/* Surface + crop, 2-col */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Field label="Suprafață stropită">
          <Input value={`${surface} ha`} mono/>
        </Field>
        <Field label="Cultură">
          <Input value={crop}/>
        </Field>
      </div>

      {/* Substance */}
      <Field label="Substanță" hint="Toxicitate determinată automat">
        <div style={{
          background: RA.white, borderRadius: 12, border: `1.5px solid ${RA.hair}`,
          padding: 12, display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8, background: 'rgba(220,38,38,0.10)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icons.warn size={16} color={RA.alert}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: RA.ink }}>{substance.name}</div>
            <div style={{ fontSize: 11.5, color: RA.inkMuted }}>Pauză minimă apicultori: {substance.interval}</div>
          </div>
          <ToxBadge tox={substance.tox}/>
        </div>
      </Field>

      {/* Substance picker chip row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: -6, marginBottom: 14 }}>
        {SUBSTANCES.map((s) => (
          <button key={s.name} onClick={() => setSubstance(s)} style={{
            background: substance.name === s.name ? RA.purple : RA.white,
            color: substance.name === s.name ? RA.white : RA.inkSoft,
            border: `1.5px solid ${substance.name === s.name ? RA.purple : RA.hair}`,
            borderRadius: 999, padding: '5px 10px', fontSize: 12, fontWeight: 600,
            display: 'inline-flex', alignItems: 'center', gap: 5, cursor: 'pointer',
            fontFamily: RA.font,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: 99, background: toxColor(s.tox) }}/>
            {s.name}
          </button>
        ))}
      </div>

      {/* Date + time */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 10 }}>
        <Field label="Data stropirii">
          <Input value="mâine · 24 mai" mono/>
        </Field>
        <Field label="Ora">
          <Input value="06:30 — 09:00" mono/>
        </Field>
      </div>

      {/* Notes */}
      <Field label="Observații (opțional)">
        <textarea placeholder="ex: vânt slab dimineața, drum acces din nord" style={{
          width: '100%', minHeight: 60, padding: 12, borderRadius: 12,
          border: `1.5px solid ${RA.hair}`, background: RA.white, color: RA.ink,
          fontFamily: RA.font, fontSize: 14, resize: 'none', boxSizing: 'border-box',
        }} value={notes} onChange={(e) => setNotes(e.target.value)} />
      </Field>

      {/* Risk preview banner */}
      <div style={{
        marginTop: 8, padding: 12, borderRadius: 12,
        background: RA.purple, color: RA.white,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{ width: 38, height: 38, borderRadius: 999, background: 'rgba(255,255,255,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icons.bee size={20} color={RA.pollen}/>
        </div>
        <div style={{ flex: 1, fontSize: 13.5, lineHeight: 1.35 }}>
          <b>3 apicultori</b> în raza de 3 km vor primi alertă.
          <div style={{ opacity: 0.8, fontSize: 12, marginTop: 2 }}>Andrei Bodea, Cristina Pop, Vasile Olaru</div>
        </div>
      </div>

      {/* Sticky bottom CTA */}
      <div style={{
        position: 'absolute', bottom: 78, left: 0, right: 0,
        background: 'linear-gradient(to top, rgba(255,251,235,1) 60%, rgba(255,251,235,0))',
        padding: '18px 16px 8px', display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        <button onClick={onSubmit} style={{
          width: '100%', height: 52, borderRadius: 14, border: 'none',
          background: RA.purple, color: RA.white,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em', cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(77,43,140,0.25)',
          fontFamily: RA.font,
        }}>
          <Icons.bee size={18} color={RA.pollen}/> Notifică toți
        </button>
        <button style={{
          width: '100%', height: 36, borderRadius: 10, background: 'transparent',
          color: RA.purple, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          fontFamily: RA.font,
        }}>Salvează ca draft</button>
      </div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
        <label style={{ fontSize: 12, fontWeight: 700, color: RA.ink, letterSpacing: '-0.01em' }}>{label}</label>
        {hint && <span style={{ fontSize: 11, color: RA.purpleSoft, fontWeight: 600 }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Input({ value, mono = false }) {
  return (
    <div style={{
      background: RA.white, borderRadius: 12, border: `1.5px solid ${RA.hair}`,
      padding: '12px 14px', fontSize: 14, fontWeight: 500, color: RA.ink,
      fontFamily: mono ? RA.mono : RA.font,
    }}>{value}</div>
  );
}

function ComboCard({ icon, title, subtitle }) {
  return (
    <div style={{
      background: RA.white, borderRadius: 12, border: `1.5px solid ${RA.purple}`,
      padding: 12, display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <div style={{
        width: 30, height: 30, borderRadius: 8, background: 'rgba(77,43,140,0.10)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: RA.ink }}>{title}</div>
        <div style={{ fontSize: 11.5, color: RA.inkMuted, fontFamily: RA.mono }}>{subtitle}</div>
      </div>
      <Icons.check size={16} color={RA.purple}/>
    </div>
  );
}

Object.assign(window, { ReportForm, PARCELS, SUBSTANCES });
