import { verifySession, errUnauthorized } from '@/app/api/v1/_mock/auth'
import { PARCELS } from '@/app/api/v1/_mock/data'

export async function GET() {
  const session = await verifySession()
  if (!session) return errUnauthorized()
  const items = PARCELS.filter(p => p.owner_id === session.sub)
  return Response.json({ items })
}
