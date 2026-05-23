'use client'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { MapPin, Clock, Wind, ChevronRight, CheckCircle, Bell, Phone, MessageSquare, Shield, ArrowUp } from 'lucide-react'
import { BeeLogo } from '@/components/ui/BeeLogo'
import { Chip } from '@/components/ui/Chip'
import { Button } from '@/components/ui/Button'
import { ToxBadge } from '@/components/ui/Badge'
import { LedgerChip } from '@/components/feedback/LedgerChip'
import { formatDateTime } from '@/lib/format'
import type { AlertView, ChannelStates, FinalStatus } from '@/lib/api/types'

// ── helpers ──────────────────────────────────────────────────────────────────

function degToCompass(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SV', 'V', 'NV']
  return dirs[Math.round(deg / 45) % 8]
}

function channelStateLabel(channel: 'push' | 'call' | 'sms', state: string): string {
  const labels: Record<string, string> = {
    // push
    pending: 'Așteptare', sent: 'Trimis', delivered: 'Livrat', opened: 'Deschis',
    // call
    skipped: 'Omis', queued: 'În coadă', ringing: 'Sună', answered: 'Răspuns',
    confirmed: 'Confirmat', no_input: 'Fără răspuns', no_answer: 'Neridcat',
    busy: 'Ocupat', failed: 'Eșuat', hung_up: 'Închis',
    // sms
    no_reply: 'Fără răspuns',
  }
  return labels[state] ?? state
}

// ── RiskMapPreview ────────────────────────────────────────────────────────────

function RiskMapPreview({ windDeg }: { windDeg: number }) {
  const cx = 110; const cy = 65; const r = 38
  const rad = (windDeg - 90) * (Math.PI / 180)
  const coneAngle = 35 * (Math.PI / 180)
  const len = r * 1.55

  const x1 = cx + Math.cos(rad - coneAngle) * len
  const y1 = cy + Math.sin(rad - coneAngle) * len
  const x2 = cx + Math.cos(rad + coneAngle) * len
  const y2 = cy + Math.sin(rad + coneAngle) * len

  const arrowTipX = cx + Math.cos(rad) * (r * 0.9)
  const arrowTipY = cy + Math.sin(rad) * (r * 0.9)

  return (
    <div className="w-full rounded-[10px] overflow-hidden bg-[#f0f4ee]" style={{ height: 110 }}>
      <svg width="100%" height="110" viewBox="0 0 220 110" preserveAspectRatio="xMidYMid slice">
        {/* Background */}
        <rect width="220" height="110" fill="#e8f0e5" />

        {/* Road */}
        <path d="M0 72 Q60 68 110 65 Q160 62 220 58" stroke="#c8d5c4" strokeWidth="6" fill="none" strokeLinecap="round" />

        {/* Parcel polygon */}
        <polygon
          points="55,30 100,20 140,28 145,60 100,70 55,58"
          fill="#EEA727"
          fillOpacity="0.22"
          stroke="#EEA727"
          strokeWidth="1.5"
          strokeDasharray="4,3"
        />

        {/* Spray cone */}
        <path
          d={`M${cx},${cy} L${x1},${y1} A${len},${len} 0 0,1 ${x2},${y2} Z`}
          fill="#DC2626"
          fillOpacity="0.12"
          stroke="#DC2626"
          strokeWidth="1"
          strokeOpacity="0.4"
        />

        {/* Wind direction arrow */}
        <line
          x1={cx} y1={cy}
          x2={arrowTipX} y2={arrowTipY}
          stroke="#40288C"
          strokeWidth="1.5"
          strokeDasharray="3,2"
          strokeLinecap="round"
        />
        {/* Arrow head */}
        <polygon
          points={`0,-4 3,4 -3,4`}
          fill="#40288C"
          fillOpacity="0.7"
          transform={`translate(${arrowTipX},${arrowTipY}) rotate(${windDeg})`}
        />

        {/* Parcel center dot (spray origin) */}
        <circle cx={cx} cy={cy} r="5" fill="#DC2626" fillOpacity="0.8" />
        <circle cx={cx} cy={cy} r="2.5" fill="white" />

        {/* Apiary circle */}
        <circle cx="168" cy="42" r="9" fill="#FFEF5F" stroke="#40288C" strokeWidth="1.5" />
        <circle cx="168" cy="42" r="4" fill="#40288C" />
        <circle cx="168" cy="42" r="1.5" fill="#FFEF5F" />

        {/* Compass N label */}
        <text x="205" y="14" fill="#40288C" fontSize="9" fontWeight="700" textAnchor="middle" fontFamily="system-ui">N</text>
        <line x1="205" y1="17" x2="205" y2="26" stroke="#40288C" strokeWidth="1" />
        <polygon points="205,8 202,17 208,17" fill="#40288C" />
      </svg>
    </div>
  )
}

// ── BzzChannelRows ────────────────────────────────────────────────────────────

function dotColor(state: string, isWinner: boolean): string {
  if (isWinner) return '#16A34A'
  if (['confirmed', 'opened', 'delivered'].includes(state)) return '#16A34A'
  if (['failed', 'no_answer', 'no_input', 'no_reply', 'busy', 'hung_up'].includes(state)) return '#DC2626'
  if (['ringing', 'answered', 'sent', 'queued'].includes(state)) return '#85489D'
  if (state === 'skipped') return '#7A6F90'
  return '#7A6F90'
}

function textColor(state: string, isWinner: boolean): string {
  if (isWinner) return 'text-safe font-semibold'
  if (['confirmed', 'opened', 'delivered'].includes(state)) return 'text-safe'
  if (['failed', 'no_answer', 'no_input', 'no_reply', 'busy', 'hung_up'].includes(state)) return 'text-alert'
  if (['ringing', 'answered', 'sent', 'queued'].includes(state)) return 'text-purple-soft'
  return 'text-ink-muted'
}

function BzzChannelRows({ channels, finalStatus }: { channels: ChannelStates; finalStatus: FinalStatus }) {
  const winnerChannel =
    finalStatus === 'confirmed_call' ? 'call' :
    finalStatus === 'confirmed_sms' ? 'sms' : null

  const items = [
    { Icon: Bell,          key: 'push', label: 'Push', state: channels.push.state, isWinner: false },
    { Icon: Phone,         key: 'call', label: 'Apel', state: channels.call.state, isWinner: winnerChannel === 'call' },
    { Icon: MessageSquare, key: 'sms',  label: 'SMS',  state: channels.sms.state,  isWinner: winnerChannel === 'sms' },
  ] as const

  return (
    <div className="space-y-1.5">
      {items.map(({ Icon, key, label, state, isWinner }) => {
        if (state === 'skipped') return null
        const dot = dotColor(state, isWinner)
        const txt = textColor(state, isWinner)
        return (
          <div key={key} className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: dot }} />
            <Icon size={11} style={{ color: dot }} className="shrink-0" />
            <span className="text-[12.5px] text-ink-muted font-medium">{label}</span>
            <span className="text-ink-muted text-[12.5px]">·</span>
            <span className={`text-[12.5px] ${txt}`}>{channelStateLabel(key, state)}</span>
          </div>
        )
      })}
    </div>
  )
}

// ── BzzBzzCard ────────────────────────────────────────────────────────────────

interface BzzBzzCardProps {
  alert: AlertView
  onConfirm: (action: 'move_hives' | 'seal_in_place') => void
  isPending?: boolean
}

export function BzzBzzCard({ alert, onConfirm, isPending = false }: BzzBzzCardProps) {
  const reduced = useReducedMotion()
  const confirmed = alert.final_status?.startsWith('confirmed')
  const accentColor = confirmed ? '#16A34A' : '#EEA727'

  const finalLabel =
    alert.final_status === 'confirmed_call' ? 'apel telefonic' :
    alert.final_status === 'confirmed_sms' ? 'SMS' :
    alert.final_status === 'confirmed_app' ? 'aplicație' : null

  return (
    <motion.div
      role="alert"
      aria-live="assertive"
      initial={reduced ? false : { opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.42, ease: [0.2, 0.9, 0.3, 1.1] }}
      className="relative bg-white rounded-[16px] overflow-hidden border border-hair-soft"
      style={{
        boxShadow: '0 1px 0 rgba(77,43,140,0.04), 0 8px 24px rgba(77,43,140,0.08)',
        animation: !reduced && !confirmed
          ? 'bzz-pulse 1.4s ease-out 2'
          : undefined,
      }}
    >
      {/* Left accent border */}
      <div
        aria-hidden
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-[16px]"
        style={{
          background: accentColor,
          animation: !reduced && !confirmed ? 'bzz-flash 0.42s ease-out' : undefined,
        }}
      />

      {/* Header */}
      <div className="flex items-start gap-[10px] pt-[14px] pb-[10px] pr-[14px] pl-[18px]">
        {/* Bee bubble */}
        <div
          className={`w-[52px] h-9 rounded-[10px] bg-pollen flex items-center justify-center shrink-0 mt-0.5 ${!reduced && !confirmed ? 'bzz-wing' : ''}`}
        >
          <BeeLogo size={26} aria-hidden />
        </div>

        <div className="flex-1 min-w-0">
          <p
            className="text-[11.5px] font-bold uppercase tracking-[0.04em]"
            style={{ color: confirmed ? '#16A34A' : '#EEA727' }}
          >
            {confirmed ? 'Alertă confirmată' : 'Bzz Bzz · Alertă urgentă'}
          </p>
          <p className="text-[17px] font-bold text-purple tracking-[-0.015em] mt-0.5 leading-tight">
            Stropire la {alert.distance_km.toFixed(1)} km de stupină
          </p>
          <p className="text-[13px] text-ink-soft mt-0.5">
            <span className="font-semibold text-ink">{alert.farmer_name_masked}</span>
            {' · '}{alert.apiary_name}
          </p>
        </div>

        {confirmed && (
          <div className="w-7 h-7 rounded-full bg-safe flex items-center justify-center shrink-0 mt-0.5">
            <CheckCircle size={15} className="text-white" />
          </div>
        )}
      </div>

      {/* Risk map */}
      <div className="px-[14px]">
        <RiskMapPreview windDeg={alert.wind_direction_deg} />
      </div>

      {/* Stat chips */}
      <div className="flex gap-1.5 flex-wrap px-[14px] pt-3">
        <Chip icon={<MapPin size={11} className="text-purple shrink-0" />}>
          {alert.distance_km.toFixed(1)} km
        </Chip>
        <Chip icon={<Clock size={11} className="text-purple shrink-0" />}>
          {formatDateTime(alert.scheduled_at)}
        </Chip>
        <Chip icon={<Wind size={11} className="text-purple shrink-0" />}>
          Vânt {degToCompass(alert.wind_direction_deg)}
          {alert.downwind && <span className="ml-1 text-alert font-bold">↓</span>}
        </Chip>
        <ToxBadge toxicity={alert.toxicity} />
      </div>

      {/* Substance */}
      <p className="px-[14px] pt-2 text-[13px] text-ink-soft">
        Substanță: <span className="font-semibold text-ink">{alert.substance}</span>
      </p>

      {/* Channel rows */}
      <div className="px-[14px] pt-3">
        <BzzChannelRows channels={alert.channels} finalStatus={alert.final_status} />
      </div>

      {/* CTA */}
      <div className="p-[14px] flex flex-col gap-2">
        {!confirmed && !alert.in_app_action ? (
          <>
            <Button
              variant="primary"
              fullWidth
              onClick={() => onConfirm('move_hives')}
              loading={isPending}
              icon={<ArrowUp size={16} />}
            >
              Mut stupii
            </Button>
            <Button
              variant="ghost"
              fullWidth
              onClick={() => onConfirm('seal_in_place')}
              loading={isPending}
              icon={<Shield size={16} />}
            >
              Sigilez aici
            </Button>
          </>
        ) : (
          <div className="flex items-center gap-2 px-3 py-[10px] rounded-[10px] bg-safe/10 text-safe text-[13.5px] font-semibold">
            <CheckCircle size={16} className="shrink-0" />
            {finalLabel
              ? `Confirmat prin ${finalLabel}`
              : `Acțiune: ${alert.in_app_action === 'move_hives' ? 'Mut stupii' : 'Sigilez'}`}
          </div>
        )}
      </div>

      {/* Ledger footer */}
      <div className="px-[14px] pb-[14px] border-t border-hair-soft flex items-center justify-between gap-2 pt-3">
        <LedgerChip hash={alert.ledger_hash} />
        <button className="text-[11.5px] font-semibold text-purple-soft flex items-center gap-1 shrink-0">
          Verifică <ChevronRight size={11} />
        </button>
      </div>
    </motion.div>
  )
}
