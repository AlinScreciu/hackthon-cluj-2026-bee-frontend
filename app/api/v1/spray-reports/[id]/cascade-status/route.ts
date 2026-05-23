import { verifySession, errUnauthorized, errNotFound } from '@/app/api/v1/_mock/auth'
import { computeCascadeStatus } from '@/app/api/v1/_mock/data'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await verifySession()
  if (!session) return errUnauthorized()
  const { id } = await params
  const status = computeCascadeStatus(id)
  if (!status) return errNotFound()
  return Response.json(status)
}
