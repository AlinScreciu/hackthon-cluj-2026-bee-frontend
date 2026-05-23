import { verifySession, errUnauthorized, errNotFound } from '@/app/api/v1/_mock/auth'
import { APIARIES } from '@/app/api/v1/_mock/data'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await verifySession()
  if (!session) return errUnauthorized()
  const { id } = await params
  const apiary = APIARIES.find(a => a.id === id)
  if (!apiary) return errNotFound()
  return Response.json({ apiary, history: [] })
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await verifySession()
  if (!session) return errUnauthorized()
  const { id } = await params
  const idx = APIARIES.findIndex(a => a.id === id)
  if (idx === -1) return errNotFound()
  const body = await req.json().catch(() => ({}))
  Object.assign(APIARIES[idx], body)
  return Response.json({ apiary: APIARIES[idx] })
}
