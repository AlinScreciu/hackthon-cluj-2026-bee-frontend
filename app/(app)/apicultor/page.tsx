'use client'
import { useApiaries, useAlerts, useConfirmAlert } from '@/lib/api/queries'
import { useAuth } from '@/lib/hooks/useAuth'
import { ToxBadge, StatusBadge } from '@/components/ui/Badge'
import { BeeLogo } from '@/components/ui/BeeLogo'
import { BzzBzzCard } from '@/components/alerts/BzzBzzCard'
import { PushPermissionBanner } from '@/components/push/PushPermissionBanner'
import { toast } from 'sonner'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/feedback/Spinner'
import Link from 'next/link'
import { Wind, MapPin, AlertTriangle, Plus } from 'lucide-react'
import type { Apiary } from '@/lib/api/types'

// ── HiveIcon ─────────────────────────────────────────────────────────────────

function HiveIcon({ status }: { status: Apiary['status'] }) {
  const color = status === 'safe' ? '#16A34A' : status === 'warning' ? '#EEA727' : '#DC2626'
  const bgOpacity = status === 'safe' ? '0.10' : '0.12'
  const bg = status === 'safe'
    ? `rgba(22,163,74,${bgOpacity})`
    : status === 'warning'
      ? `rgba(238,167,39,${bgOpacity})`
      : `rgba(220,38,38,${bgOpacity})`

  return (
    <div
      className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0"
      style={{ background: bg }}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        {/* Hive box */}
        <rect x="3" y="6" width="14" height="11" rx="2" fill={color} fillOpacity="0.9" />
        {/* Stripes */}
        <line x1="3" y1="10" x2="17" y2="10" stroke="white" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="3" y1="13" x2="17" y2="13" stroke="white" strokeWidth="1" strokeOpacity="0.6" />
        {/* Roof */}
        <path d="M2 6 L10 2 L18 6" fill={color} stroke={color} strokeWidth="0.5" strokeLinejoin="round" />
        {/* Entry */}
        <rect x="8" y="14" width="4" height="3" rx="1" fill="white" fillOpacity="0.5" />
      </svg>
    </div>
  )
}

// ── SectionHeader ─────────────────────────────────────────────────────────────

function SectionHeader({ label, href, linkLabel }: { label: string; href?: string; linkLabel?: string }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.06em] text-purple">{label}</h2>
      {href && (
        <Link href={href} className="text-[12px] font-semibold text-purple hover:text-purple-soft transition-colors">
          {linkLabel ?? 'Vezi toate'}
        </Link>
      )}
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ApicultorPage() {
  const { user } = useAuth()
  const { data: apiariesData, isLoading: loadingApiaries } = useApiaries()
  const { data: activeAlertsData } = useAlerts('active')
  const { data: allAlertsData } = useAlerts('all')
  const { mutate: confirmAlert, isPending: confirmPending } = useConfirmAlert()

  const apiaries = apiariesData?.items ?? []
  const activeAlerts = activeAlertsData?.items ?? []
  const recentAlerts = allAlertsData?.items ?? []
  // Closest still-active dispatch wins the hero — most urgent first
  const heroAlert = [...activeAlerts].sort((a, b) => a.distance_km - b.distance_km)[0]
  const hasAlert = activeAlerts.length > 0
  const totalHives = apiaries.reduce((s, a) => s + a.hive_count, 0)

  const firstName = user?.full_name?.split(' ')[0] ?? user?.name ?? 'Apicultor'

  const hour = new Date().getHours()
  const timeGreeting = hour < 12 ? 'dimineața' : hour < 18 ? 'ziua' : 'seara'

  const apiaryRow = (apiary: Apiary) => (
    <Link
      key={apiary.id}
      href={`/apicultor/stupine/${apiary.id}`}
      aria-label={`${apiary.name} — ${apiary.hive_count} stupi, ${apiary.status === 'safe' ? 'în siguranță' : apiary.status === 'warning' ? 'avertizare' : 'pericol'}`}
    >
      <div className="bg-white rounded-[14px] p-3.5 mb-2 flex items-center gap-3 hover:shadow-sm transition-shadow border border-hair-soft">
        <HiveIcon status={apiary.status} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-ink text-[14px] truncate leading-snug">{apiary.name}</p>
          <p className="text-[12px] text-ink-muted mt-0.5">
            {apiary.hive_count} stupi
          </p>
          {apiary.status !== 'safe' && apiary.current_risk.nearest_spray_km !== null ? (
            <p className="text-[11px] text-honey-deep font-semibold flex items-center gap-1 mt-1">
              <MapPin size={10} aria-hidden />
              {apiary.current_risk.nearest_spray_km.toFixed(1)} km de stropire
            </p>
          ) : (
            <p className="text-[11px] text-ink-muted flex items-center gap-1 mt-1">
              <Wind size={10} aria-hidden />
              {apiary.type === 'permanent' ? 'Permanent' : 'Pastoral'}
            </p>
          )}
        </div>
        <StatusBadge status={apiary.status} />
      </div>
    </Link>
  )

  const activityFeed = (
    recentAlerts.length === 0 ? (
      <EmptyState
        message="Zero alerte. Zumzet liniștit."
        subtitle="Când un fermier anunță o stropire, te alertăm imediat."
      />
    ) : (
      <div className="space-y-2">
        {recentAlerts.slice(0, 3).map(alert => (
          <Link
            key={alert.alert_dispatch_id}
            href={`/apicultor/alerte/${alert.alert_dispatch_id}`}
            aria-label={`Alertă: stropire cu ${alert.substance} la ${alert.distance_km.toFixed(1)} km de ${alert.apiary_name}`}
          >
            <div className="bg-white rounded-[14px] px-3.5 py-3 mb-2 flex items-start gap-3 border border-hair-soft hover:shadow-sm transition-shadow">
              <span
                className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                style={{ background: '#EEA727' }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-ink leading-snug">
                  <span className="font-semibold">Un fermier</span>
                  {' '}a anunțat stropire cu{' '}
                  <span className="font-semibold">{alert.substance}</span>
                  {' '}la {alert.distance_km.toFixed(1)} km
                </p>
              </div>
              <ToxBadge toxicity={alert.toxicity} />
            </div>
          </Link>
        ))}
      </div>
    )
  )

  return (
    <div className="px-4 md:px-6 lg:px-8 py-5 space-y-7 lg:max-w-none lg:grid lg:grid-cols-12 lg:gap-6 lg:space-y-0">

      {/* ── Push notification opt-in (hidden once subscribed or dismissed) ── */}
      <div className="lg:col-span-12">
        <PushPermissionBanner />
      </div>

      {/* ── Hero ── */}
      {hasAlert ? (
        /* Alert hero */
        <div
          className="rounded-[20px] p-5 relative overflow-hidden lg:col-span-12"
          style={{ background: 'rgba(238,167,39,0.15)', border: '1.5px solid rgba(238,167,39,0.30)' }}
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-honey-deep flex items-center gap-1.5 mb-1">
            <AlertTriangle size={12} aria-hidden /> Atenție
          </p>
          <h1 className="text-[22px] font-bold text-ink tracking-[-0.02em] leading-tight">
            {activeAlerts.length} {activeAlerts.length === 1 ? 'alertă activă' : 'alerte active'}
          </h1>
          {heroAlert && (
            <p className="text-[13px] text-ink-soft mt-1">
              Stropire la {heroAlert.distance_km.toFixed(1)} km de {heroAlert.apiary_name}
            </p>
          )}
          <BeeLogo size={52} aria-hidden className="absolute right-4 top-3 opacity-40" />
        </div>
      ) : (
        /* Safe hero — solid pale green (masks body hex wallpaper) */
        <div
          className="rounded-[20px] p-5 relative overflow-hidden lg:col-span-12 lg:min-h-[140px] lg:flex lg:flex-col lg:justify-center"
          style={{
            backgroundColor: '#e8f6ed',
            border: '1.5px solid rgba(22,163,74,0.28)',
          }}
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-safe-deep mb-1">
            Bună {timeGreeting}, {firstName}
          </p>
          <h1 className="text-[20px] font-bold text-ink tracking-[-0.02em] leading-snug">
            Stupinele tale sunt în siguranță
          </h1>
          <p className="text-[12px] text-ink-soft mt-1.5">
            {totalHives} {totalHives === 1 ? 'stup' : 'stupi'} · {activeAlerts.length} alerte
          </p>
          <BeeLogo size={52} aria-hidden className="absolute right-4 top-3 opacity-25" />
        </div>
      )}

      {/* ── Active alerts preview ── */}
      {hasAlert && heroAlert && (
        <section aria-live="assertive" className="lg:col-span-8">
          <SectionHeader label="Alertă urgentă" href="/apicultor/alerte" linkLabel="Toate alertele" />
          <div className="space-y-3">
            <BzzBzzCard
              key={heroAlert.alert_dispatch_id}
              alert={heroAlert}
              onConfirm={(action) =>
                confirmAlert(
                  { id: heroAlert.alert_dispatch_id, action },
                  {
                    onSuccess: () =>
                      toast.success(
                        action === 'move_hives'
                          ? 'Stupii vor fi mutați. Alerta a fost confirmată.'
                          : 'Stupii vor fi sigilați. Alerta a fost confirmată.',
                      ),
                    onError: () => toast.error('Nu am putut confirma acțiunea. Reîncearcă.'),
                  },
                )
              }
              isPending={confirmPending}
            />
          </div>
        </section>
      )}

      {/* ── Desktop rail (lg+ only) ──
          With an active alert it stacks vertically beside the BzzBzzCard (col-span-4).
          With no alert it goes full-width and the two sections sit side-by-side. */}
      <aside
        className={
          hasAlert
            ? 'hidden lg:flex lg:col-span-4 lg:flex-col lg:gap-6'
            : 'hidden lg:grid lg:col-span-12 lg:grid-cols-2 lg:gap-6'
        }
      >
        <section>
          <SectionHeader label="Stupinele tale" href="/apicultor/stupine" />
          {loadingApiaries ? (
            <Spinner size="sm" className="py-4" />
          ) : apiaries.length === 0 ? (
            <EmptyState
              message="Nicio stupină înregistrată."
              action={{ label: 'Adaugă prima stupină', href: '/apicultor/stupine/nou' }}
              albiSize={56}
            />
          ) : (
            <div className="space-y-3">
              {apiaries.slice(0, 4).map(apiaryRow)}
              {apiaries.length > 4 && (
                <Link href="/apicultor/stupine" className="block text-center text-[12px] font-semibold text-purple py-2 hover:text-purple-soft">
                  + {apiaries.length - 4} mai multe stupine
                </Link>
              )}
            </div>
          )}
        </section>
        <section>
          <SectionHeader label="Activitate recentă" href="/apicultor/alerte" linkLabel="Toate alertele" />
          {activityFeed}
        </section>
      </aside>

      {/* ── Apiaries (mobile/tablet only at lg+) ── */}
      <section className="lg:hidden lg:col-span-12">
        <SectionHeader label="Stupinele tale" href="/apicultor/stupine" />
        {loadingApiaries ? (
          <Spinner size="sm" className="py-4" />
        ) : apiaries.length === 0 ? (
          <EmptyState
            message="Nicio stupină înregistrată."
            action={{ label: 'Adaugă prima stupină', href: '/apicultor/stupine/nou' }}
            albiSize={56}
          />
        ) : (
          <div className="space-y-3">
            {apiaries.slice(0, 4).map(apiaryRow)}
            {apiaries.length > 4 && (
              <Link href="/apicultor/stupine" className="block text-center text-[12px] font-semibold text-purple py-2 hover:text-purple-soft">
                + {apiaries.length - 4} mai multe stupine
              </Link>
            )}
          </div>
        )}
      </section>

      {/* ── Add apiary CTA (when none) ── */}
      {!loadingApiaries && apiaries.length === 0 && (
        <Link
          href="/apicultor/stupine/nou"
          className="flex items-center justify-center gap-2 h-12 rounded-[12px] bg-purple text-white font-bold text-[15px] hover:bg-purple-soft transition-colors lg:col-span-8"
        >
          <Plus size={18} /> Înregistrează stupina
        </Link>
      )}

      {/* ── Activitate recentă (mobile/tablet only at lg+) ── */}
      <section className="lg:hidden lg:col-span-12">
        <SectionHeader label="Activitate recentă" href="/apicultor/alerte" linkLabel="Toate alertele" />
        {activityFeed}
      </section>
    </div>
  )
}
