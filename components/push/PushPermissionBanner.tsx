'use client'
import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import { usePushSubscription } from '@/lib/hooks/usePushSubscription'
import { ensureServiceWorker } from '@/lib/push/registerSW'
import { toast } from 'sonner'

export function PushPermissionBanner() {
  const { isSubscribed, subscribe } = usePushSubscription()
  const [dismissed, setDismissed] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [pending, setPending] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission)
    }
  }, [])

  if (isSubscribed || dismissed || permission === 'denied') return null

  async function handleEnable() {
    setPending(true)
    try {
      await ensureServiceWorker()
      const ok = await subscribe()
      if (ok) {
        toast.success('Notificările push sunt active.')
        setPermission('granted')
      } else {
        toast.error('Nu am putut activa notificările push.')
      }
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-[12px] border border-purple/20 bg-purple/5 p-3 mb-4">
      <div className="flex items-center gap-3 min-w-0">
        <Bell className="text-purple shrink-0" size={20} />
        <p className="text-[13px] text-ink">
          <span className="font-semibold">Activează notificările</span> — primește alerte instant când un fermier stropește lângă stupinele tale.
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => setDismissed(true)}
          className="text-[12px] text-ink-muted hover:text-ink-soft px-2 py-1"
          type="button"
        >
          Mai târziu
        </button>
        <button
          onClick={handleEnable}
          disabled={pending}
          className="text-[12px] font-semibold bg-purple text-white rounded-[8px] px-3 py-1.5 hover:bg-purple-soft disabled:opacity-60"
          type="button"
        >
          {pending ? 'Se activează…' : 'Activează'}
        </button>
      </div>
    </div>
  )
}
