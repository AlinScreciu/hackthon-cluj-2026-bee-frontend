import { verifySession, errUnauthorized, errBadRequest } from '@/app/api/v1/_mock/auth'
import { sprayReports, createSprayReport } from '@/app/api/v1/_mock/data'

export async function GET(req: Request) {
  const session = await verifySession()
  if (!session) return errUnauthorized()
  const url = new URL(req.url)
  const status = url.searchParams.get('status')
  const allReports = Array.from(sprayReports.values())
  const items = allReports.filter(r => r.farmer_id === session.sub)
  return Response.json({ items, next_cursor: null })
}

export async function POST(req: Request) {
  const session = await verifySession()
  if (!session) return errUnauthorized()

  const body = await req.json().catch(() => ({}))
  if (!body.parcel_id || !body.substance || !body.scheduled_at) {
    return errBadRequest('validation_failed', 'Câmpuri obligatorii lipsă.')
  }

  const result = createSprayReport(session.sub, body)
  const { created_at_ms, initial_dispatches, ...spray_report } = result

  return Response.json({
    spray_report,
    ledger_hash: spray_report.ledger_hash,
    affected_apiaries: spray_report.affected_apiaries_count,
    primarie_pdf_url: `/spray-reports/${spray_report.id}/primarie-pdf`,
    initial_dispatches,
  }, { status: 201 })
}
