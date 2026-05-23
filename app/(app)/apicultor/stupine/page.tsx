'use client'
import { useApiaries } from '@/lib/api/queries'
import Link from 'next/link'
import { Plus, ChevronRight } from 'lucide-react'
import { StatusBadge } from '@/components/ui/Badge'
import { Spinner } from '@/components/feedback/Spinner'
import { BeeLogo } from '@/components/ui/BeeLogo'

export default function StupinePage() {
  const { data, isLoading } = useApiaries()
  const apiaries = data?.items ?? []

  return (
    <div className="px-4 md:px-6 lg:px-8 py-5">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold text-ink">Stupinele mele</h1>
        <Link
          href="/apicultor/stupine/nou"
          className="flex items-center gap-1 bg-purple text-white text-sm font-medium px-3 py-2 rounded-xl"
          aria-label="Adaugă stupină nouă"
        >
          <Plus size={16} /> Adaugă
        </Link>
      </div>

      {isLoading ? <Spinner size="md" className="py-8 mx-auto" /> : apiaries.length === 0 ? (
        <div className="text-center py-12">
          <BeeLogo size={56} aria-hidden className="mx-auto mb-4 opacity-60" />
          <p className="text-ink-muted">Nicio stupină înregistrată.</p>
          <Link href="/apicultor/stupine/nou" className="text-purple text-sm font-medium mt-2 inline-block">
            Înregistrează prima stupină
          </Link>
        </div>
      ) : (
        <ul className="space-y-3" role="list">
          {apiaries.map(a => (
            <li key={a.id} role="listitem">
              <Link href={`/apicultor/stupine/${a.id}`} aria-label={`${a.name} — ${a.hive_count} stupi, ${a.status === 'safe' ? 'în siguranță' : a.status === 'warning' ? 'avertizare' : 'pericol'}`}>
                <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${a.status === 'safe' ? 'bg-safe' : a.status === 'warning' ? 'bg-honey' : 'bg-alert'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-ink truncate">{a.name}</p>
                    <p className="text-sm text-ink-muted">{a.hive_count} stupi · {a.type === 'permanent' ? 'Permanent' : 'Pastoral'}</p>
                  </div>
                  <StatusBadge status={a.status} />
                  <ChevronRight size={16} className="text-ink-muted" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
