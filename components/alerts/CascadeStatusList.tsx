'use client'
import { useCascadeStatus } from '@/lib/api/queries'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { Spinner } from '@/components/feedback/Spinner'
import { CascadeRow } from '@/components/cascade/CascadeRow'
import { Wifi, WifiOff } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { t } from '@/lib/i18n'
import type { FinalStatus } from '@/lib/api/types'

interface CascadeStatusListProps {
  sprayId: string
  initialDispatchCount?: number
}

export function CascadeStatusList({ sprayId, initialDispatchCount = 2 }: CascadeStatusListProps) {
  const { data, isLoading, isError, failureCount } = useCascadeStatus(sprayId)
  const reduced = useReducedMotion()
  const [isOffline, setIsOffline] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const prevStatusRef = useRef<Record<string, string>>({})

  useEffect(() => {
    const onOnline = () => setIsOffline(false)
    const onOffline = () => setIsOffline(true)
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])

  useEffect(() => {
    if (!data) return
    data.dispatches.forEach(d => {
      const prev = prevStatusRef.current[d.alert_dispatch_id]
      const curr = d.final_status ?? ''
      if (prev !== undefined && prev !== curr && curr.startsWith('confirmed')) {
        setAnnouncement(
          `${d.beekeeper_initials}, ${d.apiary_name}: ${
            t.cascade.finalStatus[d.final_status as keyof typeof t.cascade.finalStatus] ?? 'confirmat'
          }`
        )
      }
      prevStatusRef.current[d.alert_dispatch_id] = curr
    })
  }, [data])

  const dispatches = data?.dispatches ?? []

  return (
    <div>
      {/* Offline banner */}
      {isOffline && (
        <div className="flex items-center gap-2 bg-ink/5 border border-ink/10 rounded-[12px] px-4 py-3 mb-4 text-sm text-ink-soft">
          <WifiOff size={16} />
          {t.cascade.offlineBanner}
        </div>
      )}

      {/* Retry indicator */}
      {isError && failureCount >= 3 && (
        <div className="flex justify-end mb-2">
          <span className="text-[11px] text-ink-muted bg-white border border-hair rounded-lg px-2 py-1 flex items-center gap-1">
            <Wifi size={11} /> {t.cascade.retrying}
          </span>
        </div>
      )}

      {/* Accessibility live region */}
      <div role="status" aria-live="polite" className="sr-only">{announcement}</div>

      {/* Summary pills */}
      {data && (
        <div className="flex gap-2 mb-4 flex-wrap">
          <span className="bg-safe/10 text-safe px-3 py-1 rounded-full text-[12px] font-bold">
            {data.summary.confirmed} confirmate
          </span>
          {data.summary.pending > 0 && (
            <span className="bg-purple/10 text-purple px-3 py-1 rounded-full text-[12px] font-bold">
              {data.summary.pending} în așteptare
            </span>
          )}
          {data.summary.unconfirmed > 0 && (
            <span className="px-3 py-1 rounded-full text-[12px] font-bold"
              style={{ background: 'rgba(238,167,39,0.14)', color: '#8a5800' }}>
              {data.summary.unconfirmed} neconfirmate
            </span>
          )}
          {data.summary.failed > 0 && (
            <span className="bg-alert/10 text-alert px-3 py-1 rounded-full text-[12px] font-bold">
              {data.summary.failed} eșuate
            </span>
          )}
        </div>
      )}

      {/* Dispatch rows */}
      <div
        role="list"
        aria-label="Status notificări apicultori"
        className="grid gap-4 lg:grid-cols-2"
      >
        {isLoading
          ? Array.from({ length: initialDispatchCount }).map((_, i) => (
              <div key={i} className="bg-white rounded-[12px] p-4 border border-hair-soft animate-pulse">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-[30px] h-[30px] rounded-full bg-hair" />
                  <div className="flex-1">
                    <div className="h-3.5 bg-hair rounded w-28 mb-1.5" />
                    <div className="h-3 bg-hair rounded w-40" />
                  </div>
                </div>
                <div className="flex gap-4 justify-between">
                  {[0, 1, 2].map(j => (
                    <div key={j} className="flex flex-col items-center gap-1">
                      <div className="w-[22px] h-[22px] rounded-full bg-hair" />
                      <div className="h-2 bg-hair rounded w-10" />
                    </div>
                  ))}
                </div>
              </div>
            ))
          : dispatches.map((d, i) => (
              <CascadeRow
                key={d.alert_dispatch_id}
                dispatch={d}
                delay={i * 80}
              />
            ))
        }
      </div>

      {data?.overall_status === 'complete' && (
        <p className="mt-4 text-center text-[12px] text-ink-muted">
          Toate notificările au fost procesate.
        </p>
      )}
    </div>
  )
}
