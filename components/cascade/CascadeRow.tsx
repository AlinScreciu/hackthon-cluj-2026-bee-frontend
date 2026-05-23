'use client'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Phone, MessageSquare, Bell, Wind } from 'lucide-react'
import { ConfettiBurst } from '@/components/feedback/ConfettiBurst'
import { LedgerChip } from '@/components/feedback/LedgerChip'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import type { AlertDispatchPublic, ChannelStates } from '@/lib/api/types'

// ── channel helpers ───────────────────────────────────────────────────────────

function stateLabel(state: string): string {
  const labels: Record<string, string> = {
    pending: 'așteptare', queued: 'coadă', sent: 'trimis', delivered: 'livrat',
    opened: 'deschis', ringing: 'sună', answered: 'răspuns', confirmed: 'confirmat ✓',
    no_input: 'fără răspuns', no_answer: 'necontactat', busy: 'ocupat',
    failed: 'eșuat', hung_up: 'închis', no_reply: 'fără reply', skipped: 'omis',
  }
  return labels[state] ?? state
}

type ChannelColor = { dot: string; text: string; bg: string }

function channelColor(state: string): ChannelColor {
  if (['confirmed', 'opened'].includes(state))
    return { dot: '#16A34A', text: 'text-safe', bg: 'rgba(22,163,74,0.08)' }
  if (['failed', 'no_answer', 'no_input', 'no_reply', 'busy', 'hung_up'].includes(state))
    return { dot: '#DC2626', text: 'text-alert', bg: 'rgba(220,38,38,0.07)' }
  if (['ringing', 'answered', 'sent', 'delivered'].includes(state))
    return { dot: '#85489D', text: 'text-purple-soft', bg: 'rgba(133,72,157,0.07)' }
  if (state === 'skipped')
    return { dot: '#7A6F90', text: 'text-ink-muted', bg: 'transparent' }
  return { dot: '#7A6F90', text: 'text-ink-muted', bg: 'transparent' }
}

// ── ChannelGrid ────────────────────────────────────────────────────────────────

function ChannelGrid({ channels }: { channels: ChannelStates }) {
  const items = [
    { key: 'push', Icon: Bell, state: channels.push.state, label: 'Push' },
    { key: 'call', Icon: Phone, state: channels.call.state, label: 'Apel' },
    { key: 'sms', Icon: MessageSquare, state: channels.sms.state, label: 'SMS' },
  ] as const

  return (
    <div className="grid grid-cols-3 gap-1.5 mt-2.5">
      {items.map(({ key, Icon, state, label }) => {
        const { dot, text, bg } = channelColor(state)
        const isSkipped = state === 'skipped'
        return (
          <div
            key={key}
            className={`flex items-center gap-1.5 px-2 py-1.5 rounded-[8px] ${isSkipped ? 'opacity-40' : ''}`}
            style={{ background: bg || 'rgba(77,43,140,0.04)' }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: dot }}
            />
            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-ink-muted leading-none">{label}</p>
              <p className={`text-[10px] font-medium leading-none mt-0.5 truncate ${text}`}>
                {stateLabel(state)}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── CascadeRow ────────────────────────────────────────────────────────────────

interface CascadeRowProps {
  dispatch: AlertDispatchPublic
  delay?: number
}

export function CascadeRow({ dispatch, delay = 0 }: CascadeRowProps) {
  const reduced = useReducedMotion()
  const confirmed = dispatch.final_status?.startsWith('confirmed') ?? false
  const isUnconfirmed = dispatch.final_status === 'unconfirmed'
  const isFailed = dispatch.final_status === 'failed'
  const isPending = dispatch.final_status === null

  // Initials circle fill color
  const circleBg = confirmed ? '#16A34A' : isUnconfirmed ? '#EEA727' : isFailed ? '#DC2626' : '#85489D'
  const circleText = '#FFFFFF'

  // Card border
  const borderColor = confirmed ? 'rgba(22,163,74,0.25)' : isUnconfirmed ? 'rgba(238,167,39,0.30)' : isFailed ? 'rgba(220,38,38,0.25)' : 'rgba(77,43,140,0.10)'
  const borderLeftColor = confirmed ? '#16A34A' : isUnconfirmed ? '#EEA727' : isFailed ? '#DC2626' : '#85489D'

  const initials = dispatch.beekeeper_initials.replace(/[\s.]/g, '').slice(0, 2).toUpperCase()

  return (
    <motion.div
      role="listitem"
      initial={reduced ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay / 1000, ease: [0.2, 0.7, 0.3, 1] }}
      className="relative bg-white rounded-[12px] border overflow-hidden"
      style={{
        borderColor,
        borderLeftColor,
        borderLeftWidth: 3,
      }}
    >
      <ConfettiBurst active={confirmed} />

      <div className="p-3">
        {/* Top row */}
        <div className="flex items-center gap-2.5">
          {/* Initials circle — solid fill */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[12px] font-bold"
            style={{ background: circleBg, color: circleText }}
          >
            {initials}
          </div>

          {/* Name + apiary + distance */}
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-ink truncate leading-snug">
              {dispatch.beekeeper_initials}
              <span className="text-ink-muted font-normal"> · {dispatch.apiary_name} · {dispatch.distance_km.toFixed(1)} km</span>
              {dispatch.downwind && (
                <span className="inline-flex items-center gap-0.5 ml-1 text-[10px] text-honey font-medium" title="Favorizat de vânt">
                  <Wind size={10} />
                </span>
              )}
            </p>
          </div>

          {/* Status badge */}
          {confirmed && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 bg-safe/10 text-safe">
              <CheckCircle size={10} /> Confirmat
            </span>
          )}
          {isUnconfirmed && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0"
              style={{ background: 'rgba(238,167,39,0.15)', color: '#92400E' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-honey" style={{ animation: 'casc-dot 1.2s ease-in-out infinite' }} />
              În așteptare
            </span>
          )}
          {isFailed && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 bg-alert/10 text-alert">
              <XCircle size={10} /> Eșuat
            </span>
          )}
          {isPending && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0"
              style={{ background: 'rgba(133,72,157,0.10)', color: '#85489D' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#85489D', animation: 'casc-dot 1.2s ease-in-out infinite' }} />
              În curs
            </span>
          )}
        </div>

        {/* Channel grid */}
        <ChannelGrid channels={dispatch.channels} />

        {/* Unconfirmed warning */}
        {isUnconfirmed && (
          <div className="mt-2 px-3 py-2 rounded-lg text-[12px] font-medium"
            style={{ background: 'rgba(238,167,39,0.10)', color: '#92400E' }}>
            Apicultorul nu a confirmat. Sună-l direct: <span className="font-bold">07•• ••• •••</span>
          </div>
        )}

        {/* Failed error bar */}
        {isFailed && (
          <div className="mt-2 px-3 py-2 rounded-lg bg-alert/8 text-[12px] font-medium text-alert">
            Eroare tehnică. Cascada nu a reușit.
          </div>
        )}

        {/* Ledger */}
        <div className="mt-2.5">
          <LedgerChip hash={dispatch.ledger_hash} />
        </div>
      </div>
    </motion.div>
  )
}
