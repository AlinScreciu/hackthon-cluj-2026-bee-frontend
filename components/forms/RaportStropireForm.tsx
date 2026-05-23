'use client'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useParcels, useSubstances } from '@/lib/api/queries'
import { api } from '@/lib/api/client'
import { ApiError } from '@/lib/api/client'
import { ToxBadge } from '@/components/ui/Badge'
import { Bell } from 'lucide-react'
import type { Toxicity } from '@/lib/api/types'

const schema = z.object({
  parcel_id: z.string().min(1, 'Selectează o parcelă'),
  surface_ha: z.number({ error: 'Introduceți suprafața' }).positive('Suprafața trebuie să fie pozitivă'),
  crop: z.string().min(1, 'Introduceți cultura'),
  substance: z.string().min(1, 'Selectează o substanță'),
  scheduled_at: z.string().min(1, 'Selectează data'),
  duration_hours: z.number({ error: 'Introduceți durata' }).positive().max(24),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

function tomorrow() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  d.setMinutes(0, 0, 0)
  return d.toISOString().slice(0, 16)
}

const RISK_RADIUS: Record<Toxicity, string> = {
  'T+': '3 km',
  'T': '1,5 km',
  'T-': '750 m',
}

// Mock affected beekeepers — in production this comes from the API
const MOCK_AFFECTED = ['Andrei Bodea', 'Cristina Pop', 'Vasile Olaru']

export function RaportStropireForm() {
  const router = useRouter()
  const { data: parcelsData } = useParcels()
  const { data: substancesData } = useSubstances()
  const parcels = parcelsData?.items ?? []
  const substances = substancesData?.items ?? []

  const [selectedToxicity, setSelectedToxicity] = useState<Toxicity | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const lastParcelId = typeof window !== 'undefined' ? localStorage.getItem('ra:last_parcel_id') : null

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      parcel_id: lastParcelId ?? '',
      surface_ha: undefined,
      crop: '',
      substance: '',
      scheduled_at: tomorrow(),
      duration_hours: 2,
      notes: '',
    },
  })

  const selectedSubstance = watch('substance')
  const selectedParcelId = watch('parcel_id')

  useEffect(() => {
    const sub = substances.find(s => s.label === selectedSubstance)
    setSelectedToxicity(sub?.toxicity ?? null)
  }, [selectedSubstance, substances])

  useEffect(() => {
    if (selectedParcelId) {
      const parcel = parcels.find(p => p.id === selectedParcelId)
      if (parcel?.surface_ha) setValue('surface_ha', parcel.surface_ha)
      if (parcel?.default_crop) setValue('crop', parcel.default_crop)
    }
  }, [selectedParcelId, parcels, setValue])

  async function onSubmit(values: FormValues) {
    setSubmitting(true)
    setError('')
    try {
      if (values.parcel_id) localStorage.setItem('ra:last_parcel_id', values.parcel_id)
      const data = await api.post<{ spray_report: { id: string } }>('/spray-reports', {
        ...values,
        scheduled_at: new Date(values.scheduled_at).toISOString(),
      })
      router.push(`/fermier/rapoarte/${data.spray_report.id}`)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Eroare la trimitere. Reîncearcă.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const fieldCls = `w-full h-12 px-4 rounded-xl border border-hair bg-white text-ink text-[14px] focus:outline-none focus:border-purple transition-colors`
  const labelCls = `block text-[12px] font-semibold text-ink-soft mb-1.5 uppercase tracking-[0.04em]`
  const errorCls = `text-[11px] text-alert mt-1`

  // Parcel label for autofill hint
  const selectedParcel = parcels.find(p => p.id === selectedParcelId)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pb-40">

      {/* Parcel */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="parcel_id" className={labelCls.replace('mb-1.5', '')}>Parcelă</label>
          {selectedParcel && (
            <span className="text-[11px] text-ink-muted">Autofill din cadastru</span>
          )}
        </div>
        <select
          id="parcel_id"
          {...register('parcel_id')}
          className={fieldCls}
          aria-invalid={!!errors.parcel_id}
        >
          <option value="">Selectează parcela...</option>
          {parcels.map(p => (
            <option key={p.id} value={p.id}>{p.name} – {p.locality}</option>
          ))}
        </select>
        {selectedParcel && (
          <p className="text-[11px] text-ink-muted mt-1">
            {selectedParcel.surface_ha} ha · {selectedParcel.cadastral_number}
          </p>
        )}
        {errors.parcel_id && <p className={errorCls}>{errors.parcel_id.message}</p>}
      </div>

      {/* Surface + Crop side by side */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="surface_ha" className={labelCls}>Suprafață stropită</label>
          <input
            id="surface_ha"
            type="number"
            step="0.1"
            min="0.1"
            placeholder="4.2"
            {...register('surface_ha', { valueAsNumber: true })}
            className={fieldCls}
          />
          {errors.surface_ha && <p className={errorCls}>{errors.surface_ha.message}</p>}
        </div>
        <div>
          <label htmlFor="crop" className={labelCls}>Cultură</label>
          <input
            id="crop"
            type="text"
            placeholder="rapiță"
            {...register('crop')}
            className={fieldCls}
          />
          {errors.crop && <p className={errorCls}>{errors.crop.message}</p>}
        </div>
      </div>

      {/* Substance — pill buttons */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={labelCls.replace('mb-1.5', '')}>Substanță</label>
          {selectedToxicity && (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-ink-muted">Toxicitate determinată automat</span>
              <ToxBadge toxicity={selectedToxicity} />
            </div>
          )}
        </div>

        <Controller
          name="substance"
          control={control}
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {substances.map(s => {
                const isSelected = field.value === s.label
                return (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => field.onChange(s.label)}
                    className="px-3 py-2 rounded-[10px] text-[13px] font-semibold transition-all active:scale-[0.97]"
                    style={isSelected ? {
                      background: '#40288C',
                      color: '#FFFFFF',
                      border: '1.5px solid #40288C',
                    } : {
                      background: '#FFFFFF',
                      color: '#1B0F2E',
                      border: '1.5px solid rgba(77,43,140,0.18)',
                    }}
                  >
                    {s.label}
                  </button>
                )
              })}
            </div>
          )}
        />

        {selectedToxicity && (
          <div
            className="mt-3 rounded-xl px-3 py-2 text-[13px] font-medium"
            style={
              selectedToxicity === 'T+' ? { background: 'rgba(220,38,38,0.08)', color: '#B91C1C' } :
              selectedToxicity === 'T'  ? { background: 'rgba(238,167,39,0.10)', color: '#92400E' } :
              { background: 'rgba(22,163,74,0.08)', color: '#166534' }
            }
          >
            Raza de risc: <strong>{RISK_RADIUS[selectedToxicity]}</strong>
            {selectedToxicity === 'T-' && ' · Fără apel vocal'}
          </div>
        )}

        {errors.substance && <p className={errorCls}>{errors.substance.message}</p>}
      </div>

      {/* Date + time side by side */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="scheduled_at" className={labelCls}>Data stropire</label>
          <input
            id="scheduled_at"
            type="datetime-local"
            {...register('scheduled_at')}
            className={fieldCls}
          />
          {errors.scheduled_at && <p className={errorCls}>{errors.scheduled_at.message}</p>}
        </div>
        <div>
          <label htmlFor="duration_hours" className={labelCls}>Ora</label>
          <input
            id="duration_hours"
            type="number"
            step="0.5"
            min="0.5"
            max="24"
            {...register('duration_hours', { valueAsNumber: true })}
            className={fieldCls}
          />
          {errors.duration_hours && <p className={errorCls}>{errors.duration_hours.message}</p>}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className={labelCls}>Observații (opțional)</label>
        <textarea
          id="notes"
          rows={3}
          placeholder="ex: vânt slab dimineața, drum acces din nord"
          {...register('notes')}
          className="w-full px-4 py-3 rounded-xl border border-hair bg-white text-ink text-[14px] focus:outline-none focus:border-purple resize-none transition-colors"
        />
      </div>

      {error && (
        <p role="alert" className="text-[13px] text-alert bg-alert/10 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      {/* Sticky bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-20 pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-lg mx-auto px-4 pb-4">
          {selectedToxicity ? (
            /* Enhanced CTA with affected count */
            <div
              className="rounded-[16px] px-4 pt-3 pb-4"
              style={{ background: '#1B0F2E' }}
            >
              <p className="text-[13px] text-white/70 leading-snug mb-0.5">
                <span className="text-pollen font-bold">{MOCK_AFFECTED.length} apicultori</span>
                {' '}în raza de {RISK_RADIUS[selectedToxicity]} vor primi alertă
              </p>
              <p className="text-[11.5px] text-white/50 mb-3 truncate">
                {MOCK_AFFECTED.join(', ')}
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="w-full h-12 rounded-[12px] font-bold text-[15px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                style={{ background: '#FFEF5F', color: '#1B0F2E' }}
              >
                {submitting ? (
                  <span className="w-4 h-4 rounded-full border-2 border-ink border-t-transparent" style={{ animation: 'spin 0.7s linear infinite' }} />
                ) : (
                  <>
                    <Bell size={16} />
                    Notifică toți
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full mt-2 text-[13px] text-white/50 text-center py-1 hover:text-white/70 transition-colors"
              >
                Salvează ca draft
              </button>
            </div>
          ) : (
            /* Simple CTA when no substance selected */
            <div className="bg-white/95 backdrop-blur-md border-t border-hair pt-3 pb-1 -mx-4 px-4">
              <button
                type="submit"
                disabled={submitting || !selectedParcelId}
                className="w-full h-12 bg-purple text-white font-bold text-[15px] rounded-[12px] disabled:opacity-40 hover:bg-purple-soft transition-colors"
              >
                {submitting ? 'Se trimite...' : 'Notifică apicultorii'}
              </button>
            </div>
          )}
        </div>
      </div>
    </form>
  )
}
