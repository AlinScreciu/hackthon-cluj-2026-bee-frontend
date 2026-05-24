'use client'
import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import Select from 'react-select'
import { useApiaries, useCreateDamageClaim } from '@/lib/api/queries'
import { PhotoUploader } from '@/components/forms/PhotoUploader'
import { Spinner } from '@/components/feedback/Spinner'
import { toastSuccess, toastError } from '@/lib/api/toast'

function PagubaNouaForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const apiariesQ = useApiaries()
  const createClaim = useCreateDamageClaim()

  const [apiaryId, setApiaryId] = useState('')
  const [relatedSprayId, setRelatedSprayId] = useState('')
  const [description, setDescription] = useState('')
  const [hiveLossCount, setHiveLossCount] = useState('5')
  const [photoKeys, setPhotoKeys] = useState<string[]>([])

  // Pre-fill the related-spray dropdown when arriving from a spray report link.
  useEffect(() => {
    const fromQuery = searchParams.get('related_spray_id')
    if (fromQuery) setRelatedSprayId(fromQuery)
  }, [searchParams])

  const apiaries = apiariesQ.data?.items ?? []

  const labelCls = 'block text-sm font-medium text-ink-soft mb-1'
  const inputCls = 'w-full h-12 px-4 rounded-xl border border-hair bg-white text-ink focus:outline-none focus:ring-2 focus:ring-purple'

  // Photos are encouraged but not required — lets the user submit a claim
  // even if R2 CORS isn't yet configured for the dev origin.
  const missing: string[] = []
  if (!apiaryId) missing.push('Selectează stupina afectată.')
  const descLen = description.trim().length
  if (descLen === 0) {
    missing.push('Adaugă o descriere (minim 10 caractere).')
  } else if (descLen < 10) {
    missing.push(`Descrierea trebuie să aibă cel puțin 10 caractere (mai sunt ${10 - descLen}).`)
  }
  if (hiveLossCount === '' || Number.isNaN(Number(hiveLossCount)) || Number(hiveLossCount) < 0) {
    missing.push('Introdu un număr valid de stupi afectați (≥ 0).')
  }
  const canSubmit = missing.length === 0 && !createClaim.isPending

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const apiary = apiaries.find(a => a.id === apiaryId)
    if (!apiary) {
      toastError(null, 'Selectează o stupină validă.')
      return
    }
    try {
      await createClaim.mutateAsync({
        apiary_id: apiaryId,
        related_spray_id: relatedSprayId || null,
        description: description.trim(),
        hive_loss_count: Number(hiveLossCount),
        gps_lat: apiary.lat,
        gps_lng: apiary.lng,
        photos: photoKeys,
      })
      toastSuccess('Pagubă raportată.')
      router.push('/apicultor/daune')
    } catch (err) {
      toastError(err, 'Eroare la trimitere.')
    }
  }

  return (
    <div className="px-4 md:px-6 lg:px-8 py-4 lg:max-w-2xl">
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-1 text-purple text-sm font-medium mb-4"
        aria-label="Înapoi"
      >
        <ChevronLeft size={18} /> Înapoi
      </button>
      <h1 className="text-xl font-bold text-ink mb-6">Pagubă nouă</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-2xl p-5 shadow-sm">
        {/* Apiary */}
        <div>
          <label htmlFor="apiary" className={labelCls}>Stupină afectată</label>
          {(() => {
            const options = apiaries.map(a => ({ value: a.id, label: a.name }))
            const selected = options.find(o => o.value === apiaryId) ?? null
            return (
              <Select
                inputId="apiary"
                instanceId="apiary"
                options={options}
                value={selected}
                onChange={opt => setApiaryId(opt?.value ?? '')}
                placeholder={apiariesQ.isLoading ? 'Se încarcă...' : 'Alege stupina'}
                noOptionsMessage={() => 'Nicio stupină'}
                isClearable
                isSearchable
                isDisabled={apiariesQ.isLoading}
                unstyled
                aria-required
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
          })()}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className={labelCls}>Descriere</label>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            minLength={10}
            placeholder="Descrie ce ai observat: număr aproximativ albine moarte, simptome, momentul descoperirii..."
            className="w-full px-4 py-3 rounded-xl border border-hair bg-white text-ink text-[14px] focus:outline-none focus:border-purple focus-visible:ring-2 focus-visible:ring-purple focus-visible:ring-offset-1 resize-none transition-colors"
          />
        </div>

        {/* Hive loss count */}
        <div>
          <label htmlFor="hive-loss" className={labelCls}>Număr stupi afectați</label>
          <input
            id="hive-loss"
            type="number"
            min="0"
            value={hiveLossCount}
            onChange={e => setHiveLossCount(e.target.value)}
            required
            className={inputCls}
          />
        </div>

        {/* Photos */}
        <div>
          <label className={labelCls}>Poze (cel puțin una)</label>
          <PhotoUploader onKeysChange={setPhotoKeys} maxFiles={5} />
        </div>

        {missing.length > 0 && (
          <div
            role="alert"
            aria-live="polite"
            className="rounded-xl border border-honey/30 bg-pollen/15 px-4 py-3 text-[13px] text-honey-deep"
          >
            <p className="font-semibold mb-1">Completează înainte de a trimite:</p>
            <ul className="list-disc list-inside space-y-0.5">
              {missing.map(m => <li key={m}>{m}</li>)}
            </ul>
          </div>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full h-12 bg-purple text-white font-semibold rounded-xl disabled:opacity-50 transition-opacity"
        >
          {createClaim.isPending ? 'Se trimite...' : 'Trimite pagubă'}
        </button>
      </form>
    </div>
  )
}

export default function PagubaNouaPage() {
  return (
    <Suspense fallback={<Spinner size="md" className="py-12 mx-auto" />}>
      <PagubaNouaForm />
    </Suspense>
  )
}
