'use client'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { MapPin, Clock, Wind, ChevronRight, CheckCircle, Bell, Phone, MessageSquare, Shield, ArrowUp, AlertTriangle } from 'lucide-react'
import { BeeLogo } from '@/components/ui/BeeLogo'
import { Chip } from '@/components/ui/Chip'
import { Button } from '@/components/ui/Button'
import { ToxBadge } from '@/components/ui/Badge'
import { LedgerChip } from '@/components/feedback/LedgerChip'
import { formatDateTime } from '@/lib/format'
import { useApiaries } from '@/lib/api/queries'
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
    confirmed: 'Confirmat', no_input: 'Fără răspuns', no_answer: 'Neridicat',
    busy: 'Ocupat', failed: 'Eșuat', hung_up: 'Închis',
    // sms
    no_reply: 'Fără răspuns',
  }
  return labels[state] ?? state
}

// ── RiskMapPreview ────────────────────────────────────────────────────────────
// 3×3 OSM tile grid. Centred on the apiary; spray shown as secondary marker.

function latLngToFloat(lat: number, lng: number, z: number) {
  const scale = Math.pow(2, z)
  const xF = (lng + 180) / 360 * scale
  const latRad = lat * Math.PI / 180
  const yF = (1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * scale
  return { xF, yF }
}

interface RiskMapPreviewProps {
  apiaryLat: number; apiaryLng: number
  sprayLat: number; sprayLng: number
}

function RiskMapPreview({ apiaryLat, apiaryLng, sprayLat, sprayLng }: RiskMapPreviewProps) {
  const zoom = 15

  // Tile grid centred on the apiary
  const aF = latLngToFloat(apiaryLat, apiaryLng, zoom)
  const aTx = Math.floor(aF.xF); const aTy = Math.floor(aF.yF)
  const aOx = (aF.xF % 1) * 256; const aOy = (aF.yF % 1) * 256

  // Spray position in pixels relative to the apiary centre
  const sF = latLngToFloat(sprayLat, sprayLng, zoom)
  const sprayOffX = Math.round((sF.xF - aF.xF) * 256)
  const sprayOffY = Math.round((sF.yF - aF.yF) * 256)

  const tiles: { x: number; y: number; left: number; top: number }[] = []
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      tiles.push({ x: aTx + dx, y: aTy + dy, left: (dx + 1) * 256, top: (dy + 1) * 256 })
    }
  }

  return (
    <div className="w-full rounded-[10px] overflow-hidden bg-[#aad3df] relative" style={{ height: 110, pointerEvents: 'none', userSelect: 'none' }}>
      {/* Tile grid — entire container is pointer-events:none so scroll passes through */}
      <div style={{
        position: 'absolute', width: 768, height: 768,
        left: `calc(50% - ${Math.round(256 + aOx)}px)`,
        top: `calc(50% - ${Math.round(256 + aOy)}px)`,
      }}>
        {tiles.map(t => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`${t.x},${t.y}`}
            src={`https://tile.openstreetmap.org/${zoom}/${t.x}/${t.y}.png`}
            alt=""
            width={256}
            height={256}
            style={{ position: 'absolute', left: t.left, top: t.top }}
          />
        ))}
      </div>

      {/* Apiary marker — centred (yellow hive icon) */}
      <div aria-hidden style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)',
        width: 20, height: 20, borderRadius: '50%',
        background: '#EEA727', border: '3px solid white',
        boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
      }} />

      {/* Spray marker — offset from apiary */}
      <div aria-hidden style={{
        position: 'absolute',
        left: `calc(50% + ${sprayOffX}px)`,
        top: `calc(50% + ${sprayOffY}px)`,
        transform: 'translate(-50%, -50%)',
        width: 14, height: 14, borderRadius: '50%',
        background: '#DC2626', border: '2.5px solid white',
        boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
      }} />

      {/* Label chip */}
      <div style={{
        position: 'absolute', bottom: 6, right: 8,
        background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(4px)',
        borderRadius: 6, padding: '2px 6px',
        fontSize: 10, fontWeight: 700, color: '#40288C',
      }}>
        🐝 stupină · 🔴 stropire
      </div>
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
    { Icon: Bell, key: 'push', label: 'Push', state: channels.push.state, isWinner: false, at: channels.push.at },
    { Icon: Phone, key: 'call', label: 'Apel', state: channels.call.state, isWinner: winnerChannel === 'call', at: channels.call.at },
    { Icon: MessageSquare, key: 'sms', label: 'SMS', state: channels.sms.state, isWinner: winnerChannel === 'sms', at: channels.sms.at },
  ] as const

  return (
    <div className="space-y-1.5">
      {items.map(({ Icon, key, label, state, isWinner, at }) => {
        if (state === 'skipped') return null
        const dot = dotColor(state, isWinner)
        const txt = textColor(state, isWinner)
        return (
          <div key={key} className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: dot }} />
            <Icon size={11} style={{ color: dot }} className="shrink-0" />
            <span className="text-[12.5px] text-ink-muted font-medium">{label}</span>
            <span className="text-ink-muted text-[12.5px]">·</span>
            <span className={`text-[12.5px] ${txt}`}>{channelStateLabel(key, state)}{at && <span className="text-ink-muted"> · {new Date(at).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })}</span>}</span>
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
  const { data: apiariesData } = useApiaries()
  const apiary = apiariesData?.items.find(a => a.id === alert.apiary_id)
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
        <div className="flex-1 min-w-0">
          <p
            className="text-[11.5px] font-bold uppercase tracking-[0.04em]"
            style={{ color: confirmed ? '#16A34A' : '#EEA727' }}
          >
            {confirmed ? 'Alertă confirmată' : 'BZZ BZZ · ALERTĂ URGENTĂ'}
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
        <RiskMapPreview
          apiaryLat={apiary?.lat ?? alert.spray_lat}
          apiaryLng={apiary?.lng ?? alert.spray_lng}
          sprayLat={alert.spray_lat}
          sprayLng={alert.spray_lng}
        />
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
        {alert.final_status === 'failed' ? (
          <div className="flex items-center gap-2 p-3 rounded-[10px] bg-alert/10 text-alert text-[13px] font-medium">
            <AlertTriangle size={16} />
            <span>Eroare tehnică. Contactează apicultorul direct.</span>
          </div>
        ) : !confirmed && !alert.in_app_action ? (
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
        <button
          aria-label="Verifică integritatea înregistrării"
          className="text-[11.5px] font-semibold text-purple-soft flex items-center gap-1 shrink-0"
          onClick={() => window.open(`/api/v1/events/${alert.ledger_hash}`, '_blank')}
        >
          Verifică <ChevronRight size={11} />
        </button>
      </div>
    </motion.div>
  )
}
