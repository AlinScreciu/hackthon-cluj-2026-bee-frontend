'use client'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useMemo } from 'react'
import Select from 'react-select'
import { useParcels, useSubstances } from '@/lib/api/queries'
import { api } from '@/lib/api/client'
import { ApiError } from '@/lib/api/client'
import { ToxBadge } from '@/components/ui/Badge'
import { TriangleAlert } from 'lucide-react'
import type { Toxicity } from '@/lib/api/types'

const schema = z.object({
  parcel_id: z.string().min(1, 'Selectează o parcelă'),
  surface_ha: z.number({ error: 'Introduceți suprafața' }).positive('Suprafața trebuie să fie pozitivă'),
  dose_kg_ha: z.number({ error: 'Introduceți doza' }).positive('Doza trebuie să fie pozitivă'),
  crop: z.string().min(1, 'Introduceți cultura'),
  substance: z.string().min(1, 'Selectează o substanță'),
  scheduled_at: z
    .string()
    .min(1, 'Selectează data')
    .refine(v => {
      const picked = new Date(v)
      const now = new Date()
      now.setSeconds(0, 0)
      return picked.getTime() >= now.getTime()
    }, 'Data și ora nu pot fi în trecut'),
  duration_hours: z.number({ error: 'Introduceți durata' }).positive().max(24),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

function toLocalInputValue(d: Date) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function tomorrow() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  d.setMinutes(0, 0, 0)
  return toLocalInputValue(d)
}

function nowLocal() {
  const d = new Date()
  d.setSeconds(0, 0)
  return toLocalInputValue(d)
}

export const RISK_RADIUS: Record<Toxicity, string> = {
  'T+': '3 km',
  'T': '1,5 km',
  'T-': '750 m',
}

// Real affected count is computed server-side on submit (Phase 6 adds a preview endpoint).

export interface RaportLiveValues {
  substance: string
  parcel_id: string
  toxicity: Toxicity | null
  surface_ha: number | null
  dose_kg_ha: number | null
  crop: string
  scheduled_at: string
  duration_hours: number | null
}

export interface RaportStropireFormProps {
  onLiveValues?: (values: RaportLiveValues) => void
}

export function RaportStropireForm({ onLiveValues }: RaportStropireFormProps = {}) {
  const router = useRouter()
  const { data: parcelsData } = useParcels()
  const { data: substancesData } = useSubstances()
  const parcels = useMemo(() => parcelsData?.items ?? [], [parcelsData])
  const substances = useMemo(() => substancesData?.items ?? [], [substancesData])

  const [selectedToxicity, setSelectedToxicity] = useState<Toxicity | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const lastParcelId = typeof window !== 'undefined' ? localStorage.getItem('ra:last_parcel_id') : null

  const { register, handleSubmit, control, watch, setValue, setError: setFieldError, clearErrors, formState: { errors, isValid } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      parcel_id: lastParcelId ?? '',
      surface_ha: undefined,
      dose_kg_ha: 1,
      crop: '',
      substance: '',
      scheduled_at: tomorrow(),
      duration_hours: 2,
      notes: '',
    },
  })

  const selectedSubstance = watch('substance')
  const selectedParcelId = watch('parcel_id')
  const selectedSurfaceHa = watch('surface_ha')
  const selectedDose = watch('dose_kg_ha')
  const selectedScheduledAt = watch('scheduled_at')
  const selectedCrop = watch('crop')
  const selectedDuration = watch('duration_hours')
  const parcelMaxHa = parcels.find(p => p.id === selectedParcelId)?.surface_ha

  // Bee-safe window: hours 21:00–05:59 (after sunset / before sunrise).
  // Anything in [6, 21) overlaps with active foraging — warn but allow.
  const scheduledHour = selectedScheduledAt ? new Date(selectedScheduledAt).getHours() : null
  const isRiskyHour = scheduledHour !== null && scheduledHour >= 6 && scheduledHour < 21

  useEffect(() => {
    if (!parcelMaxHa || !selectedSurfaceHa) {
      clearErrors('surface_ha')
      return
    }
    if (selectedSurfaceHa > parcelMaxHa) {
      setFieldError('surface_ha', {
        type: 'max',
        message: `Nu poate depăși ${parcelMaxHa} ha (suprafața parcelei)`,
      })
    } else {
      clearErrors('surface_ha')
    }
  }, [selectedSurfaceHa, parcelMaxHa, setFieldError, clearErrors])

  // Show an inline error the moment scheduled_at is set to a past moment.
  // Zod's refine in the schema is the final gate that blocks submission.
  useEffect(() => {
    if (!selectedScheduledAt) return
    const picked = new Date(selectedScheduledAt)
    if (Number.isNaN(picked.getTime())) return
    const now = new Date()
    now.setSeconds(0, 0)
    if (picked.getTime() < now.getTime()) {
      setFieldError('scheduled_at', { type: 'min', message: 'Data și ora nu pot fi în trecut' })
    } else {
      clearErrors('scheduled_at')
    }
  }, [selectedScheduledAt, setFieldError, clearErrors])

  useEffect(() => {
    const sub = substances.find(s => s.label === selectedSubstance)
    setSelectedToxicity(sub?.toxicity ?? null)
  }, [selectedSubstance, substances])

  useEffect(() => {
    onLiveValues?.({
      substance: selectedSubstance ?? '',
      parcel_id: selectedParcelId ?? '',
      toxicity: selectedToxicity,
      surface_ha: typeof selectedSurfaceHa === 'number' ? selectedSurfaceHa : null,
      dose_kg_ha: typeof selectedDose === 'number' ? selectedDose : null,
      crop: selectedCrop ?? '',
      scheduled_at: selectedScheduledAt ?? '',
      duration_hours: typeof selectedDuration === 'number' ? selectedDuration : null,
    })
  }, [selectedSubstance, selectedParcelId, selectedToxicity, selectedSurfaceHa, selectedDose, selectedCrop, selectedScheduledAt, selectedDuration, onLiveValues])

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

  const fieldCls = `w-full h-12 px-4 rounded-xl border border-hair bg-white text-ink text-[14px] focus:outline-none focus:border-purple focus-visible:ring-2 focus-visible:ring-purple focus-visible:ring-offset-1 transition-colors`
  const labelCls = `block text-[12px] font-semibold text-ink-soft mb-1.5 uppercase tracking-[0.04em]`
  const errorCls = `text-[11px] text-alert mt-1`

  // Parcel label for autofill hint
  const selectedParcel = parcels.find(p => p.id === selectedParcelId)

  return (
    <form id="raport-stropire-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">

      {/* Parcel */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="parcel_id" className={labelCls.replace('mb-1.5', '')}>Parcelă</label>
          {selectedParcel && (
            <span className="text-[11px] text-ink-muted">Autofill din cadastru</span>
          )}
        </div>
        <Controller
          name="parcel_id"
          control={control}
          render={({ field }) => {
            const options = parcels.map(p => ({
              value: p.id,
              label: `${p.name} – ${p.locality}`,
            }))
            const selected = options.find(o => o.value === field.value) ?? null
            return (
              <Select
                inputId="parcel_id"
                instanceId="parcel_id"
                options={options}
                value={selected}
                onChange={opt => field.onChange(opt?.value ?? '')}
                onBlur={field.onBlur}
                placeholder="Selectează parcela..."
                noOptionsMessage={() => 'Nicio parcelă'}
                isClearable
                isSearchable
                unstyled
                aria-invalid={!!errors.parcel_id}
                aria-describedby={errors.parcel_id ? 'err-parcel' : undefined}
                classNames={{
                  control: ({ isFocused }) =>
                    `min-h-12 px-2 rounded-xl bg-white text-[14px] border transition-colors ${isFocused ? 'border-purple' : 'border-hair'
                    }`,
                  valueContainer: () => 'px-1.5 gap-1',
                  placeholder: () => 'text-ink-muted',
                  singleValue: () => 'text-ink',
                  input: () => 'text-ink',
                  indicatorsContainer: () => 'gap-1',
                  indicatorSeparator: () => 'hidden',
                  dropdownIndicator: () => 'text-ink-muted px-1.5 hover:text-purple transition-colors',
                  clearIndicator: () => 'text-ink-muted px-1 hover:text-alert transition-colors cursor-pointer',
                  menu: () => 'mt-1 bg-white rounded-xl border border-hair shadow-lg overflow-hidden z-50',
                  menuList: () => 'py-1 max-h-60',
                  option: ({ isFocused, isSelected }) =>
                    `px-3 py-2.5 text-[14px] cursor-pointer transition-colors ${isSelected
                      ? 'bg-purple/10 text-purple font-semibold'
                      : isFocused
                        ? 'bg-hair-soft text-ink'
                        : 'text-ink'
                    }`,
                  noOptionsMessage: () => 'px-3 py-2.5 text-[13px] text-ink-muted text-center',
                }}
              />
            )
          }}
        />
        {selectedParcel && (
          <p className="text-[11px] text-ink-muted mt-1">
            {selectedParcel.surface_ha} ha · {selectedParcel.cadastral_number}
          </p>
        )}
        {errors.parcel_id && <p id="err-parcel" className={errorCls}>{errors.parcel_id.message}</p>}
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
            max={parcelMaxHa}
            placeholder="4.2"
            {...register('surface_ha', { valueAsNumber: true })}
            className={fieldCls}
            aria-invalid={!!errors.surface_ha}
            aria-describedby={errors.surface_ha ? 'err-surface' : parcelMaxHa ? 'hint-surface' : undefined}
          />
          {errors.surface_ha
            ? <p id="err-surface" className={errorCls}>{errors.surface_ha.message}</p>
            : parcelMaxHa
              ? <p id="hint-surface" className="text-[11px] text-ink-muted mt-1">max {parcelMaxHa} ha</p>
              : null}
        </div>
        <div>
          <label htmlFor="crop" className={labelCls}>Cultură</label>
          <input
            id="crop"
            type="text"
            placeholder="rapiță"
            {...register('crop')}
            className={fieldCls}
            aria-invalid={!!errors.crop}
            aria-describedby={errors.crop ? 'err-crop' : undefined}
          />
          {errors.crop && <p id="err-crop" className={errorCls}>{errors.crop.message}</p>}
        </div>
      </div>

      {/* Dose: kg/ha + computed total */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="dose_kg_ha" className={labelCls.replace('mb-1.5', '')}>Doză (kg/ha)</label>
          {typeof selectedDose === 'number' && typeof selectedSurfaceHa === 'number' && selectedDose > 0 && selectedSurfaceHa > 0 && (
            <span className="text-[11px] text-ink-muted">
              ≈ <strong className="text-ink-soft">{(selectedDose * selectedSurfaceHa).toFixed(2)} kg</strong> total
            </span>
          )}
        </div>
        <input
          id="dose_kg_ha"
          type="number"
          step="any"
          min="0.01"
          placeholder="1.0"
          {...register('dose_kg_ha', { valueAsNumber: true })}
          className={fieldCls}
          aria-invalid={!!errors.dose_kg_ha}
          aria-describedby={errors.dose_kg_ha ? 'err-dose' : 'hint-dose'}
        />
        {errors.dose_kg_ha
          ? <p id="err-dose" className={errorCls}>{errors.dose_kg_ha.message}</p>
          : <p id="hint-dose" className="text-[11px] text-ink-muted mt-1">Doza pe hectar conform etichetei produsului</p>}
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
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Selectează substanța">
              {substances.map(s => {
                const isSelected = field.value === s.label
                return (
                  <button
                    key={s.label}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
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

        {/* Risk radius is shown in the preview panel; not duplicated here. */}
        {selectedToxicity === 'T-' && (
          <p className="text-[11.5px] text-ink-muted mt-2">Toxicitate scăzută · fără apel vocal de avertizare</p>
        )}

        {errors.substance && <p id="err-substance" className={errorCls} role="alert">{errors.substance.message}</p>}
      </div>

      {/* Date + time side by side */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="scheduled_at" className={labelCls}>Data stropire</label>
          <input
            id="scheduled_at"
            type="datetime-local"
            min={nowLocal()}
            {...register('scheduled_at')}
            className={fieldCls}
            aria-invalid={!!errors.scheduled_at}
            aria-describedby={errors.scheduled_at ? 'err-scheduled' : isRiskyHour ? 'warn-scheduled' : undefined}
          />
          {errors.scheduled_at && <p id="err-scheduled" className={errorCls}>{errors.scheduled_at.message}</p>}
        </div>
        <div>
          <label htmlFor="duration_hours" className={labelCls}>Durată (ore)</label>
          <input
            id="duration_hours"
            type="number"
            step="0.5"
            min="0.5"
            max="24"
            {...register('duration_hours', { valueAsNumber: true })}
            className={fieldCls}
            aria-invalid={!!errors.duration_hours}
            aria-describedby={errors.duration_hours ? 'err-duration' : undefined}
          />
          {errors.duration_hours && <p id="err-duration" className={errorCls}>{errors.duration_hours.message}</p>}
        </div>
      </div>

      {/* Bee-safe hour warning — non-blocking */}
      {isRiskyHour && (
        <div
          id="warn-scheduled"
          role="note"
          className="flex items-start gap-2 rounded-xl px-3 py-2.5 bg-pollen/15 border border-honey/30"
        >
          <TriangleAlert size={16} className="text-honey-deep shrink-0 mt-0.5" aria-hidden />
          <p className="text-[13px] text-honey-deep leading-snug">
            <strong>Ora poate afecta albinele.</strong> Stropirea în intervalul 06:00–21:00 prinde albinele în zbor.
            Recomandăm seara târziu sau dimineața devreme.
          </p>
        </div>
      )}

      {/* Notes */}
      <div>
        <label htmlFor="notes" className={labelCls}>Observații (opțional)</label>
        <textarea
          id="notes"
          rows={3}
          placeholder="ex: vânt slab dimineața, drum acces din nord"
          {...register('notes')}
          className="w-full px-4 py-3 rounded-xl border border-hair bg-white text-ink text-[14px] focus:outline-none focus:border-purple focus-visible:ring-2 focus-visible:ring-purple focus-visible:ring-offset-1 resize-none transition-colors"
          aria-invalid={!!errors.notes}
        />
      </div>

      {error && (
        <p role="alert" className="text-[13px] text-alert bg-alert/10 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      {/* On mobile, the RiskPreviewPanel is rendered below this form by the
          parent page and provides its own submit button. We no longer ship a
          separate sticky CTA so there's only ONE submit button visible. */}
    </form>
  )
}
