'use client'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { Spinner } from '@/components/feedback/Spinner'
import type { LayerKey } from '@/components/map/MapView'

const MapView = dynamic(
  () => import('@/components/map/MapView'),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-[70vh]"><Spinner size="lg" label="Se încarcă harta..." /></div> }
)

const LAYERS: { key: LayerKey; label: string; dot: string }[] = [
  { key: 'apiaries', label: 'Stupine', dot: '#16A34A' },
  { key: 'sprays', label: 'Stropiri', dot: '#EEA727' },
  { key: 'damage', label: 'Pagube', dot: '#DC2626' },
]

function LayerPills({ visible, toggle }: { visible: Set<LayerKey>; toggle: (k: LayerKey) => void }) {
  return (
    <>
      {LAYERS.map(({ key, label, dot }) => {
        const active = visible.has(key)
        return (
          <button
            key={key}
            onClick={() => toggle(key)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-all"
            style={active
              ? { background: dot, color: '#fff', borderColor: dot }
              : { background: '#fff', color: '#7A6F90', borderColor: '#e5e5e5' }
            }
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: active ? '#fff' : dot }}
            />
            {label}
          </button>
        )
      })}
    </>
  )
}

function Legend() {
  return (
    <>
      <span className="flex items-center gap-1.5 text-[11.5px] text-ink-muted">
        <span className="w-3 h-3 rounded-full bg-safe inline-block" /> Stupine sigure
      </span>
      <span className="flex items-center gap-1.5 text-[11.5px] text-ink-muted">
        <span className="w-3 h-3 rounded-full bg-pollen inline-block" /> Stupine în atenție
      </span>
      <span className="flex items-center gap-1.5 text-[11.5px] text-ink-muted">
        <span className="w-3 h-3 rounded-full bg-alert inline-block" /> Stropiri / Pagube
      </span>
    </>
  )
}

export default function HartaPage() {
  const [visible, setVisible] = useState<Set<LayerKey>>(new Set(['apiaries', 'sprays', 'damage']))

  function toggle(key: LayerKey) {
    setVisible(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <>
      {/* Mobile layout (unchanged) */}
      <div className="px-4 md:px-6 py-4 lg:hidden">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-ink">Hartă teritoriu</h1>
        </div>

        <div className="flex gap-2 mb-3 flex-wrap">
          <LayerPills visible={visible} toggle={toggle} />
        </div>

        <div
          className="rounded-2xl overflow-hidden shadow-sm border border-hair-soft"
          style={{ height: '65vh' }}
          aria-label="Hartă interactivă cu stupine și zone de stropire"
        >
          <MapView visibleLayers={visible} />
        </div>

        <div className="flex gap-4 mt-3 flex-wrap">
          <Legend />
        </div>
      </div>

      {/* Desktop layout: full-bleed map filling area right of sidebar, below TopBar */}
      <div
        className="hidden lg:block lg:fixed lg:top-14 lg:left-[220px] lg:right-0 lg:bottom-0 lg:z-10"
        aria-label="Hartă interactivă cu stupine și zone de stropire"
      >
        <MapView visibleLayers={visible} />

        {/* Floating layer toggle panel */}
        <div className="absolute top-4 right-4 bg-white rounded-xl shadow-lg p-2 flex flex-col gap-2 z-20">
          <LayerPills visible={visible} toggle={toggle} />
        </div>

        {/* Floating legend panel */}
        <div className="absolute bottom-4 left-4 bg-white rounded-xl shadow-lg p-3 flex flex-col gap-1.5 z-20">
          <Legend />
        </div>
      </div>
    </>
  )
}
