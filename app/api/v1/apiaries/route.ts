import { verifySession, errUnauthorized } from '@/app/api/v1/_mock/auth'
import { APIARIES } from '@/app/api/v1/_mock/data'

export async function GET() {
  const session = await verifySession()
  if (!session) return errUnauthorized()
  const items = APIARIES.filter(a => a.owner_id === session.sub)
  return Response.json({ items })
}

export async function POST(req: Request) {
  const session = await verifySession()
  if (!session) return errUnauthorized()

  const body = await req.json().catch(() => ({}))
  const apiary = {
    id: crypto.randomUUID(),
    owner_id: session.sub,
    name: body.name ?? 'Stupină nouă',
    type: body.type ?? 'permanent',
    lat: body.lat ?? 46.77,
    lng: body.lng ?? 23.59,
    hive_count: body.hive_count ?? 10,
    start_date: body.start_date ?? new Date().toISOString().split('T')[0],
    end_date: body.end_date ?? null,
    notes: body.notes ?? null,
    status: 'safe' as const,
    current_risk: { nearest_spray_km: null, nearest_spray_eta: null, active_alerts: 0 },
    created_at: new Date().toISOString(),
    last_ledger_hash: crypto.randomUUID().replace(/-/g, '').substring(0, 16),
  }
  APIARIES.push(apiary)
  return Response.json({ apiary, ledger_hash: apiary.last_ledger_hash }, { status: 201 })
}
