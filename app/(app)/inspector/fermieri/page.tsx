'use client'
import { useFarmers } from '@/lib/api/queries'
import { Spinner } from '@/components/feedback/Spinner'
import { ChevronRight, User } from 'lucide-react'

export default function FermieriPage() {
  const { data, isLoading } = useFarmers()
  const farmers = (data?.items as any[]) ?? []

  return (
    <div className="px-4 py-4">
      <h1 className="text-xl font-bold text-ink mb-4">Fermieri</h1>
      {isLoading ? <Spinner size="md" className="py-8 mx-auto" /> : (
        <div className="space-y-3">
          {farmers.map((f: any) => (
            <div key={f.id} className="bg-white rounded-2xl p-4 mb-2 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-hair-soft flex items-center justify-center">
                <User size={18} className="text-ink-muted" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-ink">{f.full_name}</p>
                <p className="text-sm text-ink-muted">{f.locality}, {f.county}</p>
              </div>
              <ChevronRight size={16} className="text-ink-muted" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
