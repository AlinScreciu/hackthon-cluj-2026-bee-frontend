import { verifySession, errUnauthorized } from '@/app/api/v1/_mock/auth'
import { pushSubscriptions } from '@/app/api/v1/_mock/data'

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await verifySession()
  if (!session) return errUnauthorized()
  const { id } = await params
  pushSubscriptions.delete(id)
  return new Response(null, { status: 204 })
}
