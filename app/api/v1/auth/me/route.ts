import { verifySession, errUnauthorized } from '@/app/api/v1/_mock/auth'
import { getUserById } from '@/app/api/v1/_mock/data'

export async function GET() {
  const session = await verifySession()
  if (!session) return errUnauthorized()

  const user = getUserById(session.sub)
  if (!user) return errUnauthorized()

  return Response.json({ user })
}
