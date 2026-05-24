'use client'
import { use, useState } from 'react'
import Link from 'next/link'
import { useFarmer, useANFExport } from '@/lib/api/queries'
import { Spinner } from '@/components/feedback/Spinner'
import { formatDateTime, formatHa } from '@/lib/format'
import { ApiError } from '@/lib/api/client'
import { ArrowLeft, Mail, Phone, MapPin, Download } from 'lucide-react'

const TOX_LABEL = { 'T-': 'Toxicitate mică', T: 'Toxicitate medie', 'T+': 'Toxicitate mare' } as const
const TOX_STYLE: Record<string, { bg: string; fg: string }> = {
  'T-': { bg: 'rgba(22,163,74,0.12)', fg: '#15803D' },
  T:    { bg: 'rgba(238,167,39,0.15)', fg: '#92400E' },
  'T+': { bg: 'rgba(220,38,38,0.12)', fg: '#991B1B' },
}

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}
function daysAgoISO(n: number) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

export default function FermierDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data, isLoading, error } = useFarmer(id)
  const anfExport = useANFExport()

  const [from, setFrom] = useState(daysAgoISO(30))
  const [to, setTo] = useState(todayISO())
  const [exportError, setExportError] = useState<string | null>(null)

  async function handleExport() {
    setExportError(null)
    try {
      await anfExport.mutateAsync({ farmer_id: id, from, to })
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Eroare la descărcare PDF'
      setExportError(msg)
    }
  }

  if (isLoading) {
    return (
      <div className="px-4 md:px-6 lg:px-8 py-4">
        <Spinner size="md" className="py-12 mx-auto" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="px-4 md:px-6 lg:px-8 py-4">
        <Link href="/inspector/fermieri" className="inline-flex items-center gap-1.5 text-sm text-purple mb-4">
          <ArrowLeft size={14} /> Înapoi la fermieri
        </Link>
        <p className="text-ink-muted text-sm">
          {error instanceof ApiError ? error.message : 'Fermier negăsit'}
        </p>
      </div>
    )
  }

  const { farmer, sprays_last_30d, sprays_total, damages_filed_against } = data

  return (
    <div className="px-4 md:px-6 lg:px-8 py-4 space-y-5 max-w-4xl">
      <Link href="/inspector/fermieri" className="inline-flex items-center gap-1.5 text-sm text-purple hover:text-purple-soft">
        <ArrowLeft size={14} /> Înapoi la fermieri
      </Link>

      {/* ── Header ── */}
      <header>
        <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-purple mb-1">Fermier</p>
        <h1 className="text-[22px] font-bold text-ink tracking-[-0.02em] leading-tight">
          {farmer.full_name}
        </h1>
        <p className="text-sm text-ink-muted mt-0.5">CNP {farmer.cnp}</p>
      </header>

      {/* ── Contact + stats card ── */}
      <section className="bg-white rounded-2xl p-4 border border-hair-soft space-y-3">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.06em] text-purple">Contact</h2>
        <div className="grid sm:grid-cols-2 gap-2 text-sm">
          <p className="flex items-center gap-2 text-ink"><MapPin size={14} className="text-ink-muted" /> {farmer.locality}, {farmer.county}</p>
          <p className="flex items-center gap-2 text-ink"><Phone size={14} className="text-ink-muted" /> <a href={`tel:${farmer.phone}`} className="hover:underline">{farmer.phone}</a></p>
          <p className="flex items-center gap-2 text-ink sm:col-span-2"><Mail size={14} className="text-ink-muted" /> <a href={`mailto:${farmer.email}`} className="hover:underline">{farmer.email}</a></p>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-hair-soft">
          <div className="text-center">
            <p className="text-[26px] font-bold text-honey-deep leading-none">{sprays_total}</p>
            <p className="text-[11.5px] font-semibold text-ink-soft mt-1">Stropiri total</p>
          </div>
          <div className="text-center">
            <p className="text-[26px] font-bold text-alert leading-none">{damages_filed_against}</p>
            <p className="text-[11.5px] font-semibold text-ink-soft mt-1">Pagube împotriva</p>
          </div>
        </div>
      </section>

      {/* ── ANF Export ── */}
      <section className="bg-white rounded-2xl p-4 border border-hair-soft space-y-3">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.06em] text-purple">Export ANF (PDF)</h2>
        <p className="text-sm text-ink-muted">Generează raport oficial cu toate stropirile din interval.</p>
        <div className="flex flex-col sm:flex-row sm:items-end gap-3">
          <label className="flex-1">
            <span className="block text-[11px] font-semibold uppercase tracking-wide text-ink-soft mb-1">De la</span>
            <input
              type="date"
              value={from}
              max={to}
              onChange={e => setFrom(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-hair bg-white text-sm"
            />
          </label>
          <label className="flex-1">
            <span className="block text-[11px] font-semibold uppercase tracking-wide text-ink-soft mb-1">Până la</span>
            <input
              type="date"
              value={to}
              min={from}
              max={todayISO()}
              onChange={e => setTo(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-hair bg-white text-sm"
            />
          </label>
          <button
            type="button"
            onClick={handleExport}
            disabled={anfExport.isPending || !from || !to || from > to}
            className="h-10 inline-flex items-center justify-center gap-1.5 px-4 rounded-lg bg-purple text-white text-sm font-semibold hover:bg-purple-soft transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {anfExport.isPending ? <Spinner size="sm" /> : <Download size={14} />}
            {anfExport.isPending ? 'Se generează…' : 'Descarcă PDF ANF'}
          </button>
        </div>
        {exportError && <p className="text-sm text-alert">{exportError}</p>}
      </section>

      {/* ── Recent sprays ── */}
      <section>
        <h2 className="text-[11px] font-bold uppercase tracking-[0.06em] text-purple mb-3">
          Stropiri din ultimele 30 zile
        </h2>
        {sprays_last_30d.length === 0 ? (
          <p className="text-sm text-ink-muted py-4 text-center bg-white rounded-2xl border border-hair-soft">
            Nicio stropire în ultimele 30 de zile.
          </p>
        ) : (
          <ul role="list" className="space-y-2">
            {sprays_last_30d.map(s => {
              const tox = TOX_STYLE[s.toxicity] ?? TOX_STYLE.T
              return (
                <li key={s.id} role="listitem">
                  <div className="bg-white rounded-2xl p-3.5 border border-hair-soft flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-ink text-[14px] truncate">{s.substance}</p>
                      <p className="text-[12px] text-ink-muted mt-0.5">
                        {formatDateTime(s.scheduled_at)} · {formatHa(s.surface_ha)}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        <span
                          className="text-[10.5px] font-semibold px-1.5 py-0.5 rounded"
                          style={{ background: tox.bg, color: tox.fg }}
                        >
                          {TOX_LABEL[s.toxicity] ?? s.toxicity}
                        </span>
                        <span className="text-[10.5px] font-semibold px-1.5 py-0.5 rounded bg-hair-soft text-ink-soft">
                          {s.affected_apiaries_count} {s.affected_apiaries_count === 1 ? 'stupină afectată' : 'stupine afectate'}
                        </span>
                        <span className="text-[10.5px] font-semibold px-1.5 py-0.5 rounded bg-hair-soft text-ink-soft uppercase">
                          {s.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
