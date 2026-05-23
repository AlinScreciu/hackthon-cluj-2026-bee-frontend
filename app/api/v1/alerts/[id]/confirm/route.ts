import { verifySession, errUnauthorized, errNotFound } from '@/app/api/v1/_mock/auth'
import { alertViews } from '@/app/api/v1/_mock/data'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await verifySession()
  if (!session) return errUnauthorized()
  const { id } = await params
  const alert = alertViews.get(id)
  if (!alert) return errNotFound()
  const body = await req.json().catch(() => ({}))
  const updated = { ...alert, in_app_action: body.action, final_status: 'confirmed_app' as const }
  alertViews.set(id, updated)
  const ledger_hash = crypto.randomUUID().replace(/-/g, '').substring(0, 16)
  return Response.json({ alert: updated, ledger_hash })
}
