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

  async function subscribe(): Promise<boolean> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false
    try {
      const perm = await Notification.requestPermission()
      if (perm !== 'granted') return false

      const { key } = await api.get<{ key: string }>('/push/vapid-public-key')
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(key).buffer as ArrayBuffer,
      })
      const { id } = await api.post<{ id: string }>('/push/subscriptions', sub.toJSON())
      localStorage.setItem('ra:push_id', id)
      setSubscriptionId(id)
      return true
    } catch {
      return false
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
