import { verifySession, errUnauthorized } from '@/app/api/v1/_mock/auth'
import { alertViews, computeCascadeStatus } from '@/app/api/v1/_mock/data'

export async function GET(request: Request) {
  const session = await verifySession()
  if (!session) return errUnauthorized()

  const status = new URL(request.url).searchParams.get('status')

  // Enrich each alert with live cascade-computed state
  const enriched = Array.from(alertViews.values()).map(av => {
    const cascade = computeCascadeStatus(av.spray_report_id)
    const dispatch = cascade?.dispatches.find(d => d.alert_dispatch_id === av.alert_dispatch_id)
    if (!dispatch) return av
    // Prefer in-app confirmed status; otherwise use time-based cascade result
    const finalStatus = av.final_status === 'confirmed_app'
      ? av.final_status
      : (dispatch.final_status ?? av.final_status)
    return { ...av, final_status: finalStatus, channels: dispatch.channels }
  })

  // status=active → only dispatches still needing the beekeeper's attention
  // (cascade in progress with no terminal state, or cascade exhausted without confirmation)
  const items = status === 'active'
    ? enriched.filter(a => !a.final_status?.startsWith('confirmed'))
    : enriched

  // Newest first — standard feed ordering. Clients can re-sort if they need a
  // different ordering (e.g. urgency-by-distance for a hero card).
  items.sort((a, b) => b.created_at.localeCompare(a.created_at))

  return Response.json({ items })
}
