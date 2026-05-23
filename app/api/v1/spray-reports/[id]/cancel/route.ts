import { verifySession, errUnauthorized, errNotFound } from '@/app/api/v1/_mock/auth'
import { sprayReports } from '@/app/api/v1/_mock/data'

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await verifySession()
  if (!session) return errUnauthorized()
  const { id } = await params
  const spray = sprayReports.get(id)
  if (!spray) return errNotFound()
  spray.status = 'cancelled'
  const { created_at_ms, ...spray_report } = spray
  return Response.json({ spray_report })
}
