import { verifySession, errUnauthorized, errNotFound } from '@/app/api/v1/_mock/auth'
import { APIARIES, LEDGER_EVENTS } from '@/app/api/v1/_mock/data'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await verifySession()
  if (!session) return errUnauthorized()
  const { id } = await params
  const apiary = APIARIES.find(a => a.id === id)
  if (!apiary) return errNotFound()
  const history = LEDGER_EVENTS
    .filter(e => {
      const payload = e.payload as Record<string, unknown>
      return payload.apiary_id === id
    })
    .map(e => ({ hash: e.hash, type: e.type, created_at: e.created_at }))
  return Response.json({ apiary, history })
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
