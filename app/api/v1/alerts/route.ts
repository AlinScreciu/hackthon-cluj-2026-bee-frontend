import { verifySession, errUnauthorized } from '@/app/api/v1/_mock/auth'
import { alertViews, computeCascadeStatus } from '@/app/api/v1/_mock/data'

export async function GET() {
  const session = await verifySession()
  if (!session) return errUnauthorized()

  // Enrich each alert with live cascade-computed state
  const items = Array.from(alertViews.values()).map(av => {
    const cascade = computeCascadeStatus(av.spray_report_id)
    const dispatch = cascade?.dispatches.find(d => d.alert_dispatch_id === av.alert_dispatch_id)
    if (!dispatch) return av
    // Prefer in-app confirmed status; otherwise use time-based cascade result
    const finalStatus = av.final_status === 'confirmed_app'
      ? av.final_status
      : (dispatch.final_status ?? av.final_status)
    return { ...av, final_status: finalStatus, channels: dispatch.channels }
  })

  return Response.json({ items })
}
