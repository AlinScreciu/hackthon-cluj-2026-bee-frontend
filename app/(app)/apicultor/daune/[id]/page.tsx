'use client'
import { use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useDamageClaim, useApiaries } from '@/lib/api/queries'
import { Spinner } from '@/components/feedback/Spinner'
import { StatusBadge } from '@/components/ui/Badge'
import { PhotoGallery } from '@/components/ui/PhotoGallery'
import { LedgerChip } from '@/components/feedback/LedgerChip'
import { formatDate } from '@/lib/format'

export default function DamageClaimDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { data, isLoading } = useDamageClaim(id)
  const apiariesQ = useApiaries()

  if (isLoading) return <Spinner size="lg" className="py-16 mx-auto" />
  if (!data) return <p className="text-center py-12 text-ink-muted">Pagubă negăsită.</p>

  const { claim } = data
  const apiary = (apiariesQ.data?.items ?? []).find(a => a.id === claim.apiary_id)

  return (
    <div className="px-4 md:px-6 lg:px-8 py-4 lg:max-w-3xl">
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-1 text-purple text-sm font-medium mb-4"
        aria-label="Înapoi"
      >
        <ChevronLeft size={18} /> Înapoi
      </button>

      <h1 className="text-xl font-bold text-ink mb-3">
        {apiary?.name ?? 'Stupină necunoscută'}
      </h1>

      <div className="flex items-center gap-2 flex-wrap mb-5">
        <StatusBadge status={claim.status} />
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-hair-soft text-ink-soft border border-hair">
          {claim.hive_loss_count} stupi pierduți
        </span>
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-hair-soft text-ink-soft border border-hair">
          {formatDate(claim.created_at)}
        </span>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
        <h2 className="text-sm font-semibold text-ink-soft mb-2">Descriere</h2>
        <p className="text-ink whitespace-pre-wrap">{claim.description}</p>
      </div>

      <div className="mb-4">
        <h2 className="text-sm font-semibold text-ink-soft mb-2">Poze</h2>
        <PhotoGallery urls={claim.photos} />
      </div>

      {claim.related_spray_id && (
        <Link
          href={`/fermier/rapoarte/${claim.related_spray_id}`}
          className="inline-flex items-center gap-1 text-purple text-sm font-medium mb-4"
        >
          Stropire asociată <ChevronRight size={14} />
        </Link>
      )}

      <div className="mt-4">
        <LedgerChip hash={claim.ledger_hash} />
      </div>
    </div>
  )
}
