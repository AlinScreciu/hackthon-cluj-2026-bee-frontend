'use client'
import { useParcels } from '@/lib/api/queries'
import { Spinner } from '@/components/feedback/Spinner'
import { ChevronRight, MapPin } from 'lucide-react'

export default function ParcelePage() {
  const { data, isLoading } = useParcels()
  const parcels = data?.items ?? []

  return (
    <div className="px-4 py-5">
      <h1 className="text-xl font-bold text-ink mb-5">Parcelele mele</h1>
      {isLoading ? <Spinner size="md" className="py-8 mx-auto" /> : (
        <div className="space-y-3">
          {parcels.map(p => (
            <div key={p.id} className="bg-white rounded-2xl p-4 mb-2 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-hair-soft flex items-center justify-center">
                <MapPin size={18} className="text-ink-muted" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-ink truncate">{p.name}</p>
                <p className="text-sm text-ink-muted">{p.surface_ha} ha · {p.locality}</p>
                {p.default_crop && <p className="text-xs text-ink-muted">{p.default_crop}</p>}
              </div>
              <ChevronRight size={16} className="text-ink-muted" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
