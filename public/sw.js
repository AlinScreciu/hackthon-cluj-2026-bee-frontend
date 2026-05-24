self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))

self.addEventListener('push', (event) => {
  let data = {}
  try { data = event.data ? event.data.json() : {} } catch (_) {}

  const title = 'BeeLive — alertă pesticide'
  const km = data.distance_m != null ? (data.distance_m / 1000).toFixed(1) : '?'
  const body = `Tratament fitosanitar la ${km} km de stupina ta. Apasă pentru detalii.`

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: data.dispatch_id || 'beelive-alert',
      data: { dispatch_id: data.dispatch_id, spray_report_id: data.spray_report_id },
      requireInteraction: true,
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const id = event.notification.data && event.notification.data.dispatch_id
  const url = id ? `/apicultor/alerte/${id}` : '/apicultor/alerte'

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsArr) => {
      for (const client of clientsArr) {
        if ('focus' in client) {
          client.focus()
          if ('navigate' in client) client.navigate(url)
          return
        }
      }
      return self.clients.openWindow(url)
    })
  )
})
