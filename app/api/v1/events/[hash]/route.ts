import { verifySession, errUnauthorized, errNotFound } from '@/app/api/v1/_mock/auth'
import { LEDGER_EVENTS } from '@/app/api/v1/_mock/data'

export async function GET(_: Request, { params }: { params: Promise<{ hash: string }> }) {
  const session = await verifySession()
  if (!session) return errUnauthorized()
  const { hash } = await params
  const idx = LEDGER_EVENTS.findIndex(e => e.hash === hash)
  if (idx === -1) return errNotFound()
  const event = LEDGER_EVENTS[idx]
  const prev_hash = event.prev_hash
  const next_hash = LEDGER_EVENTS[idx + 1]?.hash ?? null
  return Response.json({ event, chain: { prev_hash, next_hash } })
}
