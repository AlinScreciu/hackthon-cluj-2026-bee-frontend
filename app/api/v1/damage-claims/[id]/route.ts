import { verifySession, errUnauthorized, errNotFound, errForbidden } from '@/app/api/v1/_mock/auth'
import { damageClaims } from '@/app/api/v1/_mock/data'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await verifySession()
  if (!session) return errUnauthorized()
  const { id } = await params
  const claim = damageClaims.get(id)
  if (!claim) return errNotFound()
  // Apicultor can only see own claims
  if (session.role === 'apicultor' && claim.beekeeper_id !== session.sub) return errForbidden()
  return Response.json({ damage_claim: claim })
}
