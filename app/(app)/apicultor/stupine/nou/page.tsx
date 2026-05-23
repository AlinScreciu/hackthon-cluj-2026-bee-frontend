'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import { api } from '@/lib/api/client'
import { ChevronLeft } from 'lucide-react'
import { Spinner } from '@/components/feedback/Spinner'
import { toastSuccess, toastError } from '@/lib/api/toast'

const LocationPicker = dynamic(
  () => import('@/components/map/LocationPicker'),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-[260px]"><Spinner size="md" label="Se încarcă harta..." /></div> },
)

export default function NoaStupinePage() {
  const router = useRouter()
  const today = new Date().toISOString().split('T')[0]
  const [name, setName] = useState('')
  const [hiveCount, setHiveCount] = useState('10')
  const [apiaryType, setApiaryType] = useState<'permanent' | 'pastoral'>('permanent')
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState('')
  const [notes, setNotes] = useState('')
  const [lat, setLat] = useState(46.77)
  const [lng, setLng] = useState(23.59)
  const [locationTouched, setLocationTouched] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleLocationChange(newLat: number, newLng: number) {
    setLat(newLat)
    setLng(newLng)
    setLocationTouched(true)
  }

  const labelCls = 'block text-sm font-medium text-ink-soft mb-1'
  const inputCls = 'w-full h-12 px-4 rounded-xl border border-hair bg-white text-ink focus:outline-none focus:ring-2 focus:ring-purple'

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/apiaries', {
        name,
        hive_count: parseInt(hiveCount),
        type: apiaryType,
        lat,
        lng,
        start_date: startDate,
        end_date: apiaryType === 'pastoral' && endDate ? endDate : undefined,
        notes: notes.trim() || undefined,
      })
      toastSuccess('Stupina a fost înregistrată.')
      router.push('/apicultor/stupine')
    } catch (err) {
      toastError(err, 'Eroare la salvare. Reîncearcă.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-4 md:px-6 lg:px-8 py-4">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-purple text-sm font-medium mb-4"
        aria-label="Înapoi la lista de stupine"
      >
        <ChevronLeft size={18} /> Înapoi
      </button>
      <h1 className="text-xl font-bold text-ink mb-6">Stupină nouă</h1>
      <div className="lg:grid lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_520px] 2xl:grid-cols-[1fr_640px] lg:gap-6 lg:items-stretch">
        <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-2xl p-5 shadow-sm lg:max-w-md">

          {/* Name */}
          <div>
            <label htmlFor="apiary-name" className={labelCls}>Nume stupină</label>
            <input
              id="apiary-name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder="ex: Stupina Apahida Nord"
              className={inputCls}
            />
          </div>

          {/* Hive count */}
          <div>
            <label htmlFor="hive-count" className={labelCls}>Număr stupi</label>
            <input
              id="hive-count"
              type="number"
              value={hiveCount}
              onChange={e => setHiveCount(e.target.value)}
              required
              min="1"
              className={inputCls}
            />
          </div>

          {/* Type */}
          <div>
            <label className={labelCls}>Tip</label>
            <div className="flex gap-2" role="radiogroup" aria-label="Tip stupină">
              {(['permanent', 'pastoral'] as const).map(type => (
                <button
                  key={type}
                  type="button"
                  role="radio"
                  aria-checked={apiaryType === type}
                  onClick={() => setApiaryType(type)}
                  className="flex-1 h-12 rounded-xl font-semibold text-sm transition-all"
                  style={apiaryType === type
                    ? { background: '#40288C', color: '#FFFFFF', border: '1.5px solid #40288C' }
                    : { background: '#FFFFFF', color: '#1B0F2E', border: '1.5px solid rgba(77,43,140,0.18)' }
                  }
                >
                  {type === 'permanent' ? 'Permanent' : 'Pastoral'}
                </button>
              ))}
            </div>
          </div>

          {/* Start date */}
          <div>
            <label htmlFor="start-date" className={labelCls}>
              {apiaryType === 'pastoral' ? 'Data sosirii' : 'Data înregistrării'}
            </label>
            <input
              id="start-date"
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              required
              min={today}
              className={inputCls}
            />
          </div>

          {/* End date — pastoral only */}
          {apiaryType === 'pastoral' && (
            <div>
              <label htmlFor="end-date" className={labelCls}>Data plecării (estimat)</label>
              <input
                id="end-date"
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                min={startDate}
                className={inputCls}
              />
            </div>
          )}

          {/* Location — mobile only; desktop renders it in the aside */}
          <div className="lg:hidden">
            <label className={labelCls}>
              Locație {!locationTouched && <span className="text-alert">*</span>}
            </label>
            <LocationPicker lat={lat} lng={lng} onChange={handleLocationChange} />
            {!locationTouched && (
              <p className="mt-1 text-[12px] text-alert">Alege locația pe hartă sau caută o adresă.</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className={labelCls}>Observații (opțional)</label>
            <textarea
              id="notes"
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="ex: lângă pădure de salcâm, acces din drumul județean"
              className="w-full px-4 py-3 rounded-xl border border-hair bg-white text-ink text-[14px] focus:outline-none focus:border-purple focus-visible:ring-2 focus-visible:ring-purple focus-visible:ring-offset-1 resize-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !name || !startDate || !locationTouched}
            className="w-full h-12 bg-purple text-white font-semibold rounded-xl disabled:opacity-50 transition-opacity"
          >
            {loading ? 'Se salvează...' : 'Înregistrează stupina'}
          </button>
        </form>

        <aside className="hidden lg:flex lg:flex-col h-full min-h-0">
          <div className="bg-white rounded-[16px] border border-hair-soft p-4 flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-purple">
                Locație {!locationTouched && <span className="text-alert">*</span>}
              </p>
              {!locationTouched && (
                <p className="text-[11px] text-alert">Necesar</p>
              )}
            </div>
            <div className="flex-1 min-h-0">
              <LocationPicker fill lat={lat} lng={lng} onChange={handleLocationChange} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
