'use client'
import { BeeLogo } from '@/components/ui/BeeLogo'

export default function PagubePage() {
  return (
    <div className="px-4 py-5">
      <h1 className="text-xl font-bold text-ink mb-5">Cereri de pagubă</h1>
      <div className="text-center py-12">
        <BeeLogo size={56} aria-hidden className="mx-auto mb-4 opacity-60" />
        <p className="text-ink-muted">Nicio cerere depusă momentan.</p>
      </div>
    </div>
  )
}
