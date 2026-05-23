import { verifySession, errUnauthorized } from '@/app/api/v1/_mock/auth'
import { LEDGER_EVENTS } from '@/app/api/v1/_mock/data'

export async function GET(req: Request) {
  const session = await verifySession()
  if (!session) return errUnauthorized()

  const url = new URL(req.url)
  const type = url.searchParams.get('type')
  const actor = url.searchParams.get('actor')
  const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '20', 10), 100)
  const cursor = url.searchParams.get('cursor')

  // Sort newest first
  let items = [...LEDGER_EVENTS].reverse()
  if (type) items = items.filter(e => e.type === type)
  if (actor) items = items.filter(e => e.actor_id === actor)

  // Simple cursor: treat cursor as the last seen id offset
  const startIdx = cursor ? items.findIndex(e => e.id === cursor) + 1 : 0
  const page = items.slice(startIdx, startIdx + limit)
  const next_cursor = startIdx + limit < items.length ? page[page.length - 1]?.id ?? null : null

  return Response.json({ items: page, next_cursor })
}
