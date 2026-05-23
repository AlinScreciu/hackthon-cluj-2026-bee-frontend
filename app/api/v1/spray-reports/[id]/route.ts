import { verifySession, errUnauthorized, errNotFound } from '@/app/api/v1/_mock/auth'
import { sprayReports, computeCascadeStatus } from '@/app/api/v1/_mock/data'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await verifySession()
  if (!session) return errUnauthorized()
  const { id } = await params
  const spray = sprayReports.get(id)
  if (!spray) return errNotFound()
  const { created_at_ms, ...spray_report } = spray
  const cascade = computeCascadeStatus(id)
  return Response.json({ spray_report, cascade })
}
