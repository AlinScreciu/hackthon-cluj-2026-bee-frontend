import { verifySession, errUnauthorized, errNotFound } from '@/app/api/v1/_mock/auth'
import { alertViews, sprayReports, computeCascadeStatus } from '@/app/api/v1/_mock/data'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await verifySession()
  if (!session) return errUnauthorized()
  const { id } = await params
  const av = alertViews.get(id)
  if (!av) return errNotFound()

  // Enrich with live cascade state
  const cascade = computeCascadeStatus(av.spray_report_id)
  const dispatch = cascade?.dispatches.find(d => d.alert_dispatch_id === id)
  const finalStatus = av.final_status === 'confirmed_app'
    ? av.final_status
    : (dispatch?.final_status ?? av.final_status)
  const alert = { ...av, final_status: finalStatus, channels: dispatch?.channels ?? av.channels }

  const spray = sprayReports.get(av.spray_report_id)
  const { created_at_ms, ...spray_report } = spray ?? { created_at_ms: 0 } as any
  return Response.json({ alert, spray_report })
}
