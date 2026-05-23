import { verifySession, errUnauthorized, errNotFound } from '@/app/api/v1/_mock/auth'
import { PARCELS } from '@/app/api/v1/_mock/data'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await verifySession()
  if (!session) return errUnauthorized()
  const { id } = await params
  const parcel = PARCELS.find(p => p.id === id)
  if (!parcel) return errNotFound()
  return Response.json({ parcel })
}
