import { verifySession, errUnauthorized } from '@/app/api/v1/_mock/auth'
import { pushSubscriptions } from '@/app/api/v1/_mock/data'

export async function POST(req: Request) {
  const session = await verifySession()
  if (!session) return errUnauthorized()
  const body = await req.json().catch(() => ({}))
  const id = crypto.randomUUID()
  pushSubscriptions.set(id, { userId: session.sub, ...body })
  return Response.json({ id }, { status: 201 })
}
