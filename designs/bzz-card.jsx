// BzzBzzAlert — urgent alert card shown to beekeepers
// Spring scale-in 0.95 → 1.0, 1-frame yellow→orange flash on the left border,
// 2-cycle box-shadow pulse, then static. Persistent. role="alert" / aria-live="assertive".

/**
 * @typedef {Object} BzzAlert
 * @property {string} id
 * @property {string} farmer
 * @property {string} parcel        - e.g. "Apahida · Parcela A12"
 * @property {number} distanceKm
 * @property {string} eta           - "mâine, 06:30"
 * @property {string} wind          - "NV · 12 km/h"
 * @property {'T+'|'T'|'T-'} tox
 * @property {string} substance
 * @property {{push:'sent'|'received'|'opened', call:'pending'|'answered'|'confirmed'|'unreached', sms?:'sent'|'confirmed'}} channels
 * @property {string} hash
 * @property {string} hashTime
 */

/**
 * @param {object} props
 * @param {BzzAlert} props.alert
 * @param {boolean} [props.confirmed]
 * @param {'apel'|'sms'|'aplicatie'} [props.confirmedVia]
 * @param {()=>void} [props.onMove]
 * @param {()=>void} [props.onSeal]
 */
function BzzBzzAlert({ alert, confirmed = false, confirmedVia = 'apel', onMove, onSeal }) {
  // mount animation
  const ref = React.useRef(null);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);

  React.useEffect(() => {
    if (document.getElementById('bzz-kf')) return;
    const s = document.createElement('style');
    s.id = 'bzz-kf';
    s.textContent = `
      @keyframes bzzIn { 0% { opacity:0; transform: scale(0.95); } 100% { opacity:1; transform: scale(1); } }
      @keyframes bzzFlash { 0% { background: ${RA.pollen}; } 100% { background: ${RA.honey}; } }
      @keyframes bzzPulse { 0%,100% { box-shadow: 0 8px 24px rgba(238,167,39,0.0), 0 0 0 0 rgba(238,167,39,0); }
        50% { box-shadow: 0 8px 28px rgba(238,167,39,0.18), 0 0 0 4px rgba(238,167,39,0.18); } }
      @keyframes bzzWing { 0%,100% { transform: rotate(-8deg); } 50% { transform: rotate(14deg); } }
      .bzz-card { animation: bzzIn .42s cubic-bezier(.2,.9,.3,1.1); }
      .bzz-border { animation: bzzFlash .42s ease-out; }
      .bzz-wrap { animation: bzzPulse 1.4s ease-out 2; }
      .bzz-wing { animation: bzzWing .16s ease-in-out 3; transform-origin: 50% 90%; }
      @media (prefers-reduced-motion: reduce) {
        .bzz-card,.bzz-border,.bzz-wrap,.bzz-wing { animation: none !important; }
        .bzz-card { transition: opacity .2s ease-out; }
      }
    `;
    document.head.appendChild(s);
  }, []);

  const accent = confirmed ? RA.safe : RA.honey;

  return (
    <div ref={ref} className={confirmed ? 'bzz-card' : 'bzz-card bzz-wrap'}
      role="alert" aria-live="assertive"
      style={{
        position: 'relative',
        background: RA.white, borderRadius: 16, overflow: 'hidden',
        boxShadow: '0 1px 0 rgba(77,43,140,0.04), 0 8px 24px rgba(77,43,140,0.08)',
        border: `1px solid ${RA.hairSoft}`,
      }}>
      {/* left border accent */}
      <div className={confirmed ? '' : 'bzz-border'} aria-hidden="true" style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: accent,
      }}/>

      {/* Header */}
      <div style={{ padding: '14px 14px 10px 18px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, background: RA.pollen,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto',
        }}>
          <svg className="bzz-wing" width="22" height="22" viewBox="0 0 24 24" fill="none">
            <Icons.bee size={22} color={RA.purple}/>
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: confirmed ? RA.safe : RA.honey, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            {confirmed ? 'Alertă confirmată' : 'Bzz Bzz · Alertă urgentă'}
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, color: RA.purple, letterSpacing: '-0.015em', marginTop: 2 }}>
            Stropire la {alert.distanceKm} km de stupină
          </div>
          <div style={{ fontSize: 13, color: RA.inkSoft, marginTop: 2 }}>
            <b style={{ color: RA.ink, fontWeight: 600 }}>{alert.farmer}</b> · {alert.parcel}
          </div>
        </div>
        {confirmed && (
          <div style={{
            width: 28, height: 28, borderRadius: 999, background: RA.safe,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto',
          }}>
            <Icons.check size={16} color={RA.white}/>
          </div>
        )}
      </div>

      {/* Map preview */}
      <div style={{ padding: '0 14px' }}>
        <RiskMap height={120} withCone={true}/>
      </div>

      {/* Stat row */}
      <div style={{ padding: '12px 14px 0', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <Chip><Icons.pin size={11} color={RA.purple}/> {alert.distanceKm} km</Chip>
        <Chip><span style={{ fontWeight: 700, color: RA.purple }}>{alert.eta}</span></Chip>
        <Chip><Icons.wind size={11} color={RA.purple}/> {alert.wind}</Chip>
        <ToxBadge tox={alert.tox}/>
      </div>

      {/* Substance line */}
      <div style={{ padding: '10px 14px 0', fontSize: 13, color: RA.inkSoft }}>
        Substanță: <b style={{ color: RA.ink }}>{alert.substance}</b>
      </div>

      {/* Channel-status row — persistent */}
      <div style={{ padding: '12px 14px 0' }}>
        <ChannelChips channels={alert.channels} confirmed={confirmed} confirmedVia={confirmedVia}/>
      </div>

      {/* CTAs */}
      {!confirmed ? (
        <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button onClick={onMove} style={btnPrimary}>
            <Icons.arrowUp size={16} color={RA.white}/>
            Mut stupii
          </button>
          <button onClick={onSeal} style={btnGhost}>
            <Icons.shield size={16} color={RA.purple}/>
            Sigilez aici
          </button>
        </div>
      ) : (
        <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 12px', borderRadius: 10,
            background: 'rgba(22,163,74,0.08)', color: RA.safe, fontSize: 13.5, fontWeight: 600,
          }}>
            <Icons.check size={16}/> Confirmat prin {confirmedVia === 'apel' ? 'apel telefonic' : confirmedVia === 'sms' ? 'SMS' : 'aplicație'}
          </div>
        </div>
      )}

      {/* Ledger chip footer */}
      <div style={{
        padding: '10px 14px 14px', borderTop: `1px solid ${RA.hairSoft}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
      }}>
        <LedgerChip hash={alert.hash} time={alert.hashTime}/>
        <button aria-label="Verifică integritate" style={{
          background: 'none', border: 'none', color: RA.purpleSoft, fontSize: 11.5, fontWeight: 600,
          cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4,
        }}>Verifică integritate <Icons.chevR size={11} color={RA.purpleSoft}/></button>
      </div>
    </div>
  );
}

// Chip primitive (for stat row)
function Chip({ children }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 8px', borderRadius: 6, background: RA.hairSoft,
      fontSize: 11.5, fontWeight: 600, color: RA.inkSoft,
    }}>{children}</div>
  );
}

// Channel chips — shows which channels reached this beekeeper
function ChannelChips({ channels, confirmed, confirmedVia }) {
  const items = [
    { key: 'push', label: 'Push primit',  icon: Icons.push,  active: !!channels.push, time: '18:04' },
    { key: 'call', label: channels.call === 'confirmed' ? 'Apel preluat' : channels.call === 'unreached' ? 'Apel ratat' : 'Apel la 18:04',
      icon: Icons.phone, active: channels.call !== undefined,  time: '18:04' },
    { key: 'sms',  label: 'SMS la 18:05',  icon: Icons.msg,   active: !!channels.sms,  time: '18:05' },
  ];

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {items.map((it) => {
        if (!it.active) return null;
        const isWinner = confirmed && (
          (confirmedVia === 'apel' && it.key === 'call') ||
          (confirmedVia === 'sms' && it.key === 'sms') ||
          (confirmedVia === 'aplicatie' && it.key === 'push')
        );
        const Ic = it.icon;
        return (
          <div key={it.key} style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '5px 9px', borderRadius: 999,
            background: isWinner ? 'rgba(22,163,74,0.10)' : RA.hairSoft,
            color: isWinner ? RA.safe : RA.inkSoft,
            fontSize: 11.5, fontWeight: 600,
            border: isWinner ? `1px solid rgba(22,163,74,0.25)` : '1px solid transparent',
          }}>
            <Ic size={12} color={isWinner ? RA.safe : RA.purpleSoft}/>
            {isWinner ? `Confirmat prin ${it.key === 'call' ? 'apel' : it.key === 'sms' ? 'SMS' : 'aplicație'}` : it.label}
            {isWinner && <Icons.check size={11} color={RA.safe}/>}
          </div>
        );
      })}
    </div>
  );
}

const btnPrimary = {
  width: '100%', height: 48, borderRadius: 12, border: 'none',
  background: RA.purple, color: RA.white,
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em', cursor: 'pointer',
  fontFamily: RA.font,
};
const btnGhost = {
  width: '100%', height: 44, borderRadius: 12,
  background: RA.white, color: RA.purple, border: `1.5px solid ${RA.hair}`,
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  fontSize: 14, fontWeight: 600, cursor: 'pointer',
  fontFamily: RA.font,
};

Object.assign(window, { BzzBzzAlert, Chip, ChannelChips });
