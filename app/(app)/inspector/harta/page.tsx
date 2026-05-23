'use client'
import dynamic from 'next/dynamic'
import { Spinner } from '@/components/feedback/Spinner'

const MapView = dynamic(
  () => import('@/components/map/MapView'),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-[70vh]"><Spinner size="lg" label="Se încarcă harta..." /></div> }
)

export default function HartaPage() {
  return (
    <div className="px-4 py-4">
      <h1 className="text-xl font-bold text-ink mb-4">Hartă teritoriu</h1>
      <div className="rounded-2xl overflow-hidden shadow-sm" style={{ height: '70vh' }}>
        <MapView />
      </div>
    </div>
  )
}
