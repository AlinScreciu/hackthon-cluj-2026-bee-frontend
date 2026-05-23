'use client'
import { use } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useAlert, useConfirmAlert } from '@/lib/api/queries'
import { Spinner } from '@/components/feedback/Spinner'
import { BzzBzzCard } from '@/components/alerts/BzzBzzCard'
import { BzzBzzConfirmed } from '@/components/alerts/BzzBzzConfirmed'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { toast } from 'sonner'

export default function AlertDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data, isLoading, refetch } = useAlert(id)
  const confirm = useConfirmAlert()
  const router = useRouter()

  if (isLoading) return <Spinner size="lg" className="py-16 mx-auto" />
  if (!data) return <p className="text-center py-12 text-ink-muted">Alerta nu a fost găsită.</p>

  const { alert } = data
  const confirmed = alert.final_status?.startsWith('confirmed')

  async function handleConfirm(action: 'move_hives' | 'seal_in_place') {
    try {
      await confirm.mutateAsync({ id, action })
      toast.success(action === 'move_hives' ? 'Stupii vor fi mutați.' : 'Stupii vor fi sigilați.')
      await refetch()
    } catch {
      toast.error('Nu am putut confirma acțiunea. Reîncearcă.')
    }
  }

  return (
    <div className="px-4 py-4 lg:max-w-2xl lg:mx-auto">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-purple text-sm font-medium mb-4 hover:text-purple-soft transition-colors"
      >
        <ChevronLeft size={18} /> Înapoi la alerte
      </button>

      <AnimatePresence mode="wait">
        {confirmed ? (
          <BzzBzzConfirmed
            key="confirmed"
            apiaryName={alert.apiary_name}
            finalStatus={alert.final_status}
          />
        ) : (
          <BzzBzzCard
            key="alert"
            alert={alert}
            onConfirm={handleConfirm}
            isPending={confirm.isPending}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
