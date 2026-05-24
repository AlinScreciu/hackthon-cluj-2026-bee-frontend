'use client'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { useDamageClaims, useApiaries } from '@/lib/api/queries'
import { Spinner } from '@/components/feedback/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { StatusBadge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/format'

export default function DaunePage() {
  const claims = useDamageClaims()
  const apiaries = useApiaries()

  const items = (claims.data?.items ?? []).slice().sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
  const apiaryById = new Map((apiaries.data?.items ?? []).map(a => [a.id, a]))

  if (claims.isLoading) {
    return <Spinner size="md" className="py-12 mx-auto" />
  }

  if (items.length === 0) {
    return (
      <div className="px-4 md:px-6 lg:px-8 py-5 lg:max-w-3xl">
        <EmptyState
          message="Nicio pagubă raportată"
          subtitle="Dacă observi pierderi de albine după o stropire, raportează aici."
          action={{ label: '+ Pagubă nouă', href: '/apicultor/daune/nou' }}
        />
      </div>
    )
  }

  return (
    <div className="px-4 md:px-6 lg:px-8 py-5 lg:max-w-3xl">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold text-ink">Daunele mele</h1>
        <Link
          href="/apicultor/daune/nou"
          className="flex items-center gap-1 bg-purple text-white text-sm font-medium px-3 py-2 rounded-xl"
          aria-label="Raportează pagubă nouă"
        >
          <Plus size={16} /> Pagubă nouă
        </Link>
      </div>

      <ul role="list" className="space-y-3">
        {items.map(c => {
          const apiary = apiaryById.get(c.apiary_id)
          const firstPhoto = c.photos[0]
          return (
            <li key={c.id} role="listitem">
              <Link
                href={`/apicultor/daune/${c.id}`}
                aria-label={`Pagubă ${apiary?.name ?? ''} ${formatDate(c.created_at)}`}
              >
                <div className="bg-white rounded-2xl p-4 shadow-sm flex items-start gap-3">
                  {firstPhoto && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={firstPhoto}
                      alt=""
                      loading="lazy"
                      className="w-10 h-10 rounded-[8px] object-cover shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <StatusBadge status={c.status} />
                      <span className="text-xs text-ink-muted">{formatDate(c.created_at)}</span>
                    </div>
                    <p className="font-semibold text-ink truncate">
                      {apiary?.name ?? 'Stupină necunoscută'}
                    </p>
                    <p className="text-sm text-ink-muted">
                      {c.hive_loss_count} {c.hive_loss_count === 1 ? 'stup pierdut' : 'stupi pierduți'}
                    </p>
                    {c.description && (
                      <p className="text-sm text-ink-soft mt-1 line-clamp-2">{c.description}</p>
                    )}
                  </div>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
