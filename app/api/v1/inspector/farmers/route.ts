import { verifySession, errUnauthorized } from '@/app/api/v1/_mock/auth'
import { USERS } from '@/app/api/v1/_mock/data'

export async function GET() {
  const session = await verifySession()
  if (!session) return errUnauthorized()
  const items = USERS.filter(u => u.role === 'fermier')
  return Response.json({ items })
}
