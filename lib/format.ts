const roDate = new Intl.DateTimeFormat('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })
const roDateTime = new Intl.DateTimeFormat('ro-RO', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
const roTime = new Intl.DateTimeFormat('ro-RO', { hour: '2-digit', minute: '2-digit' })

export function formatDate(iso: string) {
  return roDate.format(new Date(iso))
}

export function formatDateTime(iso: string) {
  return roDateTime.format(new Date(iso))
}

export function formatTime(iso: string) {
  return roTime.format(new Date(iso))
}

export function formatHa(n: number) {
  return n.toLocaleString('ro-RO', { maximumFractionDigits: 2 }) + ' ha'
}

export function formatKm(n: number) {
  return n.toLocaleString('ro-RO', { maximumFractionDigits: 1 }) + ' km'
}
