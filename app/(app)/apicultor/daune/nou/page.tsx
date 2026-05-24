'use client'
import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
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
  const canSubmit =
    !!apiaryId &&
    description.trim().length >= 10 &&
    Number(hiveLossCount) >= 0 &&
    !createClaim.isPending

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
          <select
            id="apiary"
            value={apiaryId}
            onChange={e => setApiaryId(e.target.value)}
            required
            className={inputCls}
          >
            <option value="">{apiariesQ.isLoading ? 'Se încarcă...' : 'Alege stupina'}</option>
            {apiaries.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
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
