import { verifySession, errUnauthorized, errNotFound } from '@/app/api/v1/_mock/auth'
import { getUserById } from '@/app/api/v1/_mock/data'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await verifySession()
  if (!session) return errUnauthorized()
  const { id } = await params
  const farmer = getUserById(id)
  if (!farmer) return errNotFound()
  return Response.json({ farmer, sprays_total: 3, sprays_last_30d: 1, damages_filed_against: 0 })
}
