'use client'
import { useParcels } from '@/lib/api/queries'
import { Spinner } from '@/components/feedback/Spinner'
import { BeeLogo } from '@/components/ui/BeeLogo'
import { formatHa } from '@/lib/format'
import { MapPin, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function ParcelePage() {
  const { data, isLoading } = useParcels()
  const parcels = data?.items ?? []

  return (
    <div className="px-4 md:px-6 lg:px-8 py-5">
      <h1 className="text-xl font-bold text-ink mb-5">Parcelele mele</h1>
      {isLoading ? <Spinner size="md" className="py-8 mx-auto" /> : parcels.length === 0 ? (
        <div className="text-center py-12">
          <BeeLogo size={48} aria-hidden className="mx-auto mb-4 opacity-60" />
          <p className="text-ink-muted">Nicio parcelă înregistrată.</p>
        </div>
      ) : (
        <ul className="space-y-3 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-3 lg:space-y-0" role="list">
          {parcels.map(p => (
            <li key={p.id} role="listitem">
              <Link href={`/fermier/parcele/${p.id}`} className="flex bg-white rounded-2xl p-4 shadow-sm border border-hair-soft hover:shadow-md transition-shadow items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-hair-soft flex items-center justify-center shrink-0" aria-hidden>
                  <MapPin size={18} className="text-purple" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-ink truncate">{p.name}</p>
                  <p className="text-sm text-ink-muted">{formatHa(p.surface_ha)} · {p.locality}</p>
                  {p.default_crop && <p className="text-xs text-ink-muted">{p.default_crop}</p>}
                </div>
                <ChevronRight size={16} className="text-ink-muted shrink-0" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
