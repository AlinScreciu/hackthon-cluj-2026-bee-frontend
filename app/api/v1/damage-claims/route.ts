import { verifySession, errUnauthorized, errBadRequest, errForbidden } from '@/app/api/v1/_mock/auth'
import { damageClaims, createDamageClaim } from '@/app/api/v1/_mock/data'

export async function GET() {
  const session = await verifySession()
  if (!session) return errUnauthorized()

  const all = Array.from(damageClaims.values())
  // Inspector sees all; apicultor sees own
  const items = session.role === 'inspector'
    ? all
    : all.filter(c => c.beekeeper_id === session.sub)

  return Response.json({ items })
}

export async function POST(req: Request) {
  const session = await verifySession()
  if (!session) return errUnauthorized()
  if (session.role !== 'apicultor') return errForbidden()

  const body = await req.json().catch(() => ({}))
  if (!body.apiary_id || !body.description || body.hive_loss_count == null || body.gps_lat == null || body.gps_lng == null) {
    return errBadRequest('validation_failed', 'Câmpuri obligatorii lipsă: apiary_id, description, hive_loss_count, gps_lat, gps_lng.')
  }

  const claim = createDamageClaim(session.sub, body)
  const ledger_hash = claim.ledger_hash
  return Response.json({ damage_claim: claim, ledger_hash }, { status: 201 })
}
