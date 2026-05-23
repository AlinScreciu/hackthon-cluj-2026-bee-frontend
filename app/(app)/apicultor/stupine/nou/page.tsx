'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { api } from '@/lib/api/client'
import { ApiError } from '@/lib/api/client'
import { ChevronLeft } from 'lucide-react'

export default function NoaStupinePage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [hiveCount, setHiveCount] = useState('10')
  const [apiaryType, setApiaryType] = useState<'permanent' | 'pastoral'>('permanent')
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [endDate, setEndDate] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const labelCls = 'block text-sm font-medium text-ink-soft mb-1'
  const inputCls = 'w-full h-12 px-4 rounded-xl border border-hair bg-white text-ink focus:outline-none focus:ring-2 focus:ring-purple'

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.post('/apiaries', {
        name,
        hive_count: parseInt(hiveCount),
        type: apiaryType,
        lat: 46.77,
        lng: 23.59,
        start_date: startDate,
        end_date: apiaryType === 'pastoral' && endDate ? endDate : undefined,
        notes: notes.trim() || undefined,
      })
      router.push('/apicultor/stupine')
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Eroare la salvare. Reîncearcă.')
      }
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
      <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-2xl p-5 shadow-sm">

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

        {/* Notes */}
        <div>
          <label htmlFor="notes" className={labelCls}>Observații (opțional)</label>
          <textarea
            id="notes"
            rows={3}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="ex: lângă pădure de salcâm, acces din drumul județean"
            className="w-full px-4 py-3 rounded-xl border border-hair bg-white text-ink text-[14px] focus:outline-none focus:border-purple resize-none transition-colors"
          />
        </div>

        {error && (
          <p role="alert" className="text-[13px] text-alert bg-alert/10 rounded-xl px-4 py-3">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !name || !startDate}
          className="w-full h-12 bg-purple text-white font-semibold rounded-xl disabled:opacity-50 transition-opacity"
        >
          {loading ? 'Se salvează...' : 'Înregistrează stupina'}
        </button>
      </form>
    </div>
  )
}
