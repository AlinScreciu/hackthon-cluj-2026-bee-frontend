'use client'
import { useState } from 'react'
import { api } from '@/lib/api/client'

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const base64Str = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = window.atob(base64Str)
  const arr = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i)
  return arr
}

export function usePushSubscription() {
  const [subscriptionId, setSubscriptionId] = useState<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('ra:push_id') : null
  )

  async function subscribe(): Promise<{ ok: boolean; error?: string }> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return { ok: false, error: 'Browserul nu suportă notificări push.' }
    }
    try {
      const perm = await Notification.requestPermission()
      if (perm !== 'granted') return { ok: false, error: 'Permisiunea a fost refuzată.' }

      const { key } = await api.get<{ key: string }>('/push/vapid-public-key')
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(key) as BufferSource,
      })
      const { id } = await api.post<{ id: string }>('/push/subscriptions', sub.toJSON())
      localStorage.setItem('ra:push_id', id)
      setSubscriptionId(id)
      return { ok: true }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('push subscribe failed:', err)
      const msg = err instanceof Error ? err.message : String(err)
      return { ok: false, error: msg }
    }
  }

  async function unsubscribe() {
    if (!subscriptionId) return
    await api.del(`/push/subscriptions/${subscriptionId}`)
    localStorage.removeItem('ra:push_id')
    setSubscriptionId(null)
  }

  return { subscriptionId, isSubscribed: !!subscriptionId, subscribe, unsubscribe }
}
