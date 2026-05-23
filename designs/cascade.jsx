// NotificationCascade — farmer's live status checklist showing each beekeeper's
// 3-channel notification escalation (push, call, SMS) in real time.
// Plus a 'system' line for PDF + email + ledger.

/**
 * @typedef {Object} CascadeBeekeeper
 * @property {string} id
 * @property {string} name
 * @property {string} village
 * @property {number} hives
 * @property {{push:'sent'|'received'|'opened', call:'pending'|'ringing'|'answered'|'confirmed'|'unreached', sms?:'pending'|'sent'|'confirmed'}} channels
 * @property {'apel'|'sms'|'aplicatie'|null} resolvedVia
 */

/**
 * @param {object} props
 * @param {CascadeBeekeeper[]} props.beekeepers
 * @param {{pdf:boolean, email:boolean, ledger:boolean}} props.system
 */
function NotificationCascade({ beekeepers, system }) {
  // stagger keyframes
  React.useEffect(() => {
    if (document.getElementById('cascade-kf')) return;
    const s = document.createElement('style');
    s.id = 'cascade-kf';
    s.textContent = `
      @keyframes cascIn { 0% { opacity:0; transform: translateY(6px); } 100% { opacity:1; transform: translateY(0); } }
      .casc-row { animation: cascIn .35s cubic-bezier(.2,.7,.3,1) both; }
      @keyframes cascSpin { to { transform: rotate(360deg); } }
      .casc-spin { animation: cascSpin 0.9s linear infinite; }
      @keyframes cascDot { 0%,100% { opacity:.3; } 50% { opacity:1; } }
      .casc-dot { animation: cascDot 1.2s ease-in-out infinite; }
      @media (prefers-reduced-motion: reduce){ .casc-row{ animation: none !important; opacity:1; } }
    `;
    document.head.appendChild(s);
  }, []);

  const systemRows = [
    { key: 'pdf',    label: 'PDF generat',                    icon: Icons.file, done: system.pdf },
    { key: 'email',  label: 'Email trimis la Primăria Apahida', icon: Icons.msg,  done: system.email },
    { key: 'ledger', label: 'Înregistrat pe ledger',         icon: Icons.link, done: system.ledger },
  ];

  return (
    <div style={{
      background: RA.white, borderRadius: 16, padding: 14,
      border: `1px solid ${RA.hairSoft}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: RA.purpleSoft, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Cascadă notificări
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: RA.ink, letterSpacing: '-0.01em', marginTop: 2 }}>
            Trimit raportul…
          </div>
        </div>
        <BeeSpinnerInline>În progres</BeeSpinnerInline>
      </div>

      {/* System rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
        {systemRows.map((r, i) => (
          <div key={r.key} className="casc-row" style={{ animationDelay: `${i * 80}ms`, ...rowStyle }}>
            <div style={iconBubble(r.done ? RA.safe : RA.purpleSoft)}>
              <r.icon size={13} color={RA.white}/>
            </div>
            <div style={{ flex: 1, fontSize: 13.5, fontWeight: 500, color: RA.ink }}>
              {r.label}
            </div>
            {r.done ? <Icons.check size={16} color={RA.safe}/> : <span className="casc-spin" style={{
              width: 14, height: 14, border: `2px solid ${RA.hair}`, borderTopColor: RA.purple, borderRadius: 999,
            }}/>}
          </div>
        ))}
      </div>

      <Divider label={`${beekeepers.length} apicultori în raza de risc`}/>

      {/* Per-beekeeper rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
        {beekeepers.map((b, i) => (
          <BeekeeperRow key={b.id} bk={b} delay={(i + systemRows.length) * 80}/>
        ))}
      </div>
    </div>
  );
}

function BeekeeperRow({ bk, delay }) {
  const isDone = !!bk.resolvedVia;
  const isWaiting = !isDone && (bk.channels.call === 'unreached' && bk.channels.sms === 'sent');

  const accent = isDone ? RA.safe : isWaiting ? RA.honey : RA.purpleSoft;

  return (
    <div className="casc-row" style={{
      animationDelay: `${delay}ms`,
      padding: 10, borderRadius: 12,
      background: isDone ? 'rgba(22,163,74,0.05)' : isWaiting ? 'rgba(238,167,39,0.06)' : RA.cream,
      border: `1px solid ${isDone ? 'rgba(22,163,74,0.18)' : isWaiting ? 'rgba(238,167,39,0.22)' : RA.hairSoft}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 999, flex: '0 0 auto',
          background: 'linear-gradient(135deg, #fff 0%, #fbf0c5 100%)',
          border: `1.5px solid ${accent}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: RA.purple, fontSize: 12, fontWeight: 700, fontFamily: RA.font,
        }}>{bk.name.split(' ').map((p)=>p[0]).join('').slice(0,2)}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: RA.ink, letterSpacing: '-0.01em' }}>{bk.name}</div>
          <div style={{ fontSize: 11.5, color: RA.inkMuted }}>{bk.village} · {bk.hives} stupi</div>
        </div>
        {isDone && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '4px 8px', borderRadius: 999,
            background: 'rgba(22,163,74,0.12)', color: RA.safe,
            fontSize: 11.5, fontWeight: 700,
          }}>
            <Icons.check size={12}/> Confirmat
          </div>
        )}
        {isWaiting && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '4px 8px', borderRadius: 999,
            background: 'rgba(238,167,39,0.18)', color: '#8a5800',
            fontSize: 11.5, fontWeight: 700,
          }}>
            <span className="casc-dot" style={{ width: 6, height: 6, borderRadius: 99, background: RA.honey }}/>
            În așteptare
          </div>
        )}
      </div>

      {/* Channel timeline */}
      <ChannelTimeline bk={bk}/>
    </div>
  );
}

function ChannelTimeline({ bk }) {
  // Builds a horizontal timeline of channel events
  const events = [];
  if (bk.channels.push)  events.push({ k: 'push',  status: bk.channels.push,  time: '18:04:02' });
  if (bk.channels.call)  events.push({ k: 'call',  status: bk.channels.call,  time: '18:04:04' });
  if (bk.channels.sms)   events.push({ k: 'sms',   status: bk.channels.sms,   time: '18:05:14' });

  const channelMap = {
    push: { icon: Icons.push,  label: 'Push' },
    call: { icon: Icons.phone, label: 'Apel' },
    sms:  { icon: Icons.msg,   label: 'SMS' },
  };

  const statusLabel = (k, s) => {
    if (k === 'push') return s === 'opened' ? 'deschis' : s === 'received' ? 'primit' : 'trimis';
    if (k === 'call') return s === 'confirmed' ? 'confirmat ✓' : s === 'answered' ? 'preluat (fără 1)' : s === 'ringing' ? 'sună…' : s === 'unreached' ? 'necontactat' : 'pornit';
    if (k === 'sms')  return s === 'confirmed' ? 'confirmat ✓' : s === 'sent' ? 'trimis' : 'pornit';
    return '';
  };
  const statusColor = (k, s) => {
    if (s === 'confirmed' || s === 'opened') return RA.safe;
    if (s === 'unreached') return RA.honey;
    return RA.inkSoft;
  };

  return (
    <div style={{ display: 'flex', alignItems: 'stretch', gap: 0, marginTop: 10, marginLeft: 40 }}>
      {events.map((ev, i) => {
        const Ic = channelMap[ev.k].icon;
        const col = statusColor(ev.k, ev.status);
        return (
          <React.Fragment key={ev.k}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, paddingRight: 6 }}>
              <div style={{
                width: 22, height: 22, borderRadius: 999, background: col === RA.safe ? 'rgba(22,163,74,0.12)' : col === RA.honey ? 'rgba(238,167,39,0.18)' : RA.hairSoft,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto',
              }}>
                <Ic size={11} color={col}/>
              </div>
              <div style={{ fontSize: 10.5, color: RA.inkSoft, lineHeight: 1.15 }}>
                <div style={{ fontWeight: 700, color: RA.ink }}>{channelMap[ev.k].label}</div>
                <div style={{ color: col, fontWeight: 600 }}>{statusLabel(ev.k, ev.status)}</div>
              </div>
            </div>
            {i < events.length - 1 && (
              <div style={{ alignSelf: 'center', height: 1, flex: 1, minWidth: 12,
                background: `repeating-linear-gradient(to right, ${RA.hair} 0, ${RA.hair} 2px, transparent 2px, transparent 5px)` }}/>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

const rowStyle = {
  display: 'flex', alignItems: 'center', gap: 10,
  padding: '8px 10px', borderRadius: 10,
  background: RA.cream, border: `1px solid ${RA.hairSoft}`,
};
const iconBubble = (color) => ({
  width: 24, height: 24, borderRadius: 999, background: color,
  display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto',
});

function Divider({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
      <div style={{ height: 1, flex: 1, background: RA.hair }}/>
      <div style={{ fontSize: 10.5, fontWeight: 700, color: RA.purpleSoft, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ height: 1, flex: 1, background: RA.hair }}/>
    </div>
  );
}

// ───────────────────────────── Beekeeper channel-chip row (compact, for Bzz card) ─────────────────────────────
// Already in bzz-card.jsx as ChannelChips — but expose a richer "received via" component for docs

function ChannelReceivedBadge({ via = 'apel', callTime = '18:04' }) {
  const map = {
    apel: { icon: Icons.phone, label: 'Confirmat prin apel' },
    sms:  { icon: Icons.msg,   label: 'Confirmat prin SMS' },
    aplicatie: { icon: Icons.push, label: 'Confirmat din aplicație' },
  };
  const m = map[via];
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '6px 10px', borderRadius: 999,
      background: 'rgba(22,163,74,0.10)', color: RA.safe,
      fontSize: 12, fontWeight: 700,
      border: `1px solid rgba(22,163,74,0.25)`,
    }}>
      <m.icon size={13} color={RA.safe}/> {m.label} <Icons.check size={12} color={RA.safe}/>
      {via === 'apel' && (
        <span style={{ fontWeight: 500, color: RA.inkSoft, marginLeft: 4 }}>· {callTime}</span>
      )}
    </div>
  );
}

Object.assign(window, { NotificationCascade, BeekeeperRow, ChannelTimeline, ChannelReceivedBadge, Divider });
